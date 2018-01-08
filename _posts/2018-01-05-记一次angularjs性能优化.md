---
layout: post
title: "记一次angularjs性能优化"
categories: 技术学习
tag: angularjs
---
* content
{:toc}
项目中遇到一个页面卡顿的问题,当页面停留一段时长后各项操作和渲染响应会感觉到明显迟钝，项目用的框架是`angularjs`，开始调试的时候其实也是没什么准确方向的，查了很多文章,各种减少消耗,语法的优化等等,但都属于页面渲染慢的问题，而我的问题是页面已经出来了，但进行操作却很卡顿;既然找不到捷径就只能自己分析了。
<!-- more -->
### 查看cpu、内存占用率

![]({{ '/styles/images/angular/cpu.png' | prepend: site.baseurl }})

任务管理器中的数据可以看出cpu在进行大量计算,肯定有js函数始终在执行造成没跑了。用了一年angularjs，首先想到的是$watch监听的队列是不是过多呢，当然具体有多少个需要统计下了。

### angularjs调试工具

`angularjs batarang`是我一直在用的工具，查看作用域的嵌套关系很好用。里面的`performance`一直没用过，通过里面的`digest timings`可以看到监听队列的变化情况。

![]({{ '/styles/images/angular/watch.png' | prepend: site.baseurl }})

通过观察发现卡顿后`digest`会一直处于运行状态，且处于变化的监控函数基本全来自`ui_grid`这款插件里。那么问题就出来了，`ui_grid`中存在某些逻辑会致使`digest`反复执行。


`angular performance`这款谷歌的扩展工具更加有针对性,没有`angularjs batarang`全面但在性能调试上我感觉要更详细，一目了然。

![]({{ '/styles/images/angular/p.png' | prepend: site.baseurl }})

可以从图里看到监控列表里的具体数量，最近一次`digest`耗时，还有`digest`的折线图,非常清晰。

通过这个工具我排除了`$watch`监听的队列过多的猜测，肯定了问题产生的源头。

### $watch和$digest
补习了一下`$scope`里的双向绑定执行过程的知识。 [http://angularjs.cn/A0lr](http://angularjs.cn/A0lr)


然后我在`angularjs`源文件中加入了一条输出语句(更直观的找到问题产生点) ：

```js
$digest: function(){
     //...
    do {
     //...
     console.log("digest")
    } while()
}

```
页面操作的过程中，当点击页面中的返回或者切换导航条的标签时，输出会激增从几十涨到上千，而且会不停的涨。

然后查看返回事件对应的函数，发现了问题所在:
```js
 $scope.$broadcast("tableresize");
```
在ui_grid中
```js
    $scope.$on("tableresize", function ($event) {
                getResize($event);
    })
    function getResize($event) {
        var timeOut = $timeout(function () {
            if (gridUtil.elementWidth($elm) == 0) {
                    getResize();
            } else {
                    gridResize($event);
                    timeOut = null;
            }
        }, 10);
    };
    // Resize the grid on window resize events
            function gridResize($event) {
              grid.gridWidth = $scope.gridWidth = gridUtil.elementWidth($elm);
              grid.gridHeight = $scope.gridHeight = gridUtil.elementHeight($elm);

              grid.refreshCanvas(true);
            };                

```
当去掉`$on`的接收函数后，页面不在卡顿。但是问题来了怎样用一个替代方案去替换`$broadcast`的使用呢？

### 问题解决
原本想的是如何改造`$broadcast`这种传值方式,试了下用指令里的绑定策略去实现的方式发现代价更大而且会增加隐患。

宽高需要传入，意味着在父指令中需要增加窗口监听事件，另外触发点有多个且不在同一指令中，所以需要在父指令`controller`中暴露宽高动态计算的函数。并且有些指令是平级的所以需要在多个地方做重复的操作，并且窗口变化的时候会产生多次函数触发调用。

所以我又回头想着反复调用是怎么造成的，怎么解决问题根本而不是找替代方案。

经过分析和测试发现问题的根源来自`getResize`函数：
```js
function getResize($event) {
        var timeOut = $timeout(function () {
            if (gridUtil.elementWidth($elm) == 0) {
                    getResize();
            } else {
                    gridResize($event);
                    timeOut = null;
            }
        }, 10);
    };
```
因为页面做了状态保持，在点击不同导航的时候并不会重新渲染页面。所以容器的宽高动态计算的触发点只能放在点击导航条的事件里。点击导航跳转后页面有一个从当前页切换到跳转页的显示过程,容器宽高会有一个从0到正常值的变化过程。所以`getResize`函数执行的时间点需要推迟，需要保证容器高度已到正常值，所以函数里加了`$timeout`,但有个地方当判断容器高度为0的时候不应该直接递归函数。

假如容器高度从0到正常值得这个过程渲染时间是0.1秒而我做的延迟是0.01秒一次，这样会调用getResize函数至少10次以上,而这10次都是延迟处理的，所以就造成了当容器宽变化到正常值得时候`gridResize`这个函数执行了很多次。而`gridResize`函数每执行一次都意味着会执行`digest`循环。

所以问题解决的方案也很好得到,去掉递归保证容器宽度正常的时候执行一次就够了。

```js
function getResize($event) {
        var interVal = $interval(function () {
            if (gridUtil.elementWidth($elm) != 0) {
                    gridResize($event);
                    $interval.cancel(interVal)
            } 
        }, 100);
    };
```

### 总结
1. 页面出现明显的操作延迟卡顿多半是因为内存过多被占用或者cpu被大量消耗造成的。
2. angularjs的性能问题首先要看`diges`t循环的情况，其次看`$watch`数量。
3. 遇到一个问题先考虑从根本去解决，如果问题本身无法处理在考虑替代方式。
4. 在异步函数里慎用递归，除非你能很清楚它会出现的所有情况。
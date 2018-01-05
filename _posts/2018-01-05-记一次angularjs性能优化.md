---
layout: post
title: "记一次angularjs性能优化"
categories: 技术学习
tag: angularjs
---
* content
{:toc}
项目中遇到一个页面卡顿的问题,当页面停留一段时长后各项操作和渲染响应会感觉到明显迟钝，项目用的框架是angularjs，开始调试的时候其实也是没什么准确方向的，查了很多文章,各种减少消耗,语法的优化等等,但都属于页面渲染慢的问题，而我的问题是页面已经出来了，但进行操作却很卡顿;既然找不到捷径就只能自己分析了。
<!-- more -->
### 查看cpu、内存占用率

![]({{ '/styles/images/angular/cpu.png' | prepend: site.baseurl }})

任务管理器中的数据可以看出cpu在进行大量计算,肯定有js函数始终在执行造成没跑了。用了一年angularjs，首先想到的是$watch监听的队列是不是过多呢，当然具体有多少个需要统计下了。

### angularjs调试工具

`angularjs batarang`是我一直在用的工具，查看作用域的嵌套关系很好用。里面的performance一直没用过，通过里面的digest timings可以看到监听队列的变化情况。

![]({{ '/styles/images/angular/watch.png' | prepend: site.baseurl }})

通过观察发现卡顿后digest会一直处于运行状态，且处于变化的监控函数基本全来自ui_grid这款插件里。那么问题就出来了，ui_grid中存在某些逻辑会致使digest反复执行。


`angular performance`这款谷歌的扩展工具更加有针对性,没有`angularjs batarang`全面但在性能调试上我感觉要更详细，一目了然。

![]({{ '/styles/images/angular/p.png' | prepend: site.baseurl }})

可以从图里看到监控列表里的具体数量，最近一次digest耗时，还有digest的折线图,非常清晰。

通过这个工具我排除了$watch监听的队列过多的猜测，肯定了问题产生的源头。

### $watch和$digest
补习了一下$scope里的双向绑定执行过程的知识。http://angularjs.cn/A0lr

然后我在angularjs源文件中加入了一条输出语句(更直观的找到问题产生点) ：

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
当去掉$on的接收函数后，页面不在卡顿。但是问题来了怎样用一个替代方案去替换$broadcast的使用呢？
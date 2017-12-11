---
layout: post
title: "angularjs-IE8兼容性问题解决"
categories: 技术学习
tag: angularjs
---
* content
{:toc}

平台的web框架一直以来都遵循兼容IE9+,但在某次功能讨论会上,领导又提起了IE8这个话题,称目前仍有一些电脑使用IE8,需要满足兼容IE8要求。不论那些用户出于什么目的依旧不放弃IE8不愿升级,对于要求既然问题出自程序,那就有了充分的无法拒绝的解决理由。
<!-- more -->

### 开始
在把这个任务交给我时,给我提供的信息只有一份`angular.js-ie8-builds-master`文件,不用想肯定没法用的,如果能用也不会把任务交给我了.我问IE8下存在哪些bug可供我参考找出问题的,答案是没有,因为首页完全进不去,直接报一堆空值和引用错误,所以对于此次任务需要从0开始。

### jqeury版本解决
由于使用了bootstrap、angular-datepicker等一些列依赖jquery的插件,理所应当需要先解决jqeury的版本问题。

查询了关于jqeury的版本信息,知道了jqeury自1.9版本后不再支持IE6/7/8, 1.9是最后一个支持IE 6/7/8 的版本。

>jQuery 1.9 移除了很多已经标为过时（deprecated）的 API，如果你的程序已经避免使用这些废弃的 API 的话，则升级到 1.9 不会有什么问题，但是大部分开发者可能不会那么幸运，所以这个时候 jQuery 提供的 jQuery Migrate 插件可以帮上忙，它收集了自 1.6.4 版本以来 1.9 废弃的 API。在使用 1.9/2.0 的时候，一并加载 jQuery Migrate，就可以不用更改程序继续使用，还可以通过 console.log 查看那些不相容的 API，作为修改的参考。等所有问题都修改之后，就可以不再使用 jQuery Migrate。

那么搞定jquery的解决方法就是`jquery-1.9.0.js`+`jquery-migrate-1.2.1`.
```html
<!--[if IE 8]>
        <script src="EIP/lib/angular.js/angular.js-ie8/es5-shim.min.js"></script>
        <script src="EIP/lib/angular.js/angular.js-ie8/jquery-1.9.0.js"></script>
        <script src="EIP/lib/angular.js/angular.js-ie8/jquery-migrate-1.2.1.js"></script>
        <style>
            .ng-hide {
                display: none !important;
            }
        </style>
<![endif]-->
```

### lodash.js兼容解决
`lodash.js`是不支持IE8的,里面的一些诸如数组操作的ES5方法在IE8下是不存在的,最省事的解决办法是用支持ES5特性的中间库,我用的`es5-sham.js`+`es5-shim.js`,为什么要用es5-sham.js呢,官方解释是
>shim 完美模拟了所有 ES5 中可以被完美模拟的方法。ES5 中其他无法被完美模拟的方法，就由 sham 承包了。 sham 只承诺你用的时候代码不会崩溃，至于对应的方法是不是起作用它就不保证了，它只是尽力模拟。

由于lodash中包含Object.create而此语法只在sham.js中采用,所以这里我都做了引用。

### angular中NODE对象未定义
```js
var jqLiteContains = Node.prototype.contains || function (arg) {
  // jshint bitwise: false
  return !!(this.compareDocumentPosition(arg) & 16);
  // jshint bitwise: true
};
```
这里做的处理如下:
```js
var isNode = function () {
    if (typeof Node != "undefined") {
        return obj = Node.prototype.contains
    }
};
var jqLiteContains = isNode() || function (arg) {
  // jshint bitwise: false
  return !!(this.compareDocumentPosition(arg) & 16);
  // jshint bitwise: true
};
```

### window对象上hasOwnProperty方法不存在问题
ngStorage.js文件错误： `window.hasOwnProperty('angular')`,在老版本ie中window对象下是没有hasOwnProperty方法的,解决办法为`Object.prototype.hasOwnProperty.call(window, "angular")`

### 关键字作为属性的问题解决
catch的报错:
```js
promise.then(function(response) {
  // success
})
.catch(function(response) {
  // error
});
```
修改方式为：
```js
promise.then(function(response) {
  // success
})
["catch"](function(response) {
  // error
});
```
因为IE8不允许点关键词的调用方式.包括对象属性`{class:"btn"}`、` $scope.delete `诸如这样的对象都要对关键词加引号。

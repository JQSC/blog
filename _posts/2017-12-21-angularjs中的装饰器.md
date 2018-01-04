---
layout: post
title: "angularjs中的装饰器"
categories: 技术学习
tag: angularjs
---
* content
{:toc}
我们经常在使用某些service的时候，更希望它能具备一些额外的功能,这时我们难道改这service吗？如果是angularjs自带的服务呢,改源码吗？
<!-- more -->

### decorator服务功能的扩展
decorator接收两个参数,第一个参数为服务的名称,第二个为回调函数,函数的参数为$delegate(服务的实例),返回的也是$delegate。

需要注意的是constant常量是不可以被装饰的。
```js
var B=angular.module("B",[])

B.service("test",function(){
    this.firstName="aaaaaaaaaa";
})

var A=angular.module('myApp', ["B"]);

A.controller('myCtrl',['$scope','test',function($scope,test){
    test.changeName()
    $scope.name=test.firstName
}])

A.config(function($provide) {  
    $provide.decorator('test', function($delegate) {  
        $delegate.changeName = function() {  
            this.firstName="a" 
        };  
        return $delegate;  
    });  
}) 
```

### 存在的疑问
这里我存在一些疑惑,譬如如果直接在回调里这样写：
```js
A.config(function($provide) {  
    $provide.decorator('test', function($delegate) {  
            $delegate.firstName = "b" 
            return $delegate;  
        });  
}) 
```
那么test.firstName的值不管在哪么模块中调用都将会是b；
这样的话增加decorator则毫无意义,和直接去改服务没什么区别。我认为的decorator应该是在当把config的调用者改为B的时候,则只有B下的test服务才会起到装饰效果,而A模块不受影响。

### 一些想法
如果在进行decorator的时候能够在A模块下为test服务增加一个A模块下的新实例,那么无论对原先服务如何去破坏都将不会影响模块B下的test服务,或者约定decorator的回调中只能通过增加函数的形式去修改服务。这样只要不调用装饰器服务中的函数则不会对原有服务造成影响。



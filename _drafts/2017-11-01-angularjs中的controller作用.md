---
layout: post
title: "angualrjs平台新功能培训"
categories: 技术学习
tag: angularjs
---
* content
{:toc}

平台功能讲解,主要培训内容为如何配置页面,和一些新功能的配置方法。

<!-- more -->

### controller中的配置属性概述
#### 编辑页：

`html` --> `eipform`  --> `controller` --> 控制器作用域下的`customfunction`和`outparamss`对象
```html
<eip-form controller-name="DemoProblemCtrl"></eip-form>
```


####  `customfunction`：
```js
$scope.customfunction = [
        { "name": "ShowOrHide", "value": "ShowOrHide" }
    ];
```    
 用于事件注册,根据controller里定义的customfunction对象中的name、value在指令中创建同名函数,此函数会执行它的父级作用域中的同名函数。
 ```js
 angular.forEach($scope.customfunction, function (data) {
        $scope[data.name] = function (selectedItem) {
            $scope.$parent[data.value]({ "selectedItem": selectedItem }, $scope);
        }
});
 ```

#### `outparamss`:

数据模板,outparamss对象中的dataModule作为基础的配置信息,而pageModule属性去定义如何把这些基本信息的模块进行组装。
```js
$scope.outparamss = {
        API_VERSION: 1.2,
        init: {},
        dataModule:{},
        pageModule:{},
        pageCustomBtn:{},
        workflowBtn:{}
}
```

### 路由

### 配置属性详解

### 常用功能的配置方法

### 建议



<!-- AngularJs是一个MVC架构的应用，其中视图（View）就是DOM,可以理解为HTML页面。控制器（Controller）是一个用户自定义的JavaScript类。模型数据（Model）存储在对象的属性中,在angularjs中是scope。

angularjs中的控制器为指令controller，controller管理的就是当前作用域scope下各个对象的赋值和它们的行为。

### 正确的使用controller

控制器只做作用域的管理工作,它只关心业务逻辑,不涉及视图操作所以不要把DOM操作放到控制器里。

一个控制器不应该做太多的工作,它应该只包含单个视图的业务逻辑(不要在不同页面多次使用同一个controller)。

保持控制器职责单一的最常见做法是将那些不属于控制器的工作抽离到服务中，然后通过依赖注入在控制器中使用这些服务。 -->



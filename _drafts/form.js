/*
详情页
*/
angular.module('eipPageModule').directive('eipForm', ['$templateCache', '$sce', '$compile', 'eipUrlParams', '$stateParams',
function ($templateCache, $sce, $compile, eipUrlParams, $stateParams) {
    var obj = {
        restricts: 'E',
        replace: true,
        scope: {
            outparamss: '=',
            customfunction: '=',
        },
        compile: formCompile,
    };
    return obj;
    function formCompile(element, attrs) {
        var html = $templateCache.get('eip-page/eip-page-form').replace("CONTROLLER_NAME", attrs.controllerName);
        element.html(html);
    }
}]);

//表单部分
angular.module('eipPageModule').directive('eipFormView', ['UserInfo', '$templateCache', 'eipEditPageHelper', 'eipPageHelper', '$modal', '$compile', 'COMMON_CONSTANT', '$localStorage', 'eipUrlAction', 'PostHelperFactory', 'eipHttpService', 'eipDict', 'eipDefaultDialog', '$stateParams', '$http', 'eipUrlParams', 'eipUrl', '$state', 'eipLoginInfoService', 'eipShowLoadingService', 'eipPageSubTable', '$timeout','eipformService','eipOpenModal',
function (UserInfo, $templateCache, eipEditPageHelper, eipPageHelper, $modal, $compile, COMMON_CONSTANT, $localStorage, eipUrlAction, PostHelperFactory, eipHttpService, eipDict, eipDefaultDialog, $stateParams, $http, eipUrlParams, eipUrl, $state, eipLoginInfoService, eipShowLoadingService, eipPageSubTable, $timeout, eipformService, eipOpenModal) {
var formObj = {
    restricts: 'E',
    replace: true,
    scope: {
        outparamss: '=',
        customfunction: '=',
    },
    link: FormViewLink
};
return formObj;
function FormViewLink($scope, $element, $attrs, formCtrl) {
    /*————初始化————————*/
    $scope.item = {};
    $scope.rowIndex = 0;
    $scope.parentId = "-1";
    $scope._PK = "-1";
    $scope.menuId = "0";
    var btnBackState,
        Formhtml = "",
        otherHtml = "",
        dict_modeArras = []; //储存字典项内容
    $scope.API_VERSION = $scope.outparamss.API_VERSION || 1.0;
    //表单初始化
    $scope.dataModule = $scope.outparamss.dataModule;//数据模型
    $scope.pageModule = $scope.outparamss.pageModule;//页面模型
    $scope.init = eipformService.setFormDataInit($scope.outparamss.init)//初始化参数
    //设置页面状态
    var PageInfo = eipformService.getPageStatus($scope.init.initPrimaryKey)
    $scope.ItemPageStatus = PageInfo.ItemPageStatus || "new"
    $scope.parentId = PageInfo.PrimaryKey || "-1"
    $scope._PK = $scope.parentId;
    $scope["" + $scope.init.initPrimaryKey + ""] = $scope._PK;
    //递归获取菜单ID
    var MenuCode = $scope.$root.menuCodeSelect;
    getMenuID(MenuCode, $scope.$root.menuData);
    
    templateInit()  //视图模型
    treeInit()       //组织机构树
    getDictContent()  //字典项
    $scope.init.initParam.editInitParam.push({ key: 'IS_ADD', value: true });
    var initArr = $scope.init.inUrlSumbit.editInitSubmit
    angular.forEach($scope.customfunction, function (data) {
        $scope[data.name] = function (selectedItem) {
            $scope.$parent[data.value]({ "selectedItem": selectedItem }, $scope);
        }
    });
    dg(initArr, 0, initArr[0], "no"); //递归进行页面数据覆盖
    operaInitParams($scope.init.initParam.editInitParam);
       
    //弹窗中的放大镜
    $scope.OpenModal = function (dataModuleName, callback) {
        return eipOpenModal.openModal("item", $scope, dataModuleName, callback)
    };
    /*——————————编译——————————————*/
    $scope.rowVisible = {};
 
    $element.html(Formhtml);
    $compile($element.contents())($scope);

   /*——————————————————————end————————————————————————————————————————————————————*/
    $timeout(function () {
        if ($scope.ItemPageStatus == "new") {
            var objRowVisible = $scope.$parent.outparamss.init.initParam.addInitParam.setRowVisible;
            if (typeof (objRowVisible) != "undefined") {
                for (var key in objRowVisible) {
                    $scope.rowVisible[key] = objRowVisible[key];//设置页面行显示隐藏
                }
            }
        }
    }, 500)
    
    //递归获取菜单ID
    function getMenuID(MenuCode, SubMenu) {
        _.forEach(SubMenu, function (n) {
            if (n.code != MenuCode || n.url == "") {
                SubMenu = n.submenu;
                return getMenuID(MenuCode, SubMenu);
            }
            else {
                $scope.menuId = n.id;
            }
        })
    }
    //初始化树
    function treeInit() {

        //有权限的数据树
        $scope.permitTreeData = eipLoginInfoService.getInfoType("dataUserOrgTree") || "";


        //无权限的数据树
        $scope.allTreeData = eipLoginInfoService.getInfoType("dataAllOrgTree") || "";
        var getAllTree = function () {
            var httpObj = {
                url: "Common/GetAllOrgTree"
            }
            eipHttpService.post(httpObj)
                .success(function (data, status, headers, config) {
                    $scope.allTreeData = data.dataResult
                    $scope.permitTreeData = data.dataResult
                })
                .error(function (data, status, headers, config) {
                    console.log('error:加载组织机构树错误');
                })
        }
        if ($scope.allTreeData.length <= 0) {
            getAllTree()
        }
        $scope.treeOptions = {
            isSelectable: function (node) {
                if (node.HAS_PERM == null) {
                    return true
                } else {
                    return node.HAS_PERM.indexOf("0") !== 0;
                }

            }
        };
    }

    //生成模板
    function templateInit() {
        //解析 $scope.formModule
        var Edit_CustomHtml = [], Edit_SubTable = [], subN = 1, formNum = 1, isSubType = false, isFormType = false;
        var Html_Order = []
        var Edit_Html = {
                subTable: [],
                formTable: [],
                formCustom: [],
                attachmentCustom: [],
                subCustom:[],
                other: []
        };

        var isSubTable = function () {
            if (!isSubType) {
                Html_Order.push("subTable")
            }
        };
        var isFormTable = function () {
            if (!isFormType) {
                Html_Order.push("formTable")
            }
        };
        //按照定义的顺序进行组装
        var html_Package = function () {
            var subTableHtml = '', formTable = '', testForm = '';
            if (Edit_Html.subTable.length > 0) {
                Edit_Html.subTable.forEach(function (str) {
                    subTableHtml += str
                })
                subTableHtml = '<tabset>' + subTableHtml + '</tabset>'
            }
            if (Edit_Html.formTable.length > 0) {
                Edit_Html.formTable.forEach(function (str) {
                    formTable += str
                })
                 formTable = '<tabset>' + formTable + '</tabset>'
                //formTable =  formTable 
            }
            var formTableType = false, subTableHtmlType = false
            Html_Order.forEach(function (str, n) {
                switch (str) {
                    case "formTable":
                        if (!formTableType) {
                            otherHtml += formTable
                            formTableType = true;
                        }
                        break;
                    case "subTable":
                        if (!subTableHtmlType) {
                            otherHtml += subTableHtml
                            subTableHtmlType = true
                        }
                        break;
                    case "subCustom":
                        otherHtml += Edit_Html.subCustom[0]
                        Edit_Html.subCustom.shift()
                        
                        break;
                    case "formCustom":
                        otherHtml += Edit_Html.formCustom[0]
                        Edit_Html.formCustom.shift()
                        break;
                    case "attachmentCustom":
                        otherHtml += Edit_Html.attachmentCustom
                        break;
                }
            })
        };
        //判断子表form是否拥有对应的附件信息
        var isHaveAttachment = function (formName) {
            var html = "";
            _.forEach($scope.pageModule, function (pageModuleObj, n) {
                if (typeof (pageModuleObj.formRelation) != "undefined" && pageModuleObj.formRelation == formName) {
                    var formObj = {
                        formId: "",
                        formName: "",
                        isHide: false,
                        ngIf: true,
                        isExpand: true
                    }
                    if (!_.isUndefined(pageModuleObj.isHide) && !_.isError(pageModuleObj.isHide) && !_.isNull(pageModuleObj.isHide)) {
                        formObj.isHide = pageModuleObj.isHide;
                    }
                    if (!_.isUndefined(pageModuleObj.ngIf) && !_.isError(pageModuleObj.ngIf) && !_.isNull(pageModuleObj.ngIf)) {
                        formObj.ngIf = pageModuleObj.ngIf;
                    }
                    if (!_.isUndefined(pageModuleObj.isExpand) && !_.isError(pageModuleObj.isExpand) && !_.isNull(pageModuleObj.isExpand)) {
                        formObj.isExpand = pageModuleObj.isExpand;
                    }
                    var dataModule = _.find($scope.dataModule, function (dM) {
                        return dM.key === pageModuleObj.dataModuleName;
                    }).module;
                    html = attachmentHtml(dataModule, pageModuleObj, formObj)

                }
            })
            return html
        };
        
        _.forEach($scope.pageModule, function (pageModuleObj, n) {
            var formObj = {
                formId: "",
                formName: "",
                isHide: false,
                ngIf: true,
                isExpand: true,
                isRowEdit: false,
                pageModule: pageModuleObj
            };
            var dataModule = _.find($scope.dataModule, function (dM) {
                return dM.key === pageModuleObj.dataModuleName;
            }).module;
            //设置默认状态
            formObj=eipformService.settingForm(formObj)
            //设置禁用
           eipformService.settingItemDisable.call($scope, dataModule);
            
            switch (pageModuleObj.type) {
                case "Edit_Regular":
                    break;
                case "Edit_Irregular":
                    break;
                case "Edit_Custom":
                    if (typeof (pageModuleObj.formTable) == "undefined" || pageModuleObj.formTable=="true") {
                        isFormTable()
                        formNum++
                        var attachmentTableHtml = isHaveAttachment(pageModuleObj.dataModuleName)
                        Edit_Html.formTable.push(CustomFormHtml(dataModule, pageModuleObj, formObj, formNum, attachmentTableHtml))
                    } else {
                        Html_Order.push("formCustom")
                        Edit_Html.formCustom.push(CustomFormHtml(dataModule, pageModuleObj, formObj))
                    }
                    break;
                    //处理附件,自定义附件取旧指令;table形式附件走新指令
                case "Edit_Custom_Attachment":
                    if (typeof (pageModuleObj.formRelation) == "undefined") {
                        Html_Order.push("attachmentCustom")
                        Edit_Html.attachmentCustom.push(CustomFormHtml(dataModule, pageModuleObj, formObj))
                    }
                    break;
                case "Edit_SubTable":
                    if (typeof (pageModuleObj.isSubTable) == "undefined") {
                        Edit_Html.subTable.push(subTableFormHtml(dataModule, pageModuleObj, formObj, subN))
                        isSubTable()
                        subN++
                    } else {
                        Html_Order.push("subCustom")
                        Edit_Html.subCustom.push(subTableFormHtml(dataModule, pageModuleObj, formObj))
                     }
                    break;
                case "Popup_Grid":
                    if (typeof (pageModuleObj.isSubTable) == "undefined") {
                        Edit_Html.subTable.push(poupupFormHtml(dataModule, pageModuleObj, formObj, subN))
                        isSubTable()
                        subN++
                    } else {
                        Html_Order.push("subCustom")
                        Edit_Html.subCustom.push(poupupFormHtml(dataModule, pageModuleObj, formObj))
                    }
                    
                    break;
                case "Edit_Custom_Template":
                    if (typeof (pageModuleObj.formTable) == "undefined") {
                        isFormTable()
                        formNum++
                        Edit_Html.formTable.push(getCustomTemplate(pageModuleObj, formNum));
                    } else {
                        Html_Order.push("formCustom")
                        Edit_Html.formCustom.push(getCustomTemplate(pageModuleObj));
                    }
                    subN++;
                    break;
                case "Edit_SubUiTable":
                    if (typeof (pageModuleObj.isSubTable) == "undefined") {
                        Edit_Html.subTable.push(getSubuiTableFormHtml(dataModule, pageModuleObj, formObj, subN))
                        isSubTable()
                        subN++;
                    } else {
                        Html_Order.push("subCustom")
                        Edit_Html.subCustom.push(getSubuiTableFormHtml(dataModule, pageModuleObj, formObj))
                    }
                   
                    break;
                default:
                    break;
            }
        })

        //按照table形式组装
        html_Package()

        Formhtml = '<div class="container-fluid" > <div class="row-fluid e_mp"><div class="col-md-12 col-sm-12">' +
            '<form class="form-horizontal" name="ItemForm" id="ItemForm"  w5c-form-validate=""  novalidate=novalidate >' +
            '<div class="fixheader"><div class="btn-group  pull-right">' +
            '<eip-edit-custom-btn></eip-edit-custom-btn></div><div style="clear:both"></div>' +
        '<div class="btn-group  pull-right"><eip-workflow-btn></eip-workflow-btn></div></div>' + otherHtml
        '</form></div></div></div>'


    }
    function PageStatus() {
        var UrlParamJson, PrimaryKey,
            ItemPageStatus = "new",
            key = $scope.init.initPrimaryKey || "";
        if ($stateParams.transParam && $stateParams.transParam.indexOf("new") <0) {
            try {
                UrlParamJson = JSON.parse($stateParams.transParam);
                if (UrlParamJson[key]) {
                    ItemPageStatus = "edit"
                    PrimaryKey = UrlParamJson[key]
                }
            } catch (e) {
                console.log(e)
            }
        }
        return {
            ItemPageStatus: ItemPageStatus,
            PrimaryKey: PrimaryKey,
            UrlParamJson: UrlParamJson
        }
    }
    /*——————生成html函数————————————————*/
    //Edit_Custom
    function CustomFormHtml(dataModule, pageModuleObj, formObj, formNum, attachmentTableHtml) {
        var IrregularAndRegularModuleObj;
        var IrregularAndRegularModule = {
            MenuId: $scope.menuId,
            moduleTitle: pageModuleObj.moduleTitle,
            dataModuleName: pageModuleObj.dataModuleName,
            name: formObj.formId,
            isHide: formObj.isHide,
            ngIf: formObj.ngIf,
            isExpand: formObj.isExpand,
            IrregularAndRegularModuleContent: dataModule
        }
        //判断是否按照table方式配置
        if (formNum) {
            IrregularAndRegularModuleObj = eipPageSubTable.getFormTable(IrregularAndRegularModule, $scope, formNum, attachmentTableHtml)
        } else {
            IrregularAndRegularModuleObj = eipPageHelper.getIrregularAndRegularModuleObj(IrregularAndRegularModule, $scope);
        }

        if (IrregularAndRegularModuleObj.dict_codes.length != 0) {
            dict_modeArras.push(IrregularAndRegularModuleObj.dict_codes);
        }
        return IrregularAndRegularModuleObj.IrregularAndRegularModuleHtml;
    }
    function attachmentHtml(dataModule, pageModuleObj, formObj) {
        var IrregularAndRegularModuleObj;
        var IrregularAndRegularModule = {
            MenuId: $scope.menuId,
            moduleTitle: pageModuleObj.moduleTitle,
            dataModuleName: pageModuleObj.dataModuleName,
            name: formObj.formId,
            isHide: formObj.isHide,
            ngIf: formObj.ngIf,
            isExpand: formObj.isExpand,
            IrregularAndRegularModuleContent: dataModule
        }
        //判断是否按照table方式配置

        IrregularAndRegularModuleObj = eipPageSubTable.getAttachmentTable(IrregularAndRegularModule, $scope);

        if (IrregularAndRegularModuleObj.dict_codes.length != 0) {
            dict_modeArras.push(IrregularAndRegularModuleObj.dict_codes);
        }
        return IrregularAndRegularModuleObj.IrregularAndRegularModuleHtml;
    }
    //Edit_SubTable
    function subTableFormHtml(dataModule, pageModuleObj, formObj, subN) {
        var modeModuleTmp = _.find($scope.dataModule, function (dM) {
            return dM.key === pageModuleObj.modeModuleName;
        });
        var modeModuleContent = null;
        if (typeof (modeModuleTmp) != "undefined") {
            modeModuleContent = modeModuleTmp.module;
        }

        var SubTableModel = {
            MenuId: $scope.menuId,
            moduleTitle: pageModuleObj.moduleTitle,
            contentColSpan: pageModuleObj.contentColSpan,
            name: formObj.formId,
            isHide: formObj.isHide,
            ngIf: formObj.ngIf,
            isRowEdit: formObj.isRowEdit,
            isExpand: formObj.isExpand,
            SubTableModelContent: dataModule,
            modeModuleContent: modeModuleContent
        }

        //pageModuleObj.gridDataName是一个属性链的值
        // $scope.init.initEditName ???
        var guidTable = eipPageHelper.getGuid(5, 16);
        $scope[guidTable + "name"] = dataModule;
        $scope[guidTable + "modename"] = modeModuleContent;
        $scope[pageModuleObj.dataModuleName + "_add"] = false;
        $scope[pageModuleObj.dataModuleName + "_edit"] = false;
        $scope[pageModuleObj.dataModuleName + "_delete"] = false;
        if (typeof (pageModuleObj.initActionName) != "undefined" && pageModuleObj.initActionName != "") {
            pageModuleObj.initActionName = $scope.init.initEditName + "/" + pageModuleObj.initActionName;
        }
        else {
            pageModuleObj.initActionName = "";
        }
        if (typeof (pageModuleObj.addActionName) != "undefined" && pageModuleObj.addActionName != "") {
            pageModuleObj.addActionName = $scope.init.initEditName + "/" + pageModuleObj.addActionName;
        }
        else {
            pageModuleObj.addActionName = "";
        }
        if (typeof (pageModuleObj.editActionName) != "undefined" && pageModuleObj.editActionName != "") {
            pageModuleObj.editActionName = $scope.init.initEditName + "/" + pageModuleObj.editActionName;
        }
        else {
            pageModuleObj.editActionName = "";
        }
        if (typeof (pageModuleObj.editSaveActionName) != "undefined" && pageModuleObj.editSaveActionName != "") {
            pageModuleObj.editSaveActionName = $scope.init.initEditName + "/" + pageModuleObj.editSaveActionName;
        }
        else {
            pageModuleObj.editSaveActionName = "";
        }
        if (typeof (pageModuleObj.delActionName) != "undefined" && pageModuleObj.delActionName != "") {
            pageModuleObj.delActionName = $scope.init.initEditName + "/" + pageModuleObj.delActionName;
        }
        else {
            pageModuleObj.delActionName = "";
        }
        if (typeof (pageModuleObj.permissionActionName) != "undefined" && pageModuleObj.permissionActionName != "") {
            pageModuleObj.permissionActionName = $scope.init.initEditName + "/" + pageModuleObj.permissionActionName;
        }
        else {
            pageModuleObj.permissionActionName = "";
        }
        if (subN) {
            var SubTableModelObj = eipPageSubTable.getSubTableModel(SubTableModel, guidTable + "name", pageModuleObj, guidTable + "modename", $scope.init.initPrimaryKey, subN);
        } else {
            var SubTableModelObj = eipPageHelper.getSubTableModel(SubTableModel, guidTable + "name", pageModuleObj, guidTable + "modename", $scope.init.initPrimaryKey);
        }
       
        if (SubTableModelObj.dict_codes.length != 0) {
            dict_modeArras.push(SubTableModelObj.dict_codes);
        }
        return SubTableModelObj.SubTableModelHtml;
    }
    function poupupFormHtml(dataModule, pageModuleObj, formObj,subN) {
        var modeModuleTmp = _.find($scope.dataModule, function (dM) {
            return dM.key === pageModuleObj.modeModuleName;
        });
        var modeModuleContent = null;
        if (typeof (modeModuleTmp) != "undefined") {
            modeModuleContent = modeModuleTmp.module;
        }

        var SubTableModel = {
            MenuId: $scope.menuId,
            moduleTitle: pageModuleObj.moduleTitle,
            contentColSpan: pageModuleObj.contentColSpan,
            name: formObj.formId,
            isHide: formObj.isHide,
            ngIf: formObj.ngIf,
            isExpand: formObj.isExpand,
            SubTableModelContent: dataModule,
            modeModuleContent: modeModuleContent
        }

        //pageModuleObj.gridDataName是一个属性链的值
        // $scope.init.initEditName ???
        var guidTable = eipPageHelper.getGuid(5, 16);
        $scope[guidTable + "name"] = dataModule;
        $scope[guidTable + "modename"] = modeModuleContent;
        $scope[pageModuleObj.dataModuleName + "_add"] = false;
        $scope[pageModuleObj.dataModuleName + "_edit"] = false;
        $scope[pageModuleObj.dataModuleName + "_delete"] = false;
        if (typeof (pageModuleObj.initActionName) != "undefined" && pageModuleObj.initActionName != "") {
            pageModuleObj.initActionName = $scope.init.initEditName + "/" + pageModuleObj.initActionName;
        }
        else {
            pageModuleObj.initActionName = "";
        }
        if (typeof (pageModuleObj.addActionName) != "undefined" && pageModuleObj.addActionName != "") {
            pageModuleObj.addActionName = $scope.init.initEditName + "/" + pageModuleObj.addActionName;
        }
        else {
            pageModuleObj.addActionName = "";
        }
        if (typeof (pageModuleObj.editActionName) != "undefined" && pageModuleObj.editActionName != "") {
            pageModuleObj.editActionName = $scope.init.initEditName + "/" + pageModuleObj.editActionName;
        }
        else {
            pageModuleObj.editActionName = "";
        }
        if (typeof (pageModuleObj.editSaveActionName) != "undefined" && pageModuleObj.editSaveActionName != "") {
            pageModuleObj.editSaveActionName = $scope.init.initEditName + "/" + pageModuleObj.editSaveActionName;
        }
        else {
            pageModuleObj.editSaveActionName = "";
        }
        if (typeof (pageModuleObj.delActionName) != "undefined" && pageModuleObj.delActionName != "") {
            pageModuleObj.delActionName = $scope.init.initEditName + "/" + pageModuleObj.delActionName;
        }
        else {
            pageModuleObj.delActionName = "";
        }
        if (typeof (pageModuleObj.permissionActionName) != "undefined" && pageModuleObj.permissionActionName != "") {
            pageModuleObj.permissionActionName = $scope.init.initEditName + "/" + pageModuleObj.permissionActionName;
        }
        else {
            pageModuleObj.permissionActionName = "";
        }
        if (subN) {
            var SubTableModelObj = eipPageSubTable.getSubTableModel(SubTableModel, guidTable + "name", pageModuleObj, guidTable + "modename", $scope.init.initPrimaryKey, subN);
        } else {
            var SubTableModelObj = eipPageHelper.getSubTableModel(SubTableModel, guidTable + "name", pageModuleObj, guidTable + "modename", $scope.init.initPrimaryKey);
        }
       
        if (SubTableModelObj.dict_codes.length != 0) {
            dict_modeArras.push(SubTableModelObj.dict_codes);
        }
        return SubTableModelObj.SubTableModelHtml;
    }

    function getCustomTemplate(pM, formNum) {
        var html = '';

        if (formNum) {
            html += '<tab index=' + formNum + ' ng-hide="' + pM.isHide + '"><tab-heading class="sub_tab" title="' + pM.moduleTitle + '">' + pM.moduleTitle + '</tab-heading>' +
                '<div class="form-group"><eip-edit-custom templatename="' + pM.templateName + '"></eip-edit-custom></div>' +
                '</tab>';
        } else {
            if (pM.templateName) {

                html += '<div>';
                if (pM.moduleTitle && pM.moduleTitle != '') {
                    if (pM.isHide) {
                        html += '<h3 class="page-header" ng-hide="' + pM.isHide + '"><span class="h_title"></span><span>' + pM.moduleTitle + '</span></h3>';
                    } else {
                        html += '<h3 class="page-header"><span class="h_title"></span><span>' + pM.moduleTitle + '</span></h3>';
                    }
                }
                if (pM.isHide) {
                    html += '<div class="form-group"  ng-hide="' + pM.isHide + '"><eip-edit-custom templatename="' + pM.templateName + '"></eip-edit-custom></div>';
                } else {
                    html += '<div class="form-group"><eip-edit-custom templatename="' + pM.templateName + '"></eip-edit-custom></div>';
                }
                html += '</div>';
            } else {
                console.log('没有定义模板文件名');
            }

        }
        return html;
    }
    //主子表保存模式的模板
    function getSubuiTableFormHtml(dataModule, pM, formObj, subN) {
        var modeModuleTmp = _.find($scope.dataModule, function (dM) {
            return dM.key === pM.modeModuleName;
        });
        var modeModuleContent = null, modeModuleGrid = null;
        if (typeof (modeModuleTmp) != "undefined") {
            modeModuleContent = modeModuleTmp.module;
            modeModuleGrid = modeModuleTmp.moduleGrid
        }
        var SubTableModel = {
            MenuId: $scope.menuId,
            moduleTitle: pM.moduleTitle,
            contentColSpan: pM.contentColSpan,
            name: formObj.formId,
            isHide: formObj.isHide,
            ngIf: formObj.ngIf,
            isRowEdit:formObj.isRowEdit,
            isExpand: formObj.isExpand,
            SubTableModelContent: dataModule,
            modeModuleContent: modeModuleContent,
            modeModuleGrid: modeModuleGrid

        };
        var guidTable = eipPageHelper.getGuid(5, 16);
        $scope[guidTable + "name"] = dataModule;
        $scope[guidTable + "modename"] = modeModuleContent;
        $scope[guidTable + "modengrid"] = modeModuleGrid
        $scope[pM.dataModuleName + "_add"] = false;
        $scope[pM.dataModuleName + "_edit"] = false;
        $scope[pM.dataModuleName + "_delete"] = false;
        if (typeof (pM.initActionName) != "undefined" && pM.initActionName != "") {
            pM.initActionName = $scope.init.initEditName + "/" + pM.initActionName;
        }
        else {
            pM.initActionName = "";
        }
        if (typeof (pM.addActionName) != "undefined" && pM.addActionName != "") {
            pM.addActionName = $scope.init.initEditName + "/" + pM.addActionName;
        }
        else {
            pM.addActionName = "";
        }
        if (typeof (pM.editActionName) != "undefined" && pM.editActionName != "") {
            pM.editActionName = $scope.init.initEditName + "/" + pM.editActionName;
        }
        else {
            pM.editActionName = "";
        }
        if (typeof (pM.editSaveActionName) != "undefined" && pM.editSaveActionName != "") {
            pM.editSaveActionName = $scope.init.initEditName + "/" + pM.editSaveActionName;
        }
        else {
            pM.editSaveActionName = "";
        }
        if (typeof (pM.delActionName) != "undefined" && pM.delActionName != "") {
            pM.delActionName = $scope.init.initEditName + "/" + pM.delActionName;
        }
        else {
            pM.delActionName = "";
        }
        if (typeof (pM.permissionActionName) != "undefined" && pM.permissionActionName != "") {
            pM.permissionActionName = $scope.init.initEditName + "/" + pM.permissionActionName;
        }
        else {
            pM.permissionActionName = "";
        }
        if (subN) {
            var SubTableModelObj = eipPageSubTable.getSubUiTableModel(SubTableModel, guidTable + "name", pM, guidTable + "modename", $scope.init.initPrimaryKey, subN, guidTable + "modengrid");
        } else {
            var SubTableModelObj = eipPageHelper.getSubUiTableModel(SubTableModel, guidTable + "name", pM, guidTable + "modename", $scope.init.initPrimaryKey);
        }
       
        if (SubTableModelObj.dict_codes.length != 0) {
            dict_modeArras.push(SubTableModelObj.dict_codes);
        }
        return SubTableModelObj.SubTableModelHtml;
    }

    /*——————————————————————视图模板end*/
    //取字典项
    function getDictContent() {
        _.forEach(dict_modeArras, function (n) {
            _.forEach(n, function (item) {
                $scope["" + item.key + ""] = eipDict.getListByDictCode("" + item.key + "");
            })
        })

    }

    //递归
    /*
       增加回调函数用于保存新建和保存复制
    */
    function dg(urlSumbitArray, i, urlSumbitObj, succMsg, callback) { //递归

        if (i >= urlSumbitArray.length) { return; }
        var item = urlSumbitObj;
        var url = '';
        if ($scope.API_VERSION >= 1.2) {
            url = "Common/" + $scope.init.initUrl["" + item.urlName + ""]
        } else {
            url = $scope.init.initEditName + "/" + $scope.init.initUrl["" + item.urlName + ""];
        }

        var submitParams = $scope.init.initSubmitParam["" + item.submitParamName + ""];
        var submitBindScope = $scope.init.initReturnBindScope["" + item.ReturnBindScopeName + ""];

        if (!_.isUndefined(url) && url) {

            var otherHttpObject = {
                url: url,
                params: ''
            };
            var isCon = false;
            if (_.isArray(submitParams) && submitParams.length > 0) {

                var paramsStr = "";
                for (var index = 0; index < submitParams.length; index++) {
                    var n = submitParams[index];
                    if (!_.isUndefined(n.isUseEdit) && !_.isError(n.isUseEdit)) {
                        if (n.isUseEdit && $scope.ItemPageStatus == "edit") {
                            isCon = true;
                        } else {
                            continue;
                        }
                    } else if (!_.isUndefined(n.isUseNewEdit) && !_.isError(n.isUseNewEdit)) {
                        if (n.isUseNewEdit && $scope.ItemPageStatus == "new") {
                            isCon = true;
                        } else {
                            continue;
                        }

                    } else {
                        isCon = true;
                    }

                    if (isCon) {
                        if (index == 0) {
                            if (n.isScope == true) {
                                paramsStr = '{ "' + n.key + '": "' + $scope["" + n.value + ""] + '",';
                            } else {
                                '{ "' + n.key + '": "' + n.value + '",';
                            }
                        } else {
                            if (n.isScope == true) {
                                paramsStr = '"' + n.key + '": "' + $scope["" + n.value + ""] + '",';
                            } else {
                                paramsStr = '"' + n.key + '": "' + n.value + '",';
                            }
                        }
                    }
                }
                if (isCon) {
                    paramsStr = paramsStr.length > 1 ? paramsStr.substr(0, paramsStr.length - 1) : paramsStr;
                    paramsStr += "}";

                    otherHttpObject.params = JSON.parse(paramsStr);
                }
            } else if (_.isString(submitParams)) {
                isCon = true;
                otherHttpObject.params = $scope["" + submitParams + ""];
            }
            if (isCon) {
                if ($scope.API_VERSION && $scope.API_VERSION >= 1.2) {
                    otherHttpObject.params.controllerName = $scope.init.initEditName;
                    otherHttpObject.params.bizID = $scope._PK;
                    if (typeof (otherHttpObject.params) == 'object') {
                        otherHttpObject.params.dataJsonStr = '';
                        otherHttpObject.params.dataJsonStr = JSON.stringify(otherHttpObject.params);
                    }
                }
                eipHttpService.post(otherHttpObject)
                    .success(function (data, status, headers, config) {

                        var ifShow = eipShowLoadingService.isLoading();//是否弹框了
                        if (ifShow) {
                            eipShowLoadingService.stop();//关闭弹框
                        }
                        //加入保存复制、保存新建判断
                        if (typeof (callback) == "function") {
                            var isCallback = callback();
                            if (isCallback) {
                                return false
                            }
                        }

                        if (typeof (data) == 'string') {
                            data = JSON.parse(data);
                        }
                        operatReturnData(data, submitBindScope, succMsg);
                        if ($scope.afterGetRecord && typeof ($scope.afterGetRecord) == 'function') {
                            $scope.afterGetRecord();
                        }

                        //added by liuhongtai 20161230
                        EditPageStateControl($scope, data);
                        var keyID = "";
                        if (typeof (data.returnID) != "undefined") {
                            keyID = data.returnID.pkid;
                        }
                        else {
                            keyID = $scope.parentId;
                        }
                        var refresh = typeof (data.refresh) != "undefined" && data.refresh ? data.refresh : false;
                        // var refresh = (typeof (data.refresh) == "undefined") ? true : data.refresh
                        PageReload($scope, keyID, $scope.menuId, refresh);

                        if (i < urlSumbitArray.length) {
                            i = i + 1;
                            dg(urlSumbitArray, i, urlSumbitArray[i], succMsg);
                        }
                        //add by liuhongtai 20170122 保存成功后页面状态变为edit
                        if (typeof (data.IsSuccess) != "undefined" && data.IsSuccess) {
                            $scope.ItemPageStatus = "edit";
                        }
                        //编辑页面的数据向上传
                        if (otherHttpObject.url.split("/")[1] == "GetBaseItemByID") {
                            $scope.$emit("send-dataByID", data);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        if (l.isLoading()) {
                            l.stop();
                        }
                        //eipDefaultDialog.open("http error:" + status);
                    });
            }

        }
    }
    //根据返回值设置区块默认显示隐藏、内容是否可读
    function EditPageStateControl(_scope, data) {
        /*-----------------------编辑页面设置默认显示隐藏------------------------------*/
        if (data[0] != null) {
            if (typeof (data[0].showRowsItem) != "undefined") {
                angular.forEach(data[0].showRowsItem, function (item) {
                    _scope["showRow_" + item.rowIndex] = item.ifShow;
                });
            }
            if (typeof (data[0].setDisable) != "undefined") {
                angular.forEach(data[0].setDisable, function (item) {
                    _scope[item.scopeName] = item.disable;
                });
            }
            if (typeof (data[0].SetBlockHide) != "undefined") {
                angular.forEach(data[0].SetBlockHide, function (item) {
                    _scope[item.scopeName] = item.hide;

                });
            }
        }
        if (data != null) {
            if (typeof (data.returnID) != "undefined") {
                for (var key in data.returnID) {
                    if (key == "pkid") {
                        _scope._PK = data.returnID[key]
                        _scope.parentId = data.returnID[key]
                    }
                    else {
                        _scope.item[key] = data.returnID[key];
                        //_scope[key] = data.returnID[key];
                    }
                    //alert(key);
                    //alert(data.returnID[key]);
                }
            }
            if (typeof (data.setDisable) != "undefined") {
                angular.forEach(data.setDisable, function (item) {
                    _scope[item.scopeName] = item.disable;
                    //console.log(data.a);
                });
            }
            if (typeof (data.SetBlockHide) != "undefined") {
                angular.forEach(data.SetBlockHide, function (item) {
                    _scope[item.scopeName] = item.hide;
                    //console.log(data.a);
                });
            }
        }
    }
    //操作返回的值
    function operatReturnData(data, SubmitBindScope, succMsg) {
        if (!_.isUndefined(data)) {
            var tip = false;
            if (SubmitBindScope.length == 3 && SubmitBindScope[0].returnData === "IsSuccess" && SubmitBindScope[1].returnData === "strMessage" && SubmitBindScope[2].returnData === "ID") {
                tip = true;
            } else if (SubmitBindScope.length == 2 && SubmitBindScope[0].returnData === "IsSuccess" && SubmitBindScope[1].returnData === "strMessage") {
                tip = true;
            }
            _.forEach(SubmitBindScope, function (n) {
                if (n.returnData === "") {
                    if (_.isUndefined(data) && !_.isNull(data) && data != '' && data != '-1') {
                        setObjectPropertyValue($scope, n.bindScope, data);
                    } else {
                        setObjectPropertyValue($scope, n.bindScope, "");
                        $scope["" + n.bindScope + ""] = "";
                    }
                } else if (_.isNumber(n.returnData)) {
                    if (!_.isUndefined(data) && _.isArray(data) && data.length > 0) {
                        setObjectPropertyValue($scope, n.bindScope, data["" + n.returnData + ""]);
                    } else if (_.isObject(data)) {
                        setObjectPropertyValue($scope, n.bindScope, data);
                    } else {
                        setObjectPropertyValue($scope, n.bindScope, []);
                    }
                } else {
                    if (!_.isUndefined(data) && !_.isUndefined(data["" + n.returnData + ""]) && !_.isError(data["" + n.returnData + ""])) {
                        setObjectPropertyValue($scope, n.bindScope, data["" + n.returnData + ""]);
                    } else {
                        setObjectPropertyValue($scope, n.bindScope, {});
                    }
                }
            })
            if (!_.isUndefined(succMsg) && !_.isError(succMsg) && succMsg == "no") {
                //后台返回提示

            } else {
                if (tip == true) {
                    if (_.isUndefined($scope.strMessage) || _.isNull($scope.strMessage) || $scope.strMessage == "" || $scope.strMessage == "{}") {
                        eipDefaultDialog.show(COMMON_CONSTANT.SUCCESSMESSAGE);
                        //eipDefaultDialog.open(COMMON_CONSTANT.SUCCESSMESSAGE);
                    } else {
                        eipDefaultDialog.show($scope.strMessage);
                        //eipDefaultDialog.open($scope.strMessage);
                    }

                } else {
                    eipDefaultDialog.show(COMMON_CONSTANT.SUCCESSMESSAGE);
                    //eipDefaultDialog.open(COMMON_CONSTANT.SUCCESSMESSAGE);
                }

            }

        } else {
            eipDefaultDialog.open(COMMON_CONSTANT.FAILERMESSAGE);
        }
    }
    //根据配置中的editInitParam给字段赋初始值
    function operaInitParams(params) {
        _.forEach(params, function (obj) {
            operaInit(obj);
        })
    }
    function operaInit(obj) {
        if (_.isUndefined(obj.toJsonObj) || _.isError(obj.toJsonObj)) {
            obj.toJsonObj = false;
        }
        if (_.isUndefined(obj.toCopy) || _.isError(obj.toCopy)) {
            obj.toCopy = false;
        }
        setObjectPropertyValue($scope, obj.key, obj.value, obj.toJsonObj, obj.toCopy);

    }
    //设置属性链的值
    function setObjectPropertyValue(o, propertyString, value, toJsonObj, toCopy, i, len) {
        if (i === undefined) i = 0;
        if (len === undefined) len = 0;

        if (o == null || propertyString == null) return null;
        var arr = propertyString.split(".");//a.b.c

        if (i == 0) {
            var oQuote = {};
            o = $scope;
            oQuote = $scope;
        }
        if (len == 0) len = arr.length;//len=3
        //一开始，arr的len必然>=1,因此arr[i]无需验证是否存在。以后递归就受限于len。
        if (len > i + 1) {//
            if (i == 0) {//第一个         
                if (_.isUndefined(o[arr[i]]) && _.isNaN(o[arr[i]]) && _.isEmpty(o[arr[i]]) && _.isError(o[arr[i]])) {
                    o[arr[i]] = {}; //$scope.a={}
                }

                oQuote = o[arr[i]];
            } else { //
                if (_.isUndefined(o[arr[i - 1]][arr[i]]) && _.isNaN(o[arr[i - 1]][arr[i]]) && _.isEmpty(o[arr[i - 1]][arr[i]]) && _.isError(o[arr[i - 1]][arr[i]])) {

                    o[arr[i - 1]][arr[i]] = {};//$scope.a.b={}
                }

                oQuote = o[arr[i - 1]][arr[i]];
            }


            return setObjectPropertyValue(oQuote, propertyString, value, toJsonObj, i + 1, len);
        }
        else if (len == i + 1) {//3==2+1 last
            if (toJsonObj) {
                value = eval('(' + value + ')');
            }
            if (toCopy) {
                o[arr[i]] = angular.copy(value);
            } else {
                o[arr[i]] = value;
            }
        }
        else {
            return null;
        }
    }
    function PageReload(_scope, PkID, MenuId, refresh) {
        if (!refresh) {
            return null;
        }
        if ($scope.ItemPageStatus == "new") {
            //新建
            //页面刷新(增加时间戳)
            var UrlParamForReload = "{\"" + _scope.init.initPrimaryKey + "\":" + '"' + PkID + '"' + ",\"menuID\":" + '"' + MenuId + '"' + ",\"timestamp\":" + (new Date()).getTime() + "}";
            $state.go("MainFrame." + _scope.init.initEditName + ".Edit", { transParam: UrlParamForReload });
        }
        if ($scope.ItemPageStatus == "edit") {
            //编辑 
            var UrlParamForReload = eipUrlAction.getUrlParam();
            UrlParamForReload["timestamp"] = (new Date()).getTime();
            //将json对象转换为字符串
            var strUrlParamForReload = "{";
            for (var item in UrlParamForReload) {
                switch (typeof (UrlParamForReload[item])) {
                    case "number":
                        strUrlParamForReload += "\"" + item + "\":" + UrlParamForReload[item] + ",";
                        break;
                    case "string":
                        strUrlParamForReload += "\"" + item + "\":" + " \"" + UrlParamForReload[item] + "\",";
                        break;
                    default:
                        strUrlParamForReload += "\"" + item + "\":" + " \"" + UrlParamForReload[item] + "\",";
                        break;
                }
            }
            strUrlParamForReload = strUrlParamForReload.substr(0, strUrlParamForReload.length - 1);
            strUrlParamForReload += "}";
            var ControllerCode = window.location.hash.split("/")[2];
            var goName = "MainFrame." + ControllerCode + ".Edit";
            if (ControllerCode == "TaskToDo" || ControllerCode == "TaskDone") {
                if (window.location.hash.indexOf("DangerManage") >= 0) {
                    goName = "MainFrame." + ControllerCode + ".Edit1";
                }
                if (window.location.hash.indexOf("CauseManage") >= 0) {
                    goName = "MainFrame." + ControllerCode + ".Edit2";
                }
            }

            $state.go(goName, { transParam: strUrlParamForReload });
        }

    }


    /*————————————函数——————————*/
    $scope.PageStatus = PageStatus;
    //保存 +加入回调用于保存复制
    $scope.saveParentItem = function (callback) {
        if ($scope.ItemForm.$invalid) {
            $scope.showError = true;//显示错误信息
        }
        else {
            eipShowLoadingService.start();
            var subArr;
            if ($scope.ItemPageStatus == "new") {
                subArr = $scope.init.inUrlSumbit.editNewSaveSumbit
            } else {
                subArr = $scope.init.inUrlSumbit.editEditSaveSumbit
            }
            dg(subArr, 0, subArr[0], "", callback);
        }
    }

}
}]);
//自定义内容块
//<eip-edit-custom></eip-edit-custom>
angular.module('eipPageModule').directive('eipEditCustom', ['$templateCache', '$compile', 'COMMON_CONSTANT', 'eipDefaultDialog', 'eipHttpService', '$localStorage',
function ($templateCache, $compile, COMMON_CONSTANT, eipDefaultDialog, eipHttpService, $localStorage) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: function (element, attrs) {
            if (attrs.templatename) {
                return attrs.templatename;
            } else {
                return '<div><span>没有指定模板文件。</span></div>';
            }
        },
        link: function (scope, element, attrs) {
        }
    }
}]);


//自定义按钮+保存+返回 + 保存新建+ 保存复制
/*
@保存新建 : 保存成功后跳转到新建页面

@保存复制 : 保存成功后将主键重置

*/
angular.module('eipPageModule').directive('eipEditCustomBtn', ['UserInfo', '$templateCache', 'eipEditPageHelper', 'eipPageHelper', '$modal', '$compile', 'COMMON_CONSTANT', '$localStorage', 'eipUrlAction', 'PostHelperFactory', 'eipHttpService', 'eipDict', 'eipDefaultDialog', 'eipBrowsePageHelper', '$http', 'eipUrlParams', 'eipUrl', '$state', 'eipLoginInfoService', 'eipShowLoadingService', 'eipCustomBtn', '$rootScope', function (UserInfo, $templateCache, eipEditPageHelper, eipPageHelper, $modal, $compile, COMMON_CONSTANT, $localStorage, eipUrlAction, PostHelperFactory, eipHttpService, eipDict, eipDefaultDialog, eipBrowsePageHelper, $http, eipUrlParams, eipUrl, $state, eipLoginInfoService, eipShowLoadingService, eipCustomBtn, $rootScope) {
var btnObj = {
    restricts: 'E',
    replace: true,
    link: BtnViewLink
};
return btnObj;

function BtnViewLink($scope, $element, $attrs) {
    /*——————————初始化————————————————*/
    $scope.initEditCustomBtn = {
        hasSave: true,
        saveCopy: false,
        saveNew: false
    };
    //组装html
    var editCustomBtn = "";
    //自定义按钮
    if (!angular.isUndefined($scope.outparamss.pageCustomBtn) && !angular.isUndefined($scope.outparamss.pageCustomBtn.editBtn)) {

        if (!angular.isArray($scope.outparamss.pageCustomBtn.editBtn)) {
            return false
        }
        angular.forEach($scope.outparamss.pageCustomBtn.editBtn, function (obj, n) {
            if ($scope.ItemPageStatus == "new" && !obj.pageNew) {
                editCustomBtn += "";
            } else {
                editCustomBtn += eipCustomBtn.getEditBtnHtml(obj)
            }

        })
    }
    //自定义保存+保存新建+保存复制是否显示
    if (!angular.isUndefined($scope.outparamss.pageCustomBtn)) {
        $scope.initEditCustomBtn.hasSave = $scope.outparamss.pageCustomBtn.isSaveShow || $scope.initEditCustomBtn.hasSave
        $scope.initEditCustomBtn.saveCopy = $scope.outparamss.pageCustomBtn.isSaveCopyShow || $scope.initEditCustomBtn.isSaveCopyShow
        $scope.initEditCustomBtn.saveNew = $scope.outparamss.pageCustomBtn.isSaveNewShow || $scope.initEditCustomBtn.isSaveNewShow
    }
    //保存新建
    $scope.savaNew = function () {
        $scope.saveParentItem(function () {
            var NewTime = "new" + (new Date()).getTime();
            $state.go("MainFrame." + $scope.init.initEditName + ".Edit", { transParam: NewTime });
            return !!1
        })
    }
    //保存复制
    $scope.saveCopy = function () {
        $scope.saveParentItem(function () {
            $scope.ItemPageStatus = "new"
            $scope.parentId = "-1";
            $scope._PK = "-1";
            $scope.WfInitEditPage()
            $scope.item[$scope.init.initPrimaryKey] = "-1"
            return !!1
        })
    }
    //加入保存新建和保存复制
    var saveNCBtn = "";
    var optionsNew = {
        title: "保存新建",
        class: "btn-info",
        isShow: $scope.initEditCustomBtn.saveNew,
        event: "savaNew()"
    }
    var optionsCopy = {
        title: "保存复制",
        class: "btn-primary",
        isShow: $scope.initEditCustomBtn.saveCopy,
        event: "saveCopy()"
    }
    saveNCBtn += eipCustomBtn.getSaveCopyHtml(optionsNew);
    saveNCBtn += eipCustomBtn.getSaveCopyHtml(optionsCopy);

    var _html = '<div>' + editCustomBtn + saveNCBtn;

    _html += '<input type="button" style="margin-left:20px" value="保存" class="btn btn-success" ng-show="initEditCustomBtn.hasSave"  ng-click="saveParentItem()"/>' +
        '<a class="btn btn-default" type="button" ng-click="Back()">返回</a></div>'

    $element.html(_html);
    $compile($element.contents())($scope);
    /*————————————事件————————————————*/
    //返回
    $scope.Back = function () {
        $rootScope.$broadcast('change-select', $scope.menuId);
        var moduleStr = eipUrl.getPathUrl().substring(11);
        moduleStr = moduleStr.substring(0, moduleStr.indexOf('/'));
        btnBackState = "MainFrame." + moduleStr + ".Select";
        var params = { menuID: $scope.menuId }
        //加入自定义返回 backUrl
        /*example:   
                 backUrl:"MainFrame. moduleStr .Select",
                 backUrlParams:{transParam:"{id:\"sdsd\"}" }

        */
        if (!angular.isUndefined($scope.outparamss.pageCustomBtn) && !angular.isUndefined($scope.outparamss.pageCustomBtn.backUrl)) {
            btnBackState = $scope.outparamss.pageCustomBtn.backUrl
            params = $scope.outparamss.pageCustomBtn.backUrlParams
        }
        $state.go(btnBackState, params);
    }
}
}]);

//定义工作流
angular.module('eipPageModule').directive('eipWorkflowBtn', ['UserInfo', '$templateCache', 'eipEditPageHelper', 'eipPageHelper', '$modal', '$compile', 'COMMON_CONSTANT', '$localStorage', 'eipUrlAction', 'PostHelperFactory', 'eipHttpService', 'eipDict', 'eipDefaultDialog', 'eipBrowsePageHelper', '$http', 'eipUrlParams', 'eipUrl', '$state', 'eipLoginInfoService', 'eipShowLoadingService', 'eipCustomBtn','$q', function (UserInfo, $templateCache, eipEditPageHelper, eipPageHelper, $modal, $compile, COMMON_CONSTANT, $localStorage, eipUrlAction, PostHelperFactory, eipHttpService, eipDict, eipDefaultDialog, eipBrowsePageHelper, $http, eipUrlParams, eipUrl, $state, eipLoginInfoService, eipShowLoadingService, eipCustomBtn,$q) {
var btnObj = {
    restricts: 'E',
    replace: true,
    template: '<div class="btn-group  pull-right" ng-show="true"> ' +
    '<input type="button" ng-value="initEditBtn.btnShowsubmit.title" class="btn" ng-class="initEditBtn.btnShowsubmit.class" ng-click="SubmitData()" ng-show="initEditBtn.btnShowsubmit.show" ng-disabled="initEditBtn.btnShowsubmit.disabled" />' +
    '<input type="button" ng-value="initEditBtn.btnShowapprove.title" class="btn" ng-class="initEditBtn.btnShowapprove.class" ng-click="ApproveData()"  ng-show="initEditBtn.btnShowapprove.show"  ng-disabled="initEditBtn.btnShowapprove.disabled"" />' +
    '<input type="button" ng-value="initEditBtn.btnGetback.title" class="btn" ng-class="initEditBtn.btnGetback.class" ng-click="GetBack()"   ng-show="initEditBtn.btnGetback.show" ng-disabled="initEditBtn.btnGetback.disabled""/>' +
    '<input type="button" ng-value="initEditBtn.btnSendback.title" class="btn" ng-class="initEditBtn.btnSendback.class" ng-click="SendBack()"   ng-show="initEditBtn.btnSendback.show"  ng-disabled="initEditBtn.btnSendback.disabled" />' +
    '<a class="btn" type="button" ng-bind="initEditBtn.btnDisplaywf.title" target="_blank" ng-class="initEditBtn.btnDisplaywf.class" ng-show="initEditBtn.btnDisplaywf.show" ng-click="DisplayWorkFlow()" ng-disabled="initEditBtn.btnDisplaywf.disabled" ></a>' +
    '</div>',
    link: BtnViewLink
};
return btnObj;

function BtnViewLink($scope, $element, $attrs, form) {

    //默认配置
    $scope.initEditBtn = {
        btnShowsubmit: {
            class: "btn-primary",
            title: "提交",
            isRefresh: true,
            disabled: false,
            show:false
        },
        btnShowapprove: {
            class: "btn-info",
            title: "审批",
            isRefresh: true,
            disabled: false,
            show: false
        },
        btnGetback: {
            class: "btn-warning",
            title: "撤回",
            isRefresh: true,
            disabled: false,
            show: false
        },
        btnSendback: {
            class: "btn-danger",
            title: "退回",
            isRefresh: true,
            disabled: false,
            show: false
        },
        btnDisplaywf: {
            class: "btn-default",
            title: "查看流程",
            isRefresh: true,
            disabled: false,
            show: false
        }
    };
   //将配置的属性进行覆盖操作
    var btnPropertyEqual = function (btnGrop) {
        if (!angular.isUndefined($scope.outparamss.workflowBtn)) {
            for (var i in $scope.outparamss.workflowBtn) {
                for (var j in $scope.outparamss.workflowBtn[i]) {
                    btnGrop[i][j] = $scope.outparamss.workflowBtn[i][j];
                }
            }
        }
    };
    btnPropertyEqual($scope.initEditBtn)
    //控制相关按钮显示隐藏
    $scope.WfInitEditPage = function () {
        var wfParamsObj = {
            "MODULE_ID": $scope.menuId,
            "PK_ID": $scope.parentId,
            "initHasSave": true
        }
        var httpObject = {
            url: "WorkFlowCommon/WfInitEditPage",
            params: wfParamsObj
        };
        eipHttpService.post(httpObject)
            .success(function (data, status, headers, config) {
                if (data.dataResult) {
                    for (var n in data.dataResult) {
                        $scope.initEditBtn[n] = data.dataResult[n]
                    }
                }
            })
            .error(function (data, status, headers, config) {
                console.log("http error:" + status);
            })
    };
    $scope.WfInitEditPage()

    /*——————————————————————————工作流——————————————————————————*/
    //操作要提交的值url, submitParams, submitBindScope （提交操作调用）
    $scope.operateParamsForSubmit = function (urlSumbitArray, succMsg) {

        if (_.isUndefined(succMsg) || _.isError(succMsg)) {
            succMsg = "show";
        }
        var confirmSubmit = "是否确认提交？";
        eipDefaultDialog.confirm(confirmSubmit).then(function (value) {

        }).then(function (success) {
            $scope.dgaForSubmit(urlSumbitArray, 0, urlSumbitArray[0], succMsg, "submit");
            return true;
        }, function (error) {
            $scope.initEditBtn.enabledSubmit = false;
        });

    }
    //操作要提交的值url, submitParams, submitBindScope （审批操作调用）
    $scope.operateParamsForApprove = function (urlSumbitArray, succMsg) {

        if (_.isUndefined(succMsg) || _.isError(succMsg)) {
            succMsg = "show";
        }
        var confirmSubmit = "是否确认审批？";
        eipDefaultDialog.confirm(confirmSubmit).then(function (value) {

        }).then(function (success) {
            $scope.dgaForSubmit(urlSumbitArray, 0, urlSumbitArray[0], succMsg, "approve");
            return true;
        }, function (error) {
            $scope.initEditBtn.enabledApprove = false;
        });

    }
    //递归（提交操作使用的事件）
    $scope.dgaForSubmit = function (urlSumbitArray, i, urlSumbitObj, succMsg, operateType) {
        if (i >= urlSumbitArray.length) { return; }
        var item = urlSumbitObj;
        var url = '';
        if ($scope.API_VERSION >= 1.2) {
            url = "Common/" + $scope.init.initUrl["" + item.urlName + ""];
        } else {
            url = $scope.init.initEditName + "/" + $scope.init.initUrl["" + item.urlName + ""];
        }
        var submitParams = $scope.init.initSubmitParam["" + item.submitParamName + ""];
        var submitBindScope = $scope.init.initReturnBindScope["" + item.ReturnBindScopeName + ""];

        if (!_.isUndefined(url) && url != '') {

            var otherHttpObject = {
                url: url,
                params: ''
            };
            var isCon = false;
            if (_.isArray(submitParams) && submitParams.length > 0) {

                var paramsStr = "";
                for (var index = 0; index < submitParams.length; index++) {
                    var n = submitParams[index];
                    if (!_.isUndefined(n.isUseEdit) && !_.isError(n.isUseEdit)) {
                        if (n.isUseEdit && $scope.ItemPageStatus == "edit") {
                            isCon = true;
                        } else {
                            continue;
                        }
                    } else if (!_.isUndefined(n.isUseNewEdit) && !_.isError(n.isUseNewEdit)) {
                        if (n.isUseNewEdit && $scope.ItemPageStatus == "new") {
                            isCon = true;
                        } else {
                            continue;
                        }

                    } else {
                        isCon = true;
                    }

                    if (isCon) {
                        if (index == 0) {
                            if (n.isScope == true) {
                                paramsStr = '{ "' + n.key + '": "' + $scope["" + n.value + ""] + '",';
                            } else {
                                '{ "' + n.key + '": "' + n.value + '",';
                            }
                        } else {
                            if (n.isScope == true) {
                                paramsStr = '"' + n.key + '": "' + $scope["" + n.value + ""] + '",';
                            } else {
                                paramsStr = '"' + n.key + '": "' + n.value + '",';
                            }
                        }
                    }
                }
                if (isCon) {
                    paramsStr = paramsStr.length > 1 ? paramsStr.substr(0, paramsStr.length - 1) : paramsStr;
                    paramsStr += "}";

                    otherHttpObject.params = JSON.parse(paramsStr);
                }

            } else if (_.isString(submitParams)) {
                isCon = true;
                otherHttpObject.params = $scope["" + submitParams + ""];
            }
            if (isCon) {

                eipHttpService.post(otherHttpObject)
                    .success(function (data, status, headers, config) {
                        //$scope.operatReturnData(data, submitBindScope, succMsg);
                        /*-----------------------编辑页面设置默认显示隐藏------------------------------*/
                        if (data[0] != null && typeof (data[0].showRowsItem) != "undefined") {
                            angular.forEach(data[0].showRowsItem, function (item) {
                                $scope["showRow_" + item.rowIndex] = item.ifShow;
                                //console.log(data.a);
                            });

                        }

                        if (i < urlSumbitArray.length) {
                            i = i + 1;
                            if (operateType == "submit") {
                                $scope.dgaForSubmit(urlSumbitArray, i, urlSumbitArray[i], succMsg, "submit");
                            }
                            else {
                                $scope.dgaForSubmit(urlSumbitArray, i, urlSumbitArray[i], succMsg, "approve");
                            }
                        }
                        if (data.IsSuccess) {
                            $scope.IsSaveOk = true;
                            $scope.IsWfFlag = true;
                            if (data.ID != undefined) {
                                $scope._PK = data.ID;
                            }
                            if (data.HandleWf) {
                                $scope.IsWfOk = true;
                            }
                            else {
                                $scope.IsWfOk = false;
                            }
                        }
                        else {
                            $scope.IsSaveOk = false;
                            eipDefaultDialog.open(data.strMessage);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        eipDefaultDialog.open("http error:" + status);
                        return;
                    });
            }
        }
    }
    //工作流提交时调用的保存事件
    $scope.saveParentItemForSubmit = function () {
        if ($scope.ItemForm.$invalid) {
            //验证失败时提交、审批按钮可用
            $scope.initEditBtn.enabledSubmit = false;
            $scope.showError = true;//显示错误信息
        }
        else {
            $scope.WfType = "submit"; //工作流操作类型
            $scope.IsSaveOk = true;  //业务是否保存成功
            $scope.IsWfOk = false;  //是否要走工作流
            $scope.IsWfFlag = false;  //是否进行了保存操作
            $scope.operateParamsForSubmit($scope.init.inUrlSumbit.editEditSaveSumbit);
        }

    }
    //工作流审批时调用的保存事件（提交操作使用的事件）
    $scope.saveParentItemForApprove = function () {
        if ($scope.ItemForm.$invalid) {
            //验证失败时提交、审批按钮可用
            $scope.initEditBtn.enabledApprove = false;
            $scope.showError = true;//显示错误信息
        }
        else {
            $scope.WfType = "approve"; //工作流操作类型
            $scope.IsSaveOk = true;  //业务是否保存成功
            $scope.IsWfOk = false;  //是否要走工作流
            $scope.IsWfFlag = false;  //是否进行了保存操作
            $scope.operateParamsForApprove($scope.init.inUrlSumbit.editEditSaveSumbit);
        }

    }
    //工作流操作事件(被调用)
    $scope.WorkFlow = function (url, PK, MenuId, UserId) {
        var httpObject = {
            url: url,
            params: { PK_ID: PK, MODULE_ID: $scope.menuId, USER_ID: UserId }
        };
        eipHttpService.post(httpObject)
            .success(function (data, status, headers, config) {
                if (data == "Session expired") {
                    eipDefaultDialog.open("会话已经过期！请重新登录！");
                    $state.go("Index");
                }
                eipDefaultDialog.open(data.dataResult.strMessage);
                //$scope.$parent.initEditUpdate(pkID);
                //及时刷新按钮显示
                if (data.dataResult.IsSuccess) {

                    //页面刷新(增加时间戳)
                    $scope.PageReload($scope, PK, $scope.menuId, true);
                }

            })
            .error(function (data, status, headers, config) {
                eipDefaultDialog.open("http error:" + status);
            })
    }
    $scope.$watchGroup(["IsSaveOk", "IsWfOk", "IsWfFlag"], function (newVal, oldVal) {
        //注意：newVal与oldVal都返回的是一个数组
        if ($scope.WfType == "submit") {
            if (!newVal[0]) {
                //保存错误时启用提交按钮
                $scope.initEditBtn.enabledSubmit = false;
                //eipDefaultDialog.open("提交失败");
            }
            else {
                if (newVal[1]) {
                    var url = "WorkFlowCommon/WfSubmitAndApprove";
                    /* 以下代码为提交操作,提交操作 */
                    var httpObject = {
                        url: "WorkFlowCommon/GetIsSpecifiedUid",
                        params: { PK_ID: $scope._PK, MODULE_ID: $scope.menuId }
                    };
                    eipHttpService.post(httpObject)
                        .success(function (data, status, headers, config) {
                            if (data == "Session expired") {
                                eipDefaultDialog.open("会话已经过期！请重新登录！");
                                $state.go("Index");
                            }
                            if (data.dataResult) {
                                var modalSelectUser = $modal.open({
                                    templateUrl: '../../Views/Common/SelectUserForWF.html',
                                    size: 'lg'
                                });
                            }
                            else {
                                //不指定审批人，进行提交操作
                                $scope.WorkFlow(url, $scope._PK, $scope.menuId, UserId);
                            }
                        })
                        .error(function (data, status, headers, config) {
                            //错误时启用提交按钮
                            $scope.initEditBtn.enabledSubmit = false;
                            eipDefaultDialog.open("http error:" + status);
                        })
                }
                else {
                    if (oldVal[2] != undefined && newVal[2]) {
                        eipDefaultDialog.open("提交成功!");
                        //页面刷新(增加时间戳)
                        $scope.PageReload($scope, $scope._PK, $scope.menuId, true);
                    }

                }
            }
        }
        if ($scope.WfType == "approve") {
            if (!newVal[0]) {
                //保存错误时启用审批按钮
                $scope.initEditBtn.enabledApprove = false;
                //eipDefaultDialog.open("审批失败");
            }
            else {
                if (newVal[1]) {
                    $scope.PK_ID = $scope._PK;
                    $scope.MODULE_ID = MenuId;
                    $scope.USER_ID = UserId;
                    $scope.url = "WorkFlowCommon/WfSubmitAndApprove";
                    $scope.Title = '审批意见';
                    var Advice = '审批意见';
                    $scope.ApproveModalInstance = $modal.open({
                        templateUrl: '../../Views/Common/ApproveAdvice.html',
                        //controller: ApproveModalInstanceCtrl,
                        size: 'sm',
                        scope: $scope
                    });
                }
                else {
                    if (oldVal[2] != undefined && newVal[2]) {
                        eipDefaultDialog.open("审批成功!");
                        //页面刷新(增加时间戳)
                        $scope.PageReload($scope, $scope._PK, MenuId, true);
                    }
                }
            }
        }

    });

    //获取审批人、审批意见
    var getApproveInfo = function () {
        var defer = $q.defer();
        defer.resolve();
        var httpObject = {
            url: "WorkFlowCommon/WfBeforeVerification",
            params: { PK_ID: $scope.parentId, MODULE_ID: $scope.menuId, DATA_STATUS: typeof ($scope.item.DATA_STATUS) == "undefined" ? "" : $scope.item.DATA_STATUS }
        };
        eipHttpService.post(httpObject)
            .success(function (data, status, headers, config) {
                if (data.dataResult.IsSuccess) {
                    //defer.resolve(data.dataResult.IsSuccess);
                }
                else {
                   // defer.reject("返回了空数据!");
                }
            })
            .error(function (data, status, headers, config) {
                eipDefaultDialog.open("http error:" + status);
            })

        return defer.promise;
    };
    //提交操作
     $scope.submitRequest = function () {
        var httpObject = {
            url: "WorkFlowCommon/WfBeforeVerification",
            params: { PK_ID: $scope.parentId, MODULE_ID: $scope.menuId, DATA_STATUS: typeof ($scope.item.DATA_STATUS) == "undefined" ? "" : $scope.item.DATA_STATUS }
        };
        eipHttpService.post(httpObject)
            .success(function (data, status, headers, config) {
                $scope.initEditBtn.disabled = false;
                if (data.dataResult.IsSuccess) {
                    //调用页面保存事件
                    $scope.saveParentItemForSubmit();
                }
                else {
                    eipDefaultDialog.open(data.dataResult.strMessage);
                    //页面刷新(增加时间戳)
                    $scope.PageReload($scope, $scope.PK_ID, $scope.MODULE_ID, true);
                }
            })
            .error(function (data, status, headers, config) {
                //状态校验失败时提交按钮可用
                $scope.initEditBtn.disabled = false;
                eipDefaultDialog.open("http error:" + status);
            })
    }
    //工作流提交事件
    $scope.SubmitData = function () {
        //点击时禁用提交按钮
        $scope.initEditBtn.disabled = true;
        $scope.PK_ID = $scope.parentId;
        $scope.MODULE_ID = $scope.menuId;
        var promise = getApproveInfo()
        promise.then(function (data) {
            //弹窗填写审批人
            $scope.ApproveModalInstance = $modal.open({
                templateUrl: '../../Views/Common/SubmitApprove.html',
                scope: $scope
            });
        },function () {
            //直接提交
            $scope.submitRequest()
        }) 
    }
    //审批事件
    $scope.ApproveData = function () {
        //点击时禁用审批按钮
        $scope.initEditBtn.enabledApprove = true;
        $scope.PK_ID = $scope._PK;
        $scope.MODULE_ID = $scope.menuId;
        $scope.USER_ID = UserId;
        var httpObject = {
            url: "WorkFlowCommon/WfBeforeVerification",
            params: { PK_ID: $scope._PK, MODULE_ID: $scope.menuId, DATA_STATUS: typeof ($scope.item.DATA_STATUS) == "undefined" ? "" : $scope.item.DATA_STATUS }
        };
        eipHttpService.post(httpObject)
            .success(function (data, status, headers, config) {
                if (data.dataResult.IsSuccess) {

                    $scope.saveParentItemForApprove();
                }
                else {
                    eipDefaultDialog.open(data.dataResult.strMessage);
                    //页面刷新(增加时间戳)
                    $scope.PageReload($scope, $scope.PK_ID, $scope.MODULE_ID, true);
                }
            })
            .error(function (data, status, headers, config) {
                //校验出错时启用审批按钮
                $scope.initEditBtn.enabledApprove = false;
                eipDefaultDialog.open("http error:" + status);
            })

    }
    //退回事件
    $scope.SendBack = function () {
        //点击时禁用退回按钮
        $scope.initEditBtn.enabledSendBack = true;
        $scope.url = "WorkFlowCommon/WfSendBack";
        $scope.Title = '退回意见';
        var confirmDel = "是否确认退回？"
        eipDefaultDialog.confirm(confirmDel).then(function (value) {

        }).then(function (success) {
            var status = typeof ($scope.item.DATA_STATUS) == "undefined" ? "" : $scope.item.DATA_STATUS
            var httpObject = {
                url: "WorkFlowCommon/WfBeforeVerification",
                params: { PK_ID: $scope._PK, MODULE_ID: $scope.menuId, DATA_STATUS: status }
            };
            eipHttpService.post(httpObject)
                .success(function (data, status, headers, config) {
                    if (data.dataResult.IsSuccess) {
                        $scope.ApproveModalInstance = $modal.open({
                            templateUrl: '../../Views/Common/ApproveAdvice.html',
                            size: 'sm',
                            scope: $scope
                        });
                    }
                    else {
                        eipDefaultDialog.open(data.dataResult.strMessage);
                        //页面刷新(增加时间戳)
                        $scope.PageReload($scope, $scope._PK, $scope.MODULE_ID, true);
                    }
                })
                .error(function (data, status, headers, config) {
                    //错误退回按钮可用
                    $scope.initEditBtn.enabledSendBack = false;
                    eipDefaultDialog.open("http error:" + status);

                })
        }, function (error) {
            $scope.initEditBtn.enabledSendBack = false;
        });
    }
    //撤回事件
    $scope.GetBack = function () {
        //点击时禁用撤回按钮
        $scope.initEditBtn.enabledGetBack = true;
        var url = "WorkFlowCommon/WfRecall";
        var confirmGetBackl = "是否确认撤回？";
        eipDefaultDialog.confirm(confirmGetBackl).then(function (value) {

        }).then(function (success) {
            var httpObject = {
                url: "WorkFlowCommon/WfBeforeVerification",
                params: { PK_ID: $scope._PK, MODULE_ID: $scope.menuId, DATA_STATUS: typeof ($scope.item.DATA_STATUS) == "undefined" ? "" : $scope.item.DATA_STATUS }
            };
            eipHttpService.post(httpObject)
                .success(function (data, status, headers, config) {
                    if (data.dataResult.IsSuccess) {
                        $scope.WorkFlow(url, $scope._PK, $scope.menuId);
                    }
                    else {
                        eipDefaultDialog.open(data.dataResult.strMessage);
                        //页面刷新(增加时间戳)
                        $scope.PageReload($scope, $scope.PK_ID, $scope.MODULE_ID, true);
                    }
                })
                .error(function (data, status, headers, config) {
                    //错误撤回按钮可用
                    $scope.initEditBtn.enabledGetBack = false;
                    eipDefaultDialog.open("http error:" + status);
                })
        },
            function (error) {
                //错误撤回按钮可用
                $scope.initEditBtn.enabledGetBack = false;
            });
    };
    //工作流展示事件
    $scope.DisplayWorkFlow = function () {
        $scope.PK_ID = $scope._PK;
        $scope.MODULE_ID = $scope.menuId;
        var modalInstance = $modal.open({
            templateUrl: '../../Views/WorkFlow/DisplayWorkFlow.html',
            size: 'lg',
            scope: $scope
        });
    }
}
}]);

//解决tab切换grid收缩问题
angular.module('eipPageModule').directive('tabClick', function ($parse) {
return function (scope, element, attrs) {
    element.bind('click', function () {
        scope.$broadcast("tableresize", "");
    });
};
});
//代码收缩
angular.module('eipPageModule').directive('codeCollapse', function ($parse) {
return {
    restricts: 'E',
    replace: true,
    template: "<div class=\"code-expand\" ng-click='expandCode()' >" +
    "<i class=\"glyphicon code-button\" ng-class='codeinfo.icon'></i>" +
    "<span ng-class=\"code-c\" ng-bind='codeinfo.content'></span></div>",
    scope: {
        codeinfo: '=',
    },
    link: function ($scope, el, attr) {
        $scope.codeinfo = {
            isCollapse: true,
            content: "收缩表单",
            icon: "glyphicon-chevron-up"
        }
        //代码收缩
        $scope.expandCode = function () {
            $scope.codeinfo.isCollapse = !$scope.codeinfo.isCollapse
            if (!$scope.codeinfo.isCollapse) {
                $scope.codeinfo.content = "展开表单"
                $scope.codeinfo.icon = "glyphicon-chevron-down"
            } else {
                $scope.codeinfo.content = "收缩表单"
                $scope.codeinfo.icon = "glyphicon-chevron-up"
            }

        }
    }
}
});
//输入框的自适应高度
angular.module('eipPageModule').directive('eipautosize', function ($parse) {
return function (scope, element, attrs) {
    autosize(element);
};
});

//下拉多选
angular.module('eipPageModule').directive('eipRowCheckbox', ["$localStorage", "$location", "eipHttpService", function ($localStorage, $location, eipHttpService) {
return {
    restricts: 'AE',
    replace: true,
    scope: {
        modelName: '=',
        datasourceUrl: '@',
        dictCode: '@',
        onChange: '&',
        onClick: '&',
        isDisabled: '='
    },
    template: function (el, att) {
        var checkboxHtml = '<div class="eipRowCheckbox">\
        <input type="hidden" ng-model="modelName">\
        <ul class="rowCheckbox"><li ng-repeat="o in treeData">\
        <input type="checkbox" ng-click="checkClick(o)" ng-checked="o.check==true"> {{o.DITEM_NAME}}\
       </li></ul> <div class="clearfloat"></div><ul class="rowCheckboxView rowCheckbox" ng-show="listShow"><li ng-repeat="item in childrenItem">\
       <input ng-click="checkClick(item)" type="checkbox" ng-checked="item.check==true"> {{item.DITEM_NAME}}\
       </li></ul></div>'
        return checkboxHtml;
    },
    controller: function ($scope) {
        //获取用户id
        this.getUserID = function () {
            if ($localStorage["UserData"] && $localStorage["UserData"].USER_ID) {
                return $localStorage["UserData"].USER_ID;
            }
        };
        //获取请求的主键id
        this.getRequestKey = function (o) {
            o.type = "new"
            var aTmpParams = decodeURI($location.url().toString().split('?')[1]);
            if (aTmpParams.indexOf("transParam=new") < 0) {
                var obj = JSON.parse(aTmpParams.split('=')[1])
                for (var i in obj) {
                    o[i] = obj[i]
                }
                o.type = "edit"
            }
        };
    },
    link: function ($scope, el, attr, contrl) {
        //存取选中的id
        var setSelectIDs = function (obj) {
            if (obj.check) {
                $scope.modelName.push(obj.DITEM_CODE)
            } else {
                $scope.modelName.forEach(function (str, n) {
                    if (str == obj.DITEM_CODE) {
                        $scope.modelName.splice(n, 1)
                        return false
                    }
                })
            }
        };
        //格式化后台数据
        var selectChildren = function (data) {
            data.forEach(function (o, n) {
                if (o.showChildren) {
                    $scope.listShow = !!o.children
                    $scope.childrenItem = o.children
                }
                if (o.check) {
                    $scope.modelName.push(o.DITEM_CODE)
                }
                if (o.children && o.children.length > 0) {
                    selectChildren(o.children)
                }
            })
        };
        var requestDataSourceUrl = function (httpObject) {
            httpObject.params.UID = contrl.getUserID()
            contrl.getRequestKey(httpObject.params)
            eipHttpService.post(httpObject)
                .success(function (data, status, headers, config) {
                    $scope.modelName = []
                    $scope.treeData = data.dataResult
                    selectChildren($scope.treeData)
                })
                .error(function (data, status, headers, config) {
                    eipDefaultDialog.open("http error:" + status);
                })
        };

        //请求数据
        var getDataType = function () {
            if (typeof ($scope.dictCode) != "undefined") {
                $scope.treeData = eipDict.getListByDictCode($scope.dictCode)
                var modelNameWatch = $scope.$watch("modelName", function (n, o) {
                    if (n) {
                        $scope.modelName = n
                        modelNameWatch()
                    }
                });
            } else if (typeof ($scope.datasourceUrl) != "undefined") {
                var httpObject = {
                    url: $scope.datasourceUrl,
                    params: {}
                };
                requestDataSourceUrl(httpObject)
            }
        };
        getDataType()
        //checkbox点击事件
        $scope.checkClick = function (obj) {
            obj.check = !obj.check
            setSelectIDs(obj)
            if (obj.check && obj.showChildren) {
                $scope.listShow = true
                $scope.childrenItem = obj.children
            } else if (!obj.check && obj.showChildren) {
                $scope.listShow = false
            }
            $scope.onClick({ selectedItem: $scope.modelName })
        };
    }
}
}]);
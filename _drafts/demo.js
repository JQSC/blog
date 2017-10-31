 /**
  * Demo-问题上报审批管理模块
  */
  angular.module('EIPApp').controller('DemoProblemCtrl', ['$scope', '$localStorage', 'COMMON_CONSTANT', 'eipUrlAction', 'eipHttpService', 'eipDefaultDialog', 'PostHelperFactory', 'eipBrowsePageHelper', 'eipDict', function ($scope, $localStorage, COMMON_CONSTANT,
    eipUrlAction, eipHttpService, eipDefaultDialog, PostHelperFactory, eipBrowsePageHelper, eipDict) {
    $scope.t = true;
    //导出Word
    $scope.Export = function (obj) {
        var httpObject = {
            url: "Common/Export",
            params: { controllerName: "DemoProblem", suffix:"docx", exportShowName: "问题上报", recordID: $scope.$$childHead._PK, mapParty: "1" }
        };
        eipHttpService.post(httpObject)
        .success(function (data, status, headers, config) {
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display:none');
            a.setAttribute('href', '../../ExportWord/' + data.fileName);
            a.setAttribute('download', data.fileName);
            a.click();
        })
        .error(function (data, status, headers, config) {
            console.log("http error:" + status);
        })
    }
    //导出Excel
    $scope.ExportExcel = function (obj) {
        var httpObject = {
            url: "Common/Export",
            params: { controllerName: "DemoProblem", suffix: "xlsx", exportShowName: "问题上报", recordID: $scope.$$childHead._PK, mapParty: "1" }
        };
        eipHttpService.post(httpObject)
        .success(function (data, status, headers, config) {
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display:none');
            a.setAttribute('href', '../../ExportWord/' + data.fileName);
            a.setAttribute('download', data.fileName);
            a.click();
        })
        .error(function (data, status, headers, config) {
            console.log("http error:" + status);
        })
    }
    $scope.ShowOrHide = function (obj) {
        //根据选择值控制区块显示
        if (obj.selectedItem.selectedValue == "0") {
            $scope.$$childHead.Edit_OutDictModule_hide = false;
            $scope.$$childHead.Edit_InnerDictModule_hide = true;
        }
        else {
            $scope.$$childHead.Edit_OutDictModule_hide = true;
            $scope.$$childHead.Edit_InnerDictModule_hide = false;
        }
    }
    $scope.roleSearch = function (obj,scope) {
        scope.OpenModal("Modal_Head");
    }
    $scope.test = function (e, scope) {
        console.log(scope)
    }
    //查询页自定义函数
    $scope.listTest = function (e, scope) {
        var selectedRows = scope.$$childHead.getSelectState()
        var selectRowCount = selectedRows.length
        console.log("list:", selectedRows)
    }
    $scope.customfunction = [
        { "name": "ShowOrHide", "value": "ShowOrHide" },
        { "name": "roleSearch", "value": "roleSearch" },
        { "name": "ExportWord", "value": "ExportWord" },
         { "name": "listTest", "value": "listTest" },
          { "name": "test", "value": "test" },
        { "name": "Export", "value": "Export" },
        { "name": "ExportExcel", "value": "ExportExcel" }
    ];
    $scope.outparamss = {
       API_VERSION: 1.2,
        init: {
            initEditName: 'DemoProblem',
            initPrimaryKey: 'PROBLEM_ID',//主键编号,
            initUrl: {//初始化Url
                //editTreeNodeUrls: ["ItemDetailAdd", "ItemDetailSave", "ItemDetailDelete"],
                //editInitGridUrl:['xxx'],//编辑页面,初始化Grid的Url,防止有多个Grid所以用数组,       
            },
            initParam: {
                browseInitParam: [
                      { key: COMMON_CONSTANT.initBrowseItem, value: '{ ORG_INSP_ID: "", ORG_INSPED_ID:"", DICT_DEMO_CONTRACTOR:"", DATA_STATUS:"",INSP_TIME_BEGIN:"",INSP_TIME_END:"",PROBLEM_NUM:"",OP_CREATE_UNAME:"" }', toJsonObj: true, toCopy: true }
                ],
                editInitParam: [
                    { key: 'item', value: '{"ORG_INSP_ID":"' + $localStorage["UserData"].ORG_ID + '","INSPECT_USER":"' + $localStorage["UserData"].USER_NAME + '","INSPECT_TIME":"' + (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate() + '","OP_CREATE_UNAME":"' + $localStorage["UserData"].USER_NAME + '","OP_CREATE_USER":"' + $localStorage["UserData"].USER_ID + '", "OP_CREATE_DATE":"' + (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate() + '" }', toJsonObj: true, isUseNewEdit: true }
                ],
                addInitParam: {
                    "setBlockHide": { "Hide_Main_Attachments": true, "Hide_Rectify_Attachments": true, "Hide_Rectify_Attachments1": true, "Hide_Rectify_Info": false, "Hide_Cause_Analysis": true, "Hide_Acceptance_Info": true },
                    "setRowVisible": {
                        "showRow_11": false, "showRow_4": false, "showRow_3": false, "showRow_0": false
                    }
                }
            },
            inUrlSumbit: {
                editInitSubmit: [
                    {}
                    //{ urlName: 'editInitTree'}
                ]
            }
        },
             dataModule: [
                 {
                     key: COMMON_CONSTANT.BrowseKey,
                     module: {
                               eipGridTable: [
                                       { name: '主键', field: 'PROBLEM_ID', visible: false, isDelKey: true },
                                       { name: '序号', field: 'ROW_NUM', visible: true, width: 50 },
                                       { name: '检查单位', field: 'ORG_INSP_NAME',cellTemplate: { cell_tree_edit: true }, enableSorting:true, isDelArray: true, delShowName: true, isLink: true, linkState: "MainFrame.DemoProblem.Edit", linkParams: ['PROBLEM_ID'], linkTransportType: "STRING" },
                                       { name: '受检单位', field: 'ORG_INSPED_NAME',cellTemplate: { cell_tree_edit: true } },
                                       { name: '承包商', field: 'DICT_DEMO_CONTRACTOR_NAME' },
                                       { name: '问题编号', field: 'PROBLEM_NUM', enableSorting: true },
                                       { name: '问题描述', field: 'PROBLEM_DESC' },
                                       { name: '检查日期', field: 'INSPECT_TIME' },
                                       { name: '要求完成时间', field: 'DEMAND_TIME' },
                                       { name: '问题状态', field: 'DATA_STATUS', width: 100, cellTemplate: { cell_dict_Code: 'DICT_DEMO_PROBLEM_STATUS' } }
                               ],
                               eipSimpleTable: [
                                   { name: '检查单位', type: 'tree', placeholder: '', ngModel: 'ORG_INSP_ID', groupOrder: 1, hasPermit: true }
                                   //groupOrder代表排序
                               ],
                               eipAdvancedTable: [
                                   { name: '检查单位', type: 'tree', ngModel: 'ORG_INSP_ID', groupOrder: 1 },
                                   { name: '受检单位', type: 'tree', ngModel: 'ORG_INSPED_ID', groupOrder: 2 },
                                   { name: '承包商', type: 'select', ngModel: 'DICT_DEMO_CONTRACTOR', dataSourceUrl: 'DemoProblem/GetContractorList', multiple: 'false', groupOrder: 3 },
                                   { name: '问题状态', type: 'select', ngModel: 'DATA_STATUS', groupOrder: 4 },
                                   { name: '检查起始日期', type: 'date', ngModel: 'INSP_TIME_BEGIN', groupOrder: 5, format: 'yyyy/MM/dd' },
                                   { name: '检查截止日期', type: 'date', ngModel: 'INSP_TIME_END', groupOrder: 6, format: 'yyyy/MM/dd' },
                                   { name: '问题编号', type: 'text', ngModel: 'PROBLEM_NUM', placeholder: '问题编号', groupOrder: 7 },
                                   { name: '录入人', type: 'text', ngModel: 'OP_CREATE_UNAME', placeholder: '录入人', groupOrder: 8 }
                               ],
                               isShowEdit: "true",
                               isShowNew: "true",
                               isShowDelete: "true",
                               isShowExport: "true"
                     },
                     pageSetting: {
                         customBtn: [
                               {
                                   title: "自定义按钮",
                                   class: "btn-info",
                                   isShow: "true",
                                   event: "listTest($event)"
                               },
                         ]
                     }
                 },
                 {
                     key: 'Edit_Basic_Info',
                     module: [
                         { name: '检查单位：', bindModel: 'item.ORG_INSP_ID', type: 'tree', row: 1, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '检查类型：', bindModel: 'item.DICT_DEMO_INSP_TYPE', type: 'select', row: 1, bindDict_code: 'DICT_DEMO_INSP_TYPE', textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '受检单位：', bindModel: 'item.ORG_INSPED_ID', type: 'tree', row: 2, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '承包商：', bindModel: 'item.DICT_DEMO_CONTRACTOR', dataSourceUrl: 'DemoProblem/GetContractorList', type: 'multiselect', multiple: 'false', row: 2, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '问题编号：', bindModel: 'item.PROBLEM_NUM', type: 'text', row: 3, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '问题状态：', bindModel: 'item.DATA_STATUS', type: 'select', bindDict_code: 'DICT_DEMO_PROBLEM_STATUS', row: 3, textColSpan: 2, contentColSpan: 3, disabled: true },
                         { name: '问题描述：', bindModel: 'item.PROBLEM_DESC', type: 'textarea', row: 4, textColSpan: 2, contentColSpan: 8, disabled: 'wtj_Disable' },
                         { name: '问题分类：', bindModel: 'item.DICT_DEMO_PROB_TYPE', type: 'select', row: 6, textColSpan: 2, contentColSpan: 3, bindDict_code: 'DICT_DEMO_PROB_TYPE', disabled: 'wtj_Disable' },
                          { name: '放大镜', bindModel: 'item.FDJ_NAME', type: 'text', row: 6, textColSpan: 2, contentColSpan: 3, },
                        { name: '', bindModel: 'item.FDJ', type: 'hidden', row: 0, textColSpan: 0, contentColSpan: 0, placeholder: '隐藏文本' },
                        { name: '', type: 'icon', iconType: 'search', row: 6, textColSpan: 0, contentColSpan: 1, title: '查询弹框', on_Change: "roleSearch()" },

                        { name: '要求完成时间：', bindModel: 'item.DEMAND_TIME', type: 'date', row: 8, format: 'yyyy/MM/dd', textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '检查人员：', bindModel: 'item.INSPECT_USER', type: 'text', row: 8, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '检查日期：', bindModel: 'item.INSPECT_TIME', type: 'date3', format: 'YYYY/MM/DD', row: 9, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' },
                         { name: '录入人：', bindModel: 'item.OP_CREATE_UNAME', type: 'text', row: 9, textColSpan: 2, contentColSpan: 3, disabled: true },
                         { name: '录入日期：', bindModel: 'item.OP_CREATE_DATE', type: 'date', format: 'yyyy/MM/dd', row: 10, textColSpan: 2, contentColSpan: 3, disabled: 'wtj_Disable' }
                     ]
                 },
                 //附件
                 {
                     key: 'Edit_Attachments',
                     module: [
                        {
                            name: '', type: 'attachment', textColSpan: 1, contentColSpan: 12, row: 1, height: '100px',
                            parentTableName: 'SYS_DEMO_PROBLEM', attachmentTableName: 'SYS_ATTACHMENTS',
                            uploadActionName: 'AddAttachments', downloadActionName: 'GetAttachments',
                            deleteActionName: 'DelAttachments', bindModel: 'item.AttachmentsList', modalWindowid: 'demoProblemAttachement',
                            isShowUpload: "true",
                            isShowEdit: "true",
                            isShowDelete: "true"
                        }
                     ]
                 },
                 //原因分析
                 {
                     key: 'Edit_Cause_Analysis',
                     module: [
                         { name: '原因分析1：', bindModel: 'item.DC_SYS_DEMO_PROBLEM_ANALYSE.DICT_DEMO_ANALYSE_1', type: 'select', bindDict_code: 'DICT_DEMO_ANALYSE_1', row: 1, textColSpan: 2, contentColSpan: 3, disabled: "Cause_Disable" },
                         { name: '原因分析2：', bindModel: 'item.DC_SYS_DEMO_PROBLEM_ANALYSE.DICT_DEMO_ANALYSE_2', type: 'select', bindDict_code: 'DICT_DEMO_ANALYSE_2', row: 1, textColSpan: 2, contentColSpan: 3, disabled: "Cause_Disable" }
                     ]
                 },
                 {
                     key: 'Edit_Rectify_Info',
                     module: {
                         eipGridTable: [
                             { name: '主键ID', field: 'REC_ID', visible: false, isDelKey: true },
                             { name: '序号', field: 'ROW_NUM', visible: true },
                             { name: '整改措施', field: 'REC_MEASURE', isDelArray: true, delShowName: true ,isLink:true,isCellEdit:false},
                             { name: '整改进度', field: 'REC_RATE',isCellEdit: false },
                             { name: '整改时间', field: 'REC_TIME', cellTemplate: { cell_date_format: '{{COL_FIELD|timeformat:"YYYY-MM-DD"}}' } },
                             { name: '负责人', field: 'REC_RESPONSE_USER' },
                         ],
                         isShowEdit: "false",
                         isShowNew: "false",
                         isShowDelete: "false",
                         isShowExport: "false"
                     }
                 },
                 {//整改编辑弹出框
                     key: 'Edit_RectifyModule',
                     module: [
                       { name: '整改措施', bindModel: 'subitem.REC_MEASURE', type: 'text', row: 1, textColSpan: 2, contentColSpan: 4, placeholder: '整改措施' },
                       { name: '整改进度(%)', bindModel: 'subitem.REC_RATE', type: 'text', placeholder: '整改进度(0-100)', row: 1, textColSpan: 2, contentColSpan: 4 },
                       { name: '整改时间', bindModel: 'subitem.REC_TIME', type: 'date', format: 'yyyy/MM/dd', row: 2, textColSpan: 2, contentColSpan: 4 },
                       { name: '负责人', bindModel: 'subitem.REC_RESPONSE_USER', type: 'text', row: 2, textColSpan: 2, contentColSpan: 4, placeholder: '负责人' },
                        { name: '放大镜', bindModel: 'subitem.FDJ_NAME', type: 'text', row: 3, textColSpan: 2, contentColSpan: 4, },
                        { name: '', bindModel: 'subitem.FDJ', type: 'hidden', row: 0, textColSpan: 0, contentColSpan: 0, placeholder: '隐藏文本' },
                        { name: '', type: 'icon', iconType: 'search', row: 3, textColSpan: 0, contentColSpan: 1, title: '查询弹框', on_Change: "roleSearch()" },

                     ],
                     //测试子表弹窗带grid
                     moduleGrid: {
                         eipGridTable: [
                            { name: '主键ID', field: 'REC_CONTENT_ID', visible: false, isDelKey: true },
                            { name: '整改内容', field: 'REC_CONTENT' },
                            { name: '内容录入日期', field: 'REC_CONTENT_TIME', cellTemplate: { cell_date_format: '{{COL_FIELD|timeformat:"YYYY/MM/DD HH:mm"}}' } },
                            { name: '内容类型', field: 'DICT_REC_CONTENT_TYPE', cellTemplate: { cell_dict_Code: 'DICT_REC_CONTENT_TYPE' } },
          
                         ],
                         tableName: "DC_SYS_DEMO_REC_CONTENT",
                         tableUrl: "DemoProblem/GetRecContentList"
                     }
                 },
                 //整改附件
                 {
                     key: 'Edit_Rectify_Attachments',
                     module: [
                        {
                            name: '', type: 'attachment', textColSpan: 1, contentColSpan: 12, row: 1, height: '100px',
                            parentTableName: 'SYS_DEMO_PROBLEM_RECTIFY', attachmentTableName: 'SYS_ATTACHMENTS',
                            uploadActionName: 'AddAttachments', downloadActionName: 'GetAttachments',
                            deleteActionName: 'DelAttachments', bindModel: 'item.ATTACHMENTSLIST', modalWindowid: 'demoProblemRectifyAttachement',
                            isShowUpload: "true",
                            isShowEdit: "true",
                            isShowDelete: "true"
                        }
                     ]
                 },
                 //验收信息
                 {
                     key: 'Edit_Acceptance_Info',
                     module: [
                         { name: '验收人：', bindModel: 'item.DC_SYS_DEMO_PROBLEM_ACCEPT.ACCEPT_USER', type: 'text', row: 0, textColSpan: 2, contentColSpan: 3, disabled: "accept_Disable" },
                         { name: '验收时间：', bindModel: 'item.DC_SYS_DEMO_PROBLEM_ACCEPT.ACCEPT_TIME', type: 'date', format: 'yyyy/MM/dd', row: 0, textColSpan: 2, contentColSpan: 3, disabled: "accept_Disable" },
                     ]
                 },
                 {//负责人放大镜
                     key: 'Modal_Head',
                     module: {
                         modalID: "Head",//弹框ID，同一个controller下，名称不能重复
                         eipGridTable: [//isDelArray 删除前提示名称项（例是要删除 "单位value" 么）。 
                                       //delShowName 删除后提示名称项 （例删除 "单位value" 成功）。 
                           { name: 'ID', field: 'ROLE_ID', width: '0', isDelKey: true, disabled: true, visible: false },//visible: false,
                           { name: '角色名称', field: 'ROLE_NAME' },
                           { name: '角色备注', field: 'ROLE_DESC'},
                         ],
                         eipSimpleTable: [//默认简单查询 查询条件。
                                            //groupOrder代表排序
                            { name: '角色名称', type: 'text', placeholder: '', ngModel: 'ROLE_NAME', groupOrder: 1 },
                         ],
                         initUrl: "UserMange/GetRoleListOutOfUser",//grid初始化及查询调用后台方法
                         /*-------------------------------------弹出层相关配置-------------------------------------------*/
                         width: 750,             //弹层的宽度
                         saveAndClose: true,      //grid列表下是否显示关闭与保存（主要用于弹出层，查询列表页可以不配置此项）
                         //setTextTo: "FDJ_NAME",//弹框取回文本值赋给控件名称--SuchDangerType
                         //setValueTo: "FDJ",//弹框取ID值赋给控件名称 --SuchDangerTypeID
                         //textFrom: "ROLE_NAME",  //弹框文本取值列名
                         //valueFrom: "ROLE_ID", //弹框Value取值列名
                         //采用键值对形式传入多个参数进行多个赋值
                         setMultipleValue: {
                             "ROLE_ID": "FDJ",
                             "ROLE_NAME": "FDJ_NAME"
                         }
                     }
                 },
             ],
             pageModule: [
               {
                   type: 'Edit_Custom', moduleTitle: '基础信息', dataModuleName: 'Edit_Basic_Info'
               },
               {
                   type: 'Edit_Custom_Attachment', formRelation: 'Edit_Basic_Info', moduleTitle: '基本信息附件', dataModuleName: 'Edit_Attachments'
               },
               {
                   type: 'Edit_Custom', moduleTitle: '原因分析', dataModuleName: 'Edit_Cause_Analysis', isHide: "Hide_Cause_Analysis"
               },
               {
                   type: 'Edit_SubUiTable',isRowEdit:"ture", moduleTitle: '整改信息', dataModuleName: 'Edit_Rectify_Info', isHide: "Hide_Rectify_Info", /*initActionName: 'GetRectifyListByJdjcID',*/ editActionName: 'GetDangerStatus', permissionActionName: 'GetPermission', editActionName: 'GetSingleRecByID', editSaveActionName: 'SaveRecInfo', delActionName: 'DeleteRec', modeModuleName: 'Edit_RectifyModule', modeTitle: '', gridDataName: 'item.DC_SYS_DEMO_PROBLEM_RECTIFY', gridDataTotal: 'item.DC_SYS_DEMO_PROBLEM_RECTIFY.total'
               },
               {
                   type: 'Edit_Custom_Attachment',  moduleTitle: '整改信息附件', dataModuleName: 'Edit_Rectify_Attachments', isHide: "Hide_Rectify_Info"
               },
               {
                   type: 'Edit_Custom', moduleTitle: '验收信息', dataModuleName: 'Edit_Acceptance_Info', isHide: "Hide_Acceptance_Info"
               }
             ],
             //保存新建+保存复制
             pageCustomBtn: {
                 isSaveShow: true,   //默认true 
                 isSaveCopyShow: true,
                 isSaveNewShow: true, 
                 backUrl: "MainFrame.DemoProblem.Select",  //默认
                 //默认 backUrlParams: { menuID: "menuID" }, 
                 editBtn: [
                       {
                           pageNew:"true",  //默认新建页面隐藏按钮,当为true时候显示
                           title: "测试",
                           class: "btn-danger",
                           isShow:"true",
                           event: "test($event)"
                       },
                       {
                           pageNew:"false",  //默认新建页面隐藏按钮,当为true时候显示
                           title: "导出",
                           class: "btn-info",
                           isShow:"true",
                           event: "Export($event)"
                       },
                       {
                           pageNew: "false",  //默认新建页面隐藏按钮,当为true时候显示
                           title: "导出Excel",
                           class: "btn-info",
                           isShow: "true",
                           event: "ExportExcel($event)"
                       }
                 ]
             },
            //控制工作流
             workflowBtn: {
                 btnShowsubmit: {
                     class: "btn-danger",
                     title: "提交测试",
                     isRefresh: true,
                     //event:""
                 },
                 btnShowapprove: {
                     class: "btn-info",
                     title: "审批",
                     isRefresh: true
                 },
             }
    }

}]); 
/*
服务类
*/

//tab形式子表
eipApp.factory('eipPageSubTable', ['eipBrowsePageHelper', 'eipEditPageModeHelper', '$compile', function (eipBrowsePageHelper, eipEditPageModeHelper, $compile) {
    return {
        getSubTableModel: function (SubTableModel, guidTableScopeName, pM, modeModuleScopeName, parentId, subN) {
            var SubTableModelHtml = '';
            var dict_codes = [];
            var groupByArray = _.toArray(
                _.groupBy(SubTableModel.SubTableModelContent, function (groupByItem) {
                    return groupByItem.row;
                })
            );
            _.forEach(groupByArray, function (gba, gbaIndex) {
                _.forEach(gba, function (item2, item2Index) {
                    if (item2.type == "radio") {
                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    } else if (item2.type == 'select') {

                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    }
                })
            });
            var groupByArrayModeModule = _.toArray(
                _.groupBy(SubTableModel.modeModuleContent, function (groupByItem) {
                    return groupByItem.row;
                })
            );
            _.forEach(groupByArrayModeModule, function (gba, gbaIndex) {
                _.forEach(gba, function (item2, item2Index) {
                    if (item2.type == "radio") {
                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    } else if (item2.type == 'select') {

                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    }
                })
            });
            SubTableModelHtml += '<tab tab-click index=' + subN + ' ng-if="!' + SubTableModel.isHide + '"><tab-heading class="sub_tab" title="' + SubTableModel.moduleTitle + '">' + SubTableModel.moduleTitle + '</tab-heading>' +
                '<div class="form-group" style="margin:15px"><div class="col-sm-"' + SubTableModel.contentColSpan + '" control-label="control-label">' +
                '<eipsubgrid customfunction="customfunction" eipgridtable="' + guidTableScopeName + '" initgridurl=' + pM.initActionName + ' colspan="' + SubTableModel.contentColSpan +
                '"  editactionname="' + pM.editActionName + '"  delactionname="' + pM.delActionName + '"  modemodulecontent="' + modeModuleScopeName +
                '" addactionname="' + pM.addActionName + '" permissionactionname="' + pM.permissionActionName + '" datamodulename="' + pM.dataModuleName +
                '" modetitle="' + pM.modeTitle + '" editsaveactionname="' + pM.editSaveActionName + '" parentid="_PK" modeid="' +
                guidTableScopeName + '"  initgridtype="Data" ' + ' menu-id="' + SubTableModel.MenuId + '"' +
                ' isshow_edit="' + SubTableModel.SubTableModelContent.isShowEdit +
                '" isshow_new="' + SubTableModel.SubTableModelContent.isShowNew +
                '" isshow_delete="' + SubTableModel.SubTableModelContent.isShowDelete +
                '" isshow_export="' + SubTableModel.SubTableModelContent.isShowExport +
                 '" isrow_edit="' + SubTableModel.isRowEdit +
                '" is-disabled-new="' + pM.dataModuleName +
                '_add" is-disabled-edit="' + pM.dataModuleName +
                '_edit" is-disabled-delete="' + pM.dataModuleName +
                '_delete" enablepaging="' + pM.gridPagination + '" gridclass="' + (pM.gridClass || '') + '"></eipsubgrid></div></div></tab>';

            return {
                SubTableModelHtml: SubTableModelHtml,
                dict_codes: dict_codes,
                title: SubTableModel.moduleTitle
            }
        },
        getSubUiTableModel: function (SubTableModel, guidTableScopeName, pM, modeModuleScopeName, parentId, subN, modeModuleScopeGrid) {
            var SubTableModelHtml = '';
            var dict_codes = [];
            var groupByArray = _.toArray(
                _.groupBy(SubTableModel.SubTableModelContent, function (groupByItem) {
                    return groupByItem.row;
                })
            );
            _.forEach(groupByArray, function (gba, gbaIndex) {
                _.forEach(gba, function (item2, item2Index) {
                    if (item2.type == "radio") {
                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    } else if (item2.type == 'select') {

                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    }
                })
            });
            var groupByArrayModeModule = _.toArray(
                _.groupBy(SubTableModel.modeModuleContent, function (groupByItem) {
                    return groupByItem.row;
                })
            );
            _.forEach(groupByArrayModeModule, function (gba, gbaIndex) {
                _.forEach(gba, function (item2, item2Index) {
                    if (item2.type == "radio") {
                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    } else if (item2.type == 'select') {

                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    }
                })
            });
            SubTableModelHtml += '<tab tab-click index=' + subN + ' ng-if="!' + SubTableModel.isHide + '"><tab-heading class="sub_tab" title="' + SubTableModel.moduleTitle + '">' + SubTableModel.moduleTitle + '</tab-heading>' +
                '<div class="form-group" style="margin:15px"><div class="col-sm-"' + SubTableModel.contentColSpan + '" control-label="control-label">' +
                '<eipsubuigrid2 customfunction="customfunction" eipgridtable="' + guidTableScopeName + '" colspan="' + SubTableModel.contentColSpan +
                '"  editactionname="' + pM.editActionName + '"  delactionname="' + pM.delActionName + '"  modemodulecontent="' + modeModuleScopeName + '"  modemodulegrid="' + modeModuleScopeGrid +
                '" addactionname="' + pM.addActionName + '" permissionactionname="' + pM.permissionActionName + '" datamodulename="' + pM.dataModuleName +
                '" modetitle="' + pM.modeTitle + '" editsaveactionname="' + pM.editSaveActionName + '" parentid="_PK" modeid="' +
                guidTableScopeName + '"  initgridtype="Data" ' + //' menu-id="' + SubTableModel.MenuId + '"' +
                'grid-data="' + pM.gridDataName + '"' +
                ' isshow_edit="' + SubTableModel.SubTableModelContent.isShowEdit +
                '" isshow_new="' + SubTableModel.SubTableModelContent.isShowNew +
                '" isshow_delete="' + SubTableModel.SubTableModelContent.isShowDelete +
                '" isshow_export="' + SubTableModel.SubTableModelContent.isShowExport +
                 '" isrow_edit="' + SubTableModel.isRowEdit +
                '" is-disabled-new="' + pM.dataModuleName +
                '_add" is-disabled-edit="' + pM.dataModuleName +
                '_edit" is-disabled-delete="' + pM.dataModuleName +
                '_delete" enablepaging="' + pM.gridPagination + '"></eipsubuigrid2></div></div></tab>';
            return {
                SubTableModelHtml: SubTableModelHtml,
                dict_codes: dict_codes,
                title: SubTableModel.moduleTitle
            };
        },
        getFormTable: function (IrregularAndRegularModule, scope, formNum, attachmentTableHtml) {
            var IrregularAndRegularModuleHtml = '';
            var dict_codes = [];
            var editBtnHtml = '';
            //var btnBackState = "MainFrame." + State + ".Select";

            IrregularAndRegularModule.IrregularAndRegularModuleContent = _.orderBy(IrregularAndRegularModule.IrregularAndRegularModuleContent, function (n) {
                return n.row;
            });

            var groupByArray = _.toArray(
                _.groupBy(IrregularAndRegularModule.IrregularAndRegularModuleContent, function (groupByItem) {
                    return groupByItem.row;
                })
            );
            var foreachhtml = "";
            _.forEach(groupByArray, function (gba, gbaIndex) {
                if (gba[0].type == "attachment") {
                    foreachhtml += "<div class='form-group' >";
                }
                else {
                    var rowIndex = scope.rowIndex;//取行索引
                    foreachhtml += "<div ng-init='rowVisible.showRow_" + rowIndex + "=true'></div>";//默认设置行显示
                    foreachhtml += "<div class='form-group' ng-if='rowVisible.showRow_" + rowIndex + "' >";
                    scope.rowIndex = rowIndex + 1;
                }
                _.forEach(gba, function (item2, item2Index) {
                    if (item2.type != "attachment" && item2.type != "icon" && item2.type != "grid" && item2.type != "hidden") {
                        foreachhtml += '<eipcol col-span="' + item2.textColSpan + '" control-label="control-label"><label>' + item2.name + '</label></eipcol>';
                    }
                    var guid = eipBrowsePageHelper.getGuid(4, 16);
                    if (item2.type == "text") {

                        if (!_.isUndefined(item2.contentColSpan)) {
                            foreachhtml += "<div class='col-sm-" + item2.contentColSpan + "'>";
                        }

                        foreachhtml += "<input name='" + guid + "'";
                        if (!_.isUndefined(item2.dataType)) {
                            if (item2.dataType == 'number') {
                                if (item2.dataFloat) {
                                    foreachhtml += " ng-pattern='/^\\d+(\\.\\d{1," + item2.dataFloat + "})?$/' ";
                                } else {
                                    foreachhtml += " ng-pattern='/^\\d+$/'";
                                }
                            } else {
                                foreachhtml += " type='" + item2.dataType + "'";
                            }
                        }
                        else {
                            foreachhtml += " type='text'";
                        }
                        if (!_.isUndefined(item2.title)) {
                            foreachhtml += " title='" + item2.title + "'";
                        }
                        if (!_.isUndefined(item2.required)) {
                            foreachhtml += " required = ''";
                        }
                        if (!_.isUndefined(item2.maxLength)) {
                            foreachhtml += "  ng-maxlength='" + item2.maxLength + "'";
                        }
                        if (!_.isUndefined(item2.minLength)) {
                            foreachhtml += " ng-minlength='" + item2.minLength + "'";
                        }
                        if (!_.isUndefined(item2.bindModel)) {
                            foreachhtml += " ng-model='" + item2.bindModel + "'";
                        }
                        if (!_.isUndefined(item2.placeholder)) {
                            foreachhtml += " placeholder='" + item2.placeholder + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " ng-disabled='" + item2.disabled + "'";
                        }
                        var floatmsg = "";
                        if (item2.dataFloat) {
                            floatmsg = "或" + item2.dataFloat + "位小数";
                        }
                        foreachhtml += "  data-toggle=\"tooltip\"  class=\"form-control tooltip-test\" />";
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError||ItemForm." + guid + ".$error.$invalid\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.minlength\">" + item2.name + "长度为11位</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.email\">" + item2.name + "格式错误" + "</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.pattern\">" + item2.name + "只能为数字" +floatmsg+ "</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.maxlength\">" + item2.name + "长度为11位</span>\
                            </span>";
                        foreachhtml += "</div>";

                    }
                    else if (item2.type == "icon") {
                        foreachhtml += "<div";
                        if (!_.isUndefined(item2.contentColSpan)) {
                            foreachhtml += " class='col-sm-" + item2.contentColSpan + "'";
                        }
                        foreachhtml += ">";
                        if (item2.iconType == "search") {//search图标
                            foreachhtml += "<a type='button' href='' ";
                            if (typeof (item2.on_Change) != "undefined") {
                                foreachhtml += "ng-click='" + item2.on_Change + "' ";
                            }
                            if (!_.isUndefined(item2.disabled)) {
                                foreachhtml += " ng-hide='" + item2.disabled + "'";
                            }
                            foreachhtml += " data-toggle='modal' class='btn btn-default btn-sm'>" +
                                "<span class='glyphicon glyphicon-search'></span>" +
                                " </a>";
                        }
                        foreachhtml += "</div>";
                    }
                    else if (item2.type == "radio") {

                        foreachhtml += "<div";
                        if (!_.isUndefined(item2.contentColSpan)) {
                            foreachhtml += " class='col-sm-" + item2.contentColSpan + "'";
                        }
                        foreachhtml += "><eipradiolist ";
                        if (!_.isUndefined(item2.bindModel)) {
                            foreachhtml += " model_name='" + item2.bindModel + "'";
                        }
                        if (!_.isUndefined(item2.bindDict_code)) {
                            foreachhtml += " dict_code='" + item2.bindDict_code + "'";
                        }
                        if (!_.isUndefined(item2.radioName)) {
                            foreachhtml += " radio_name='" + item2.radioName + "'";
                        }
                        if (typeof (item2.on_Change) != "undefined") {
                            foreachhtml += " on_change='" + item2.on_Change + "'";
                        }
                        if (typeof (item2.on_Click) != "undefined") {
                            foreachhtml += " on_click='" + item2.on_Click + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " isDisabled='" + item2.disabled + "'";
                        }
                        foreachhtml += "> </eipradiolist></div>";

                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    } else if (item2.type == 'textarea') {

                        foreachhtml += "<div";
                        if (!_.isUndefined(item2.contentColSpan)) {
                            foreachhtml += " class='col-sm-" + item2.contentColSpan + "'";
                        }
                        if (!_.isUndefined(item2.height)) {
                            foreachhtml += " style='height:" + item2.height + ";' ng-cloak";
                        }
                        foreachhtml += " ><textarea style=\"max-height: 300px\" eipautosize class='form-control tooltip-test' ";
                        if (!_.isUndefined(item2.title)) {
                            foreachhtml += "title='" + item2.title + "'";
                        }
                        if (!_.isUndefined(item2.required)) {
                            foreachhtml += " required = ''";
                        }
                        if (!_.isUndefined(item2.maxLength)) {
                            foreachhtml += "  ng-maxlength='" + item2.maxLength + "'";
                        }
                        if (!_.isUndefined(item2.minlength)) {
                            foreachhtml += " ng-minlength='" + item2.minlength + "'";
                        }
                        if (!_.isUndefined(item2.bindModel)) {
                            foreachhtml += " ng-model='" + item2.bindModel + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " ng-disabled='" + item2.disabled + "'";
                        }
                        foreachhtml += " data-toggle='tooltip' name='" + guid + "' ></textarea>";
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError||ItemForm." + guid + ".$error.$invalid\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.minlength\">" + item2.name + "长度不能小于" + item2.minlength + "</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.maxlength\">" + item2.name + "长度不能大于" + item2.maxLength + "</span>\
                            </span>";
                        foreachhtml += "</div>";
                    } else if (item2.type == 'select') {
                        foreachhtml += '<eipcol col-span="' + item2.contentColSpan + '" >';
                        foreachhtml += "<eipdropdownlist name='" + guid + "'";
                        if (typeof (item2.bindModel) != "undefined") {
                            foreachhtml += " model_name='" + item2.bindModel + "'";
                        }
                        if (typeof (item2.selectedText) != "undefined") {
                            foreachhtml += " selected_text='" + item2.selectedText + "'";
                        }
                        if (typeof (item2.bindDict_code) != "undefined") {
                            foreachhtml += " dict_code='" + item2.bindDict_code + "'";
                        }
                        if (typeof (item2.required) != "undefined") {
                            foreachhtml += " isrequired='" + item2.required + "'";
                        }
                        if (typeof (item2.on_Change) != "undefined") {
                            foreachhtml += " on_change='" + item2.on_Change + "'";
                        }
                        if (typeof (item2.dataSourceUrl) != "undefined") {
                            foreachhtml += " datasource_url='" + item2.dataSourceUrl + "'";
                        }
                        if (typeof (item2.dataSource) != "undefined") {
                            foreachhtml += " datasource='" + item2.dataSource + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " isDisabled='" + item2.disabled + "'";
                        }
                        if (!typeof (item2.params) != "undefined") {
                            foreachhtml += " params='" + item2.params + "'";
                        }
                        foreachhtml += "></eipdropdownlist>";
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError||ItemForm." + guid + ".$error.$invalid\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span></span>";
                        foreachhtml += "</eipcol>";
                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }

                    } else if (item2.type == "select3") {
                        foreachhtml += '<eipcol col-span="' + item2.contentColSpan + '" >';
                        foreachhtml += "<eipdropdownlist2 name='" + guid + "'";
                        if (typeof (item2.bindModel) != "undefined") {
                            foreachhtml += " model_name='" + item2.bindModel + "'";
                        }
                        if (typeof (item2.selectedText) != "undefined") {
                            foreachhtml += " selected_text='" + item2.selectedText + "'";
                        }
                        if (typeof (item2.bindDict_code) != "undefined") {
                            foreachhtml += " dict_code='" + item2.bindDict_code + "'";
                        }
                        if (typeof (item2.required) != "undefined") {
                            foreachhtml += " isrequired='" + item2.required + "'";
                        }
                        if (typeof (item2.on_Change) != "undefined") {
                            foreachhtml += " on_change='" + item2.on_Change + "'";
                        }
                        if (typeof (item2.dataSourceUrl) != "undefined") {
                            foreachhtml += " datasource_url='" + item2.dataSourceUrl + "'";
                        }
                        if (typeof (item2.dataSource) != "undefined") {
                            foreachhtml += " datasource='" + item2.dataSource + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " isDisabled='" + item2.disabled + "'";
                        }
                        if (!typeof (item2.params) != "undefined") {
                            foreachhtml += " params='" + item2.params + "'";
                        }
                        foreachhtml += "></eipdropdownlist2>";
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError||ItemForm." + guid + ".$error.$invalid\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span></span>";
                        foreachhtml += "</eipcol>";
                        if (!_.isUndefined(item2.bindDict_code) && !_.isError(item2.bindDict_code)) {
                            dict_codes.push({ 'key': item2.bindDict_code });
                        }
                    } else if (item2.type == 'date') {
                        foreachhtml += "<eipcol";
                        if (!_.isUndefined(item2.contentColSpan)) {
                            foreachhtml += " col-span='" + item2.contentColSpan + "'";
                        }
                        foreachhtml += " ><eipcalendar22 name='" + guid + "' ";
                        if (!_.isUndefined(item2.format)) {
                            foreachhtml += " format = '" + item2.format + "'";
                        }
                        if (!_.isUndefined(item2.title)) {
                            foreachhtml += " title='" + item2.title + "'";
                        }
                        if (!_.isUndefined(item2.bindModel)) {
                            foreachhtml += " model-name='" + item2.bindModel + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " isDisabled='" + item2.disabled + "'";
                        }
                        if (typeof (item2.required) != "undefined") {
                            foreachhtml += " isrequired='" + item2.required + "'";
                        }
                        foreachhtml += " ></eipcalendar22>";
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.date\">" + item2.name + "为非日期格式</span>\
                            </span>";
                        foreachhtml += "</eipcol>";
                    } else if (item2.type == 'date3') {
                        foreachhtml += '<eipcol>';
                        foreachhtml += '<div class="input-group" >';
                        foreachhtml += '<input readonly style="background-color:white !important;" ng-disabled="' + item2.disabled + '" class="form-control" type="text" date-time ng-model="' + item2.bindModel + '" ';
                        if (item2.tz) {
                            foreachhtml += 'timezone="' + item2.tz + '" ';
                        } else {
                            foreachhtml += 'timezone="Asia/Chongqing" ';
                        }
                        if (item2.autoClose == true || item2.autoClose == 'true') {
                            foreachhtml += 'auto-close="true" ';
                        }
                        if (item2.maxView) {
                            foreachhtml += 'max-view="' + item2.maxView + '" ';
                        } else {
                            foreachhtml += 'max-view="year" ';
                        }
                        if (item2.minView) {
                            foreachhtml += 'min-view="' + item2.minView + '" ';
                        } else {
                            foreachhtml += 'min-view="date" ';
                        }
                        if (item2.format) {
                            foreachhtml += 'format="' + item2.format + '" ';
                        }
                        else {
                            foreachhtml += 'format= "YYYY-MM-DD" ';
                        }
                        if (item2.view) {
                            foreachhtml += 'view="' + item2.view + '" ';
                        }
                        else {
                            foreachhtml += 'view= "date" ';
                        }
                        if (item2.minDate) {
                            foreachhtml += 'min-date="' + item2.minDate + '" ';
                        }
                        if (item2.maxDate) {
                            foreachhtml += 'max-date="' + item2.maxDate + '" ';
                        }
                        if (item2.dateChange) {
                            foreachhtml += 'date-change="' + item2.dateChange + '" ';
                        }
                        foreachhtml += ' />';
                        foreachhtml += '<span class="input-group-addon" style="background-color: white;"><i class="glyphicon glyphicon-calendar"></i></span>';
                        foreachhtml += '</div>';
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span>\
                            <span ng-show=\"ItemForm." + guid + ".$error.date\">" + item2.name + "为非日期格式</span>\
                            </span>";
                        foreachhtml += '</eipcol>';
                    } else if (item2.type == "attachment") {
                        //foreachhtml += '<eipcol col-span="' + item2.contentColSpan + '" >' +
                        //'<eipfileupload ng-if="!' + item2.hideModalName + '" pkid="_PK" model-name="' + item2.bindModel +
                        //'" tablename="' + item2.parentTableName + '" attachmenttablename="'
                        //+ item2.attachmentTableName + '" ctrlname="' + scope.init.initEditName + '" uploadactionname="' +
                        //item2.uploadActionName + '" downloadactionname="' + item2.downloadActionName +
                        //'" deleteactionname="' + item2.deleteActionName +
                        //'" modal-windowid="' + item2.modalWindowid + '"></eipfileupload>' +
                        foreachhtml += '<eipattachment parentid="_PK" model-name="' + item2.bindModel +
                            '" datamodulename="' + IrregularAndRegularModule.dataModuleName +
                            '" tablename="' + item2.parentTableName + '" attachmenttablename="' +
                            item2.attachmentTableName + '" ctrlname="' + scope.init.initEditName +
                            '" uploadactionname="' + item2.uploadActionName +
                            '" downloadactionname="' + item2.downloadActionName +
                            '" permissionactionname="' + item2.permissionActionName +
                            '" deleteactionname="' + item2.deleteActionName +
                            '" modal-windowid="' + item2.modalWindowid + '" menu-id="' + IrregularAndRegularModule.MenuId +
                            '" is-show-upload="' + item2.isShowUpload +
                            '" is-show-edit="' + item2.isShowEdit +
                            '" is-show-delete="' + item2.isShowDelete + '"></eipattachment>';//+
                        //'</eipcol>'
                    } else if (item2.type == 'grid') {
                        //简单查询只取一个查询字段
                        if (!_.isUndefined(item2.eipSimpleTable)) {
                            foreachhtml += "<div class=\"container-fluid\"><div class=\"row-fluid\">" +
                                "<div class='col-sm-2  control-label' control-label='control-label' ><label>" + item2.eipSimpleTable[0].name + "</label></div>" +
                                "<div class='col-sm-4'>" +
                                "<input type=\"text\" class=\"form-control ng-pristine ng-untouched ng-valid ng-scope\"  placeholder=\"" + item2.eipSimpleTable[0].placeholder + "\" ng-model=\"eipSimpleSearch.content\">" +
                                " </div> <div class='col-sm-6'>" +
                                "<button type=\"button\" class=\"btn btn-primary\" ng-click=\"pageSearch()\">查询</button>" +
                                "</div></div></div>"
                        }


                        //foreachhtml += '<eipcol col-span="12"><div role="grid" ui-grid="' + item2.gridOptions + '" ui-grid-pagination class="gridStyle" ui-grid-selection></div></eipcol>';

                        foreachhtml += "<table class=\"table table-bordered table-hover\"><thead><tr style='background-color:#f0f0ee'><th style='width:10px;'><input type=\"checkbox\" ng-model='selectedAll' ng-change='selectAll(selectedAll)'></th>";
                        var fieldhtml = '';
                        if (!_.isUndefined(item2.columns)) {
                            _.forEach(item2.columns, function (col, index) {
                                if (col.visible == undefined || col.visible == true) {
                                    foreachhtml += "<th style='width:45%;'>" + col.name + "</th>";
                                    fieldhtml += "<td title='{{item." + col.field + "}}'>{{item." + col.field + "|cut:20:'...'}}</td>";
                                } else {
                                    foreachhtml += "<th style='display:none;'>" + col.name + "</th>";
                                    fieldhtml += "<td style='display:none;' title='{{item." + col.field + "}}'>{{item." + col.field + "}}</td>";
                                }

                            })
                        }
                        foreachhtml += "</tr></thead>" +
                            "<tbody>" +
                            "<tr ng-repeat=\"item in dataItems\">" +
                            " <td><input type=\"checkbox\" ng-model='item.$checked' ng-change='selection(item)'></td>" +
                            fieldhtml + " </tr></tbody></table>";
                        foreachhtml += '  <div role="contentinfo" class="ui-grid-pager-panel ng-scope" >' +
                            '<div class="ui-grid-pager-count-container">' +
                            '<div class="ui-grid-pager-count">' +
                            '<span class="ng-binding">' +
                            '显示<span class="ng-binding" style="">1 <abbr>-</abbr> 10 共  {{dataItems.length}} 行</span>' +
                            '</span></div></div>' +
                            '<div role="navigation" class="ui-grid-pager-container">' +
                            '<div role="menubar" class="ui-grid-pager-control">' +
                            '<button type="button" role="menuitem" class="ui-grid-pager-first" ui-grid-one-bind-title="aria.pageToFirst" ui-grid-one-bind-aria-label="aria.pageToFirst" ng-click="pageFirstPageClick()" ng-disabled="canFirstPage" title="第一页" aria-label="第一页" ><div class="ng-binding">第一页</div></button>' +
                            '<button type="button" role="menuitem" class="ui-grid-pager-previous" ui-grid-one-bind-title="aria.pageBack" ui-grid-one-bind-aria-label="aria.pageBack" ng-click="pagePreviousPageClick()" ng-disabled="canPreviousPage" title="上一页" aria-label="上一页" ><div class="ng-binding">上一页</div></button> ' +
                            '<span class="ng-binding">第 </span><input type="number" ui-grid-one-bind-title="aria.pageSelected" ui-grid-one-bind-aria-label="aria.pageSelected" class="ui-grid-pager-control-input ng-pristine ng-untouched ng-valid ng-valid-min ng-valid-max ng-valid-required" min="1" max="36" ng-readonly="true" title="当前页" aria-label="当前页" ng-model="pageIndex"><span class="ng-binding"> 页   </span><span class="ng-binding"> - 共 {{pageCount}} 页  </span>' +
                            '<button type="button" role="menuitem" class="ui-grid-pager-next" ui-grid-one-bind-title="aria.pageForward" ui-grid-one-bind-aria-label="aria.pageForward" ng-click="pageNextPageClick()" ng-disabled="canNextPage" title="下一页" aria-label="下一页"><div class="ng-binding">下一页</div></button> ' +
                            '<button type="button" role="menuitem" class="ui-grid-pager-last" ui-grid-one-bind-title="aria.pageToLast" ui-grid-one-bind-aria-label="aria.pageToLast" ng-click="pageLastPageClick()" ng-disabled="canLastPage" title="最后一页" aria-label="最后一页"><div class="ng-binding">最后一页</div></button></div>' +
                            '<div class="ui-grid-pager-row-count-picker ng-scope"></div></div></div>';

                    } else if (item2.type == "tree") {
                        foreachhtml += '<eipcol col-span="' + item2.contentColSpan + '" >';
                        foreachhtml += "<tree-site tree_name='" + guid + "' ";
                        if (typeof (item2.bindModel) != "undefined") {
                            foreachhtml += "  model_name='" + item2.bindModel + "'";
                        }
                        if (typeof (item2.dataSourceUrl) != "undefined" && item2.dataSourceUrl != null && item2.dataSourceUrl != '') {
                            foreachhtml += " datasource_url='" + item2.dataSourceUrl + "'";
                            foreachhtml += " tree-data='requestTreeData' tree-option='treeOptions'";
                        } else if (typeof (item2.hasPermit) == "undefined" || item2.hasPermit == true) {
                                foreachhtml += " tree-data='permitTreeData' tree-type='1' tree-option='treeOptions'";
                        }else {
                                foreachhtml += " tree-data='allTreeData' tree-type='0' tree-option=''";
                        }
                        if (typeof (item2.hasPermit) == "undefined" || item2.hasPermit == true) {
                            foreachhtml += " tree-data='permitTreeData' tree-type='1' tree-option='treeOptions'";
                        }
                        else {
                            foreachhtml += " tree-data='allTreeData' tree-type='0' tree-option=''";
                        }
                        if (typeof (item2.on_Change) != "undefined") {
                            foreachhtml += " on_change='" + item2.on_Change + "'";
                        }
                        if (typeof (item2.disabled) != "undefined") {
                            foreachhtml += " is-disabled='" + item2.disabled + "'";
                        }
                        if (typeof (item2.multiSelect) != "undefined") {
                            foreachhtml += " multi-selection='" + item2.multiSelect + "'";
                        }
                        else {
                            foreachhtml += " multi-selection='false'";
                        }
                        if (!_.isUndefined(item2.required)) {
                            foreachhtml += " required = ''";
                        }
                        foreachhtml += " tree-shortname='item.ORG_SHORTNAME'></tree-site>";
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError\"><span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span></span>";
                        foreachhtml += "</eipcol>";
                    }
                    else if (item2.type == "hidden") {
                        foreachhtml += "<input type='hidden' ";
                        if (!_.isUndefined(item2.bindModel)) {
                            foreachhtml += " ng-model='" + item2.bindModel + "' ";
                        }
                        foreachhtml += " ></input>";
                    } else if (item2.type == "checkbox") {
                        foreachhtml += '<eipcol col-span="' + item2.contentColSpan + '" >';
                        foreachhtml += "<eip-row-checkbox ";
                        if (!_.isUndefined(item2.bindModel)) {
                            foreachhtml += " model_name='" + item2.bindModel + "'";
                        }
                        if (!_.isUndefined(item2.bindDict_code)) {
                            foreachhtml += " dict_code='" + item2.bindDict_code + "'";
                        }
                        if (typeof (item2.dataSourceUrl) != "undefined" && item2.dataSourceUrl != null && item2.dataSourceUrl != '') {
                            foreachhtml += " datasource_url='" + item2.dataSourceUrl + "'";
                        }
                        if (typeof (item2.on_Change) != "undefined") {
                            foreachhtml += " on_change='" + item2.on_Change + "'";
                        }
                        if (typeof (item2.on_Click) != "undefined") {
                            foreachhtml += " on_click='" + item2.on_Click + "'";
                        }
                        if (!_.isUndefined(item2.disabled)) {
                            foreachhtml += " is_disabled='" + item2.disabled + "'";
                        }
                        foreachhtml += "/></eip-row-checkbox></eipcol>";
                    }
                    else if (item2.type == "multiselect") {
                        foreachhtml += '<eipcol col-span="' + item2.contentColSpan + '" >';
                        foreachhtml += "<selectmulti name='" + guid + "'";
                        if (typeof (item2.bindDict_code) != "undefined" && item2.bindDict_code != null && item2.bindDict_code != '') {
                            foreachhtml += " dict_code='" + item2.bindDict_code + "'";
                        }
                        if (typeof (item2.closeOnSelect) != "undefined" && item2.closeOnSelect != null && item2.closeOnSelect != '') {
                            foreachhtml += " close-onselect='" + item2.closeOnSelect + "'";
                        }
                        if (typeof (item2.dataSourceUrl) != "undefined" && item2.dataSourceUrl != null && item2.dataSourceUrl != '') {
                            foreachhtml += " datasource_url='" + item2.dataSourceUrl + "'";
                        }
                        if (typeof (item2.dataSource) != "undefined" && item2.dataSource != null && item2.dataSource != '') {
                            foreachhtml += " datasource='" + item2.dataSource + "'";
                        }
                        if (typeof (item2.multiple) != "undefined" && item2.multiple != null && item2.multiple != '') {
                            foreachhtml += " multiple='" + item2.multiple + "'";
                        }
                        if (typeof (item2.disabled) != "undefined" && item2.disabled != null && item2.disabled != '') {
                            foreachhtml += " ng-disabled='" + item2.disabled + "'";
                        }
                        if (typeof (item2.required) != "undefined") {
                            foreachhtml += " isrequired='" + item2.required + "'";
                        }
                        foreachhtml += " ng-model='" + item2.bindModel + "' />"
                        foreachhtml += " <span style=\"color:red\" ng-show=\"showError\">\
                            <span ng-show=\"ItemForm." + guid + ".$error.required\">" + item2.name + "不能为空</span>\
                            </span>";
                        foreachhtml += "</eipcol>";
                    }
                });
                foreachhtml += "</div>";
            });
            IrregularAndRegularModuleHtml += '<tab index=' + formNum + ' ng-hide="' + IrregularAndRegularModule.isHide + '"><tab-heading class="sub_tab" title="' + IrregularAndRegularModule.moduleTitle + '">' + IrregularAndRegularModule.moduleTitle + '</tab-heading>'
            //IrregularAndRegularModuleHtml += '<div ng-hide="' + IrregularAndRegularModule.isHide + '"><pagetitle>' + IrregularAndRegularModule.moduleTitle + '</pagetitle>';
            IrregularAndRegularModuleHtml += "<div ng-show='codeCollapse_" + formNum + ".isCollapse' style=\"padding-top:30px\">" + foreachhtml;
            IrregularAndRegularModuleHtml += attachmentTableHtml + "</div>"
            IrregularAndRegularModuleHtml += "<code-collapse codeinfo='codeCollapse_" + formNum + "'></code-collapse></tab>"

            return {
                IrregularAndRegularModuleHtml: IrregularAndRegularModuleHtml,
                dict_codes: dict_codes
            }
        },
        getAttachmentTable: function (IrregularAndRegularModule, scope) {
            var IrregularAndRegularModuleHtml = '';
            var dict_codes = [];
            var editBtnHtml = '';
            //var btnBackState = "MainFrame." + State + ".Select";

            IrregularAndRegularModule.IrregularAndRegularModuleContent = _.orderBy(IrregularAndRegularModule.IrregularAndRegularModuleContent, function (n) {
                return n.row;
            });

            var groupByArray = _.toArray(
                _.groupBy(IrregularAndRegularModule.IrregularAndRegularModuleContent, function (groupByItem) {
                    return groupByItem.row;
                })
            );
            var foreachhtml = "";
            _.forEach(groupByArray, function (gba, gbaIndex) {
                if (gba[0].type == "attachment") {
                    foreachhtml += "<div class='form-group' >";
                }
                else {
                    var rowIndex = scope.rowIndex;//取行索引
                    foreachhtml += "<div ng-init='showRow_" + rowIndex + "=true'></div>";//默认设置行显示
                    foreachhtml += "<div class='form-group' ng-if='showRow_" + rowIndex + "' >";
                    scope.rowIndex = rowIndex + 1;
                }
                _.forEach(gba, function (item2, item2Index) {
                    if (item2.type != "attachment" && item2.type != "icon" && item2.type != "grid" && item2.type != "hidden") {
                        foreachhtml += '<eipcol col-span="' + item2.textColSpan + '" control-label="control-label"><label>' + item2.name + '</label></eipcol>';
                    }
                    var guid = eipBrowsePageHelper.getGuid(4, 16);
                    foreachhtml += '<eipattachment parentid="_PK" model-name="' + item2.bindModel +
                        '" datamodulename="' + IrregularAndRegularModule.dataModuleName +
                        '" tablename="' + item2.parentTableName + '" attachmenttablename="' +
                        item2.attachmentTableName + '" ctrlname="' + scope.init.initEditName +
                        '" uploadactionname="' + item2.uploadActionName +
                        '" downloadactionname="' + item2.downloadActionName +
                        '" permissionactionname="' + item2.permissionActionName +
                        '" deleteactionname="' + item2.deleteActionName +
                        '" modal-windowid="' + item2.modalWindowid + '" menu-id="' + IrregularAndRegularModule.MenuId +
                        '" is-show-upload="' + item2.isShowUpload +
                        '" is-show-edit="' + item2.isShowEdit +
                        '" is-show-delete="' + item2.isShowDelete + '"></eipattachment>';//+
                });
                foreachhtml += "</div>";
            });

            IrregularAndRegularModuleHtml += '<div class="attachment_table" ng-hide="' + IrregularAndRegularModule.isHide + '">';

            IrregularAndRegularModuleHtml += foreachhtml + "</div>";

            return {
                IrregularAndRegularModuleHtml: IrregularAndRegularModuleHtml,
                dict_codes: dict_codes
            }
        },

    }
}]);
//初始数据格式化
eipApp.constant('eipformPageInit', {
    defaultInit: {
        initUrl: {
            editInitUrl: "GetBaseItemByID",
            editNewSaveUrl: "AddBaseItem",
            editEditSaveUrl: "EditBaseItem",
            editEditSaveUrlForSubmit: "WfBegin",
        },
        initSubmitParam: {
            editInitSubmitParam: [{}],
            editSaveSubmitParams: "item",
        },
        initReturnBindScope: {
            editInitBindScope: [{ "bindScope": 'item', "returnData": 0 }],
            editSaveBindScope: [{ 'bindScope': 'IsSuccess', 'returnData': 'IsSuccess' }, { 'bindScope': 'strMessage', 'returnData': 'strMessage' }],
        },
        inUrlSumbit: {
            editInitSubmit: [{
                urlName: "editInitUrl",
                submitParamName: "editInitSubmitParam",
                ReturnBindScopeName: "editInitBindScope"
            }],
            editNewSaveSumbit: [{
                urlName: "editNewSaveUrl",
                submitParamName: "editSaveSubmitParams",
                ReturnBindScopeName: "editSaveBindScope",
            }],
            editEditSaveSumbit: [{
                urlName: "editEditSaveUrl",
                urlNameForSubmit: "editEditSaveUrlForSubmit",
                submitParamName: "editSaveSubmitParams",
                ReturnBindScopeName: "editSaveBindScope"
            }]
        }
    }
});
//form初始化数据服务
eipApp.factory('eipformService', ['eipformPageInit', '$stateParams', '$rootScope', function (eipformPageInit, $stateParams, $rootScope) {

    var _setDisabled = function (dataModule,setItemDisable) {
        //编辑或新增
        _.forEach(dataModule, function (item) {
            if (typeof (item.bindModel) != "undefined") {
                var bingModel = item.bindModel.replace("item.", "");
                if (typeof (setItemDisable[bingModel]) != "undefined") {
                    item.disabled = setItemDisable[bingModel];
                }
            }
        })
    };
    var settingItemDisable = function (dataModule) {
        var setItemDisable = []
        if (this.ItemPageStatus == "edit") {
            var obj = _.find(this.init.initParam.editInitParam, function (ob) {
                return ob.key == "setItemDisable";
            });
            if (obj != null && obj != "undefined") {
                setItemDisable = obj.value;//获取编辑页需要禁用的控件
            }
        }else if (this.ItemPageStatus == "new") {
            if (typeof (this.init.initParam.addInitParam.setItemDisable) != "undefined") {
                setItemDisable = this.init.initParam.addInitParam.setItemDisable;
            }
            if (typeof (this.init.initParam.addInitParam.setBlockHide) != "undefined")//设置区块隐藏
            {
                for (var key in this.init.initParam.addInitParam.setBlockHide) {
                    this[key] = this.init.initParam.addInitParam.setBlockHide[key];//赋值;
                }
            }
        };
        _setDisabled(dataModule, setItemDisable)
    };

    var _setPageState = function (str) {
        if (!_.isUndefined(this.pageModule[str]) && !_.isError(this.pageModule[str]) && !_.isNull(this.pageModule[str])) {
            this[str] = this.pageModule[str]
        }
    };
    var settingForm = function (formObj) {
        _setPageState.call(formObj, "isHide")
        _setPageState.call(formObj, "ngIf")
        _setPageState.call(formObj, "isExpand")
        _setPageState.call(formObj, "isRowEdit")
        return formObj
    };
    var _setEditInitSubmitParam = function () {
            this.initSubmitParam.editInitSubmitParam = [{
                "isUseEdit": true,
                "key": this.initPrimaryKey,
                "value": this.initPrimaryKey,
                "isScope": true
            }]
        };
    var setFormDataInit = function (initObj) {
        var defaultInit = eipformPageInit.defaultInit
        var formInit = angular.copy(initObj)
        angular.extend(formInit, defaultInit)
        _setEditInitSubmitParam.call(formInit)
        return formInit
    };
    
    var getPageStatus = function (key) {
        var UrlParamJson = {}, PrimaryKey = "-1",
            ItemPageStatus = "new"
        if ($stateParams.transParam && $stateParams.transParam.indexOf("new") == -1) {
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
    };

    var form = {
        settingItemDisable: settingItemDisable,
        settingForm: settingForm,
        setFormDataInit: setFormDataInit,
        getPageStatus: getPageStatus
    }
    return form
    
}])

//加入自定义按钮服务
eipApp.provider('eipCustomBtn', function () {
    var editDefault = {
        title: "默认",
        class: "btn-default",
        isShow: "true",
        event: ""
    }
    var listDefault = {
        title: "默认",
        icon: "btn btn-default",
        isShow: "true",
        event: ""
    }
    var privateMethods = {
        isArray: function (o) {
            return Object.prototype.toString.call(o) == '[object Array]';
        },
        packageHtml: function (o) {
            var html = '<input style="margin: 5px" type="button" value="' + o.title + '" class="btn ' + o.class + '" ' +
                'ng-click="' + o.event + '" ng-show="' + o.isShow + '" />'
            return html
        }
    }
    this.$get = ['$document', '$rootScope', '$timeout', '$window', '$controller', '$injector',
        function ($document, $rootScope, $timeout, $window, $controller, $injector) {

            var publicMethods = {
                getEditBtnHtml: function (btnObj) {
                    var editHtml = "";
                    var defaultOptions = angular.copy(editDefault);
                    angular.extend(defaultOptions, btnObj);
                    editHtml = privateMethods.packageHtml(defaultOptions)
                    return editHtml
                },
                getSaveCopyHtml: function (defaultOptions) {
                    var saveCopyHtml = "";
                    saveCopyHtml = privateMethods.packageHtml(defaultOptions)
                    return saveCopyHtml
                },
                getListBtnHtml: function () {
                    var listHtml = "";
                }

            }
            return publicMethods;
        }]
})

eipApp.factory('eipPageTree', ['eipDefaultDialog', 'eipBrowsePageHelper', 'eipHttpService', 'eipEditPageModeHelper', '$compile', function (eipDefaultDialog, eipBrowsePageHelper, eipHttpService, eipEditPageModeHelper, $compile) {

    var num = 10;
    var _dg = function (treeData, node) {
        angular.forEach(treeData, function (obj, n) {
            obj.class = "clear-class"
            if (obj.children != null && typeof (obj.children) != "undefined" && obj.children.length >= 0) {
                _dg(obj.children)
            }
        })
    }
    var searchDg = function (treeData, content, defaultTree) {
        angular.forEach(treeData, function (obj, n) {
            if (content && typeof (obj[defaultTree.context]) != "undefined" && obj[defaultTree.context] != null && obj[[defaultTree.context]].indexOf(content) >= 0) {
                obj.class = "tree-select"
            } else {
                obj.class = "nodeClass"
            }
            if (obj.children.length > 0) {
                searchDg(obj.children, content, defaultTree)
            }
        })
    };
    return {
        searchTree: function (treeData, content, defaultTree) {
            searchDg(treeData, content, defaultTree)
        },
        clearClass: function (treeData, node) {
            _dg(treeData, node)
            node.class = "tree-select"
        },
        getInitTree: function (dataInit, detaDefault) {
            if (angular.isObject(dataInit)) {
                for (var i in dataInit) {
                    detaDefault[i] = dataInit[i]
                }
            }
            return detaDefault
        },
        getCallbackNode: function (nodeInfo, defaultTree, node) {
            var n = num, content = nodeInfo.content
            if (angular.isObject(node)) {
                n = node[defaultTree.id]
                content = node[defaultTree.context]
            }
            return {
                n: num,
                content: content
            }
        },
        getExpendNode: function (id, callback) {
            var httpObject = {
                url: "Org/GetChildrenOrgByParentID",
                params: { ORG_ID: id, hasPerm: 1 }
            };
            eipHttpService.post(httpObject)
                .success(function (data, status, headers, config) {
                    if (!_.isUndefined(data) && data) {
                        callback(data)
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("http error:" + status);
                })
        },
        getTreeNode: function (n, text, arr, type, defaultTree) {
            var obj = {}
            obj[defaultTree.id] = n
            obj[defaultTree.context] = text
            obj[defaultTree.children] = arr
            obj[defaultTree.type] = type
            return obj
        },
        addPartent: function (nodeInfo, defaultTree, node) {
            if (typeof (nodeInfo.parentNode) == "undefined") {
                return false
            }
            var node = this.getCallbackNode(nodeInfo, defaultTree, node)
            var obj = this.getTreeNode(node.n, node.content, [], "addPartent", defaultTree)
            nodeInfo.parentNode.push(obj)
            num++
        },
        addChildren: function (nodeInfo, defaultTree, node) {
            var node = this.getCallbackNode(nodeInfo, defaultTree, node)
            var obj = this.getTreeNode(node.n, node.content, [], "addChildren", defaultTree)
            nodeInfo.node.children.push(obj)
            num++
        },
        addSameLevelUp: function (nodeInfo, defaultTree, node) {
            var node = this.getCallbackNode(nodeInfo, defaultTree, node)
            var obj = this.getTreeNode(node.n, node.content, [], "addSameLevelUp", defaultTree)
            nodeInfo.nowNode.splice(nodeInfo.nowNodeIndex, 0, obj)
            num++
        },
        addSameLevelDown: function (nodeInfo, defaultTree, node) {
            var node = this.getCallbackNode(nodeInfo, defaultTree, node)
            var obj = this.getTreeNode(node.n, node.content, [], "addSameLevelDown", defaultTree)
            nodeInfo.nowNode.splice(nodeInfo.nowNodeIndex + 1, 0, obj)
            num++
        },
        editNode: function (nodeInfo, defaultTree) {
            nodeInfo.node[defaultTree.context] = nodeInfo.content
            nodeInfo.node[defaultTree.type] = "editNode"
        },
        deleteNode: function (nodeInfo, defaultTree) {
            nodeInfo.nowNode.splice(nodeInfo.nowNodeIndex, 1)
        }

    }
}])

// add by csq 20170913 对数据进行行内编辑聚焦处理
eipApp.factory('eipGridEdit', ['eipDict', 'eipDefaultDialog', 'eipHttpService', function (eipDict, eipDefaultDialog, eipHttpService) {
    var addActiveList = function (gridData) {
        gridData = gridData || []
        if (gridData.length < 1) return false;
        var template = '<div class="ui-grid-cell-contents ui-grid-cell-contents-text">\
        <ul class="grid_fomat_active"><li ng-show="row.entity.editInfo.edit" class="glyphicon glyphicon-pencil blue" ng-click="grid.appScope.gridActive(row.entity,row,col,\'edit\')"></li>\
        <li ng-show="row.entity.editInfo.remove" class="glyphicon glyphicon-trash danger" ng-click="grid.appScope.gridActive(row.entity,row,col,\'remove\')"></li>\
        <li ng-show="row.entity.editInfo.submit" class="glyphicon glyphicon-ok success" ng-click="grid.appScope.gridActive(row.entity,row,col,\'submit\')"></li>\
        <li ng-show="row.entity.editInfo.cancel" class="glyphicon glyphicon-remove danger" ng-click="grid.appScope.gridActive(row.entity,row,col,\'cancel\')"></li></ul></div>';
        var obj = {
            name: '操作',
            field: 'Active',
            width: "80",
            enableCellEdit: false,
            cellTemplate: template
        };
        gridData.push(obj)
    };
    //将ui-grid中tree的虚拟id进行赋值存储
    var treeIdCopy = function (item) {
        for (var i in item) {
            if (i.indexOf("_TREEID") > -1) {
                item[i.split("_TREEID")[0]] = item[i]
            }
        }
    };
    var _guid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    var setEditOptions = function (o) {
        o.editInfo = {
            edit: true,
            remove: true,
            submit: false,
            cancel: false,
            editClass: ""
        }
    };

    var columnDefsFomat = function (gridData) {
        gridData = gridData || [];
        //为每一列增加对应的数据类型配置
        gridData.forEach(function (o, n) {
            o.enableCellEdit = true
            o.isEditSubmit = "glyphicon glyphicon-pencil";
            if (typeof (o.isCellEdit) != "undefined" && !o.isCellEdit) {
                o.enableCellEdit = false //关闭编辑功能
            }
            switch (o.cell_edit_type) {
                case "dict":
                    o.editableCellTemplate = 'ui-grid/dropdownEditor'
                    o.displayName = o.name
                    o.name = "DITEM_NAME"
                    o.editDropdownValueLabel = "DITEM_NAME"
                    o.editDropdownIdLabel = "DITEM_CODE"
                    o.editDropdownOptionsArray = eipDict.getListByDictCode(o.dict)
                    break;
                case "date":
                    o.editableCellTemplate = 'ui-grid/dateEditor'
                    break;
                case "tree":
                    o.editableCellTemplate = 'ui-grid/treeEditor'
                    break;
                default:
                    break;
            }
        })
        //加入行编辑操作列
        addActiveList(gridData)
        return gridData
    };
    var setEditNow=function (o) {
        var old = angular.copy(o)
        o.editInfo = {
            edit: false,
            remove: false,
            submit: true,
            cancel: true,
            editClass: "editborder"
        };
        o.old = old
    };
    
    var removeData = function (gridData, requestData, obj) {
        //遍历查找主键ID
        var id = "";
        gridData.forEach(function (o, n) {
            if (o.isDelKey) {
                id = o.field
            }
        });
        requestData.forEach(function (item, n) {
            if (item[id] == obj[id]) {
                //行隐藏 假删除
                // item.editInfo.editClass = "edithide"
                requestData.splice(n, 1)
                // eipDefaultDialog.show("删除成功!");
            }
        })
        return requestData
    };
    //新增、开启编辑状态
    var startEdit = function () {
        setEditNow(this.item)
        this.item.isEdit = true
        //子表数据模型对象中加入新增行
        this.rowData.unshift(this.item)
        // this.waitSubmit.push($scope.item.rowData)
    };
    //获取主键id
    var getKeyId = function (arr){
        var keyId = "";
        arr.forEach(function (o) {
            if (o.isDelKey) {
                 keyId = o.field
            }
        })
        return keyId
    }
    //判断需提交得数组中是否存在当前修改的值
    var isGridData = function (item,keyId,obj) {
        var type=0;
        obj.waitSubmit = obj.waitSubmit || [];
        obj.waitSubmit.forEach(function (o, n) {
            if (o[keyId].indexOf(item[keyId])>-1) {
                type=1
            }
        })
        return type
    };
    //取消编辑
    var editCancel = function (item, keyId,obj) {
        //新建取消 、在编辑取消
        //如果gridData包含当前id则为编辑取消 ，否则为新建取消，这时则需要删除新建的数据
        var editType=0
        obj.waitSubmit.forEach(function (o, n) {
            if (o[keyId].indexOf(item[keyId]) > -1 && o[keyId].indexOf(":0")== -1) {
                editType=1
            } 
        });
        if (editType) {
            //编辑取消
            for (var i in item) {
                if (i != "old") {
                    item[i] = item.old[i]
                }
            }
            item.isEdit = false
        } else {
            //删除新建
            obj.rowData.forEach(function (o,n) {
                if (o[keyId] == item[keyId]) {
                     obj.rowData.splice(n,1)
                }
            })
        }
    };
    //更新除id以外其余字段
    var updateGridRow = function (item, keyId, obj) {
        obj.waitSubmit.forEach(function (o, n) {
            if (o[keyId].indexOf(item[keyId]) > -1) {
                for (var i in item) {
                    if (i != "keyId" && i != "editInfo" && i != "old") {
                        o[i] = item[i]
                    }
                }
               //deleteProperty(o)
            }
        })
    };
    var deleteProperty = function (o) {
        if (o.editInfo) {
            delete o.editInfo;
            delete o.old;
        }
    };
    //将修改过的信息加入提交列表
    var pushGridRow = function (item, keyId,obj) {
        if (item[keyId].indexOf(":0") == -1 && item[keyId].indexOf(":1") == -1) {
            item[keyId] = item[keyId] + ":1";
        }
        var gridItem = angular.copy(item);
        deleteProperty(gridItem)
       // obj.gridData.push(gridItem);
        obj.waitSubmit.push(gridItem)
    };
    //提交：结束编辑状态
    var endEditState = function (item,keyId,obj) {
        setEditOptions(item)
        item.isEdit = false
        //提交数据模型中加入行信息
        var isPush = isGridData.apply(null, arguments);
        if (isPush) {
            //更新状态
            updateGridRow(item,keyId,obj)
        } else {
            //加入提交数组
            pushGridRow( item, keyId,obj)
        }
    };


    //判断是否行编辑,如果是则对其进行初始设置
    var setRowEditState = function (obj) {
        var self = this;
        if (obj.isRowEdit && obj.isRowEdit != "false") {
            obj.rowData.forEach(function (o) {
                setEditOptions(o)
                o.isEdit = false
            });
            // add by csq 20170913 参数格式化
            obj.cellData = columnDefsFomat(obj.cellData)
            //行操作事件
            self.gridActive = function () {
                Array.prototype.push.call(arguments, obj)
                return _eventClick.apply(self, arguments)
            };
        };
        
    }
    //行操作事件
    var _eventClick = function (item, row, col, str, obj) {
        var self = this;
        var keyId = getKeyId(obj.cellData);
        switch (str) {
            case "edit":
                //标记可编辑的行,用于只给此行编辑的权限
                //console.log(item.ROW_NUM)
                setEditNow(item)
                item.isEdit = true
                break;
            case "remove":
                deleteProperty(item)
                obj.deleteData(item)
                break;
            case "submit":
                endEditState(item,keyId,obj)
                break;
            case "cancel":
                editCancel(item,keyId,obj)
                break;
        }
    };
    return {
        columnDefsFomat: columnDefsFomat,
        setEditOptions: setEditOptions,
        setEditNow: setEditNow,
        editCancel: editCancel,
        editSubmit: function (o, httpObj) {
            if (!httpObj) return false;
            var httpObject=angular.copy(httpObj)
            //将ui-grid中tree的虚拟id进行赋值存储
            treeIdCopy(httpObject.params.dataJsonStr)
            var self = this
            eipHttpService.post(httpObject)
                .success(function (data, status, headers, config) {
                    if (data.IsSuccess) {
                        o.isEdit = false
                        self.setEditOptions(o)
                        eipDefaultDialog.show("修改成功!");
                        //eipDefaultDialog.open("修改成功!");
                    }
                    else {
                        eipDefaultDialog.showError("修改失败!");
                    }
                })
                .error(function (data, status, headers, config) {
                    eipDefaultDialog.open("http error:" + status);
                })
        },
        //行删除操作；剔除requestData中的行对象o
        removeData: removeData,
        startEdit: startEdit,
        setRowEditState: setRowEditState
    }
}])

eipApp.factory('eipOpenModal', ["$modal", function ($modal) {
   
    var _getModalHtml = function (eipGridModule) {
        var modalHtml = "";
        if (typeof (eipGridModule.width) != "undefined") {
            modalHtml += '<div class="modal-content" style="width:' + eipGridModule.width + 'px">';
        }
        else {
            modalHtml += '<div class="modal-content">';
        }
        modalHtml += '<div class="modal-header"  style="border-bottom: 0px">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="close()"><span aria-hidden="true">×</span></button>' +
            '<h4 class="modal-title" id="myModalLabel"><span></span></h4>' +
            '</div>' +
            '<div class="modal-body" >' +
            '<form id="sub" name="sub">' +
            '<eip-open-modal-grid hidden-type="hiddenType.display" hierarchy="ture" customfunction="customfunction" save-click="subsave()" close-click="close()" eip-gm="eipGm" item="item" ></eip-open-modal-grid>' +
            '</form></div></div></div>';
        return modalHtml
    };
    var _setDisplay = function (obj) {
        return obj.hiddenType.display = "block";
    };
    var _ModalInstanceCtrl1 = function ($scope, $modalInstance, eipGm, item, scope, modalType) {
        $scope.eipGm = eipGm;
        $scope[modalType] = item;
        $scope.subsave = function () {
            $modalInstance.close($scope);
        }
        $scope.close = function () {
            _setDisplay(scope)
            $modalInstance.dismiss('cancel');
        };
    };
    var openModal = function (str,scope, dataModuleName,callback) {
        scope.browseParam = {};
        if (typeof (dataModuleName) == "object") {
            scope.browseParam.eipGridModule = dataModuleName
        } else {
            var dataModule = scope["dataModule"] || scope.$parent["dataModule"];
            scope.browseParam.eipGridModule = _.find(dataModule, function (dm) {
                return dm.key == dataModuleName;//查询出区块名称并获取下面的配置信息
            }).module;
        }
       
        // $scope.init.initParam.browseInitParam.key = "whereParam";
        scope.browseParam.initParam = ""//$scope.init.initParam.browseInitParam;
        scope.browseParam.initUrl = scope.browseParam.eipGridModule.initUrl;
        scope.browseParam.initState = "" //$scope.init.initEditName;
        scope.browseParam.initDelUrl = scope.browseParam.eipGridModule.initDelUrl;
        var modalID = scope.browseParam.eipGridModule.modalID;//弹出modal窗口的ID
        scope[modalID] = scope.browseParam.eipGridModule;//将GridModule赋给scope，唯一的变量，防止下一个覆盖变量
        //add by csq放大镜多个参数的赋值
        var setMultipleValue = scope.browseParam.eipGridModule.setMultipleValue;

        //显示隐藏一级弹窗 hiddenType
        scope.hiddenType = {
            "display": "none"
        }
        var modalHtml = _getModalHtml(scope.browseParam.eipGridModule)
       
        var modalInstance = $modal.open({
            template: modalHtml,
            controller: _ModalInstanceCtrl1,
            resolve: {
                eipGm: function () {
                    return scope[modalID];
                },
                item: function () {
                    return scope[str]
                },
                scope: function () {
                    return scope
                },
                modalType: function () {
                    return str
                }
            }
        });
        modalInstance.result.then(function (result) {
            //设置多个参数的值
            for (var i in setMultipleValue) {
                scope[str][setMultipleValue[i]] = result.multipleValue[setMultipleValue[i]];
            };
            if (typeof (callback) !== "undefined") {
                callback(result);
            }
            _setDisplay(scope)
        }, function (reason) {
            _setDisplay(scope)
            //console.log(reason); // 点击空白区域，总会输出backdrop  
        })
    };
    return {
        openModal: openModal
    }
}])
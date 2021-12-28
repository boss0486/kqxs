//const DateTimeLib = require("../../helper/helper.datetime.library");

//import { DateTimeLib } from "../../helper/helper.datetime.library";

var pageIndex = 1;
var _urlAction = "/matched";
var URLA = "/backend/matched";

var matchedController = {
    init: function() {
        matchedController.registerEvent();
    },
    registerEvent: function() {
        $('#btnCreate').off('click').on('click', function() {
            var flg = true;

            if (flg) {
                matchedController.create();
            } else {
                Notifization.Error(MessageText.Datamissing);
            }
        });
        $('#btnSearch').off('click').on('click', function() {
            matchedController.dataList(1);
        });
        $('#btnUpdate').off('click').on('click', function() {
            var flg = true;
            // submit
            if (flg) {
                matchedController.update();
            } else {
                Notifization.Error(MessageText.Datamissing);
            }
        });
    },
    dataList: function(page) {
        //
        var ddlTimeExpress = $('#ddlTimeExpress').val();
        var txtStartDate = $('#txtStartDate').val();
        var txtEndDate = $('#txtEndDate').val();
        var model = {
            query: $('#txtQuery').val(),
            page: page,
            timeExpress: parseInt(ddlTimeExpress),
            startDate: txtStartDate,
            endDate: txtEndDate,
            timeZoneLocal: LibDateTime.GetTimeZoneByLocal(),
            status: parseInt($('#ddlStatus').val())
        };
        // 

        AjaxFrom.POST({
            url: `${_urlAction}/all`,
            data: model,
            success: function(result) {
                $('tbody#tblData').html('');
                $('#pagination').html('');
                if (result.status == 200) {
                    var currentPage = 1;
                    var pagination = result.paging;
                    if (pagination !== null) {
                        totalPage = pagination.totalPage;
                        currentPage = pagination.currentPage;
                        pageSize = pagination.pageSize;
                        pageIndex = pagination.currentPage;
                    }
                    var rowData = '';
                    $.each(result.data, function(index, item) {
                        index = index + 1;
                        var id = item.id;
                        if (id.length > 0)
                            id = id.trim();
                        //  role 
                        var action = HelperModel.RolePermission(result.role, "matchedController", { id: id, backLink: URLA });
                        //
                        var rowNum = parseInt(index) + (parseInt(currentPage) - 1) * parseInt(pageSize);
                        rowData += `<tr>
                            <td class="text-right">${rowNum}&nbsp;</td>
                            <td class='text-center'>${LibDateTime.GetDate(item.executionDate)}</td>                                                                           
                            <td>${item.bosoName}</td>                                  
                            <td>${item.areaName}</td>                                       
                            <td>${item.bosoVal}</td>                                       
                            <td>${item.kqxsVal}</td>                                                                           
                            <td><i class="fa fa-hand-o-right" aria-hidden="true"></i> ${item.textRs}</td>                                                                           
                            <td class="text-center">${HelperModel.StateIcon(item.isMatched)}</td> 
                            <td class="tbcol-action">${action}</td>
                       </tr>`;
                    });
                    $('tbody#tblData').html(rowData);
                    if (parseInt(totalPage) > 1) {
                        Paging.Pagination("#pagination", totalPage, currentPage, matchedController.dataList);
                    }
                    return;
                }
            }
        });
    },
    create: function() {
        var ddlArea = $('#ddlArea').val();
        var ddlCategory = $('#ddlCategory').val();
        var txtValue = $('#txtValue').val();
        var txtKqxs = $('#txtKqxs').val();
        var txtNote = $('#txtNote').val();
        var txtExecutionDate = $('#txtExecutionDate').val();
        var isMatched = false;
        if ($('input[name="cbxActive"]').is(":checked"))
            isMatched = true;
        //
        var model = {
            areaId: parseInt(ddlArea),
            categoryId: ddlCategory,
            value: txtValue,
            kqxsVal: txtKqxs,
            textRs: txtNote,
            executionDate: txtExecutionDate,
            isMatched: isMatched
        };
        AjaxFrom.POST({
            url: `${_urlAction}/create`,
            data: model,
            success: function(response) {
                if (response.status == 200) {
                    Notifization.Success(response.message);
                    FData.ResetForm();
                    return;
                }
            }
        });
    },
    update: function() {
        var id = $('#txtId').val();
        var ddlArea = $('#ddlArea').val();
        var ddlCategory = $('#ddlCategory').val();
        var txtValue = $('#txtValue').val();
        var txtKqxs = $('#txtKqxs').val();
        var txtNote = $('#txtNote').val();
        var txtExecutionDate = $('#txtExecutionDate').val();
        var isMatched = false;
        if ($('input[name="cbxActive"]').is(":checked"))
            isMatched = true;
        //
        var model = {
            id: id,
            areaId: parseInt(ddlArea),
            categoryId: ddlCategory,
            value: txtValue,
            kqxsVal: txtKqxs,
            textRs: txtNote,
            executionDate: txtExecutionDate,
            isMatched: isMatched
        };
        AjaxFrom.POST({
            url: `${_urlAction}/update`,
            data: model,
            success: function(response) {
                if (response.status == 200) {
                    Notifization.Success(response.message);
                    return;
                }
            }
        });
    },
    delete: function(id) {
        var model = {
            id: id
        };
        AjaxFrom.POST({
            url: `${_urlAction}/delete`,
            data: model,
            success: function(response) {
                if (response.status != undefined && response.status == 200) {
                    Notifization.Success(response.message);
                    matchedController.dataList(pageIndex);
                    return;
                }
            }
        });
    },
    confirmDelete: function(id) {
        Confirm.Delete(id, matchedController.delete, null, null);
    }
};

matchedController.init();
//
$(document).on('keyup', '#txtTitle', function() {
    var txtTitle = $(this).val();
    if (txtTitle == '') {
        $('#lblTitle').html('Không được để trống tiêu đề');
    } else if (txtTitle.length < 1 || txtTitle.length > 80) {
        $('#lblTitle').html('Tiêu đề giới hạn từ 1-> 80 ký tự');
    } else if (!FormatKeyword.test(txtTitle)) {
        $('#lblTitle').html('Tiêu đề không hợp lệ');
    } else {
        $('#lblTitle').html('');
    }
});
$(document).on('keyup', '#txtSummary', function() {
    var txtSummary = $(this).val();
    if (txtSummary !== '') {
        if (txtSummary.length > 120) {
            $('#lblSummary').html('Mô tả giới hạn từ 1-> 120 ký tự');
            flg = false;
        } else if (!FormatKeyword.test(txtSummary)) {
            $('#lblSummary').html('Mô tả không hợp lệ');
            flg = false;
        } else {
            $('#lblSummary').html('');
        }
    } else {
        $('#lblSummary').html('');
    }
});
$(document).on('click', '[data-btnedit="true"]', function() {
    var id = $(this).data("id");
    $(this).addClass("actived");
    // var model = {
    //     id: id
    // };
    AjaxFrom.GET({
        url: `${_urlAction}/${id}`,
        data: {},
        success: function(response) {
            if (response.status == 200) {
                var data = response.data;
                $('#txtTitle').val(data.name);
                $('#txtSummary').val(data.summary);
                $('#txtSevice').val(data.serviceId);
                if (data.enabled) {
                    $('input[name="cbxActive"]').prop('checked', true);
                } else {
                    $('input[name="cbxActive"]').prop('checked', false);
                }
                return;
            }
        }
    });
});
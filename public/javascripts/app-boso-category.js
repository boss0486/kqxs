var pageIndex = 1;
var _urlAction = "/boso-cate";
var URLA = "/backend/boso-category";

var bosoCateController = {
    init: function() {
        bosoCateController.registerEvent();
    },
    registerEvent: function() {
        $('#btnCreate').off('click').on('click', function() {
            var flg = true;
            var txtTitle = $('#txtTitle').val();
            var txtSummary = $('#txtSummary').val();

            if (txtTitle == '') {
                $('#lblTitle').html('Không được để trống tiêu đề');
                flg = false;
            } else if (txtTitle.length < 1 || txtTitle.length > 80) {
                $('#lblTitle').html('Tiêu đề giới hạn từ 1-> 80 ký tự');
                flg = false;
            } else if (!FormatKeyword.test(txtTitle)) {
                $('#lblTitle').html('Tiêu đề không hợp lệ');
                flg = false;
            } else {
                $('#lblTitle').html('');
            }

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
            // submit

            if (flg) {
                bosoCateController.create();
            } else {
                Notifization.Error(MessageText.Datamissing);
            }
        });
        $('#btnSearch').off('click').on('click', function() {
            bosoCateController.dataList(1);
        });
        $('#btnUpdate').off('click').on('click', function() {
            var flg = true;
            var txtTitle = $('#txtTitle').val();
            var txtSummary = $('#txtSummary').val();

            if (txtTitle == '') {
                $('#lblTitle').html('Không được để trống tiêu đề');
                flg = false;
            } else if (txtTitle.length < 1 || txtTitle.length > 80) {
                $('#lblTitle').html('Tiêu đề giới hạn từ 1-> 80 ký tự');
                flg = false;
            } else if (!FormatKeyword.test(txtTitle)) {
                $('#lblTitle').html('Tiêu đề không hợp lệ');
                flg = false;
            } else {
                $('#lblTitle').html('');
            }

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
            // submit
            if (flg) {
                bosoCateController.update();
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
            // startDate: txtStartDate,
            // endDate: txtEndDate,
            timeZoneLocal: LibDateTime.GetTimeZoneByLocal(),
            //status: parseInt($('#ddlStatus').val())
        };
        // 

        AjaxFrom.POST({
            url: `${_urlAction}/all`,
            data: model,
            success: function(result) {
                $('tbody#tblData').html('');
                $('#pagination').html('');
                if (result !== null) {
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
                            var action = HelperModel.RolePermission(result.role, "bosoCateController", { id: id, backLink: URLA });
                            //
                            var rowNum = parseInt(index) + (parseInt(currentPage) - 1) * parseInt(pageSize);
                            rowData += `<tr>
                                 <td class="text-right">${rowNum}&nbsp;</td>
                                 <td>${item.name}</td>                                  
                                 <td>${item.serviceId}</td>                                       
                                 <td class="text-right">${LibCurrencies.FormatToCurrency(item.price)} đ</td>                                       
                                 <td>${item.summary}</td>                                       
                                 <td class="text-center">${HelperModel.StateIcon(item.enabled)}</td> 
                                 <td class="tbcol-action">${action}</td>
                            </tr>`;
                        });
                        $('tbody#tblData').html(rowData);
                        if (parseInt(totalPage) > 1) {
                            Paging.Pagination("#pagination", totalPage, currentPage, bosoCateController.dataList);
                        }
                        return;
                    } else {
                        //Notifization.Error(result.message);
                        console.log('::' + result.message);
                        return;
                    }
                }
                Notifization.Error(MessageText.NotService);
                return;
            },
            error: function(result) {
                console.log('::' + MessageText.NotService);
            }
        });
    },
    create: function() {
        var title = $('#txtTitle').val();
        var summary = $('#txtSummary').val();
        var serviceId = $('#txtSevice').val();
        var price = LibCurrencies.ConvertToCurrency($('#txtPrice').val());
        var enabled = false;
        if ($('input[name="cbxActive"]').is(":checked"))
            enabled = true;
        //
        var model = {
            serviceId: serviceId,
            price: price,
            name: title,
            summary: summary,
            enabled: enabled
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
            },
            error: function(response) {
                console.log('::' + MessageText.NotService);
            }
        });

    },
    update: function() {

        var id = $('#txtId').val();
        var title = $('#txtTitle').val();
        var summary = $('#txtSummary').val();
        var serviceId = $('#txtSevice').val();
        var price = LibCurrencies.ConvertToCurrency($('#txtPrice').val());
        var enabled = false;
        if ($('input[name="cbxActive"]').is(":checked"))
            enabled = true;
        //
        var model = {
            id: id,
            serviceId: serviceId,
            price: price,
            name: title,
            summary: summary,
            enabled: enabled
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
                    bosoCateController.dataList(pageIndex);
                    return;
                }
            }
        });
    },
    confirmDelete: function(id) {
        Confirm.Delete(id, bosoCateController.delete, null, null);
    }
};

bosoCateController.init();
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
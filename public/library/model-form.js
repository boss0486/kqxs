var ajaxStatus = 0;
class AjaxFrom {
    static POST(_form) {
        // for edg
        _form.method = "POST";
        _form.dataType = 'json';
        _form.accepts = "application/json";
        _form.async = true;
        _form.url = `/api-2021-6c84fb90-12c4-11e1-840d-7b25c5ee775a${_form.url}`;
        _form.headers = {
            accept: "application/json"
        };

        $.ajax(_form)
            .done(function(response) {
                if (response == undefined || response == null) {
                    Notifization.Error(MessageText.NotService);
                    return;
                }
                if (response.status == 401) {
                    Notifization.Error(response.message);
                    return;
                    //location.href = response.url;
                } else if (response.status != 200) {
                    Notifization.Error(response.message);
                    return;
                    //location.href = response.url;
                }
            })
            .fail(function() {
                Notifization.Error(MessageText.NotService);
                return;
            })
    }
    static GET(_form) {
        // for edg
        _form.method = "GET";
        _form.dataType = 'json';
        _form.accepts = "application/json";
        _form.async = true;
        _form.url = `/api-2021-6c84fb90-12c4-11e1-840d-7b25c5ee775a${_form.url}`;
        _form.headers = {
            accept: "application/json"
        };
        $.ajax(_form)
            .done(function(response) {
                if (response == undefined || response == null) {
                    Notifization.Error(MessageText.NotService);
                    return;
                }
                if (response.status == 401) {
                    Notifization.Error(response.message);
                    return;
                    //location.href = response.url;
                } else if (response.status != 200) {
                    Notifization.Error(response.message);
                    return;
                    //location.href = response.url;
                }
            })
            .fail(function() {
                Notifization.Error(MessageText.NotService);
                return;
            })
    }
}
// ************************************************************************************************
$(document).ajaxStart(function() {
    // edg is not working
    Loading.ShowLoading();
}).ajaxStop(function() {
    setTimeout(function() {
        Loading.HideLoading();
    }, 1500);
});
// ************************************************************************************************
$(document).ready(function() {

    //var startDate = new Date('01/01/2019');
    //var _startDate = new Date();
    //var _endDate =  '';
    //$('input[date-datepicker="1"]').datepicker({
    //    format: 'dd-mm-yyyy',
    //    todayHighlight: true,
    //    startDate: '01/01/2019',
    //    endDate: _startDate,
    //    autoclose: true
    //}).on('changeDate', function (selected) {
    //        startDate = new Date(selected.date.valueOf());
    //        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
    //    $('input[date-datepicker="2"]').datepicker('setStartDate', startDate);
    //    });
    //$('input[date-datepicker="2"]').datepicker({
    //    format: 'dd-mm-yyyy',
    //    todayHighlight: true,
    //    startDate: startDate,
    //    endDate: _endDate,
    //    autoclose: true
    //}).on('changeDate', function (selected) {
    //        _startDate = new Date(selected.date.valueOf());
    //        _startDate.setDate(_startDate.getDate(new Date(selected.date.valueOf())));
    //    $('input[date-datepicker="1"]').datepicker('setEndDate', _startDate);
    //    });
});
// ************************************************************************************************
class HelperModel {
    static Status(_status) {
        var result = '';
        switch (_status) {
            case 0:
                result = "Disable";
                break;
            case 1:
                result = "Enabled";
                break;
            default:
                result = "";
                break;
        }
        return result;
    }
    static StatusIcon(_status) {
        var result = `<i class='fa fa-toggle-on'></i>`;
        switch (_status) {
            case 0:
                result = "<i class='fa fa-toggle-off'></i>";
                break;
            case 1:
                result = "<i class='fa fa-toggle-on'></i>";
                break;
            default:
                result = "<i class='fa fa-toggle-on'></i>";
                break;
        }
        return result;
    }

    static StateIcon(_status) {
        var result = '';
        switch (_status) {
            case false:
                result = "<i class='fa fa-toggle-off'></i>";
                break;
            case true:
                result = "<i class='fa fa-toggle-on'></i>";
                break;
            default:
                result = "";
                break;
        }
        return result;
    }
    static RolePermission(role, _controlInit, _act) {
        if (role !== undefined && role !== null) {
            var action = ``;
            var cnt = 0;
            $.each(role, function(index, item) {
                //console.log(item);
                //if (role.Block) {
                //    if (item.IsBlock)
                //        action += `<a onclick="AccountController.Unlock('${id}')"><i class='far fa-dot-circle'></i>&nbsp;Unlock</a>`;
                //    else
                //        action += `<a onclick="AccountController.Block('${id}')"><i class='fas fa-ban'></i>&nbsp;Block</a>`;
                //}
                //if (role.Active) {
                //    if (item.Enabled)
                //        action += `<a onclick="AccountController.UnActive('${id}')"><i class='fas fa-toggle-off'></i>&nbsp;UnActive</a>`;
                //    else
                //        action += `<a onclick="AccountController.Active('${id}')"><i class='fas fa-toggle-on'></i>&nbsp;Active</a>`;
                //}


                // if (item.KeyID == "UserRole") {
                //     cnt++;
                //     action += `<a href='${URLA}/UserRole/${id}' target="_blank"><i class='fas fa-user-cog'></i>&nbsp;${item.Title}</a>`;
                // }

                // //
                if (item == "update") {
                    action += `<a href='${_act.backLink}/update/${_act.id}' data-id='${_act.id}' data-btnedit='true' target="_blank"><i class="fa fa-pencil-square"></i> &nbsp;</a>`;
                }
                if (item == "delete") {
                    action += `<a onclick="${_controlInit}.confirmDelete('${_act.id}')" target="_blank"><i class='fa fa-times-circle'></i>&nbsp;</a>`;

                    // action += `<a href='/update/${id}' target="_blank"><i class="fas fa-window-close"></i> &nbsp;</a>`;
                }
                // //
                // if (item.KeyID == "Delete") {
                //     cnt++;
                //     action += `<a onclick="${_controlInit}.ConfirmDelete('${id}')" target="_blank"><i class='fas fa-trash'></i>&nbsp;${item.Title}</a>`;
                // }
                // //
                // if (item.KeyID == "Details") {
                //     cnt++;
                //     action += `<a href='${URLA}/Details/${id}' target="_blank"><i class='fas fa-info-circle'></i>&nbsp;${item.Title}</a>`;
                // }
                // if (item.KeyID == "Setting") {
                //     cnt++;
                //     action += `<a href='${URLA}/Setting/${id}' target="_blank"><i class='fas fa-cog'></i>&nbsp;${item.Title}</a>`;
                // }
                // //
                // if (item.KeyID == "Profile") {
                //     cnt++;
                //     action += `<a href='${URLA}/Profile/${id}' target="_blank"><i class='fas fa-info-circle'></i>&nbsp;${item.Title}</a>`;
                // }
                // //
                // if (item.KeyID == "BookLuggage") {
                //     cnt++;
                //     action += `<a href='${URLA}/Booking/${id}' target="_blank"><i class="fas fa-luggage-cart"></i>&nbsp;${item.Title}</a>`;
                // }
                // //
                // if (item.KeyID == "SendMail") {
                //     cnt++;
                //     action += `<a href='${URLA}/Booking/${id}' target="_blank"><i class="fas fa-paper-plane"></i>&nbsp;${item.Title}</a>`;
                // }
                //
            });

            return `${action}`
            return `<div class='ddl-action'><span><i class='fa fa-caret-down'></i></span><div class='ddl-action-content'>${action}</div></div>`
                //if (cnt > 1) {
                //    return `<div class='ddl-action'><span><i class='fa fa-caret-down'></i></span><div class='ddl-action-content'>${action}</div></div>`
                //}
                //else {
                //    return action;
                //}
        }
        return "";
    }
    static AccessInApplication() {

            var _val = $('#txtAccessInApplication').val();
            if (_val == undefined || _val == null) {
                return -1;
            } else
                return parseInt(_val);
        }
        // *********************************************************************************
    static Download(path) {
        var a = document.createElement("a");
        var fileNameIndex = path.lastIndexOf("/") + 1;
        var filename = path.substr(fileNameIndex);
        a.href = path;
        a.setAttribute("taget", "_blank");
        a.setAttribute("download", filename);
        a.setAttribute("_download", "true");
        //
        document.body.appendChild(a);
        a.click();
        $("a[_download='true']").remove();
        return;
    }

}

class RoleEnum {

    static IsCMSUser = 1;
    static IsAdminInApplication = 2;
    static IsAdminCustomerLogged = 3;
    static IsCustomerLogged = 4;
    static IsAdminSupplierLogged = 5;
    static IsSupplierLogged = 6;
}

class CustomerTypeEnum {
    static Company = 1;
    static Haunt = 2;
}
var _urlAction = "/authen";

var appController = {
    init: function() {
        appController.registerEvent();
    },
    registerEvent: function() {
        $(document).on('click', '[data-logout="true"]', function(event) {
            appController.Logout();
        });

    },
    Logout: function() {
        var model = {};

        AjaxFrom.POST({
            url: `${_urlAction}/logout`,
            data: model,
            success: function(response) {
                if (response !== null) {
                    if (response.status === 200) {
                        Notifization.Success(response.message);
                        location.href = response.data.url;
                        return;
                    }
                }
            }
        });
    }
};
appController.init();
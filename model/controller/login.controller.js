const DateTimeLib = require("../../helper/helper.datetime.library");
const HelperLib = require("../../helper/helper.library");
const helperLib = require("../../helper/helper.library");
const Notyfication = require("../../helper/helper.notification");
const SecurrityLib = require("../../helper/helper.security");
var LoginModel = require("../entities/app_login");

// JK4:allen
const loginController = {
    dataList: async(req) => {
        try {
            var data = await LoginModel.find({});
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //    
            return Notyfication.success_data("ok", data);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    create: async(model) => {
        try {
            if (model.uuid == "" || model.uuid == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var login = await LoginModel.findOne({ uuid: model.uuid });
            if (login != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var logName = await LoginModel.findOne({ name: model.name });
            if (logName != null)
                return Notyfication.invalid("Data is duplicate");
            // 
            var loginModel = new LoginModel(model);

            await loginModel.save();
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_CREATE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }

    },
    update: async(model) => {
        try {
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var login = await LoginModel.findOne({ id: model.id });
            if (login == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //   
            var logName = await LoginModel.findOne({ name: model.name, id: { $not: { $eq: model.id } } });
            console.log(logName);
            if (logName != null)
                return Notyfication.invalid("Data is duplicate");
            //    
            var resultFind = await LoginModel.findOneAndUpdate({ id: model.id }, {
                name: model.name,
                isBlock: model.isBlock,
                enabled: model.enabled,
                password: model.password

            });
            if (resultFind == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_UPDATE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async(id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var resultFind = await LoginModel.findOneAndDelete({ id: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    uuid: async(_uuid) => {
        try {
            if (_uuid == undefined || _uuid == null)
                return Notyfication.invalid("uuid is empty");
            //  
            var token = helperLib.generateToken(_uuid);
            var login = await LoginModel.findOne({ uuid: _uuid });
            if (login != null) {
                var _firstlogin = HelperLib.timeNow();
                if (login.firstLogin != undefined && login.firstLogin != null)
                    _firstlogin = login.firstLogin;
                //
                var data = {
                    token: token,
                    firstLogin: _firstlogin,
                    lastLogin: HelperLib.timeNow()
                };
                var findUpdate = await LoginModel.findOneAndUpdate({ id: login.id }, data);
                if (findUpdate != null)
                    return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, token);
                //  
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
            } else {
                // 
                var loginModel = new LoginModel({
                    uuid: _uuid,
                    name: _uuid,
                    firstlogin: HelperLib.timeNow(),
                    lastLogin: HelperLib.timeNow(),
                    token: token
                });
                var resultSave = await loginModel.save();
                if (resultSave != null)
                    return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, token);
                // 
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
            }
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async(id) => {
        var item = await LoginModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    },
    getToken: async(id) => {
        var item = await LoginModel.findOne({ id: id });
        if (item == null) return null;
        //
        return item.token;
    },
    login: async(req, model) => {
        try {
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //  
            if (model.loginId == null)
                return Notyfication.invalid("Username invalid");
            //
            if (model.password == null)
                return Notyfication.invalid("Password invalid");
            //  
            var login = await LoginModel.findOne({ uuid: model.loginId });
            if (login == null)
                return Notyfication.invalid("Username or password invalid");
            //
            var dbPassword = login.password;
            var check = await SecurrityLib.checkPassword(model.password, dbPassword);
            if (!check)
                return Notyfication.invalid("Username or password invalid");
            //
            var token = helperLib.generateToken(login.uuid);
            var _firstlogin = HelperLib.timeNow();
            if (login.firstLogin != undefined && login.firstLogin != null)
                _firstlogin = login.firstLogin;
            //
            var data = {
                token: token,
                firstLogin: _firstlogin,
                lastLogin: HelperLib.timeNow()
            };
            var findUpdate = await LoginModel.findOneAndUpdate({ id: login.id }, data);
            if (findUpdate == null)
                return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
            //
            var _session = req.session;
            _session.userId = login.id;
            // 
            if (login.isAdmin != undefined) {
                _session.isAdmin = login.isAdmin;
            } else {
                _session.isAdmin = false;
            }
            if (model.url == undefined || model.url == "")
                model.url = "/index";

            return Notyfication.success_data("Login success", { url: model.url, token: token });
            // 
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    logout: async(req, model) => {
        try {
            var userid = req.session.userId;
            if (userid == undefined || userid == null)
                return Notyfication.unAuthorized(Notyfication.httMessage.NOTIFY_MESSAGE_UNAUTHORIZED, "/authen/login");
            //
            var login = await LoginModel.findOne({ id: userid });
            if (login == null)
                return Notyfication.unAuthorized(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE, "/authen/login");
            //
            var data = {
                token: null
            };
            var resultFind = await LoginModel.findOneAndUpdate({ id: userid }, data);
            if (resultFind == null) return Notyfication.unAuthorized(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            req.session.destroy();
            return Notyfication.success_data("Logout...", { url: "/authen/login" });
            // 
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    }
}

module.exports = loginController;
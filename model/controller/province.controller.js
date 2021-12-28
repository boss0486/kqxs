const helperLib = require("../../helper/helper.library");
const Notyfication = require("../../helper/helper.notification");
const ProvinceModel = require("../entities/app_province");
// JK4:allen
const provinceController = {
    dataList: async (req) => {
        try {
            var data = await ProvinceModel.find({});
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //    
            return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    create: async (model) => {
        try {
            if (model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var item = await ProvinceModel.findOne({ name: model.name });
            if (item != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var itemModel = new ProvinceModel(model);
            await itemModel.save();
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_CREATE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    update: async (model) => {
        try {
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var item = await ProvinceModel.findOne({ id: model.id });
            if (item == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            // 
            var itemName = await ProvinceModel.findOne({ name: model.name, id: { $not: { $eq: model.id } } });
            if (itemName != null)
                return Notyfication.invalid("Data is duplicate");
            // 
            var data = {
                provinceId : model.provinceId, 
                provinceName : model.provinceName, 
                provinceAlias : model.provinceAlias, 
                provinceIdRef : model.provinceIdRef, 
                areaId : model.areaId
            };
            var resultFind = await ProvinceModel.findOneAndUpdate({ provinceId: model.id }, data);
            if (resultFind == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_UPDATE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async (id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var resultFind = await ProvinceModel.findOneAndDelete({ provinceId: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async (id) => {
        var item = await ProvinceModel.findOne({ provinceId: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    }
}

module.exports = provinceController;
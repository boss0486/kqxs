const helperLib = require("../../helper/helper.library");
const Notyfication = require("../../helper/helper.notification");
const KqxsCategoryModel = require("../entities/app_kqxs_category");
// JK4:allen
const kqxsCategoryController = {
    dataList: async (req) => {
        try {
            var data = await KqxsCategoryModel.find({});
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
            var kqxsCategory = await KqxsCategoryModel.findOne({ name: model.name });
            if (kqxsCategory != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var kqxsCategoryModel = new KqxsCategoryModel(model);
            await kqxsCategoryModel.save();
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
            var kqxsCategory = await KqxsCategoryModel.findOne({ id: model.id });
            if (kqxsCategory == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            // 
            var kqxsCategoryName = await KqxsCategoryModel.findOne({ name: model.name, _id: { $not: { $eq: model.id } } });
            if (kqxsCategoryName != null)
                return Notyfication.invalid("Data is duplicate");
            // 
            var data = {
                name: model.name,
                summary: model.summary,
                orderId: model.orderId
            };
            var resultFind = await KqxsCategoryModel.findOneAndUpdate({ id: model.id }, data);
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
            var resultFind = await KqxsCategoryModel.findOneAndDelete({ id: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async (id) => {
        var item = await KqxsCategoryModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    }
}

module.exports = kqxsCategoryController;
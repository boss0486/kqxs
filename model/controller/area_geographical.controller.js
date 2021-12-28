const Notyfication = require("../../helper/helper.notification");
const AreaGeographicalModel = require("../entities/area_geographical");
// JK4:allen
const kqxsCategoryController = {
    dataList: async (req) => {
        try {
            var data = await AreaGeographicalModel.find({});
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
            var item = await AreaGeographicalModel.findOne({ areaName: model.areaName });
            if (item != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var itemModel = new AreaGeographicalModel(model);
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
            var item = await AreaGeographicalModel.findOne({ areaId: model.id });
            if (item == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            // 
            var itemName = await AreaGeographicalModel.findOne({ areaName: model.name, areaId: { $not: { $eq: model.id } } });
            if (itemName != null)
                return Notyfication.invalid("Data is duplicate");
            // 
            var data = {
                areaName: model.name
            };
            // 
            var resultFind = await AreaGeographicalModel.findOneAndUpdate({ areaId: model.id }, data);
            if (resultFind == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_UPDATE_SUCESS);
        } catch (error) {
            throw error;
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async (id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var resultFind = await AreaGeographicalModel.findOneAndDelete({ areaId: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async (id) => {
        var item = await AreaGeographicalModel.findOne({ areaId: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    }
}

module.exports = kqxsCategoryController;
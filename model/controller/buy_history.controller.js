const HelperLib = require("../../helper/helper.library");
const SecurrityLib = require("../../helper/helper.security");
const DateTimeLib = require("../../helper/helper.datetime.library");
const Notyfication = require("../../helper/helper.notification"); 
const BuyHistoryModel = require("../entities/app_buy_history");

// JK4:allen
const buyHistoryController = {
    dataList: async (req) => {
        try {
            var data = await BuyHistoryModel.find({});
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //    
            return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    LogHistory: async (model) => {
        try {
            var itemModel = new BuyHistoryModel(model);
            await itemModel.save();
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var item = await buyHistoryModel.findOne({ id: id });
            if (item == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //    
            var resultFind = await buyHistoryModel.findOneAndDelete(id);
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async (id) => {
        var item = await buyHistoryModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    },
    getByUuid: async (uuid) => {
        var items = await BuyHistoryModel.find({ uuid: uuid });
        if (items.length == 0) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, items);
    }
}

module.exports = buyHistoryController;
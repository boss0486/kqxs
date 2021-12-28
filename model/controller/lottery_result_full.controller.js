const HelperLib = require("../../helper/helper.library");
const DateTimeLib = require("../../helper/helper.datetime.library");
//
const Notyfication = require("../../helper/helper.notification");
const LotteryResultFullModel = require("../entities/lottery_result_full");
const AreaGeographical = require("../entities/area_geographical"); 
// JK4:allen
const kqxsController = {
    dataList: async (req) => {
        try {
            var data = await LotteryResultFullModel.find({});
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
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
            // if (model == null)
            //     return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // // 
            // if (model.executionDate == undefined || model.executionDate == "")
            //     return Notyfication.invalid("Execution date is empty");
            // //
            // if (!HelperLib.validData.validDate(model.executionDate))
            //     return Notyfication.invalid("Execution date invalid");
            // //
            // if (model.areaId == undefined || model.areaId == "")
            //     return Notyfication.invalid("Area date is empty");
            // //
            // var itemArea = await AreaGeographical.findOne({ id: model.areaId });
            // if (itemArea == null)
            //     return Notyfication.invalid("Area invalid");
            // //   
            // if (model.categoryId == undefined || model.categoryId == "")
            //     return Notyfication.invalid("Category date is empty");
            // //
            // var itemKqxsCategory = await KqxsCategoryModel.findOne({ id: model.categoryId });
            // if (itemKqxsCategory == null)
            //     return Notyfication.invalid("Categories invalid");
            // //  
            // var item = await KqxsModel.findOne({
            //     '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(model.executionDate)}' 
            //       && this.areaId == '${model.areaId}' && this.categoryId == '${model.categoryId}'`
            // });
            // if (item != null)
            //     return Notyfication.invalid("Data is duplicate");
            // //   
            // model.executionDate = DateTimeLib.formatToServerDate(model.executionDate);
            // var itemModel = new KqxsModel(model);
            // await itemModel.save();
            
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    update: async (model) => {
        try {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
            // if (model == null)
            //     return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // // 
            // if (model.executionDate == undefined || model.executionDate == "")
            //     return Notyfication.invalid("Execution date is empty");
            // //
            // if (!HelperLib.validData.validDate(model.executionDate))
            //     return Notyfication.invalid("Execution date invalid");
            // //
            // if (model.areaId == undefined || model.areaId == "")
            //     return Notyfication.invalid("Area date is empty");
            // //
            // var itemArea = await AreaGeographical.findOne({ id: model.areaId });
            // if (itemArea == null)
            //     return Notyfication.invalid("Area invalid");
            // //   
            // if (model.categoryId == undefined || model.categoryId == "")
            //     return Notyfication.invalid("Category date is empty");
            // //
            // var itemKqxsCategory = await KqxsCategoryModel.findOne({ id: model.categoryId });
            // if (itemKqxsCategory == null)
            //     return Notyfication.invalid("Categories invalid");
            // //  
            // var item = await KqxsModel.findOne({ id: model.id });
            // if (item == null)
            //     return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            // //  
            // var itemName = await KqxsModel.findOne({
            //     '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(model.executionDate)}' 
            //       && this.areaId == '${model.areaId}' && this.categoryId == '${model.categoryId}' && this.id != '${model.id}'`
            // });
            // if (itemName != null)
            //     return Notyfication.invalid("Data is duplicate");
            // // 
            // var data = {
            //     areaId: model.areaId,
            //     categoryId: model.categoryId,
            //     value: model.value,
            //     orderId: model.orderId,
            //     executionDate: DateTimeLib.formatToServerDate(model.executionDate),
            //     enabled: model.enabled
            // };
            // var resultFind = await KqxsModel.findOneAndUpdate({ id: model.id }, data);
            // if (resultFind == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            // //
            // return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_UPDATE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async (id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var resultFind = await KqxsModel.findOneAndDelete({ id: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async (id) => {
        var item = await KqxsModel.findOne({ id: id }); 
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    }
}

module.exports = kqxsController;
const HelperLib = require("../../helper/helper.library");
const Notyfication = require("../../helper/helper.notification");
const BosoCategoryModel = require("../entities/app_boso_category");
const BosoModel = require("../entities/app_boso");

const DateTimeLib = require("../../helper/helper.datetime.library");

// JK4:allen
const bosoCategoryModelController = {
    dataList: async(model) => {
        try {
            if (model == null) {
                model.page = 1;
            }
            let page = parseInt(model.page) || 1;
            var totalData = await BosoCategoryModel.countDocuments({});
            var totalPage = parseInt(totalData / HelperLib.paging.PAGE_SIZE);
            console.log(totalPage)
            if (page > totalPage && totalPage > 0)
                page = totalPage;
            //
            var skip = (page - 1) * HelperLib.paging.PAGE_SIZE;
            // search
            var _whereCondition = "";
            if (model.query != undefined && model.query != "") {
                model.query = model.query.trim();
                _whereCondition += ` && this.name/*.${model.query}.*/`;
            }
            var data = await BosoCategoryModel.find({
                    'name': { '$regex': `.*${model.query}.*` }
                }, { __v: 0, icon: 0, _id: 0, sortNo: 0 }).sort({ name: 1 })
                .skip(skip).limit(HelperLib.paging.PAGE_SIZE);
            //  
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //    
            return Notyfication.dataList(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data, HelperLib.paging.pagination(totalPage, page), HelperLib.role);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    dataListApi: async(model) => {
        try {
            if (model.areaId == undefined || model.areaId == null) {
                model.areaId = 1;
            }
            var data = await BosoCategoryModel.find({}, { __v: 0, icon: 0, _id: 0, sortNo: 0 });
            //  
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //  
            var result = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index].toObject();
                var boso = await BosoModel.findOne({
                    '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' && this.areaId==${model.areaId} && this.categoryId == '${element.id}'`
                });
                if (boso != null && boso.id != null) {
                    result.push(element);
                }
            }
            //
            return Notyfication.dataList(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, result, null, null);
        } catch (error) {
            throw error;
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    create: async(model) => {
        try {
            if (model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var item = await BosoCategoryModel.findOne({ name: model.name });
            if (item != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var itemModel = new BosoCategoryModel(model);
            await itemModel.save();
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
            model.id = model.id.trim();
            var item = await BosoCategoryModel.findOne({ id: model.id });
            if (item == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            // 
            var itemName = await BosoCategoryModel.findOne({ name: model.name, id: { $not: { $eq: model.id } } });
            if (itemName != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var resultFind = await BosoCategoryModel.findOneAndUpdate({ id: model.id }, {
                name: model.name,
                summary: model.summary,
                serviceId: model.serviceId,
                price: model.price,
                enabled: model.enabled,
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
            var resultFind = await BosoCategoryModel.findOneAndDelete({ id: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async(id) => {
        var item = await BosoCategoryModel.findOne({ id: id }, { __v: 0, icon: 0, _id: 0, sortNo: 0 });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, item);
    }
}

module.exports = bosoCategoryModelController;
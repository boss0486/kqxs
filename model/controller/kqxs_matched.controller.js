const HelperLib = require("../../helper/helper.library");
const SecurrityLib = require("../../helper/helper.security");
const DateTimeLib = require("../../helper/helper.datetime.library");
const Notyfication = require("../../helper/helper.notification");
const BosoModel = require("../entities/app_boso");
const AreaGeographical = require("../entities/area_geographical");
const BosoCategoryModel = require("../entities/app_boso_category");
const KqxsMatchedModel = require("../entities/app_kqxs_matched");

// JK4:allen
const kqxsMatchedController = {
    dataList: async(model, ) => {
        try {
            if (model == null) {
                model.page = 1;
            }
            let page = parseInt(model.page) || 1;
            var totalData = await BosoModel.countDocuments({});
            var totalPage = parseInt(totalData / HelperLib.paging.PAGE_SIZE);
            if (page > totalPage && totalPage > 0)
                page = totalPage;
            //  
            var skip = (page - 1) * HelperLib.paging.PAGE_SIZE;
            //
            var whereCondition = "";
            if (model.areaId != undefined && model.areaId != null) {
                whereCondition += ` && this.areaId==${model.areaId}`
            }
            //   
            if (model.categoryId != undefined && model.categoryId != null) {
                whereCondition += ` && this.bosoCategoryId == '${model.categoryId}'`
            }
            //   
            var data = await KqxsMatchedModel.find({ '$where': `this.id != '' ${whereCondition}` }, { __v: 0, _id: 0, updatedDate: 0, enabled: 0, createdDate: 0 })
                .skip(skip).limit(HelperLib.paging.PAGE_SIZE);
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //  
            for (let index = 0; index < data.length; index++) {
                const element = data[index].toObject();
                var area = await AreaGeographical.findOne({ areaId: element.areaId }, { __v: 0, _id: 0 });
                if (area != null)
                    element.areaName = area.areaName;
                // 
                var category = await BosoCategoryModel.findOne({ id: element.categoryId }, { __v: 0, _id: 0 });
                // 
                if (category != null)
                    element.name = category.name;
                //  
                data[index] = element;
            }

            return Notyfication.dataList(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data, HelperLib.paging.pagination(totalPage, page), HelperLib.role);
        } catch (error) {
            throw error;
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    create: async(model) => {
        try {
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //     
            if (!HelperLib.validData.validDate(model.executionDate))
                return Notyfication.invalid("Execution date invalid f: dd-mm-yyyy");
            //  
            var area = await AreaGeographical.findOne({ areaId: model.areaId });
            if (area == null)
                return Notyfication.invalid("Area invalid");
            //
            var boso = await BosoModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}' && this.areaId==${model.areaId} && this.categoryId == '${model.categoryId}'`
            });
            if (boso == null)
                return Notyfication.notfound(`Boso for date: ${model.executionDate} empty|${model.categoryId}|`);
            //   
            var kqxsMatched = await KqxsMatchedModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}' && this.areaId==${model.areaId} && this.bosoId == '${boso.bosoId}' `
            });
            if (kqxsMatched != null)
                return Notyfication.invalid("Data is duplicate");
            //
            var bosoCategory = await BosoCategoryModel.findOne({ id: boso.categoryId });
            var itemModel = new KqxsMatchedModel({
                areaId: model.areaId,
                bosoCategoryId: boso.categoryId,
                bosoId: boso.id,
                bosoName: bosoCategory.name,
                bosoVal: boso.bosoVal,
                kqxsVal: model.kqxsVal,
                textRs: model.textRs,
                isMatched: model.isMatched,
                executionDate: new Date(DateTimeLib.formatDateForAPI(model.executionDate))
            });
            await itemModel.save();
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_CREATE_SUCESS);
        } catch (error) {
            throw error;
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    update: async(model) => {
        try {
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID + "xxx");
            //     
            if (!HelperLib.validData.validDate(model.executionDate))
                return Notyfication.invalid("Execution date invalid f: dd-mm-yyyy");
            //  
            var area = await AreaGeographical.findOne({ areaId: model.areaId });
            if (area == null)
                return Notyfication.invalid("Area invalid");
            //
            var boso = await BosoModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}' && this.areaId==${model.areaId} && this.categoryId == '${model.categoryId}'`
            });
            if (boso == null)
                return Notyfication.notfound(`Boso for date: ${model.executionDate} empty|${model.categoryId}|`);
            //   
            var kqxsMatched = await KqxsMatchedModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}' && this.areaId==${model.areaId} && this.bosoId == '${boso.bosoId}' && this.id != '${model.id}'`
            });
            if (kqxsMatched != null)
                return Notyfication.invalid("Data is duplicate");
            //  
            var resultFind = await KqxsMatchedModel.findOneAndUpdate({ id: model.id }, {
                kqxsVal: model.kqxsVal,
                textRs: model.textRs,
                isMatched: model.isMatched
            });
            console.log(resultFind);
            if (resultFind == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_UPDATE_SUCESS);
        } catch (error) {
            throw error;
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async(id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var resultFind = await KqxsMatchedModel.findOneAndDelete(id);
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async(id) => {
        var item = await KqxsMatchedModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    }
}

module.exports = kqxsMatchedController;
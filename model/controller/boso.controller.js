const HelperLib = require("../../helper/helper.library");
const SecurrityLib = require("../../helper/helper.security");
const DateTimeLib = require("../../helper/helper.datetime.library");
//
const Notyfication = require("../../helper/helper.notification");

const AreaGeographical = require("../entities/area_geographical");
const BosoCategoryModel = require("../entities/app_boso_category");
const BosoModel = require("../entities/app_boso");
const OrderModel = require("../entities/app_order");
// JK4:allen
const bosoController = {
    dataList: async(model, token) => {
        try {

            var tokenModel = SecurrityLib.getUuidByLoginToken(token);
            if (model == null) {
                model.page = 1;
            }
            let page = parseInt(model.page) || 1;
            var totalData = await BosoModel.countDocuments({});
            var totalPage = parseInt(totalData / HelperLib.paging.PAGE_SIZE);
            if (totalData % HelperLib.paging.PAGE_SIZE > 0) {
                totalPage += 1;
            }
            if (page > totalPage && totalPage > 0)
                page = totalPage;
            //  
            var _skip = (page - 1) * HelperLib.paging.PAGE_SIZE;
            // search    
            var _match = { $match: { id: { $ne: "" } } };
            var _match2 = { $match: { id: { $ne: "" } } };
            var _match3 = { $match: { id: { $ne: "" } } };
            if (model.areaId != null && model.areaId != 0) {
                if (parseInt(model.areaId) == 0 || parseInt(model.areaId) < 0) {
                    return Notyfication.invalid("Area invalid");
                }

                _match = { $match: { areaId: parseInt(model.areaId) } };
            }
            if (model.startDate != null && model.startDate != "") {
                if (!HelperLib.validData.validDate(model.startDate))
                    return Notyfication.invalid("Start date invalid f: dd-mm-yyyy");
                // 
                _match2 = {
                    $match: {
                        executionDate: {
                            $gte: new Date(DateTimeLib.formatDateForAPI(model.startDate))
                        }
                    }
                };
            }
            if (model.endDate != null && model.endDate != "") {
                if (!HelperLib.validData.validDate(model.endDate))
                    return Notyfication.invalid("End date invalid f: dd-mm-yyyy");
                //  
                _match2 = {
                    $match: {
                        executionDate: {
                            $lte: new Date(DateTimeLib.formatDateForAPI(model.endDate))
                        }
                    }
                };
            }
            var rsData = await BosoModel.aggregate([
                _match,
                _match2,
                _match3,
                {
                    $lookup: {
                        from: "app_boso_categorys",
                        let: {
                            categoryId: "$categoryId",
                            areaName: "$areaName",
                            query: model.query,
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$id", "$$categoryId"],
                                    },
                                    'name': { '$regex': `.*${model.query}.*` }
                                },
                            },
                            {
                                "$project": {
                                    name: 1,
                                    _id: 0
                                }
                            },
                            { $sort: { name: 1 } },

                        ],
                        as: "cate"
                    },

                },
                {
                    $addFields: {
                        name: "$cate.name",
                        areaName: "",
                    }

                },
                {
                    $unwind: "$cate",
                    $unwind: "$name",
                },
                {
                    $project: {
                        _id: 0,
                        cate: 0,
                        __v: 0
                    },
                },
                { '$sort': { 'executionDate': -1 } },
                {
                    '$facet': {
                        metadata: [{ $count: "total" }, {
                            $addFields: {
                                currentPage: page,
                                pageSize: HelperLib.paging.PAGE_SIZE
                            }
                        }],
                        data: [{ $skip: _skip }, { $limit: HelperLib.paging.PAGE_SIZE }] // add projection here wish you re-shape the docs
                    }
                }

            ]);
            var meta = rsData[0].metadata[0];
            var data = rsData[0].data;
            if (data == null || data.length == 0) {
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            }
            //
            for (let index = 0; index < data.length; index++) {
                var element = data[index];
                element.bought = false;
                var area = await AreaGeographical.findOne({ areaId: element.areaId }, { __v: 0, _id: 0 });
                if (area != null) {
                    element.areaName = area.areaName;
                }

                if (tokenModel != null) {
                    var order1 = await OrderModel.findOne({
                        '$where': `this.createdDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' 
                     && this.areaId == ${element.areaId} && this.bosoId == '${element.id}' && this.uuid == '${tokenModel.uuid}'`
                    });
                    // 
                    if (order1 != null) {
                        element.bought = true;
                    }
                }
                data[index] = element;
            }
            return Notyfication.dataList(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data, HelperLib.paging.pagination(meta.total, page), HelperLib.role);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    dataListCheck: async(token) => {
        try {
            var data = await BosoCategoryModel.aggregate([{
                    $lookup: {
                        from: 'app_bosos',
                        let: { cateId: "$id" },
                        pipeline: [{
                                "$match": {
                                    "$expr": {
                                        "$eq": ["$categoryId", "$$cateId"],
                                        //"$eq": ["$$executionDate", "$$executionDate"],
                                    },
                                    "$and": [
                                        { "executionDate": new Date(DateTimeLib.formatToServerDate(HelperLib.timeNow())) }
                                    ]
                                }
                            },
                            { "$project": { id: 1, categoryId: 1, areaId: 1, price: 1, value: 1, executionDate: 1 } }
                        ],
                        //localField: 'id',
                        //foreignField: 'categoryId',
                        as: 'boso'
                    }
                },
                // {
                //     $unwind: "$boso",
                // },
                {
                    $project: { id: 1, name: 1, boso: 1 },
                }
            ]);

            if (data == null || data.length == 0) {
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_ORDER_SUCESS);
            }
            var tokenModel = SecurrityLib.getUuidByLoginToken(token);
            for (let index = 0; index < data.length; index++) {
                var element = data[index];
                element.bought = false;
                var order1 = await OrderModel.findOne({
                    '$where': `this.createdDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' 
                     && this.areaId == ${element.boso[0].areaId} && this.bosoId == '${element.boso[0].id}' && this.uuid == '${tokenModel.uuid}'`
                });
                // 
                if (order1 != null) {
                    element.bought = true;
                    data[index] = element;
                }
            }
            return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    create: async(model) => {
        try {
            if (model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            if (model.executionDate == undefined || model.executionDate == "")
                return Notyfication.invalid("Execution date is empty");
            //  
            if (!HelperLib.validData.validDate(model.executionDate))
                return Notyfication.invalid("Execution date invalid f: dd-mm-yyyy");
            //  
            if (!HelperLib.validData.validDate(model.executionDate))
                return Notyfication.invalid("Execution date invalid");
            //
            if (model.areaId == undefined || model.areaId == "")
                return Notyfication.invalid("Area date is empty");
            //
            var itemArea = await AreaGeographical.findOne({ areaId: model.areaId });
            if (itemArea == null)
                return Notyfication.invalid("Area invalid");
            //   
            if (model.categoryId == undefined || model.categoryId == "")
                return Notyfication.invalid("Category date is empty");
            //
            var itemCategory = await BosoCategoryModel.findOne({ id: model.categoryId });
            if (itemCategory == null)
                return Notyfication.invalid("Categories invalid");
            //   
            var item = await BosoModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}' 
                 && this.areaId == '${model.areaId}' && this.categoryId == '${model.categoryId}'`
            });
            if (item != null)
                return Notyfication.invalid("Data is duplicate");
            //   
            model.executionDate = DateTimeLib.formatDateForAPI(model.executionDate);
            var bosoModel = new BosoModel({
                areaId: model.areaId,
                categoryId: model.categoryId,
                value: model.value,
                price: model.price,
                kqxsVal: model.kqxsVal,
                textRs: model.textRs,
                fValue: "",
                isMatched: model.isMatched,
                executionDate: model.executionDate,
                enabled: model.enabled
            });
            await bosoModel.save();
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_CREATE_SUCESS);
        } catch (error) {
            throw error;
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    update: async(model) => {
        try {
            if (model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            if (model.executionDate == undefined || model.executionDate == "")
                return Notyfication.invalid("Execution date is empty");
            //
            if (!HelperLib.validData.validDate(model.executionDate))
                return Notyfication.invalid("Execution date invalid");
            //
            if (model.areaId == undefined || model.areaId == "")
                return Notyfication.invalid("Area date is empty");
            //
            var itemArea = await AreaGeographical.findOne({ areaId: model.areaId });
            if (itemArea == null)
                return Notyfication.invalid("Area invalid");
            //   
            if (model.categoryId == undefined || model.categoryId == "")
                return Notyfication.invalid("Category date is empty");
            //
            var itemCategory = await BosoCategoryModel.findOne({ id: model.categoryId });
            if (itemCategory == null)
                return Notyfication.invalid("Categories invalid");
            //  
            model.id = model.id.trim();
            var item = await BosoModel.findOne({ id: model.id });
            if (item == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //   
            var itemName = await BosoModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}' 
                  && this.areaId == '${model.areaId}' && this.categoryId == '${model.categoryId}' && this.id != '${model.id}'`
            });
            if (itemName != null)
                return Notyfication.invalid("Data is duplicate");
            // 
            var data = {
                areaId: model.areaId,
                categoryId: model.categoryId,
                value: model.value,
                price: model.price,
                kqxsVal: model.kqxsVal,
                textRs: model.textRs,
                fValue: model.fValue,
                isMatched: model.isMatched,
                enabled: model.enabled
            };
            var resultFind = await BosoModel.findOneAndUpdate({ id: model.id }, data);
            if (resultFind == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
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
            var resultFind = await BosoModel.findOneAndDelete({ id: id });
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async(id) => {
        var item = await BosoModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        var category = await BosoCategoryModel.findOne({ id: item.categoryId });
        item.name = category.name;
        item.serviceId = category.serviceId;
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    },
    getByAreaId: async(model, token) => {
        if (model == null)
            return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
        // 
        var item = await BosoModel.findOne({ areaId: model.areaId }, { _id: 0, __v: 0, createdDate: 0, executionDate: 0, areaId: 0, enabled: 0, unit: 0 });

        if (item == null)
            return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        // 
        item = item.toObject();
        var category = await BosoCategoryModel.findOne({ id: item.categoryId });
        item.name = category.name;
        item.bought = false;
        var tokenModel = SecurrityLib.getUuidByLoginToken(token);
        var order1 = OrderModel.findOne({
            '$where': `this.createdDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' 
             && this.areaId == ${model.areaId} && this.uuid == '${tokenModel.uuid}'`
        });
        //
        if (order1 != null) {
            item.bought = true;
        }
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    },
    getDetails: async(model, token) => {
            if (model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var item = await BosoCategoryModel.findOne({
                '$where': `this.id == '${model.categoryId}'`
            }, {
                _id: 0,
                __v: 0,
                createdDate: 0,
                enabled: 0,
                unit: 0
            });
            if (item == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);

            //
            var detail = await BosoModel.findOne({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' 
                 && this.areaId == ${model.areaId} && this.categoryId == '${model.categoryId}'`
            }, {
                _id: 0,
                __v: 0,
                createdDate: 0,
                enabled: 0,
                unit: 0,
                categoryId: 0
            });
            item = item.toObject();
            item.bought = false;
            var tokenModel = SecurrityLib.getUuidByLoginToken(token);
            var order1 = await OrderModel.findOne({
                '$where': `this.buyDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' 
             && this.areaId == ${model.areaId} && this.bosoCategoryId == '${item.id}' && this.uuid == '${tokenModel.uuid}'`
            });
            // 
            if (order1 != null) {
                item.bought = true;
            }
            item.item = detail;
            return Notyfication.success_data(Notyfication.httMessage.success, item);
        }
        // ********************************************************************************************************************************************************************
}

module.exports = bosoController;
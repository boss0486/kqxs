// logger

const HelperLogger = require('../../helper/helper.logger');
// *****************************************************
const HelperLib = require("../../helper/helper.library");
const SecurrityLib = require("../../helper/helper.security");
const DateTimeLib = require("../../helper/helper.datetime.library");
const Notyfication = require("../../helper/helper.notification");
const OrderModel = require("../entities/app_order");
const BosoModel = require("../entities/app_boso");
const BosoCategoryModel = require("../entities/app_boso_category");
const buyHistoryController = require("../controller/buy_history.controller");
// JK4:allen
const orderController = {
    dataList: async (model, token, _ssLogin) => {
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
            var _match4 = { $match: { id: { $ne: "" } } };
            var _matchToken = { $match: { id: { $ne: "" } } };
            //
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
                        createdDate: {
                            $gte: new Date(DateTimeLib.formatDateForAPI(model.startDate))
                        }
                    }
                };
            }
            if (model.endDate != null && model.endDate != "") {
                if (!HelperLib.validData.validDate(model.endDate))
                    return Notyfication.invalid("End date invalid f: dd-mm-yyyy");
                //  
                _match3 = {
                    $match: {
                        createdDate: {
                            $lte: new Date(DateTimeLib.formatDateForAPI(model.endDate))
                        }
                    }
                };
            }
            if (model.query != null && model.query != "") {
                _match4 = {
                    $match: {
                        bosoName: { '$regex': `.*${model.query}.*` }
                    }
                };
            }


            if (_ssLogin != null && _ssLogin.isAdmin) {
                //
            } else {
                _matchToken = {
                    $match: {
                        $expr: {
                            $eq: ["$uuid", tokenModel.uuid],
                        }
                    }
                };
            }
            //
            var rsData = await OrderModel.aggregate([
                _match,
                _match2,
                _match3,
                _match4,
                _matchToken,
                {
                    $lookup: {
                        from: "AreaConfig",
                        let: {
                            areaId: "$areaId",
                            areaName: "$areaName"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ["$areaId", "$$areaId"],
                                }
                            },
                        },
                        {
                            "$project": {
                                areaName: 1,
                                _id: 0
                            }
                        },
                        { $sort: { name: 1 } },

                        ],
                        as: "cate"
                    },
                },
                {
                    $lookup: {
                        from: "app_bosos",
                        let: {
                            v_areaId: "$areaId",
                            v_bosoCategoryId: "$bosoCategoryId",
                            v_buyDate: "$buyDate.toJSON().slice(0, 10)",
                            dt_event: {
                                $dateToString: {
                                    date: "$buyDate",
                                    format: "%Y-%m-%d"
                                }
                            }
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$areaId", 1] },
                                        { $eq: ["$categoryId", "$$v_bosoCategoryId"] },
                                        {
                                            $eq: [
                                                "$$dt_event",
                                                {
                                                    $dateToString: {
                                                        date: "$executionDate",
                                                        format: "%Y-%m-%d"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }

                            }
                        },
                        {
                            "$project": {
                                _id: 0,
                                __v: 0,
                                createdDate: 0,
                                enabled: 0
                            }
                        }
                        ],
                        as: "boso"
                    },
                },
                {
                    $addFields: {
                        areaName: "$cate.areaName"
                    }

                },
                {
                    $unwind: "$areaName",
                },
                {
                    $unwind: "$boso",
                },
                {
                    $project: {
                        _id: 0,
                        cate: 0,
                        __v: 0
                    },
                },
                { '$sort': { 'createdDate': -1 } },
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
            return Notyfication.dataList(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data, HelperLib.paging.pagination(meta.total, page), HelperLib.role);
        } catch (error) {
            console.log(error);
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    dataListEx: async (model, token, _ssLogin) => {
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
            var _match4 = { $match: { id: { $ne: "" } } };
            var _matchToken = { $match: { id: { $ne: "" } } };
            //
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
                        createdDate: {
                            $gte: new Date(DateTimeLib.formatDateForAPI(model.startDate))
                        }
                    }
                };
            }
            if (model.endDate != null && model.endDate != "") {
                if (!HelperLib.validData.validDate(model.endDate))
                    return Notyfication.invalid("End date invalid f: dd-mm-yyyy");
                //  
                _match3 = {
                    $match: {
                        createdDate: {
                            $lte: new Date(DateTimeLib.formatDateForAPI(model.endDate))
                        }
                    }
                };
            }
            if (model.query != null && model.query != "") {
                _match4 = {
                    $match: {
                        bosoName: { '$regex': `.*${model.query}.*` }
                    }
                };
            }


            if (_ssLogin != null && _ssLogin.isAdmin) {
                //
            } else {
                _matchToken = {
                    $match: {
                        $expr: {
                            $eq: ["$uuid", tokenModel.uuid],
                        }
                    }
                };
            }
            //
            var rsData = await OrderModel.aggregate([
                _match,
                _match2,
                _match3,
                _match4,
                _matchToken,
                {
                    $lookup: {
                        from: "AreaConfig",
                        let: {
                            areaId: "$areaId",
                            areaName: "$areaName"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: ["$areaId", "$$areaId"],
                                }
                            },
                        },
                        {
                            "$project": {
                                areaName: 1,
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
                        areaName: "$cate.areaName"
                    }

                },
                {
                    $unwind: "$areaName",
                },
                {
                    $project: {
                        _id: 0,
                        cate: 0,
                        __v: 0
                    },
                },
                { '$sort': { 'buyDate': -1 } },
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
            for (let index = 0; index < data.length; index++) {
                let element = data[index];
                data[index].isMatched = false;
                data[index].value = "";
                data[index].kqxsVal = "";
                var boso = await BosoModel.findOne({
                    '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.getDate(element.buyDate)}' 
                     && this.areaId == ${element.areaId} && this.categoryId == '${element.bosoCategoryId}'`
                });
                if (boso != null) {
                    data[index].isMatched = boso.isMatched;
                    data[index].value = boso.value;
                    data[index].kqxsVal = boso.kqxsVal;
                }
            }
            return Notyfication.dataList(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data, HelperLib.paging.pagination(meta.total, page), HelperLib.role);
        } catch (error) {
            console.log(error);
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    buy: async (model, token) => {
        try {
            HelperLogger.logged(`buy2: ${JSON.stringify(model)}`);
            if (token == undefined || token == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            var tokenModel = SecurrityLib.getUuidByLoginToken(token);

            if (tokenModel == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            // 
            if (model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //   
            var bosoCateId = model.categoryId;
            var transactionId = model.transactionId;
            var amount = model.amount;
            if (amount < 0)
                return Notyfication.invalid("Amount invalid");
            // 
            if (bosoCateId == null || bosoCateId == "")
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var bosoCategory = await BosoCategoryModel.findOne({ id: bosoCateId });
            if (bosoCategory == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //    
            var today = HelperLib.timeNow();
            switch (model.areaId) {
                case 1:
                    if (today.getHours() > 18) {
                        today.setDate(today.getDate() + 1);
                    }
                    break;
                case 2:
                    if (today.getHours() > 17) {
                        today.setDate(today.getDate() + 1);
                    }
                    break;
                case 3:
                    if (today.getHours() > 16) {
                        today.setDate(today.getDate() + 1);
                    }
                    break;
                default:
                    break;
            }
            //  
            var itemOrder = await OrderModel.findOne({
                '$where': `this.buyDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(today)}' 
                  && this.areaId == '${model.areaId}' && this.bosoCategoryId == '${bosoCateId}' && this.uuid == '${tokenModel.uuid}'`
            });
            if (itemOrder != null)
                return Notyfication.invalid("Data is duplicate");
            //
            var bosoId = "";
            var bosoVal = "";
            var bosoPrice = 0;
            var boso = await BosoModel.findOne({ areaId: model.areaId, categoryId: bosoCateId });
            if (boso != null) {
                bosoId = boso.id;
                bosoVal = boso.bosoVal;
                bosoPrice = boso.bosoPrice;
            }
            //    

            // order
            var bosoCate = await BosoCategoryModel.findOne({ id: boso.categoryId });
            var itemModel = new OrderModel({
                uuid: tokenModel.uuid,
                areaId: model.areaId,
                bosoCategoryId: bosoCategory.id,
                bosoName: bosoCategory.name,
                bosoId: bosoId,
                bosoVal: bosoVal,
                bosoPrice: bosoPrice,
                transactionId: transactionId,
                payAmount: amount,
                details: model.details,
                buyDate: today,
                state: 1
            });
            var result = await itemModel.save();
            // history 
            buyHistoryController.LogHistory({
                uuid: tokenModel.uuid,
                orderId: result.id,
                packageName: bosoCate.name,
                payAmount: amount,
                enabled: true,
                createdDate: model.createdDate
            });
            HelperLogger.logged(`200: ${Notyfication.httMessage.NOTIFY_MESSAGE_ORDER_SUCESS}`);
            return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_ORDER_SUCESS, result);
        } catch (error) {
            HelperLogger.logged(`503: ${error}`);
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async (id) => {
        try {
            if (id == undefined || id == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var item = await OrderModel.findOne({ id: id });
            if (item == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //   
            if (item.state == 1)
                return Notyfication.invalid("Order is completed");
            //
            var resultFind = await OrderModel.findOneAndDelete(id);
            if (resultFind == null)
                return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
            //
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_DELETE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    get: async (id) => {
        var item = await OrderModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    },
    getByUuid: async (uuid) => {
        var items = await OrderModel.find({ uuid: uuid });
        if (items.length == 0) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, items);
    },
    checkBuy: async (areaId, bosoId, uuid) => {
        const order1 = await OrderModel.findOne({
            '$where': `this.buyDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(HelperLib.timeNow())}' 
             && this.areaId == ${areaId} && this.bosoId == '${bosoId}' && this.uuid == '${uuid}'`
        });
        if (order1 != null)
            return true;
        //
        return false;
    }
}

module.exports = orderController;
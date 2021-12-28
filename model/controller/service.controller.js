const HelperLib = require("../../helper/helper.library");
const SecurrityLib = require("../../helper/helper.security");
const DateTimeLib = require("../../helper/helper.datetime.library");
const Notyfication = require("../../helper/helper.notification");
const OrderModel = require("../entities/app_order");

const kqxsMatchedController = require("../controller/kqxs_matched.controller");
const LotteryResultFullModel = require("../entities/lottery_result_full");
const BosoModel = require("../entities/app_boso");
const BosoCategoryModel = require("../entities/app_boso_category");
const KqxsMatchedModel = require("../entities/app_kqxs_matched");
const AreaGeographicalModel = require("../entities/area_geographical");

var LoginModel = require("../entities/app_login");
// JK4:allen
const orderController = {
    exMatched: async(model) => {
        try {
            if (model == undefined || model == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //    
            if (!HelperLib.validData.validDate(model.executionDate))
                return Notyfication.invalid("Execution date invalid f: dd-mm-yyyy");
            // 
            var lotteryResultList = await LotteryResultFullModel.find({
                '$where': `this.ngayquay == '${model.executionDate}'`
            });
            if (lotteryResultList == undefined || lotteryResultList == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            var bosoList = await BosoModel.find({
                '$where': `this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}'`
            });
            if (bosoList == undefined || bosoList == null)
                return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
            //
            bosoList.forEach(async bsItem => {
                var isMatched = false;
                if (bosoList != null) {
                    // lotteryResultList.forEach(async element => {
                    //     console.log(element.ketquaXS);
                    // });
                }
                var lotteryResult = await KqxsMatchedModel.findOne({
                    '$where': `this.ngayquay.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}'`
                });
                // create to Matched ******************************************************************************************
                var kqxsMatched = await KqxsMatchedModel.findOne({
                    '$where': `this.ngayquay.toJSON().slice(0, 10) == '${DateTimeLib.formatDateForAPI(model.executionDate)}'`
                });
                var bosoCategory = await BosoCategoryModel.findOne({ id: bsItem.categoryId });
                //create
                if (lotteryResult == null) {
                    await KqxsMatchedModel({
                        areaId: bsItem.areaId,
                        bosoId: bsItem.id,
                        bosoName: bosoCategory.name,
                        bosoVal: bsItem.bosoVal,
                        kqxsVal: "",
                        isMatched: isMatched
                    }).save();
                } else {
                    var data = {
                        areaId: bsItem.areaId,
                        bosoId: bsItem.id,
                        bosoName: bosoCategory.name,
                        bosoVal: bsItem.bosoVal,
                        kqxsVal: "",
                        isMatched: false
                    };
                    await KqxsMatchedModel.findOneAndUpdate({ id: kqxsMatched.id }, data);
                }
            });
            return Notyfication.success(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    history: async(model, token) => {
        if (token == undefined || token == null)
            return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
        // 
        var tokenModel = SecurrityLib.getUuidByLoginToken(token);
        if (tokenModel == null)
            return Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_INVALID);
        //    
        // var whereCondition = "";
        // if (model.areaId != undefined && model.areaId != null) {
        //     whereCondition += ` && this.areaId==${model.areaId}`
        // }
        // //
        // if (model.categoryId != undefined && model.categoryId != null) {
        //     whereCondition += ` && this.bosoCategoryId == '${model.categoryId}'`
        // }

        //
        var bosoCategory = await BosoCategoryModel.findOne({ id: model.categoryId });
        var login = await LoginModel.findOne({ uuid: tokenModel.uuid });
        if (login == null)
            return Notyfication.invalid("Session has expired");
        // * V1 ******************************************************************************************************************************************************************************************************************************************************************************************
        var today = DateTimeLib.formatToServerDate(HelperLib.timeNow());
        var edate = DateTimeLib.formatToServerDate(today);
        var d = new Date(today);
        d.setDate(d.getDate() - 30);
        var tdate = DateTimeLib.formatToServerDate(d);
        var daylist = DateTimeLib.getDaysArray(new Date(tdate), new Date(edate));
        daylist.map((v) => v.toISOString().slice(0, 10)).join("");
        daylist.sort((a, b) => b - a);
        // 
        var result = [];
        for (let index = 0; index < daylist.length; index++) {
            var _day = new Date(daylist[index]);
            var isBought = false;
            var _id = "";
            var _kqxsVal = "";
            var _bosoVal = "";
            var _isBought = "";
            var _isMatched = "";
            var _textRs = "";
            var boso = await BosoModel.findOne({
                '$where': `this.categoryId == '${model.categoryId}' 
                && this.areaId == '${model.areaId}' && this.executionDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(_day)}'`
            });
            //
            //94014573525709cf  || 56be2f18e6ffeef0 || me: 80af4b97c7a213ce 
            if (boso != null) {
                _isMatched = boso.isMatched;
                var order = await OrderModel.findOne({ '$where': `this.uuid == '${tokenModel.uuid}' && this.areaId == '${model.areaId}' && this.bosoCategoryId == '${model.categoryId}' && this.buyDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(_day)}'` }, { __v: 0, _id: 0, updatedDate: 0, enabled: 0, transactionId: 0, payAmount: 0, isPaymented: 0, state: 0 });
                if (order != null) {
                    _isBought = true;
                    _bosoVal = boso.value;
                    _kqxsVal = boso.kqxsVal
                } else {
                    _bosoVal = boso.textRs;
                    _kqxsVal = boso.fValue
                }
            }
            //43f9e9259c62c55e
            result.push({
                bosoName: bosoCategory.name,
                kqxsVal: _kqxsVal,
                bosoVal: _bosoVal,
                isBought: _isBought,
                isMatched: _isMatched,
                textRs: _textRs,
                executionDate: _day,
            });
        }

        // * V2 ******************************************************************************************************************************************************************************************************************************************************************************************
        // var firstLogin = login.firstLogin;
        // //317c473b-4519-4f61-932e-7db4848af3e8
        // //var bosoList = await BosoModel.find({ '$where': `this.categoryId == '${model.categoryId}' && this.areaId == '${model.areaId}'` }, { __v: 0, _id: 0, updatedDate: 0, enabled: 0, transactionId: 0, payAmount: 0, isPaymented: 0, state: 0 }).sort({ executionDate: -1 });
        // var dataReal = await BosoModel.find({
        //         areaId: model.areaId,
        //         categoryId: model.categoryId,
        //         executionDate: { $gte: firstLogin }
        //     }, { __v: 0, _id: 0, updatedDate: 0, enabled: 0, transactionId: 0, payAmount: 0, isPaymented: 0, state: 0 }).limit(30)
        //     .sort({ executionDate: -1 });

        // for (let index = 0; index < dataReal.length; index++) {
        //     const element = dataReal[index].toObject();
        //     var _day = new Date(element.executionDate);
        //     var order = await OrderModel.findOne({ '$where': `this.uuid == '${tokenModel.uuid}' && this.areaId == '${model.areaId}' && this.bosoCategoryId == '${model.categoryId}' && this.buyDate.toJSON().slice(0, 10) == '${DateTimeLib.formatToServerDate(_day)}'` }, { __v: 0, _id: 0, updatedDate: 0, enabled: 0, transactionId: 0, payAmount: 0, isPaymented: 0, state: 0 }).sort({ executionDate: -1 });
        //     // 
        //     var isBought = false;
        //     if (order != null) {
        //         isBought = true;
        //     }
        //     result.push({
        //         id: element.id,
        //         bosoName: bosoCategory.name,
        //         kqxsVal: element.kqxsVal,
        //         bosoVal: element.value,
        //         isBought: isBought,
        //         isMatched: element.isMatched,
        //         textRs: element.textRs,
        //         executionDate: _day,
        //     });
        //     console.log(`${_day}: R::: ${element.fValue}`);
        // }
        // // du lieu co dinh 
        // var dataFake = await BosoModel.find({
        //     areaId: model.areaId,
        //     categoryId: model.categoryId,
        //     executionDate: { $lte: firstLogin }
        // }, { __v: 0, _id: 0, updatedDate: 0, enabled: 0, transactionId: 0, payAmount: 0, isPaymented: 0, state: 0 }).limit(30).sort({ executionDate: -1 });
        // for (let index = 0; index < dataFake.length; index++) {
        //     const element = dataFake[index];
        //     var _day = new Date(element.executionDate);
        //     result.push({
        //         id: element.id,
        //         bosoName: bosoCategory.name,
        //         kqxsVal: element.kqxsVal,
        //         bosoVal: element.fValue,
        //         isBought: false,
        //         isMatched: element.isMatched,
        //         textRs: element.textRs,
        //         executionDate: _day,
        //     });
        //     console.log(`${_day}: F::: ${element.fValue}`);
        // }
        return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, result);
    },
    dataList: async(req) => {
        try {
            var data = await OrderModel.find({});
            if (data == null)
                return Notyfication.notfound("Data is not found");
            //    
            return Notyfication.success_data(Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS, data);
        } catch (error) {
            return Notyfication.notservices(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE);
        }
    },
    delete: async(id) => {
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
    get: async(id) => {
        var item = await OrderModel.findOne({ id: id });
        if (item == null) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, item);
    },
    getByUuid: async(uuid) => {
        var items = await OrderModel.find({ uuid: uuid });
        if (items.length == 0) return Notyfication.notfound(Notyfication.httMessage.NOTIFY_MESSAGE_NOTFOUND);
        //
        return Notyfication.success_data(Notyfication.httMessage.success, items);
    },
    checkBuy: async(strDate, areaId, bosoId, uuid) => {
        const order1 = await OrderModel.findOne({
            '$where': `this.createdDate.toJSON().slice(0, 10) == '${strDate}' 
             && this.areaId == ${areaId} && this.bosoId == '${bosoId}' && this.uuid == '${uuid}'`
        });
        if (!order1)
            return true;
        return false;
    }
}

module.exports = orderController;
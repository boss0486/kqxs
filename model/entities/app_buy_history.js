const mongoose = require('mongoose');
var helperLib = require("../../helper/helper.library");
// JK4:allen
const app_buy_history = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    uuid: {
        type: String,
        require: true
    },
    orderId: {
        type: String,
        require: true
    },
    payAmount: {
        type: String,
        require: true
    },
    packageName: {
        type: String,
        require: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: function () {
            return helperLib.timeNow();
        }
    }
});

const BuyHistoryModel = mongoose.model("app_buy_historys", app_buy_history);
//
module.exports = BuyHistoryModel;


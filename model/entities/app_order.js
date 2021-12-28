const mongoose = require('mongoose');
var helperLib = require("../../helper/helper.library");
// JK4:allen
const app_order = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function() {
            return helperLib.newGuiId();
        }
    },
    uuid: {
        type: String,
        require: true
    },
    areaId: {
        type: Number,
        require: true
    },
    bosoCategoryId: {
        type: String,
        require: true
    },
    bosoId: {
        type: String,
        require: true
    },
    bosoName: {
        type: String,
    },
    bosoVal: {
        type: String,
        require: true
    },
    bosoPrice: {
        type: Number,
        require: true
    },
    transactionId: {
        type: String
    },
    payAmount: {
        type: Number,
        default: 0
    },
    isPaymented: {
        type: Number,
        default: 0 // cho xu ly | chua thanh toan | da thanh toan 
    },
    state: {
        type: Number,
        default: 0 // chua hoan thanh | da hoan thanh: no delete => (app for delete)
    },
    details: {
        type: String
    },
    buyDate: {
        type: Date,
        require: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: function() {
            return helperLib.timeNow();
        }
    },
    updatedDate: {
        type: Date,
        default: function() {
            return helperLib.timeNow();
        }
    }
});

const OrderModel = mongoose.model("app_orders", app_order, "app_orders");
//
module.exports = OrderModel;
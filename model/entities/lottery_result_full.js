const mongoose = require('mongoose');
var helperLib = require("../../helper/helper.library");
// JK4:allen
const lotteryResultFull = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function () {
            return helperLib.newGuiId();
        }
    },
    lotteryFullId: {
        type: String,
        require: true
    },
    lotoDau: {
        type: String,
        require: true
    },
    lotoDuoi: {
        type: String,
        require: true
    },
    ketquaXS: {
        type: String,
        require: true
    },
    tinh: {
        type: String,
        require: true
    },
    alias: {
        type: String,
        require: true
    },
    ngayquay: {
        type: String,
        require: true
    },
    matinh: {
        type: Number,
        require: true
    },
    matinhref: {
        type: Number,
        require: true
    },
    areaId: {
        type: Number,
        require: true
    }, 
    createdDate: {
        type: Date,
        default: function () {
            return helperLib.timeNow();
        }
    }
});

const LotteryResultFullModel = mongoose.model("LotteryResultFull", lotteryResultFull,"LotteryResultFull");
//
module.exports = LotteryResultFullModel;


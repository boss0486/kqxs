const mongoose = require('mongoose');
const helperLib = require("../../helper/helper.library");
// JK4:allen
const app_province = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function () {
            return helperLib.newGuiId();
        }
    },
    areaId: {
        type: String,
        require: true
    },
    provinceId: {
        type: Number,
        require: true
    },
    provinceName: {
        type: String,
        require: true
    },

    provinceAlias: {
        type: String,
        require: true
    },
    provinceIdRef: {
        type: Number
    },
    createdDate: {
        type: Date,
        default: function () {
            return helperLib.timeNow();
        }
    }
});
//
const ProvinceModel = mongoose.model("ProvinceConfig", app_province, "ProvinceConfig");
//
module.exports = ProvinceModel;
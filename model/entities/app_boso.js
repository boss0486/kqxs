const mongoose = require('mongoose');
const helperLib = require("../../helper/helper.library");
// JK4:allen
const app_boso = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function() {
            return helperLib.newGuiId();
        }
    },
    areaId: {
        type: Number,
        require: null
    },
    categoryId: {
        type: String,
        require: true
    },
    value: {
        type: String,
        default: null
    },
    kqxsVal: {
        type: String,
        default: null
    },
    isMatched: {
        type: Boolean,
        default: false
    },
    textRs: {
        type: String,
        default: null
    },
    enabled: {
        type: Boolean,
        default: false
    },
    fValue: {
        type: String,
        default: ""
    },

    executionDate: {
        type: Date,
        require: true
    },
    createdDate: {
        type: Date,
        default: function() {
            return helperLib.timeNow();
        }
    }
});
//
const BosoModel = mongoose.model("app_bosos", app_boso, "app_bosos");
//
module.exports = BosoModel;
const mongoose = require('mongoose');
const helperLib = require("../../helper/helper.library");
// JK4:allen
const app_kqxs_matched = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function() {
            return helperLib.newGuiId();
        }
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
        require: "true"
    },
    bosoName: {
        type: String,
        default: ""
    },
    bosoVal: {
        type: String,
        default: ""
    },
    kqxsVal: {
        type: String,
        default: ""
    },
    textRs: {
        type: String,
        default: ""
    },
    isMatched: {
        type: Boolean,
        default: false
    },
    enabled: {
        type: Boolean,
        default: false
    },
    executionDate: {
        type: Date,
        default: null
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

const KqxsMatchedModel = mongoose.model("app_kqxs_matcheds", app_kqxs_matched);
// 
module.exports = KqxsMatchedModel;
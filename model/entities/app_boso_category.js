const mongoose = require('mongoose');
const helperLib = require("../../helper/helper.library");
// JK4:allen
const app_boso_category = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function() {
            return helperLib.newGuiId();
        }
    },
    serviceId: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: 0,
        default: 0
    },
    icon: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    summary: {
        type: String,
        default: null
    },
    sortNo: {
        type: Number,
        default: 0
    },
    enabled: {
        type: Boolean,
        default: false
    }
});
// setter 
app_boso_category.path("name").set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
});
const BosoCategoryModel = mongoose.model("app_boso_categorys", app_boso_category);
//
module.exports = BosoCategoryModel;
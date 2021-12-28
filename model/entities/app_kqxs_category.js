const mongoose = require('mongoose');
const helperLib = require("../../helper/helper.library");
// JK4:allen
const app_kqxs_category = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function () {
            return helperLib.newGuiId();
        }
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
app_kqxs_category.path("name").set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
});

const KqxsCategoryModel = mongoose.model("app_kqxs_categorys", app_kqxs_category, "app_kqxs_categorys");
//
module.exports = KqxsCategoryModel;
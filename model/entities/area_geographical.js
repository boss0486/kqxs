const mongoose = require('mongoose');
var helperLib = require("../../helper/helper.library");
// JK4:allen
const area_geographical = new mongoose.Schema({ 
    id: {
        type: String,
        require: true,
        default: function () {
            return helperLib.newGuiId();
        }
    },
    areaId: {
        type: Number,
        default: 0
    },
    areaName: {
        type: String,
        require: true
    }
});
// setter 
area_geographical.path("areaName").set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
}); 

const Area_geographical = mongoose.model("AreaConfig", area_geographical, "AreaConfig");
//
module.exports = Area_geographical;
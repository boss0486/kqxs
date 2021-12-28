const mongoose = require('mongoose');
var helperLib = require("../../helper/helper.library");
// JK4:allen 
var app_login = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: function() {
            return helperLib.newGuiId();
        }
    },
    uuid: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    firstLogin: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
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
    }
});
// setter   
app_login.path("name").set((inputString) => inputString[0].toUpperCase() + inputString.slice(1));
app_login.path("uuid").set((inputString) => inputString.toLowerCase());
//
module.exports = mongoose.model("app_logins", app_login, "app_logins");
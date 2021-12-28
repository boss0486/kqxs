const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
var helperLib = require("../helper/helper.library");
// JK4:allen
class DateTimeLib {

    static addDays(n) {
        var t = new Date();
        t.setDate(t.getDate() + n);
        var month = "0" + (t.getMonth() + 1);
        var date = "0" + t.getDate();
        month = month.slice(-2);
        date = date.slice(-2);
        return date = date + "/" + month + "/" + t.getFullYear();
    }
    //
    static get_ClientDate(_lg, ext) {
        if (ext === undefined)
            ext = "/";
        else
            ext = "-";
        var t = new Date();
        var day = t.getDate();
        var _month = t.getMonth() + 1;
        if (day.toString().length === 1)
            day = "0" + day;
        if (_month.toString().length === 1)
            _month = "0" + _month;
        return day + ext + _month + ext + t.getFullYear();
    }
    // input datetime: '/Date(1569079409997)/
    static convertUnixTimestampToDate(strDate, seperate, languaId) {
        if (strDate !== null && strDate.length > 0) {
            let date = new Date(strDate.match(/\d+/).map(Number)[0]);
            let day = date.getDate();
            if (day.toString().length === 1)
                day = "0" + day;
            let month = date.getMonth() + 1;
            if (month.toString().length === 1)
                month = "0" + month;
            let year = date.getFullYear();
            if (seperate === undefined)
                seperate = "/";
            return day + seperate + month + seperate + year;
        }
    }
    // get time from rexgex
    static getTime(str, ext) {
        var matches = str.match(/([0-9]?[0-9]?:[0-9]?[0-9]):[0-9]?[0-9]/i);
        if (ext !== undefined) {
            matches = str.match(/([0-9]?[0-9]?:[0-9]?[0-9]):[0-9]?[0-9](\s[ap]m)/i);
        }
        var time = str;
        if (matches !== null) {
            time = matches[0];
        }
        return time;
    }
    //
    static getDate(str, ext = '-') {
        let date = new Date(str);
        let day = date.getDate();
        if (day.toString().length === 1)
            day = "0" + day;
        let month = date.getMonth() + 1;
        if (month.toString().length === 1)
            month = "0" + month;
        let year = date.getFullYear();
        return [year, month, day].join(ext);
    }

    static getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    };
    //
    static formatDateForAPI(date, ext = "-") {
        var initial = "";
        if (date.includes("/")) {
            initial = date.split(/\//);
        }
        if (date.includes("-")) {
            initial = date.split(/-/);
        }
        return [initial[2], initial[1], initial[0]].join(ext);
    }
    //
    static formatToServerDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join("-"); 
    }
    static test(date) {
         console.log(date);
    }
    //
    static getTimeZoneByLocal2(callback) {
        // timezone local
        var utcLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //
        if (utcLocal == undefined || utcLocal == "") {
            return "";
        }
        var file = "/library/script/timezones.json";
        var result = "";
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                $.each(JSON.parse(rawFile.response), function (key, val) {
                    if (val.utc != undefined && val.utc != null) {
                        $.each(val.utc, function (utcKey, utcVal) {
                            if (utcVal == utcLocal) {
                                callback(val.value);
                            }
                        });
                    }
                });
            }
        }
        rawFile.send(null);

        //var a = "";
        //const result = await $.ajax({
        //    url: "/library/script/timezones.json",
        //    dataType: 'json',
        //    async: true,
        //    data: '',
        //    success: function (data) {
        //        $.each(data, function (key, val) {
        //            console.log("------------------------------------------:" + JSON.stringify(val.value));

        //            if (val.utc != undefined && val.utc != null) {
        //                $.each(val.utc, function (utcKey, utcVal) {
        //                    console.log(JSON.stringify(utcVal));
        //                    if (utcVal == utcLocal) {
        //                        console.log("------------------------------------------:ok" + val.value);
        //                        a = val.value;
        //                    }
        //                });
        //            }
        //        });

        //    }
        //});

        //return JSON.stringify(a);

    }
    //
    static getTimeZoneByLocal() {
        // timezone local
        var utcLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //
        if (utcLocal == undefined || utcLocal == "") {
            return "";
        }
        return utcLocal;
        //var result = "";
        //$.ajax({
        //    url: "/library/script/timezones.json",
        //    async: true,
        //    success: function (data) {
        //        $.each(data, function (key, val) {
        //            var _val = val.value;
        //            if (val.utc != undefined && val.utc != null) {
        //                $.each(val.utc, function (utcKey, utcVal) {
        //                    if (utcVal == utcLocal) {
        //                        result = _val;
        //                        // return _val;
        //                    }
        //                });
        //            }
        //        });

        //    }
        //});
        //return result;
        //var a = "";
        //const result = await $.ajax({
        //    url: "/library/script/timezones.json",
        //    dataType: 'json',
        //    async: true,
        //    data: '',
        //    success: function (data) {
        //        $.each(data, function (key, val) {
        //            console.log("------------------------------------------:" + JSON.stringify(val.value));

        //            if (val.utc != undefined && val.utc != null) {
        //                $.each(val.utc, function (utcKey, utcVal) {
        //                    console.log(JSON.stringify(utcVal));
        //                    if (utcVal == utcLocal) {
        //                        console.log("------------------------------------------:ok" + val.value);
        //                        a = val.value;
        //                    }
        //                });
        //            }
        //        });

        //    }
        //});

        //return JSON.stringify(a);

    }
}
module.exports = DateTimeLib;
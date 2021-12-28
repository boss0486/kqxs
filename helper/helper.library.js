const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SecurrityLib = require('../helper/helper.security');
const RegexLib = require('../helper/helper.regex.library');
// JK4:allen
class HelperLib {
    // paging
    static paging = {
        PAGE_SIZE: 100,
        pagination(totalData = 0, page = 1) {
            var totalPage = parseInt(totalData / HelperLib.paging.PAGE_SIZE);
            if (totalData % HelperLib.paging.PAGE_SIZE > 0) {
                totalPage += 1;
            }
            if (page > totalPage && totalPage != 0)
                page = totalPage;
            //


            return {
                totalPage: totalPage,
                currentPage: page,
                pageSize: HelperLib.paging.PAGE_SIZE
            }
        }
    }
    static role = ["update", "delete"];
    // 
    static current = {
        language: "vn"
    }
    static validData = {

        validDate: function(_str) {
            if (HelperLib.current.language == "vn") {
                if (RegexLib.formatDateVN.test(_str))
                    return true;
            }
            return false;
        },
        validName: function(_str) {
            console.log(_str);
            if (HelperLib.current.language == "vn") {
                if (RegexLib.formatFName.test(_str))
                    return true;
            }
            return false;
        },
        validPhoneNumber: function(_str, ext) {
            if (HelperLib.current.language == "vn") {
                if (RegexLib.formatPhone.test(_str))
                    return true;
            }
            return false;
        },
        validEmail: function(_str) {
            if (RegexLib.frmatEmail.test(_str))
                return true;
            return false;
        },
    }
    static libCurrencies = {
        formatToCurrency: function(n, dp) {
            var s = '' + (Math.floor(n)),
                d = n % 1,
                i = s.length,
                r = '';
            while ((i -= 3) > 0) { r = ' ' + s.substr(i, 3) + r; }
            return s.substr(0, i + 3) + r + (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
        },
        convertToCurrency: function(_val) {
            if (_val != undefined && _val != '')
                return _val.replace(/\s/g, "");
            else
                return 0;
        }
    }
    static subStringText = {
            subText(_length, _text) {
                if (_text !== '' > 0 && _text.length > _length)
                    return _text.substring(0, _length);
                return _text;
            },
            subTitle(_text) {
                if (_text == undefined || _text == null)
                    return '';
                if (_text !== '' && _text.length > 65)
                    return _text.substring(0, 65);
                //
                return _text;
            },
            subSummary(_text) {
                if (_text == undefined || _text == null)
                    return '';
                if (_text !== '' && _text.length > 65)
                    return _text.substring(0, 65);
                return _text;
            },
            subFileName(_text) {
                if (_text !== undefined && _text == null)
                    return '';
                if (_text !== null && _text.length > 10)
                    return "..." + _text.substring(_text.length - 10, _text.length);
                return _text;
            }
        }
        // all ******************************************************************************************
    static formatDate(date, ext = "-") {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join(ext);
    }
    static timeNow() {
        return new Date();
    }
    static newGuiId() {
        return new SecurrityLib().generateGuiId();;
    }
    static generateToken = (_uuid) => {
        return new SecurrityLib().generateToken(_uuid);
    };
}

module.exports = HelperLib;
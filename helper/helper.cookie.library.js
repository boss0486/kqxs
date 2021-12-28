class LibCookies {
    static SetCookie(_name, _val) {
        $.cookie(_name, _val, {
            expires: 1, // Expires in 10 days
            path: '/',   // The value of the path attribute of the cookie // (Default: path of page that created the cookie).
            domain: window.location.hostname, // The value of the domain attribute of the cookie// (Default: domain of page that created the cookie).
            //secure: false // If set to true the secure attribute of the cookie
            // will be set and the cookie transmission will
            // require a secure protocol (defaults to false).
        });
    }
    static GetCookie(_name) {
        console.log("111" + window.location.hostname);
        return $.cookie(_name);
    }
    static DelCookie(_name) {
        $.cookie(_name, null, { path: '/' });
    }

    static setCookie1(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
    }

    static getCookie1(_name) {
        if (document.cookie.length > 0) {
            console.log("111");
            var c_start = document.cookie.indexOf(_name + "=");
            if (c_start != -1) {
                c_start = c_start + _name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
}
module.exports = LibCookies;
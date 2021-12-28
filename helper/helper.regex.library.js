class RegexLib {
    static formatUnicode = new RegExp("^[A-z]([A-z0-9-]*)+$");
    static formatUser = new RegExp("^[A-z]([A-z0-9]*)+$");
    static formatPin = new RegExp("^[0-9]+$");
    static formatRoll = new RegExp("^([A-z0-9 -]*)+$");
    static formatFName = new RegExp("^[a-zA-Z0-9 ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ|_]+$");
    static formatPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
    static formatEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    static formatNumber = new RegExp("^(0|[1-9][0-9]*)$");
    static formatNumberFloat = /^-?\d*(\.\d+)?$/;
    static formatCurrency = /^[0-9 ]+(?:\.[0-9]{1,8})?$/;
    static formatKeyword = new RegExp("^[a-zA-Z0-9 ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ!@#$%&*()+-?<>:,;'|_]+$");
    static formatDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/u;
    static formatNegative = new RegExp("^-?[0-9]+$");
    //var regexNegative = new RegExp("^-?[0-9]\d*(\.\d+)?$");
    static formatKeyId = /^[a-zA-Z0-9-]+$/;
    static formatDateVN = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    static formatTimeWordShit = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
    static formatTimeHhMm = /^([01]\d|2[0-3]):?([0-5]\d)$/;
    static formatTime = /^(?:0?[0-9]|1[0-2]):[0-5][0-9]:[0-5][0-9]$/;
    static formatPhone = /^((\+84)|(0[2-9]|01[2|6|8|9]))+([0-9]{8,12})\b$/;
    static formatTel = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
}
module.exports = RegexLib;
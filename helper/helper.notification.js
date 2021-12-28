class Notyfication {
    static httCode = {
        NOTIFY_CODE_SUCCESS: 200,
        NOTIFY_CODE_BAD_REQUEST: 400,
        NOTIFY_CODE_UNAUTHORIZED: 401,
        NOTIFY_CODE_PAYMENT_REQUIRED: 402,
        NOTIFY_CODE_FORBIDDEN: 403,
        NOTIFY_CODE_NOTFOUND: 404,
        //
        NOTIFY_CODE_INTERNAL_SERVER_ERROR: 500,
        NOTIFY_CODE_BAD_GATWAY: 502,
        NOTIFY_CODE_SERVICE_UNAVAILABLE: 503,
        NOTIFY_CODE_GATWAY_TIMEOUT: 504,
    };
    static httMessage = {
        NOTIFY_MESSAGE_SUCESS: "OK",
        NOTIFY_MESSAGE_ERRORS: "Internal Server Error",
        NOTIFY_MESSAGE_SERVICE_UNAVAILABLE: "Service Unavailable",
        NOTIFY_MESSAGE_INVALID: "Data invalid",
        NOTIFY_MESSAGE_NOTFOUND: "Data is not found",
        NOTIFY_MESSAGE_UNAUTHORIZED: "HTTP Error 401 - Unauthorized",
        NOTIFY_MESSAGE_BAD_REQUEST: "HTTP Error 400 - Bad request",
        //
        NOTIFY_MESSAGE_CREATE_SUCESS: "Create success",
        NOTIFY_MESSAGE_UPDATE_SUCESS: "Update success",
        NOTIFY_MESSAGE_DELETE_SUCESS: "Delete success",
        //
        NOTIFY_MESSAGE_ORDER_SUCESS: "Order success",
        NOTIFY_MESSAGE_ORDER_CANCELED: "Order is canceled"
    };
    static success = async(_message = "") => {
        return {
            status: Notyfication.httCode.NOTIFY_CODE_SUCCESS,
            message: _message
        };
    };
    static dataList = async(_message = "", _data, _paging, _role) => {

        return {
            status: Notyfication.httCode.NOTIFY_CODE_SUCCESS,
            message: Notyfication.httMessage.NOTIFY_MESSAGE_SUCESS,
            data: _data,
            paging: _paging,
            role: _role
        };
    };
    static success_data = async(_message = "", _data) => {

        return {
            status: Notyfication.httCode.NOTIFY_CODE_SUCCESS,
            message: _message,
            data: _data
        };
    };
    static errors = async(_message = "") => {
        return {
            status: Notyfication.httCode.NOTIFY_CODE_INTERNAL_SERVER_ERROR,
            message: _message
        };
    };
    static notfound = async(_message = "") => {
        return {
            status: Notyfication.httCode.NOTIFY_CODE_NOTFOUND,
            message: _message
        }
    };
    static invalid = async(_message = "") => {
        return {
            status: Notyfication.httCode.NOTIFY_CODE_BAD_REQUEST,
            message: _message
        }
    };
    static notservices = async(_message = "") => {
        return {
            status: Notyfication.httCode.NOTIFY_CODE_SERVICE_UNAVAILABLE,
            message: Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE
        }
    }
    static unAuthorized = async(_message = "", _direct) => {
        return {
            status: Notyfication.httCode.NOTIFY_CODE_UNAUTHORIZED,
            message: Notyfication.httMessage.NOTIFY_MESSAGE_UNAUTHORIZED + _message,
            url: _direct
        }
    }
}

module.exports = Notyfication;
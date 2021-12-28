const winston = require('winston');
const path = require('path');
const DateTimeLib = require("../helper/helper.datetime.library");

class HelperLogger {
    static logged(_message, _type = 0) {
        const logger = HelperLogger.winstonLog();
        if (_type == 0)
            logger.info(_message);
        else
            logger.error(_message);
    };
    static winstonLog(_type = "info") {
        return winston.createLogger({
            // format của log được kết hợp thông qua format.combine
            format: winston.format.combine(
                winston.format.splat(),
                // Định dạng time cho log
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                // thêm màu sắc
                //winston.format.colorize(),
                // thiết lập định dạng của log
                winston.format.printf(
                    log => {
                        // nếu log là error hiển thị stack trace còn không hiển thị message của log 
                        if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                        return `[${log.timestamp}] [${log.level}] ${log.message}`;
                    },
                ),
            ),
            transports: [
                // hiển thị log thông qua console
                //new winston.transports.Console(),
                // Thiết lập ghi các errors vào file 
                new winston.transports.File({
                    level: _type,
                    filename: path.join(__dirname, `./logged/logged-${DateTimeLib.formatToServerDate(new Date())}.log`)
                })
            ],
        });
    }
}
module.exports = HelperLogger;
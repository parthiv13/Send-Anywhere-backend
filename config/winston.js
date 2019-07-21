const winston = require('winston');

var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.simple()
    }
};

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.label({ label: 'Voila' }),
        winston.format.timestamp(),
        myFormat
    ),
    defaultMedia: { service: 'user-service' },
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: './logs/info.log',
            level: 'info'
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './logs/exceptions.log' })
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
}

module.exports = logger; 
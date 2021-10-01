const winston = require("winston");

const logger = winston.createLogger({
	transports: [
		new winston.transports.File({ filename: "logger.log" }),
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				winston.format.simple()
			),
		}),
	],
	exceptionHandlers: [
		new winston.transports.File({ filename: "exceptions.log" }),
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				winston.format.simple()
			),
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({ filename: "rejections.log" }),
	],
});

module.exports = logger;

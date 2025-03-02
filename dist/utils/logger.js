"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info', // minimum log level
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(), // logs to the console
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }), // error logs
        new winston_1.transports.File({ filename: 'logs/combined.log' }) // all logs
    ],
});
exports.default = logger;

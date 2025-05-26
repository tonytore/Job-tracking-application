"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import { config } from "../config/index";
//Define log level
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define colors for each level
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
// tell winston to use our custom colors
winston_1.default.addColors(colors);
// Create format for console output
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Create format for file output (JSON)
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.json());
// Determine log level based on NODE_ENV
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "info";
};
// Define log directory and fields
const logDir = "logs";
const errorLog = path_1.default.join(logDir, "error.log");
const combinedLog = path_1.default.join(logDir, "combined.log");
// Create logs directory if it doesn't exist
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// Create the logger instance
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format: fileFormat,
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({
            filename: errorLog,
            level: "error",
            format: fileFormat,
        }),
        new winston_1.default.transports.File({ filename: combinedLog, format: fileFormat }),
    ],
});
// If we're in production, log to the console
if (process.env.NODE_ENV === "production") {
    logger.add(new winston_1.default.transports.Console({
        format: format,
    }));
}
// Create a stream object for morgan middleware
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
exports.default = logger;

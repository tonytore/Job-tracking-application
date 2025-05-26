"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
const logger_1 = __importDefault(require("./logger"));
class AppError extends Error {
    constructor(statusCode, message, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        this.stack = stack;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const handleError = (error) => {
    if (error instanceof AppError) {
        return {
            status: "error",
            statusCode: error.statusCode,
            message: error.message,
        };
    }
    // Programming or other unknown error: don't leak error details
    logger_1.default.error(error);
    return {
        status: "error",
        statusCode: 500,
        message: "Something went wrong",
    };
};
exports.handleError = handleError;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const index_1 = require("../config/index");
const successResponse = (data) => ({
    status: "success",
    data,
});
exports.successResponse = successResponse;
const errorResponse = (message, error) => ({
    status: "error",
    message,
    ...(index_1.config.env === "development" && error ? { error } : {}),
});
exports.errorResponse = errorResponse;

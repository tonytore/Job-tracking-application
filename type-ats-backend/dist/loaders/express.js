"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../routes/index"));
const express_1 = __importDefault(require("express"));
const index_2 = require("../config/index");
const response_1 = require("../utils/response");
const error_1 = require("../utils/error");
const logger_1 = __importDefault(require("../utils/logger"));
const expressLoader = async (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)(index_2.config.env === "development" ? "dev" : "combined"));
    app.use((req, res) => {
        res
            .status(404)
            .json((0, response_1.errorResponse)(`Can't find ${req.originalUrl} on this server!`, {}));
    });
    app.use((error, req, res, next) => {
        logger_1.default.error(error.stack || error.message);
        const errorDetails = (0, error_1.handleError)(error);
        res
            .status(errorDetails.statusCode)
            .json((0, response_1.errorResponse)(errorDetails.message, error));
    });
    app.get("/", (req, res) => {
        res.send("ATS Backend API is running!");
    });
    // Use the API routes
    app.get("/", (req, res) => {
        res.send("ATS Backend API is running!");
    });
    app.use("/api/v1", index_1.default);
    return app;
};
exports.default = expressLoader;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const db_1 = require("../db/db");
const logger_1 = __importDefault(require("../utils/logger"));
const initialize = async (app) => {
    try {
        // initialize database
        await db_1.db.$connect();
        logger_1.default.info("Database connected");
        const PORT = process.env.PORT || "development";
        // start server
        // app.listen(config.port, () => {
        //   logger.info(`Server running on port http://localhost:${config.port}`);
        //   logger.info(`Environment: ${process.env.NODE_ENV}`);
        // });
    }
    catch (error) {
        logger_1.default.error(error);
        process.exit(1);
    }
};
exports.initialize = initialize;

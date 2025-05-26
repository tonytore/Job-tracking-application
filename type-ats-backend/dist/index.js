"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const index_1 = __importDefault(require("./loaders/index"));
const logger_1 = __importDefault(require("./utils/logger"));
const exitHandler = (server) => {
    if (server) {
        server.close(() => {
            logger_1.default.info("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unExpectedErrorHandler = (server) => {
    return function (error) {
        logger_1.default.error(error);
        exitHandler(server);
    };
};
const startServer = async () => {
    const app = (0, express_1.default)();
    await (0, index_1.default)(app);
    const httpServer = http_1.default.createServer(app);
    const server = httpServer.listen(config_1.default.port, () => {
        logger_1.default.info(`Server running on port http://localhost:${config_1.default.port}`);
    });
    process.on("uncaughtException", unExpectedErrorHandler(server));
    process.on("unhandledRejection", unExpectedErrorHandler(server));
    process.on("SIGTERM", () => {
        logger_1.default.info("SIGTERM received");
        if (server) {
            server.close();
        }
    });
};
startServer();

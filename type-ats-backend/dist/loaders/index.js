"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaDb_1 = require("./prismaDb");
const express_1 = __importDefault(require("./express"));
const logger_1 = __importDefault(require("../utils/logger"));
const loaders = async (app) => {
    await (0, prismaDb_1.initialize)(app);
    logger_1.default.info("Prisma initialized"); // fixed the wrong log ("mongoose" → "Prisma")
    await (0, express_1.default)(app);
    logger_1.default.info("Express initialized");
};
exports.default = loaders;

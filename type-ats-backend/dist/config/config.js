"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const index_1 = __importDefault(require("../validations/index"));
const { value: envVars, error } = index_1.default.envVarsSchema.validate(process.env);
if (error) {
    logger_1.default.error(`Config validation error: ${error.message}`);
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = {
    port: envVars.PORT,
    env: envVars.NODE_ENV,
    dbUrl: envVars.DATABASE_URL,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVarsSchema = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const joi_1 = __importDefault(require("joi"));
exports.envVarsSchema = joi_1.default
    .object({
    PORT: joi_1.default.number().positive().default(3000),
    NODE_ENV: joi_1.default
        .string()
        .valid("development", "production")
        .default("development"),
    DATABASE_URL: joi_1.default
        .string()
        .required()
        .description("Database connection string"),
})
    .unknown();

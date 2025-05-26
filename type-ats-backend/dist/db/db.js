"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../config/index");
// Prevent multiple instances during development
const prismaClient = new client_1.PrismaClient({
    log: index_1.config.env === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
});
// Use existing instance in development or create a new one
exports.db = global.prisma ?? prismaClient;
if (index_1.config.env !== "production") {
    global.prisma = exports.db;
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationRoutes_1 = __importDefault(require("./applicationRoutes"));
const jobRoutes_1 = __importDefault(require("./jobRoutes"));
const router = (0, express_1.Router)();
// Mount specific routers under their respective paths
router.use("/applications", applicationRoutes_1.default);
router.use("/jobs", jobRoutes_1.default);
exports.default = router;

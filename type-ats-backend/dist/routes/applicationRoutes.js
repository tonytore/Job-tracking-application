"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = __importDefault(require("../controllers/applicationController")); // Correct import path
const router = (0, express_1.Router)();
/**
 * POST /applications - Submit a new job application.
 */
router.post("/", applicationController_1.default.submitApplication);
/**
 * GET /applications - Get all applications (for admin/testing).
 */
router.get("/", applicationController_1.default.getAllApplications);
exports.default = router;

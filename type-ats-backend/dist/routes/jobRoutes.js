"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = __importDefault(require("../controllers/jobController")); // Correct import path
const router = (0, express_1.Router)();
/**
 * POST /jobs - Create a new job posting (for admin).
 */
router.post("/", jobController_1.default.createJobPosting);
exports.default = router;

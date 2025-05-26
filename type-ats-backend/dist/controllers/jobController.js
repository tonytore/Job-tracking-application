"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Import the new utility
const jobService_1 = __importDefault(require("../service/jobService")); // Correct import path
/**
 * Controller for handling job posting requests.
 */
const jobController = {
    /**
     * Handles the creation of a new job posting.
     * @param req The Express request object.
     * @param res The Express response object.
     */
    createJobPosting: (0, catchAsync_1.default)(async (req, res) => {
        const { title, description, requiredSkills, department, closingDate } = req.body;
        // Basic validation
        if (!title ||
            !description ||
            !requiredSkills ||
            !department ||
            !closingDate) {
            res.status(400).json({ message: "Missing job posting fields" });
            return;
        }
        // The service layer is now responsible for throwing errors,
        // which catchAsync will then pass to the global error handler.
        const job = await jobService_1.default.createJobPosting({
            title,
            description,
            requiredSkills,
            department,
            closingDate,
        });
        res.status(201).json({ message: "Job created", job });
    }),
};
exports.default = jobController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const applicantService_1 = __importDefault(require("../service/applicantService")); // Correct import path
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Import the new utility
/**
 * Controller for handling job application requests.
 */
const applicationController = {
    /**
     * Handles the submission of a new job application.
     * @param req The Express request object.
     * @param res The Express response object.
     */
    submitApplication: (0, catchAsync_1.default)(async (req, res) => {
        const { fullName, email, yearsOfExperience, highestEducation, coverLetter, jobPostingId, } = req.body;
        // Basic validation
        if (!fullName ||
            !email ||
            !yearsOfExperience ||
            !highestEducation ||
            !jobPostingId) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        // The service layer is now responsible for throwing errors,
        // which catchAsync will then pass to the global error handler.
        const application = await applicantService_1.default.submitApplication({
            fullName,
            email,
            yearsOfExperience,
            highestEducation,
            coverLetter,
            jobPostingId: parseInt(jobPostingId, 10), // Ensure jobPostingId is a number
        });
        res.status(201).json({ message: "Application submitted", application });
    }),
    /**
     * Handles fetching all job applications.
     * @param req The Express request object.
     * @param res The Express response object.
     */
    getAllApplications: (0, catchAsync_1.default)(async (req, res) => {
        // The service layer is now responsible for throwing errors,
        // which catchAsync will then pass to the global error handler.
        const applications = await applicantService_1.default.getAllApplications();
        res.status(200).json(applications);
    }),
};
exports.default = applicationController;

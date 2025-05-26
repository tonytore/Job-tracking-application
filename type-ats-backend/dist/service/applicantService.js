"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db/db"); // Import the Prisma client instance
/**
 * Service layer for handling job application business logic and database interactions.
 */
const applicationService = {
    /**
     * Submits a new job application.
     * Handles applicant upsert and application creation.
     * @param data The application data.
     * @returns The created application object.
     * @throws Throws an error if job posting is not found.
     */
    submitApplication: async (data) => {
        const { fullName, email, yearsOfExperience, highestEducation, coverLetter, jobPostingId, } = data;
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");
        // Use upsert to handle both new and existing applicants
        const applicant = await db_1.db.applicant.upsert({
            where: { email },
            create: { firstName, lastName, email },
            update: { firstName, lastName }, // Update if applicant already exists
        });
        // Check if the job posting exists
        const jobPosting = await db_1.db.jobPosting.findUnique({
            where: { id: jobPostingId },
        });
        if (!jobPosting) {
            // Throw a standard Error, which catchAsync will pass to the global error handler.
            // The global error handler can then decide how to respond (e.g., 404).
            const error = new Error("Job posting not found");
            error.statusCode = 404; // Add a custom property for HTTP status if needed by global handler
            throw error;
        }
        // Create the application record
        const application = await db_1.db.application.create({
            data: {
                jobPostingId,
                applicantId: applicant.id,
                yearsOfExperience: parseInt(yearsOfExperience, 10), // Parse to integer
                highestEducation,
                coverLetter,
            },
        });
        return application;
    },
    /**
     * Fetches all job applications with associated applicant and job posting details.
     * @returns An array of application objects.
     */
    getAllApplications: async () => {
        const applications = await db_1.db.application.findMany({
            include: { applicant: true, jobPosting: true }, // Include related data
        });
        return applications;
    },
};
exports.default = applicationService;

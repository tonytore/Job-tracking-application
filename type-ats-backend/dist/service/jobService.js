"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db/db"); // Import the Prisma client instance
/**
 * Service layer for handling job posting business logic and database interactions.
 */
const jobService = {
    /**
     * Creates a new job posting.
     * @param data The job posting data.
     * @returns The created job posting object.
     */
    createJobPosting: async (data) => {
        const { title, description, requiredSkills, department, closingDate } = data;
        const job = await db_1.db.jobPosting.create({
            data: {
                title,
                description,
                requiredSkills,
                department,
                closingDate: new Date(closingDate), // Parse to Date object
            },
        });
        return job;
    },
};
exports.default = jobService;

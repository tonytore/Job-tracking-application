"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handledbError = void 0;
const db_1 = require("../db/db"); // Import the specific error type
/**
 * Handles database errors (specifically Prisma ClientKnownRequestError)
 * and sends appropriate HTTP responses. This function is intended to be called
 * by the global error handler in app.ts when a Prisma error is caught.
 * @param error The error object.
 * @param res The Express response object.
 */
const handledbError = (error, res) => {
    // Check if the error is a Prisma ClientKnownRequestError
    if (error instanceof db_1.db.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002": // Unique constraint violation
                res
                    .status(409)
                    .json({ message: "Record already exists", error: error.message });
                break;
            case "P2019": // Input validation error
                res
                    .status(400)
                    .json({ message: "Invalid input data", error: error.message });
                break;
            case "P2025": // Record not found
                res
                    .status(404)
                    .json({ message: "Record not found", error: error.message });
                break;
            default:
                // Generic 500 for other Prisma errors
                res
                    .status(500)
                    .json({ message: "Internal server error", error: error.message });
        }
    }
    else {
        // For non-Prisma errors, log and send a generic 500
        console.error("Non-database error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.handledbError = handledbError;

import path from "path";
// Removed: dotenv.config({ path: ".env" }); // This is handled by 'ts-node -r dotenv/config' in package.json or src/index.ts

import cors from "cors";
import morgan from "morgan";
import apiRoutes from "../routes/index"; // Main API router
import express, { NextFunction, Request, Response } from "express";

import { config } from "../config/index";

import { errorResponse } from "../utils/response"; // Assuming you have this utility
import { handleError } from "../utils/error"; // Assuming you have this utility

import logger from "../utils/logger";

const expressLoader = async (app: any) => {
  // 1. Core Middleware
  app.use(express.json()); // Body parser for JSON requests
  app.use(cors()); // Enable CORS for all origins
  app.use(morgan(config.env === "development" ? "dev" : "combined")); // HTTP request logger

  // 2. Define your specific routes
  // Root route for API status check
  app.get("/", (req: Request, res: Response) => {
    res.send("ATS Backend API is running!");
  });

  // Mount your main API routes under /api/v1
  app.use("/api/v1", apiRoutes);

  // Serve Static Files from the 'uploads' directory
  // This allows clients to access uploaded files directly via URL (e.g., http://localhost:PORT/uploads/your-cv.pdf)
  // `path.join(__dirname, '../../uploads')` constructs the path:
  // `__dirname` is `src/loaders`
  // `../` goes up to `src`
  // `../` goes up to the project root
  // `uploads` goes into the uploads folder
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

  // 3. 404 Not Found Handler (MUST be after all specific routes)
  // This middleware will only be reached if no other route has handled the request.
  app.use((req: Request, res: Response) => {
    res
      .status(404)
      .json(errorResponse(`Can't find ${req.originalUrl} on this server!`, {}));
  });

  // 4. Global Error Handler (MUST be the very last middleware)
  // This catches any errors thrown by previous middleware or route handlers.
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(error.stack || error.message); // Log the full error stack or message
    const errorDetails = handleError(error); // Process the error to get status code and message

    res
      .status(errorDetails.statusCode)
      .json(errorResponse(errorDetails.message, error));
  });

  return app;
};

export default expressLoader;

// src/routes/applicationRoutes.ts
import { Router } from "express";
import applicationController from "../controllers/applicationController";
import upload from "../middleware/uploadMiddleware"; // Correct path to your 'upload' instance

const router = Router();

/**
 * POST /api/v1/applications - Submit a new job application.
 * This route handles file uploads (CV and Profile Picture) and application data.
 * It uses the 'upload.fields' multer middleware to parse multipart/form-data.
 */
router.post(
  "/", // This matches your frontend's POST to /api/v1/applications
  upload.fields([
    // Use the 'upload' instance from uploadMiddleware.ts
    { name: "cvFile", maxCount: 1 },
    { name: "profilePictureFile", maxCount: 1 },
  ]),
  applicationController.submitApplication
);

// Add other application-related routes here if you have them, e.g.:
router.get("/", applicationController.getAllApplications);
router.get("/job/:jobPostingId", applicationController.getApplicationsForJob);

export default router;

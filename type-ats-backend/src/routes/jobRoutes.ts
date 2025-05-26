// src/routes/jobRoutes.ts
import { Router } from "express";
import jobController from "../controllers/jobController";
import { authenticate } from "../middleware/authMiddleware"; // Assuming you want this protected

const router = Router();

// Public route for everyone to view jobs
router.get("/", jobController.getAllJobPostings);

// IMPORTANT: Place specific static routes BEFORE dynamic routes with parameters
router.get("/analytics", authenticate, jobController.getJobAnalytics); // <-- MOVE THIS ROUTE UP!

router.get("/:id", jobController.getJobPostingById); // <-- This should now be AFTER /analytics

// Protected routes, only for RECRUITER or ADMIN
router.post("/", authenticate, jobController.createJobPosting);
router.put("/:id", authenticate, jobController.updateJobPosting);
router.delete("/:id", authenticate, jobController.deleteJobPosting);

export default router;

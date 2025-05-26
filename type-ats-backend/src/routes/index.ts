// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./authRoutes";
import applicationRoutes from "./applicationRoutes";
import jobRoutes from "./jobRoutes"; // Assuming your job posting routes are called jobRoutes

const router = Router();

router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);
router.use("/jobs", jobRoutes);

export default router;

// src/routes/authRoutes.ts
import { Router } from "express";
import authController from "../controllers/authController"; // We'll create this controller next

const router = Router();

/**
 * POST /auth/register - User registration endpoint.
 * Allows new users to create an account.
 */
router.post("/register", authController.register);

/**
 * POST /auth/login - User login endpoint.
 * Allows existing users to log in and receive a JWT.
 */
router.post("/login", authController.login);

export default router;

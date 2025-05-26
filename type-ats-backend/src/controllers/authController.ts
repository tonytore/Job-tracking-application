// src/controllers/authController.ts
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync"; // Assuming you have this utility
import authService from "../service/authService"; // We'll create this service next

/**
 * Controller for handling user authentication requests (registration and login).
 */
const authController = {
  /**
   * Handles user registration.
   * Expects 'email' and 'password' in the request body.
   */
  register: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required for registration." });
    }

    const newUser = await authService.registerUser(email, password);
    res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser.id, email: newUser.email },
    });
  }),

  /**
   * Handles user login.
   * Expects 'email' and 'password' in the request body.
   */
  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required for login." });
    }

    // The login service returns the user and the JWT token
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful!",
      user: { id: user.id, email: user.email },
      token,
    });
  }),
};

export default authController;

// src/service/authService.ts
import { db } from "../db/db"; // Your Prisma client instance
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For JWT generation
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables.");
  process.exit(1); // Exit if critical env var is missing
}

const authService = {
  /**
   * Registers a new user.
   * @param email User's email.
   * @param password User's plain text password.
   * @returns The newly created user object.
   * @throws Error if user with email already exists.
   */
  registerUser: async (email: string, password: string) => {
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      const error = new Error("User with this email already exists.");
      (error as any).statusCode = 409; // Conflict
      throw error;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the user in the database
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return newUser;
  },

  /**
   * Logs in a user.
   * @param email User's email.
   * @param password User's plain text password.
   * @returns An object containing the user and the JWT token.
   * @throws Error if invalid credentials.
   */
  loginUser: async (email: string, password: string) => {
    // Find the user by email
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials.");
      (error as any).statusCode = 401; // Unauthorized
      throw error;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials.");
      (error as any).statusCode = 401; // Unauthorized
      throw error;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload for the token
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return { user, token };
  },
};

export default authService;

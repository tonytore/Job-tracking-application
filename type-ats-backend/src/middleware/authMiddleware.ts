// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import dotenv from "dotenv"; // Import dotenv to load environment variables

dotenv.config(); // Load environment variables from .env file

// Extend the Request object to include a user property after authentication
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string /* any other user data from JWT payload */;
      };
    }
  }
}

/**
 * Authentication middleware.
 * This middleware reads a JWT from the Authorization header,
 * verifies its validity, and attaches the decoded user information to `req.user`.
 *
 * If authentication fails, it sends a 401 Unauthorized response.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authentication failed: No Bearer token provided.");
    return res
      .status(401)
      .json({ message: "Authentication token required (Bearer <token>)." });
  }

  const token = authHeader.split(" ")[1]; // Get the token part after 'Bearer '

  // 2. Verify the token's validity
  try {
    // Ensure JWT_SECRET is loaded from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res
        .status(500)
        .json({ message: "Server configuration error: JWT secret missing." });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      [key: string]: any;
    }; // Cast to your expected payload type

    // 3. Attach user information to `req.user`
    req.user = { id: decoded.id, email: decoded.email }; // Populate req.user with data from the token

    console.log("Authentication successful. User:", req.user.email);
    next(); // Proceed to the next middleware/route handler
  } catch (err: any) {
    // Handle specific JWT errors
    if (err instanceof jwt.TokenExpiredError) {
      console.log("Authentication failed: Token expired.");
      return res.status(401).json({ message: "Unauthorized: Token expired." });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      console.log("Authentication failed: Invalid token.");
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    // Catch any other unexpected errors during verification
    console.error(
      "Authentication failed: Unexpected error during token verification.",
      err
    );
    return res
      .status(500)
      .json({ message: "An unexpected authentication error occurred." });
  }
};

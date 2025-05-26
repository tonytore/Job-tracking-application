// src/utils/AppError.ts
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Operational errors are expected and handled
    Error.captureStackTrace(this, this.constructor);
  }
}

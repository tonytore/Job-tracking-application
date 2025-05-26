import logger from "./logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
    public stack: string = ""
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: Error | AppError) => {
  if (error instanceof AppError) {
    return {
      status: "error",
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  // Programming or other unknown error: don't leak error details
  logger.error(error);
  return {
    status: "error",
    statusCode: 500,
    message: "Something went wrong",
  };
};

import { config } from "../config/index";

interface SuccessResponse {
  status: "success";
  message?: string;
  data: any;
}

interface ErrorResponse {
  status: "error";
  message: string;
  error?: any;
}

export const successResponse = (data: any): SuccessResponse => ({
  status: "success",
  data,
});

export const errorResponse = (message: string, error?: any): ErrorResponse => ({
  status: "error",
  message,
  ...(config.env === "development" && error ? { error } : {}),
});

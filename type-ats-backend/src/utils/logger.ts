import winston from "winston";
import path from "path";
import fs from "fs";
// import { config } from "../config/index";

//Define log level
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// tell winston to use our custom colors
winston.addColors(colors);

// Create format for console output
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create format for file output (JSON)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json()
);

// Determine log level based on NODE_ENV
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

// Define log directory and fields
const logDir = "logs";
const errorLog = path.join(logDir, "error.log");
const combinedLog = path.join(logDir, "combined.log");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: errorLog,
      level: "error",
      format: fileFormat,
    }),
    new winston.transports.File({ filename: combinedLog, format: fileFormat }),
  ],
});

// If we're in production, log to the console
if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.Console({
      format: format,
    })
  );
}

// Create a stream object for morgan middleware
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;

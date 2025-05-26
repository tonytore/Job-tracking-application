import { PrismaClient } from "@prisma/client";
import { config } from "../config/index";

// Use a global variable to prevent multiple Prisma instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single Prisma client instance
const prismaClient = new PrismaClient({
  log:
    config.env === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"], // Log queries in development
});

export const db = globalThis.prisma ?? prismaClient;

if (config.env !== "production") {
  globalThis.prisma = db;
}

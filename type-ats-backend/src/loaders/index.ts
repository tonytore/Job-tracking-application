import fs from "fs";
import { initialize } from "./prismaDb";
import expressLoader from "./express";
import logger from "../utils/logger";

const loaders = async (app: any) => {
  await initialize(app);
  logger.info("Prisma initialized"); // fixed the wrong log ("mongoose" → "Prisma")

  await expressLoader(app);
  logger.info("Express initialized");
};

export default loaders;

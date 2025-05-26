import { config } from "../config";
import { db } from "../db/db";
import logger from "../utils/logger";
export const initialize = async (app: any) => {
  try {
    // initialize database
    await db.$connect();
    logger.info("Database connected");

    const PORT = process.env.PORT || "development";

    // start server
    // app.listen(config.port, () => {
    //   logger.info(`Server running on port http://localhost:${config.port}`);
    //   logger.info(`Environment: ${process.env.NODE_ENV}`);
    // });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

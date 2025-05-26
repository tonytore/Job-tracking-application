import http from "http";
import express from "express";
import config from "./config/config";
import loader from "./loaders/index";
import logger from "./utils/logger";

const exitHandler = (server: any) => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server: any) => {
  return function (error: any) {
    logger.error(error);
    exitHandler(server);
  };
};

const startServer = async () => {
  const app = express();
  await loader(app);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`Server running on port http://localhost:${config.port}`);
  });

  process.on("uncaughtException", unExpectedErrorHandler(server));
  process.on("unhandledRejection", unExpectedErrorHandler(server));
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    if (server) {
      server.close();
    }
  });
};

startServer();

import logger from "../utils/logger";
import envValidation from "../validations/index";

const { value: envVars, error } = envValidation.envVarsSchema.validate(
  process.env
);

if (error) {
  logger.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  port: envVars.PORT as number,
  env: envVars.NODE_ENV as "development" | "production",
  jwtSecret: envVars.JWT_SECRET as string,
};

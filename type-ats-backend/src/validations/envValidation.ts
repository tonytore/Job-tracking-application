import joi from "joi";

export const envVarsSchema = joi
  .object({
    PORT: joi.number().positive().default(3000),
    NODE_ENV: joi
      .string()
      .valid("development", "production")
      .default("development"),
    JWT_SECRET: joi.string(),
  })
  .unknown();

'use strict';

module.exports = {
  DB_DEBUG: process.env.DB_DEBUG,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USER: process.env.DB_USER,
  DRAIN_TIMEOUT: 60000,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: 8647,
  SALT_ROUNDS: 10,
  SLACK_URL: process.env.SLACK_URL,
  STRIPE_API_KEY: process.env.STRIPE_API_KEY
};

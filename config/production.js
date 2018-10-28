'use strict';

const Package = require('../package.json');

module.exports = {
  DB_DEBUG: process.env.DB_DEBUG,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DRAIN_TIMEOUT: 60000,
  ENVIRONMENT: 'production',
  GOOD_EVENTS: { log: '*', error: '*', request: '*', response: '*' },
  JWT_SECRET: process.env.JWT_SECRET,
  METRICS_MOCK: false,
  PORT: 8647,
  SALT_ROUNDS: 10,
  SLACK_URL: process.env.SLACK_URL,
  STATSD_HOST: process.env.STATSD_HOST,
  STRIPE_API_KEY: process.env.STRIPE_API_KEY,
  VERSION: process.env.VERSION || Package.version
};

'use strict';

module.exports = {
  DB_DEBUG: process.env.DB_DEBUG,
  DB_HOST: 'localhost',
  DB_NAME: 'pokedex_tracker',
  DB_PASSWORD: '',
  DB_PORT: process.env.DB_PORT || 9876,
  DB_USER: 'pokedex_tracker_admin',
  DRAIN_TIMEOUT: 5000,
  ENVIRONMENT: 'development',
  GOOD_EVENTS: { log: '*', error: '*', request: '*', response: '*' },
  JWT_SECRET: 's3cret',
  METRICS_MOCK: false,
  PORT: 8647,
  SALT_ROUNDS: 10,
  SLACK_URL: '',
  STATSD_HOST: 'localhost',
  VERSION: 'development'
};

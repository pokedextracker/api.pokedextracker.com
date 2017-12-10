'use strict';

module.exports = {
  DB_DEBUG: process.env.DB_DEBUG,
  DB_NAME: 'pokedex_tracker',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_PASSWORD: '',
  DB_USER: 'pokedex_tracker_user',
  DRAIN_TIMEOUT: 5000,
  JWT_SECRET: 's3cret',
  PORT: 8647,
  SALT_ROUNDS: 10,
  SLACK_URL: '',
  STRIPE_API_KEY: process.env.STRIPE_API_KEY
};

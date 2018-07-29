'use strict';

module.exports = {
  DB_DEBUG: process.env.DB_DEBUG,
  DB_NAME: 'pokedex_tracker',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_PASSWORD: '',
  DB_USER: 'pokedex_tracker_user',
  DRAIN_TIMEOUT: 5000,
  GOOD_EVENTS: {},
  JWT_SECRET: 's3cret',
  JWT_TEST: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDgsInVzZXJuYW1lIjoicm1qIiwiZnJpZW5kX2NvZGUiOm51bGwsImRhdGVfY3JlYXRlZCI6IjIwMTYtMDMtMTlUMjI6MDU6NTkuMjE1WiIsImRhdGVfbW9kaWZpZWQiOiIyMDE2LTAzLTE5VDIyOjA1OjU5LjIxNVoiLCJpYXQiOjE0NTg0MjUxNzl9.HTJPG_tC4L91n4bnfY41aGk2atLm2iTnFiMEYCcsm4A',
  PASSWORD_HASH: '$2a$10$GzqLUEOc3Uk6cB2wX.ajj.jUPr9Nx.JPKZ0CukgG29xaWX1upFSna',
  PASSWORD_VALUE: 'password',
  PORT: 8647,
  SALT_ROUNDS: 10,
  SLACK_URL: '',
  STRIPE_API_KEY: process.env.STRIPE_API_KEY
};

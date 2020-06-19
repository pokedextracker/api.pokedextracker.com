'use strict';

module.exports = {
  DB_DEBUG: process.env.DB_DEBUG,
  DB_HOST: 'localhost',
  DB_NAME: 'pokedex_tracker',
  DB_PASSWORD: '',
  DB_PORT: 5432,
  DB_USER: 'pokedex_tracker_admin',
  DRAIN_TIMEOUT: 5000,
  ENVIRONMENT: 'test',
  GOOD_EVENTS: {},
  JWT_SECRET: 's3cret',
  JWT_TEST: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDgsInVzZXJuYW1lIjoicm1qIiwiZnJpZW5kX2NvZGUiOm51bGwsImRhdGVfY3JlYXRlZCI6IjIwMTYtMDMtMTlUMjI6MDU6NTkuMjE1WiIsImRhdGVfbW9kaWZpZWQiOiIyMDE2LTAzLTE5VDIyOjA1OjU5LjIxNVoiLCJpYXQiOjE0NTg0MjUxNzl9.HTJPG_tC4L91n4bnfY41aGk2atLm2iTnFiMEYCcsm4A',
  METRICS_MOCK: true,
  PASSWORD_HASH: '$2a$10$GzqLUEOc3Uk6cB2wX.ajj.jUPr9Nx.JPKZ0CukgG29xaWX1upFSna',
  PASSWORD_VALUE: 'password',
  PORT: 8647,
  SALT_ROUNDS: 10,
  SLACK_URL: '',
  STATSD_HOST: 'localhost',
  VERSION: 'test'
};

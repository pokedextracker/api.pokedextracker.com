'use strict';

const StatsD = require('hot-shots');

const Config = require('../../config');

module.exports = new StatsD({
  host: Config.STATSD_HOST,
  port: 8125,
  prefix: 'api.',
  mock: Config.METRICS_MOCK,
  globalTags: [
    `container:${process.env.HOSTNAME}`,
    `environment:${Config.ENVIRONMENT}`,
    `version:${Config.VERSION}`
  ]
});

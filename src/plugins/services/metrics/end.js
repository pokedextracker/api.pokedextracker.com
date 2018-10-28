'use strict';

const Metrics = require('../../../libraries/metrics');

const MS_PER_SECOND = 1e3;
const NS_PER_MS     = 1e6;

exports.register = function (server, options, next) {

  server.ext('onPreResponse', (request, reply) => {
    const start = request.plugins.metrics.start;
    const diff = process.hrtime(start);
    const milliseconds = diff[0] * MS_PER_SECOND + diff[1] / NS_PER_MS;

    const statusCode = request.response.statusCode || request.response.output.statusCode;
    const tags = [
      `path:${request.route.path}`,
      `status_code:${statusCode}`
    ].concat(request.plugins.metrics.tags);

    Metrics.histogram('http.request', milliseconds, tags);

    reply.continue();
  });

  next();

};

exports.register.attributes = {
  name: 'metrics:end'
};

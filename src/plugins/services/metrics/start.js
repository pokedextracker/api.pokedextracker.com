'use strict';

exports.register = function (server, options, next) {

  server.ext('onRequest', (request, reply) => {
    const tags = [
      `method:${request.method}`
    ];

    request.plugins.metrics = {
      start: process.hrtime(),
      tags
    };

    reply.continue();
  });

  next();

};

exports.register.attributes = {
  name: 'metrics:start'
};

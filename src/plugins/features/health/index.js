'use strict';

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/health',
    config: {
      handler: (request, reply) => reply({ healthy: true })
    }
  }]);

  next();

};

exports.register.attributes = {
  name: 'health'
};

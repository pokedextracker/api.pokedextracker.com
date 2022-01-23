'use strict';

const Controller = require('./controller');

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/dex-types',
    config: {
      handler: (request, reply) => reply(Controller.list())
    }
  }]);

  next();

};

exports.register.attributes = {
  name: 'dex-types'
};

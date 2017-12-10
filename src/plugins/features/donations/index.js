'use strict';

const Controller               = require('./controller');
const DonationsCreateValidator = require('../../../validators/donations/create');

exports.register = (server, options, next) => {

  server.route([{
    method: 'POST',
    path: '/donations',
    config: {
      auth: { mode: 'try', strategy: 'token' },
      handler: (request, reply) => reply(Controller.create(request.payload, request)),
      validate: { payload: DonationsCreateValidator }
    }
  }]);

  next();

};

exports.register.attributes = {
  name: 'donations'
};

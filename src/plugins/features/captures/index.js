'use strict';

const CapturesCreateValidator = require('../../../validators/captures/create');
const CapturesDeleteValidator = require('../../../validators/captures/delete');
const CapturesListValidator   = require('../../../validators/captures/list');
const Controller              = require('./controller');
const Pokemon                 = require('../../../models/pokemon');

exports.register = (server, options, next) => {

  let pokemon;

  server.route([{
    method: 'GET',
    path: '/captures',
    config: {
      handler: (request, reply) => reply(Controller.list(request.query, pokemon)),
      validate: { query: CapturesListValidator }
    }
  }, {
    method: 'POST',
    path: '/captures',
    config: {
      auth: 'token',
      handler: (request, reply) => reply(Controller.create(request.payload, request.auth.credentials)),
      validate: { payload: CapturesCreateValidator }
    }
  }, {
    method: 'DELETE',
    path: '/captures',
    config: {
      auth: 'token',
      handler: (request, reply) => reply(Controller.delete(request.payload, request.auth.credentials)),
      validate: { payload: CapturesDeleteValidator }
    }
  }]);

  return new Pokemon().query((qb) => qb.orderBy('id')).fetchAll({ withRelated: Pokemon.RELATED })
  .get('models')
  .then((p) => {
    pokemon = p;
    next();
  });

};

exports.register.attributes = {
  name: 'captures'
};

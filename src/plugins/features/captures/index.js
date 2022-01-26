'use strict';

const keyBy = require('lodash/keyBy');

const CapturesCreateValidator = require('../../../validators/captures/create');
const CapturesDeleteValidator = require('../../../validators/captures/delete');
const Controller              = require('./controller');
const Pokemon                 = require('../../../models/pokemon');

exports.register = (server, options, next) => {

  let pokemonById;

  server.route([{
    method: 'GET',
    path: '/users/{username}/dexes/{slug}/captures',
    config: {
      handler: (request, reply) => reply(Controller.list(request.params, pokemonById))
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

  return new Pokemon().query((qb) => qb.orderBy('id')).fetchAll({ withRelated: Pokemon.CAPTURE_SUMMARY_RELATED })
  .get('models')
  .then((p) => {
    pokemonById = keyBy(p, 'id');
    next();
  });

};

exports.register.attributes = {
  name: 'captures'
};

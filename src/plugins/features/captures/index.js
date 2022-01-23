'use strict';

const keyBy = require('lodash/keyBy');

const CapturesCreateValidator = require('../../../validators/captures/create');
const CapturesDeleteValidator = require('../../../validators/captures/delete');
const CapturesListValidator   = require('../../../validators/captures/list');
const Controller              = require('./controller');
const Pokemon                 = require('../../../models/pokemon');

exports.register = (server, options, next) => {

  let pokemon;
  let pokemonById;

  server.route([{
    // TODO: remove
    method: 'GET',
    path: '/captures',
    config: {
      handler: (request, reply) => reply(Controller.list(request.query, pokemon)),
      validate: { query: CapturesListValidator }
    }
  }, {
    method: 'GET',
    path: '/users/{username}/dexes/{slug}/captures',
    config: {
      handler: (request, reply) => reply(Controller.listV2(request.params, pokemonById))
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
    pokemon = p;
    pokemonById = keyBy(p, 'id');
    next();
  });

};

exports.register.attributes = {
  name: 'captures'
};

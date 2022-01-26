'use strict';

const Bluebird = require('bluebird');

const Capture = require('../../../models/capture');
const Dex     = require('../../../models/dex');
const Errors  = require('../../../libraries/errors');
const Knex    = require('../../../libraries/knex');
const Pokemon = require('../../../models/pokemon');

exports.list = function (params, pokemon) {
  let dex;

  return new Dex().query((qb) => {
    qb.innerJoin('users', 'dexes.user_id', 'users.id');
    qb.where({ username: params.username, slug: params.slug });
  }).fetch({ require: true, withRelated: Dex.RELATED_WITH_POKEMON })
  .catch(Dex.NotFoundError, () => {
    throw new Errors.NotFound('dex');
  })
  .then((d) => {
    dex = d;
  })
  .then(() => new Capture().where('dex_id', dex.id).fetchAll({ withRelated: Capture.RELATED }))
  .get('models')
  .reduce((captures, capture) => {
    capture.relations.dex = dex;
    captures[capture.get('pokemon_id')] = capture;
    return captures;
  }, {})
  .then((captures) => {
    return Bluebird.resolve(dex.related('dex_type').related('pokemon').models)
    .map((p) => {
      if (captures[p.id]) {
        return captures[p.id];
      }

      const capture = Capture.forge({ dex_id: dex.id, pokemon_id: p.id, captured: false });
      capture.relations.dex = dex;
      capture.relations.pokemon = pokemon[p.id];
      return capture;
    });
  });
};

exports.create = function (payload, auth) {
  return Bluebird.all([
    new Pokemon().query((qb) => qb.whereIn('id', payload.pokemon)).fetchAll(),
    new Dex({ id: payload.dex }).fetch({ require: true })
  ])
  .spread((pokemon, dex) => {
    if (pokemon.length !== payload.pokemon.length) {
      throw new Errors.NotFound('pokemon');
    }

    if (dex.get('user_id') !== auth.id) {
      throw new Errors.ForbiddenAction('marking captures for this dex');
    }

    return payload.pokemon;
  })
  .map((pokemonId) => {
    return Knex('captures').insert({
      pokemon_id: pokemonId,
      dex_id: payload.dex,
      captured: true
    })
    .catch(Errors.DuplicateKey, () => {});
  })
  .then(() => {
    return new Capture().query((qb) => {
      qb.whereIn('pokemon_id', payload.pokemon);
      qb.where('dex_id', payload.dex);
    }).fetchAll({ withRelated: Capture.RELATED });
  })
  .catch(Dex.NotFoundError, () => {
    throw new Errors.NotFound('dex');
  });
};

exports.delete = function (payload, auth) {
  return new Dex({ id: payload.dex }).fetch({ require: true })
  .then((dex) => {
    if (dex.get('user_id') !== auth.id) {
      throw new Errors.ForbiddenAction('deleting captures for this dex');
    }

    return new Capture().query((qb) => {
      qb.whereIn('pokemon_id', payload.pokemon);
      qb.where('dex_id', payload.dex);
    }).destroy();
  })
  .then(() => ({ deleted: true }))
  .catch(Dex.NotFoundError, () => {
    throw new Errors.NotFound('dex');
  });
};

'use strict';

const Bluebird = require('bluebird');

const Capture = require('../../../models/capture');
const Dex     = require('../../../models/dex');
const Errors  = require('../../../libraries/errors');
const Knex    = require('../../../libraries/knex');
const Pokemon = require('../../../models/pokemon');

exports.list = function (query, pokemon) {
  let dex;

  return new Dex({ id: query.dex }).fetch({ require: true, withRelated: Dex.RELATED })
  .then((d) => dex = d)
  .catch(Dex.NotFoundError, () => {
    throw new Errors.NotFound('dex');
  })
  .then(() => new Capture().where('dex_id', query.dex).fetchAll({ withRelated: Capture.RELATED }))
  .get('models')
  .reduce((captures, capture) => {
    captures[capture.get('pokemon_id')] = capture;
    return captures;
  }, {})
  .then((captures) => {
    return Bluebird.resolve(pokemon)
    .then((p) => new Array(p.length))
    .map((_, i) => {
      if (pokemon[i].get('generation') > dex.get('generation') || !pokemon[i].get(`${dex.get('region')}_id`)) {
        return null;
      }

      if (captures[i + 1]) {
        return captures[i + 1];
      }

      const capture = Capture.forge({ dex_id: query.dex, pokemon_id: i + 1, captured: false });
      capture.relations.pokemon = pokemon[i];
      return capture;
    });
  })
  .filter((capture) => capture)
  .then((captures) => {
    const property = dex.get('region') === 'national' ? 'national_order' : `${dex.get('region')}_id`;

    return captures.sort((a, b) => a.related('pokemon').get(property) - b.related('pokemon').get(property));
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

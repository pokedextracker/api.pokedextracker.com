'use strict';

const Bluebird = require('bluebird');
const Slug     = require('slug');

const Capture = require('../../../models/capture');
const Dex     = require('../../../models/dex');
const Errors  = require('../../../libraries/errors');
const Game    = require('../../../models/game');
const Knex    = require('../../../libraries/knex');

exports.retrieve = function (params) {
  return new Dex().query((qb) => {
    qb.innerJoin('users', 'dexes.user_id', 'users.id');
    qb.where({ username: params.username, slug: params.slug });
  }).fetch({ require: true, withRelated: Dex.RELATED })
  .catch(Dex.NotFoundError, () => {
    throw new Errors.NotFound('dex');
  });
};

exports.create = function (params, payload, auth) {
  return Bluebird.resolve()
  .then(() => {
    if (params.username !== auth.username) {
      throw new Errors.ForbiddenAction('creating a dex for this user');
    }

    payload.user_id = auth.id;
    payload.slug = Slug(payload.title, { lower: true });

    if (payload.slug === '') {
      throw new Errors.EmptySlug();
    }

    return new Dex().where({ user_id: auth.id, slug: payload.slug }).fetch();
  })
  .then((existing) => {
    if (existing) {
      throw new Errors.ExistingDex();
    }

    payload.game_id = payload.game;
    delete payload.game;

    return new Dex().save(payload);
  })
  .then((dex) => dex.refresh({ withRelated: Dex.RELATED }))
  .catch(Errors.DuplicateKey, () => {
    throw new Errors.ExistingDex();
  });
};

exports.update = function (params, payload, auth) {
  return Bluebird.resolve()
  .then(() => {
    if (params.username !== auth.username) {
      throw new Errors.ForbiddenAction('updating a dex for this user');
    }

    return Bluebird.all([
      new Dex().where({ user_id: auth.id, slug: params.slug }).fetch({ require: true, withRelated: ['game'] }),
      payload.game && new Game({ id: payload.game }).fetch({ require: true, withRelated: ['game_family'] })
    ]);
  })
  .spread((dex, game) => {
    if (payload.title) {
      payload.slug = Slug(payload.title, { lower: true });

      if (payload.slug === '') {
        throw new Errors.EmptySlug();
      }
    }

    let captures;

    if (game || payload.regional) {
      captures = new Capture().query((qb) => {
        qb.where('dex_id', dex.get('id'));

        qb.andWhere(function () {
          const gameFamilyId = game ? game.get('game_family_id') : dex.related('game').get('game_family_id');

          if (game) {
            this.whereIn('pokemon_id', function () {
              this.select('pokemon.id').from('pokemon');
              this.innerJoin('game_families', 'pokemon.game_family_id', 'game_families.id');
              this.where('game_families.order', '>', game.related('game_family').get('order'));
            });
          }
          if (payload.regional && gameFamilyId) {
            this.orWhereIn('pokemon_id', function () {
              this.select('pokemon.id').from('pokemon');
              this.leftOuterJoin('game_family_dex_numbers', 'pokemon.id', 'game_family_dex_numbers.pokemon_id');
              this.havingRaw('EVERY(game_family_dex_numbers.game_family_id != ? OR game_family_dex_numbers.game_family_id IS NULL)', [gameFamilyId]);
              this.groupBy('pokemon.id');
            });
          }
          // If the dex is being changed to a national dex, delete all duplicate
          // pokemon.
          if (payload.regional === false) {
            this.orWhereIn('pokemon_id', function () {
              this.select('pokemon.id').from('pokemon');
              this.where('national_order', '<', 0);
            });
          }
        });
      });
    }

    payload.game_id = payload.game;
    delete payload.game;

    return Knex.transaction((transacting) => {
      return Bluebird.all([
        dex.save(payload, { patch: true, transacting }),
        captures && captures.destroy({ transacting })
      ]);
    });
  })
  .spread((dex) => dex.refresh({ withRelated: Dex.RELATED }))
  .catch(Dex.NotFoundError, () => {
    throw new Errors.NotFound('dex');
  })
  .catch(Game.NotFoundError, () => {
    throw new Errors.NotFound('game');
  })
  .catch(Errors.DuplicateKey, () => {
    throw new Errors.ExistingDex();
  });
};

exports.delete = function (params, auth) {
  return Bluebird.resolve()
  .then(() => {
    if (params.username !== auth.username) {
      throw new Errors.ForbiddenAction('deleting a dex for this user');
    }

    return Knex.transaction((transacting) => {
      return Dex.where({ user_id: auth.id }).count({ transacting })
      .then((count) => {
        if (parseInt(count) === 1) {
          throw new Errors.AtLeastOneDex();
        }

        return new Dex().where({ user_id: auth.id, slug: params.slug }).destroy({ require: true, transacting });
      });
    });
  })
  .then(() => ({ deleted: true }))
  .catch(Dex.NoRowsDeletedError, () => {
    throw new Errors.NotFound('dex');
  });
};

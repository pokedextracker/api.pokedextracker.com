'use strict';

const Bluebird = require('bluebird');
const Slug     = require('slug');

const Capture = require('../../../models/capture');
const Dex     = require('../../../models/dex');
const DexType = require('../../../models/dex-type');
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

    return Bluebird.all([
      new Dex().where({ user_id: auth.id, slug: payload.slug }).fetch(),
      new Game({ id: payload.game }).fetch({ require: true  }),
      new DexType({ id: payload.dex_type }).fetch({ require: true  })
    ]);
  })
  .spread((existing, game, dexType) => {
    if (existing) {
      throw new Errors.ExistingDex();
    }

    if (game.get('game_family_id') !== dexType.get('game_family_id')) {
      throw Errors.GameDexTypeMismatch();
    }

    payload.game_id = payload.game;
    delete payload.game;
    payload.dex_type_id = payload.dex_type;
    delete payload.dex_type;

    return new Dex().save(payload);
  })
  .then((dex) => dex.refresh({ withRelated: Dex.RELATED }))
  .catch(Game.NotFoundError, () => {
    throw new Errors.NotFound('game');
  })
  .catch(DexType.NotFoundError, () => {
    throw new Errors.NotFound('dex type');
  })
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
      payload.game && new Game({ id: payload.game }).fetch({ require: true, withRelated: ['game_family'] }),
      payload.dex_type && new DexType({ id: payload.dex_type }).fetch({ require: true })
    ]);
  })
  .spread((dex, game, dexType) => {
    if (payload.title) {
      payload.slug = Slug(payload.title, { lower: true });

      if (payload.slug === '') {
        throw new Errors.EmptySlug();
      }
    }

    if (game && dexType && game.get('game_family_id') !== dexType.get('game_family_id')) {
      throw Errors.GameDexTypeMismatch();
    }

    let captures;

    if (game || dexType && dexType.get('tags').includes('regional')) {
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
          if (dexType && dexType.get('tags').includes('regional') && gameFamilyId) {
            this.orWhereIn('pokemon_id', function () {
              this.select('pokemon.id').from('pokemon');
              this.leftOuterJoin('dex_type_pokemon', 'pokemon.id', 'dex_type_pokemon.pokemon_id');
              this.leftOuterJoin('dex_types', 'dex_types.id', 'dex_type_pokemon.dex_type_id');
              this.havingRaw('EVERY(dex_types.game_family_id != ? OR dex_types.game_family_id IS NULL)', [gameFamilyId]);
              this.groupBy('pokemon.id');
            });
          }
          // If the dex is being changed to a national dex, delete all duplicate
          // pokemon.
          if (dexType && !dexType.get('tags').includes('regional')) {
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
    payload.dex_type_id = payload.dex_type;
    delete payload.dex_type;

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

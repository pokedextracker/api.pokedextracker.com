'use strict';

const Bluebird = require('bluebird');

const Bookshelf           = require('../libraries/bookshelf');
const Box                 = require('./box');
const Evolution           = require('./evolution');
const GameFamily          = require('./game-family');
const GameFamilyDexNumber = require('./game-family-dex-number');
const Location            = require('./location');

module.exports = Bookshelf.model('Pokemon', Bookshelf.Model.extend({
  tableName: 'pokemon',
  hasTimestamps: ['date_created', 'date_modified'],
  game_family () {
    return this.belongsTo(GameFamily, 'game_family_id');
  },
  game_family_dex_numbers () {
    return this.hasMany(GameFamilyDexNumber, 'pokemon_id');
  },
  boxes () {
    return this.hasMany(Box, 'pokemon_id');
  },
  locations () {
    return this.hasMany(Location, 'pokemon_id');
  },
  box (query) {
    if (query.game_family === undefined || query.regional === undefined) {
      return null;
    }

    const box = this.related('boxes').models.find((m) => {
      return m.get('game_family_id') === query.game_family && m.get('regional') === query.regional;
    });

    if (!box) {
      return null;
    }

    return box.get('value');
  },
  capture_summary (query) {
    return Object.assign({
      id: this.get('id'),
      national_id: this.get('national_id'),
      name: this.get('name'),
      game_family: this.related('game_family').serialize(),
      form: this.get('form'),
      box: this.box(query)
    }, this.get('dex_number_properties'));
  },
  evolutions (query) {
    return new Evolution()
    .where('evolutions.evolution_family_id', this.get('evolution_family_id'))
    .query((qb) => {
      qb.joinRaw('INNER JOIN pokemon AS evolved ON evolutions.evolved_pokemon_id = evolved.id');
      qb.joinRaw('INNER JOIN pokemon AS evolving ON evolutions.evolving_pokemon_id = evolving.id');
      qb.joinRaw('INNER JOIN game_families AS evolved_game_family ON evolved.game_family_id = evolved_game_family.id');
      qb.joinRaw('INNER JOIN game_families AS evolving_game_family ON evolving.game_family_id = evolving_game_family.id');

      if (query.game_family) {
        qb.whereRaw(`
          evolved_game_family.order <= (
            SELECT "order" FROM game_families WHERE id = ?
          ) AND
          evolving_game_family.order <= (
            SELECT "order" FROM game_families WHERE id = ?
          )
        `, [query.game_family, query.game_family]);
      }
      if (query.regional) {
        qb.joinRaw('LEFT OUTER JOIN game_family_dex_numbers AS evolved_dex_numbers ON evolved.id = evolved_dex_numbers.pokemon_id');
        qb.joinRaw('LEFT OUTER JOIN game_family_dex_numbers AS evolving_dex_numbers ON evolving.id = evolving_dex_numbers.pokemon_id');
        qb.whereRaw(`evolved_dex_numbers.game_family_id = ? AND evolving_dex_numbers.game_family_id = ?`, [query.game_family, query.game_family]);
      }

      qb.orderByRaw('CASE WHEN trigger = \'breed\' THEN evolving.national_id ELSE evolved.national_id END, trigger DESC, evolved.national_order ASC');
    })
    .fetchAll({ withRelated: Evolution.RELATED })
    .get('models');
  },
  virtuals: {
    dex_number_properties () {
      return this.related('game_family_dex_numbers')
        .reduce((dexNumbers, dexNumber) => {
          const numbers = Object.assign({}, dexNumbers);
          numbers[`${dexNumber.get('game_family_id')}_id`] = dexNumber.get('dex_number');

          return numbers;
        }, {});
    },
    summary () {
      return {
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        form: this.get('form')
      };
    }
  },
  serialize (request) {
    const query = request.query || {};

    return this.evolutions(query)
    .reduce((family, evolution) => {
      const i = evolution.get('stage') - 1;
      const breed = evolution.get('trigger') === 'breed';
      let first;
      let second;

      family.pokemon[i] = family.pokemon[i] || [];
      family.pokemon[i + 1] = family.pokemon[i + 1] || [];
      if (breed) {
        first = evolution.related('evolved_pokemon').get('summary');
        second = evolution.related('evolving_pokemon').get('summary');
      } else {
        first = evolution.related('evolving_pokemon').get('summary');
        second = evolution.related('evolved_pokemon').get('summary');
      }

      if (!family.pokemon[i].find((p) => p.id === first.id)) {
        family.pokemon[i].push(first);
      }
      if (!family.pokemon[i + 1].find((p) => p.id === second.id)) {
        family.pokemon[i + 1].push(second);
      }

      family.evolutions[i] = family.evolutions[i] || [];
      family.evolutions[i].push(evolution.serialize());

      return family;
    }, { pokemon: [], evolutions: [] })
    .then((family) => {
      // filter out nulls from evolutions that don't exist in the given game
      // family or regionality
      while (family.pokemon.length > 0 && !family.pokemon[0]) {
        family.pokemon.shift();
      }
      while (family.evolutions.length > 0 && !family.evolutions[0]) {
        family.evolutions.shift();
      }

      if (family.pokemon.length === 0) {
        family.pokemon.push([this.get('summary')]);
      }
      return Bluebird.all([
        family,
        query.game_family && new GameFamily({ id: query.game_family }).fetch({ require: true })
      ]);
    })
    .spread((evolutionFamily, gameFamily) => {
      const locations = this.related('locations')
        .filter((l) => {
          if (!gameFamily) {
            return true;
          }

          const locationGameFamily = l.related('game').related('game_family');

          if (query.regional) {
            return gameFamily.id === locationGameFamily.get('id');
          }

          return gameFamily.get('generation') >= locationGameFamily.get('generation');
        })
        .map((l) => l.serialize(request));

      return Object.assign({
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        game_family: this.related('game_family').serialize(),
        form: this.get('form'),
        box: this.box(query)
      }, this.get('dex_number_properties'), {
        locations,
        evolution_family: evolutionFamily
      });
    });
  }
}, {
  CAPTURE_SUMMARY_RELATED: ['boxes', 'game_family', 'game_family_dex_numbers'],
  RELATED: ['boxes', 'game_family', 'game_family_dex_numbers', {
    locations (qb) {
      qb
        .innerJoin('games', 'locations.game_id', 'games.id')
        .innerJoin('game_families', 'games.game_family_id', 'game_families.id')
        .orderByRaw('game_families.order DESC, games.order ASC');
    }
  }, 'locations.game', 'locations.game.game_family']
}));

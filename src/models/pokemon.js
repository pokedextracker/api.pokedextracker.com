'use strict';

const Bluebird = require('bluebird');

const Bookshelf           = require('../libraries/bookshelf');
const DexType             = require('./dex-type');
const DexTypePokemon      = require('./dex-type-pokemon');
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
  dex_type_pokemon () {
    return this.hasMany(DexTypePokemon, 'pokemon_id');
  },
  locations () {
    return this.hasMany(Location, 'pokemon_id');
  },
  dex_specific_details (dexTypeId) {
    if (!dexTypeId) {
      return {};
    }

    const dexTypePokemon = this.related('dex_type_pokemon').models.find((dtp) => {
      return dtp.get('dex_type_id') === dexTypeId;
    });

    if (!dexTypePokemon) {
      return {};
    }

    return {
      box: dexTypePokemon.get('box') || null,
      dex_number: dexTypePokemon.get('dex_number')
    };
  },
  capture_summary (query) {
    return Object.assign({
      id: this.get('id'),
      national_id: this.get('national_id'),
      name: this.get('name'),
      game_family: this.related('game_family').serialize(),
      form: this.get('form')
    }, this.get('dex_number_properties'), this.dex_specific_details(query.dex_type));
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

      qb.joinRaw('LEFT OUTER JOIN dex_types_pokemon AS evolved_dex_numbers ON evolved.id = evolved_dex_numbers.pokemon_id');
      qb.joinRaw('LEFT OUTER JOIN dex_types_pokemon AS evolving_dex_numbers ON evolving.id = evolving_dex_numbers.pokemon_id');
      qb.whereRaw(`evolved_dex_numbers.dex_type_id = ? AND evolving_dex_numbers.dex_type_id = ?`, [query.dex_type, query.dex_type]);

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
    let regional = query.regional;
    let gameFamilyId = query.game_family;
    const dexType = query.dex_type;

    return Bluebird.resolve(dexType && new DexType({ id: dexType }).fetch({ require: true }))
    .then((dt) => {
      if (dt) {
        regional = dt.get('tags').includes('regional');
        gameFamilyId = dt.get('game_family_id');
      }

      return this.evolutions({
        dex_type: dexType,
        game_family: gameFamilyId
      });
    })
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
        gameFamilyId && new GameFamily({ id: gameFamilyId }).fetch({ require: true })
      ]);
    })
    .spread((evolutionFamily, gameFamily) => {
      const locations = this.related('locations')
        .filter((l) => {
          // If there is no game family passed in through the query param, it
          // should include all locations.
          if (!gameFamily) {
            return true;
          }

          const locationGameFamily = l.related('game').related('game_family');

          if (regional) {
            // If the game we're filtering by is the regional sword and shield
            // expansion pass dexes, then it should include the locations for
            // the expansion and the original sword and shield.
            if (gameFamily.id === 'sword_shield_expansion_pass' && locationGameFamily.get('id') === 'sword_shield') {
              return true;
            }

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
        form: this.get('form')
      }, this.get('dex_number_properties'), this.dex_specific_details(dexType), {
        locations,
        evolution_family: evolutionFamily
      });
    });
  }
}, {
  CAPTURE_SUMMARY_RELATED: ['dex_type_pokemon', 'game_family', 'game_family_dex_numbers'],
  RELATED: ['dex_type_pokemon', 'game_family', 'game_family_dex_numbers', {
    locations (qb) {
      qb
        .innerJoin('games', 'locations.game_id', 'games.id')
        .innerJoin('game_families', 'games.game_family_id', 'game_families.id')
        .orderByRaw('game_families.order DESC, games.order ASC');
    }
  }, 'locations.game', 'locations.game.game_family']
}));

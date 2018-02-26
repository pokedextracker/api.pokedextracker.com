'use strict';

const Bookshelf           = require('../libraries/bookshelf');
const Evolution           = require('./evolution');
const GameFamily          = require('./game-family');
const GameFamilyDexNumber = require('./game-family-dex-number');

module.exports = Bookshelf.model('Pokemon', Bookshelf.Model.extend({
  tableName: 'pokemon',
  hasTimestamps: ['date_created', 'date_modified'],
  game_family () {
    return this.belongsTo(GameFamily, 'game_family_id');
  },
  game_family_dex_numbers () {
    return this.hasMany(GameFamilyDexNumber, 'pokemon_id');
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
    capture_summary () {
      return Object.assign({
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        game_family: this.related('game_family').serialize(),
        form: this.get('form'),
        box: this.get('box')
      }, this.get('dex_number_properties'));
    },
    summary () {
      return {
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        form: this.get('form')
      };
    },
    x_locations () {
      return this.get('x_location') ? this.get('x_location').split(', ') : [];
    },
    y_locations () {
      return this.get('y_location') ? this.get('y_location').split(', ') : [];
    },
    or_locations () {
      return this.get('or_location') ? this.get('or_location').split(', ') : [];
    },
    as_locations () {
      return this.get('as_location') ? this.get('as_location').split(', ') : [];
    },
    sun_locations () {
      return this.get('sun_location') ? this.get('sun_location').split(', ') : [];
    },
    moon_locations () {
      return this.get('moon_location') ? this.get('moon_location').split(', ') : [];
    },
    us_locations () {
      return this.get('us_location') ? this.get('us_location').split(', ') : [];
    },
    um_locations () {
      return this.get('um_location') ? this.get('um_location').split(', ') : [];
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
      if (family.pokemon.length === 0) {
        family.pokemon.push([this.get('summary')]);
      }
      return family;
    })
    .then((family) => {
      return Object.assign({
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        game_family: this.related('game_family').serialize(),
        form: this.get('form'),
        box: this.get('box')
      }, this.get('dex_number_properties'), {
        x_locations: this.get('x_locations'),
        y_locations: this.get('y_locations'),
        or_locations: this.get('or_locations'),
        as_locations: this.get('as_locations'),
        sun_locations: this.get('sun_locations'),
        moon_locations: this.get('moon_locations'),
        us_locations: this.get('us_locations'),
        um_locations: this.get('um_locations'),
        evolution_family: family
      });
    });
  }
}, {
  RELATED: ['game_family', 'game_family_dex_numbers']
}));

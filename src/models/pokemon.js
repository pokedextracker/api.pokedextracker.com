'use strict';

const Bookshelf  = require('../libraries/bookshelf');
const Evolution  = require('./evolution');
const GameFamily = require('./game-family');

module.exports = Bookshelf.model('Pokemon', Bookshelf.Model.extend({
  tableName: 'pokemon',
  hasTimestamps: ['date_created', 'date_modified'],
  game_family () {
    return this.belongsTo(GameFamily, 'game_family_id');
  },
  evolutions (query) {
    return new Evolution()
    .where('evolutions.evolution_family_id', this.get('evolution_family_id'))
    .query((qb) => {
      qb.joinRaw('INNER JOIN pokemon AS evolved ON evolutions.evolved_pokemon_id = evolved.id');
      qb.joinRaw('INNER JOIN pokemon AS evolving ON evolutions.evolving_pokemon_id = evolving.id');

      if (query.generation) {
        qb.whereRaw(`evolved.generation <= ${query.generation} AND evolving.generation <= ${query.generation}`);
      }
      if (query.region) {
        qb.whereRaw(`evolved.${query.region}_id IS NOT NULL AND evolving.${query.region}_id IS NOT NULL`);
      }

      qb.orderByRaw('CASE WHEN trigger = \'breed\' THEN evolving.national_id ELSE evolved.national_id END, trigger DESC, evolved.national_order ASC');
    })
    .fetchAll({ withRelated: Evolution.RELATED })
    .get('models');
  },
  virtuals: {
    capture_summary () {
      return {
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        generation: this.get('generation'),
        game_family: this.related('game_family').serialize(),
        form: this.get('form'),
        box: this.get('box'),
        kanto_id: this.get('kanto_id') || undefined,
        johto_id: this.get('johto_id') || undefined,
        hoenn_id: this.get('hoenn_id') || undefined,
        sinnoh_id: this.get('sinnoh_id') || undefined,
        unova_id: this.get('unova_id') || undefined,
        central_kalos_id: this.get('central_kalos_id') || undefined,
        coastal_kalos_id: this.get('coastal_kalos_id') || undefined,
        mountain_kalos_id: this.get('mountain_kalos_id') || undefined,
        alola_id: this.get('alola_id') || undefined
      };
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
      return {
        id: this.get('id'),
        national_id: this.get('national_id'),
        name: this.get('name'),
        generation: this.get('generation'),
        game_family: this.related('game_family').serialize(),
        form: this.get('form'),
        box: this.get('box'),
        kanto_id: this.get('kanto_id') || undefined,
        johto_id: this.get('johto_id') || undefined,
        hoenn_id: this.get('hoenn_id') || undefined,
        sinnoh_id: this.get('sinnoh_id') || undefined,
        unova_id: this.get('unova_id') || undefined,
        central_kalos_id: this.get('central_kalos_id') || undefined,
        coastal_kalos_id: this.get('coastal_kalos_id') || undefined,
        mountain_kalos_id: this.get('mountain_kalos_id') || undefined,
        alola_id: this.get('alola_id') || undefined,
        x_locations: this.get('x_locations'),
        y_locations: this.get('y_locations'),
        or_locations: this.get('or_locations'),
        as_locations: this.get('as_locations'),
        sun_locations: this.get('sun_locations'),
        moon_locations: this.get('moon_locations'),
        evolution_family: family
      };
    });
  }
}, {
  RELATED: ['game_family']
}));

'use strict';

const Leftpad = require('left-pad');

const Bookshelf = require('../libraries/bookshelf');
const Evolution = require('./evolution');

module.exports = Bookshelf.model('Pokemon', Bookshelf.Model.extend({
  tableName: 'pokemon',
  idAttribute: 'national_id',
  hasTimestamps: ['date_created', 'date_modified'],
  evolutions () {
    return new Evolution()
    .where('evolution_family_id', this.get('evolution_family_id'))
    .query((qb) => {
      qb.orderByRaw('CASE WHEN trigger = \'breed\' THEN evolving_pokemon_id ELSE evolved_pokemon_id END, trigger DESC');
    })
    .fetchAll({ withRelated: Evolution.RELATED })
    .get('models');
  },
  virtuals: {
    bulbapedia_url () {
      return `http://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(this.get('name'))}_(Pok%C3%A9mon)`;
    },
    capture_summary () {
      return {
        national_id: this.get('national_id'),
        name: this.get('name'),
        kanto_id: this.get('kanto_id') || undefined,
        johto_id: this.get('johto_id') || undefined,
        hoenn_id: this.get('hoenn_id') || undefined,
        sinnoh_id: this.get('sinnoh_id') || undefined,
        unova_id: this.get('unova_id') || undefined,
        central_kalos_id: this.get('central_kalos_id') || undefined,
        coastal_kalos_id: this.get('coastal_kalos_id') || undefined,
        mountain_kalos_id: this.get('mountain_kalos_id') || undefined
      };
    },
    serebii_url () {
      return `http://www.serebii.net/pokedex-sm/${Leftpad(this.get('national_id'), 3, 0)}.shtml`;
    },
    summary () {
      return {
        national_id: this.get('national_id'),
        name: this.get('name')
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
    }
  },
  serialize () {
    return this.evolutions()
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

      if (!family.pokemon[i].find((p) => p.national_id === first.national_id)) {
        family.pokemon[i].push(first);
      }
      if (!family.pokemon[i + 1].find((p) => p.national_id === second.national_id)) {
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
        national_id: this.get('national_id'),
        name: this.get('name'),
        kanto_id: this.get('kanto_id') || undefined,
        johto_id: this.get('johto_id') || undefined,
        hoenn_id: this.get('hoenn_id') || undefined,
        sinnoh_id: this.get('sinnoh_id') || undefined,
        unova_id: this.get('unova_id') || undefined,
        central_kalos_id: this.get('central_kalos_id') || undefined,
        coastal_kalos_id: this.get('coastal_kalos_id') || undefined,
        mountain_kalos_id: this.get('mountain_kalos_id') || undefined,
        bulbapedia_url: this.get('bulbapedia_url'),
        serebii_url: this.get('serebii_url'),
        x_locations: this.get('x_locations'),
        y_locations: this.get('y_locations'),
        or_locations: this.get('or_locations'),
        as_locations: this.get('as_locations'),
        evolution_family: family
      };
    });
  }
}));

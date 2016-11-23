'use strict';

const Knex    = require('../../src/libraries/knex');
const Pokemon = require('../../src/models/pokemon');

const pokemon          = Factory.build('pokemon');
const firstPokemon     = Factory.build('pokemon');
const secondPokemon    = Factory.build('pokemon');
const unevolvedPokemon = Factory.build('pokemon');

const evolution      = Factory.build('evolution', { evolving_pokemon_id: pokemon.national_id, evolved_pokemon_id: pokemon.national_id, evolution_family_id: pokemon.evolution_family_id });
const otherEvolution = Factory.build('evolution', { evolving_pokemon_id: firstPokemon.national_id, evolved_pokemon_id: secondPokemon.national_id, evolution_family_id: firstPokemon.evolution_family_id });
const breedEvolution = Factory.build('evolution', { trigger: 'breed', evolving_pokemon_id: secondPokemon.national_id, evolved_pokemon_id: firstPokemon.national_id, evolution_family_id: firstPokemon.evolution_family_id });

describe('pokemon model', () => {

  beforeEach(() => {
    return Knex('pokemon').insert([pokemon, firstPokemon, secondPokemon, unevolvedPokemon])
    .then(() => {
      return Knex('evolutions').insert([evolution, otherEvolution, breedEvolution]);
    });
  });

  describe('evolutions', () => {

    it('only gets the models with the associated evolution_family_id', () => {
      return Pokemon.forge(pokemon).evolutions()
      .then((evolutions) => {
        expect(evolutions).to.have.length(1);
        expect(evolutions[0].get('evolution_family_id')).to.eql(pokemon.evolution_family_id);
      });
    });

  });

  describe('virtuals', () => {

    describe('bulbapedia_url', () => {

      it('URL-encodes the name in the Bulbapedia link', () => {
        expect(Pokemon.forge({ name: 'Pokémon' }).get('bulbapedia_url')).to.eql('http://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_(Pok%C3%A9mon)');
      });

    });

    describe('capture_summary', () => {

      it('only includes the fields needed for the tracker view', () => {
        expect(Pokemon.forge().get('capture_summary')).to.have.all.keys([
          'national_id',
          'name',
          'kanto_id',
          'johto_id',
          'hoenn_id',
          'sinnoh_id',
          'unova_id',
          'central_kalos_id',
          'coastal_kalos_id',
          'mountain_kalos_id'
        ]);
      });

    });

    describe('serebii_url', () => {

      it('gets the Serebii link of a Pokemon with a single digit National Id', () => {
        expect(Pokemon.forge({ national_id: '6' }).get('serebii_url')).to.eql('http://www.serebii.net/pokedex-sm/006.shtml');
      });

      it('gets the Serebii link of a Pokemon with a two digit National Id', () => {
        expect(Pokemon.forge({ national_id: '25' }).get('serebii_url')).to.eql('http://www.serebii.net/pokedex-sm/025.shtml');
      });

      it('gets the Serebii link of a Pokemon with a three digit National Id', () => {
        expect(Pokemon.forge({ national_id: '254' }).get('serebii_url')).to.eql('http://www.serebii.net/pokedex-sm/254.shtml');
      });

    });

    describe('summary', () => {

      it('only includes the national_id and name of the pokemon', () => {
        expect(Pokemon.forge().get('summary')).to.have.all.keys([
          'national_id',
          'name'
        ]);
      });

    });

    describe('x_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ x_location: 'Route 1, Route 2' }).get('x_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ x_location: null }).get('x_locations')).to.eql([]);
      });

    });

    describe('y_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ y_location: 'Route 1, Route 2' }).get('y_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ y_location: null }).get('y_locations')).to.eql([]);
      });

    });

    describe('or_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ or_location: 'Route 1, Route 2' }).get('or_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ or_location: null }).get('or_locations')).to.eql([]);
      });

    });

    describe('as_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ as_location: 'Route 1, Route 2' }).get('as_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ as_location: null }).get('as_locations')).to.eql([]);
      });

    });

  });

  describe('serialize', () => {

    it('returns the correct fields', () => {
      return Pokemon.forge(pokemon).serialize()
      .then((json) => {
        expect(json).to.have.all.keys([
          'national_id',
          'name',
          'kanto_id',
          'johto_id',
          'hoenn_id',
          'sinnoh_id',
          'unova_id',
          'central_kalos_id',
          'coastal_kalos_id',
          'mountain_kalos_id',
          'bulbapedia_url',
          'serebii_url',
          'x_locations',
          'y_locations',
          'or_locations',
          'as_locations',
          'evolution_family'
        ]);
        expect(json.evolution_family).to.have.all.keys([
          'pokemon',
          'evolutions'
        ]);
        expect(json.evolution_family.pokemon).to.have.length(2);
        expect(json.evolution_family.pokemon[0]).to.have.length(1);
        expect(json.evolution_family.pokemon[1]).to.have.length(1);
        expect(json.evolution_family.pokemon[0][0]).to.have.all.keys([
          'national_id',
          'name'
        ]);
        expect(json.evolution_family.evolutions).to.have.length(1);
        expect(json.evolution_family.evolutions[0]).to.have.length(1);
        expect(json.evolution_family.evolutions[0][0]).to.have.all.keys([
          'trigger',
          'level',
          'stone',
          'held_item',
          'notes'
        ]);
      });
    });

    it('flips evolution orders for "breed"s', () => {
      return Pokemon.forge(firstPokemon).serialize()
      .then((json) => json.evolution_family.pokemon)
      .map((poke) => poke.map((p) => p.national_id))
      .then((poke) => {
        expect(poke[0]).to.include(firstPokemon.national_id);
        expect(poke[1]).to.include(secondPokemon.national_id);
      });
    });

    it('does not insert duplicate evolutions', () => {
      return Pokemon.forge(firstPokemon).serialize()
      .then((json) => {
        expect(json.evolution_family.pokemon[0]).to.have.length(1);
        expect(json.evolution_family.pokemon[1]).to.have.length(1);
      });
    });

    it('inserts the pokemon into evolutions if the pokemon does not evolve', () => {
      return Pokemon.forge(unevolvedPokemon).serialize()
      .then((json) => {
        expect(json.evolution_family.pokemon[0]).to.have.length(1);
        expect(json.evolution_family.pokemon[0][0].national_id).to.eql(unevolvedPokemon.national_id);
      });
    });

  });

});

'use strict';

const Knex    = require('../../src/libraries/knex');
const Pokemon = require('../../src/models/pokemon');

const redBlue    = Factory.build('game-family', { id: 'red_blue', generation: 1 });
const goldSilver = Factory.build('game-family', { id: 'gold_silver', generation: 2 });
const sunMoon    = Factory.build('game-family', { id: 'sun_moon', generation: 7 });

const pikachu     = Factory.build('pokemon', { id: 25, national_id: 25, evolution_family_id: 25, generation: 1, alola_id: 25, game_family_id: redBlue.id });
const raichu      = Factory.build('pokemon', { id: 26, national_id: 26, evolution_family_id: 25, generation: 1, game_family_id: redBlue.id });
const pichu       = Factory.build('pokemon', { id: 172, national_id: 172, evolution_family_id: 25, generation: 2, alola_id: 24, game_family_id: goldSilver.id });
const alolaRaichu = Factory.build('pokemon', { id: 803, national_id: 26, evolution_family_id: 25, generation: 7, alola_id: 26, game_family_id: sunMoon.id });
const spearow     = Factory.build('pokemon', { id: 21, national_id: 21, evolution_family_id: 21, generation: 1, game_family_id: redBlue.id });
const fearow      = Factory.build('pokemon', { id: 22, national_id: 22, evolution_family_id: 21, generation: 1, game_family_id: redBlue.id });
const onix        = Factory.build('pokemon', { id: 95, national_id: 95, evolution_family_id: 95, generation: 1, game_family_id: redBlue.id });

const pikachuRedBlueDexNumber  = Factory.build('game-family-dex-number', { pokemon_id: pikachu.id, game_family_id: redBlue.id, dex_number: 25 });
const pikachuSunMoonDexNumber  = Factory.build('game-family-dex-number', { pokemon_id: pikachu.id, game_family_id: sunMoon.id, dex_number: 25 });
const raichuDexNumber          = Factory.build('game-family-dex-number', { pokemon_id: raichu.id, game_family_id: redBlue.id, dex_number: 26 });
const pichuGoldSilverDexNumber = Factory.build('game-family-dex-number', { pokemon_id: pichu.id, game_family_id: goldSilver.id, dex_number: 172 });
const pichuSunMoonDexNumber    = Factory.build('game-family-dex-number', { pokemon_id: pichu.id, game_family_id: sunMoon.id, dex_number: 24 });
const alolaRaichuDexNumber     = Factory.build('game-family-dex-number', { pokemon_id: alolaRaichu.id, game_family_id: sunMoon.id, dex_number: 26 });
const spearowDexNumber         = Factory.build('game-family-dex-number', { pokemon_id: spearow.id, game_family_id: redBlue.id, dex_number: 21 });
const fearowDexNumber          = Factory.build('game-family-dex-number', { pokemon_id: fearow.id, game_family_id: redBlue.id, dex_number: 22 });
const onixDexNumber            = Factory.build('game-family-dex-number', { pokemon_id: onix.id, game_family_id: redBlue.id, dex_number: 95 });

const levelEvolution   = Factory.build('evolution', { evolving_pokemon_id: pichu.id, evolved_pokemon_id: pikachu.id, evolution_family_id: pikachu.id, stage: 1, trigger: 'level' });
const breedEvolution   = Factory.build('evolution', { evolving_pokemon_id: pikachu.id, evolved_pokemon_id: pichu.id, evolution_family_id: pikachu.id, stage: 1, trigger: 'breed' });
const stoneEvolution   = Factory.build('evolution', { evolving_pokemon_id: pikachu.id, evolved_pokemon_id: raichu.id, evolution_family_id: pikachu.id, stage: 2, trigger: 'stone', stone: 'thunder' });
const alolaEvolution   = Factory.build('evolution', { evolving_pokemon_id: pikachu.id, evolved_pokemon_id: alolaRaichu.id, evolution_family_id: pikachu.id, stage: 2, trigger: 'stone', stone: 'thunder' });
const spearowEvolution = Factory.build('evolution', { evolving_pokemon_id: spearow.id, evolved_pokemon_id: fearow.id, evolution_family_id: spearow.id, stage: 1, trigger: 'level' });

describe('pokemon model', () => {

  beforeEach(() => {
    return Knex('game_families').insert([redBlue, goldSilver, sunMoon])
    .then(() => Knex('pokemon').insert([pikachu, raichu, pichu, alolaRaichu, spearow, fearow, onix]))
    .then(() => Knex('game_family_dex_numbers').insert([pikachuRedBlueDexNumber, pikachuSunMoonDexNumber, raichuDexNumber, pichuGoldSilverDexNumber, pichuSunMoonDexNumber, alolaRaichuDexNumber, spearowDexNumber, fearowDexNumber, onixDexNumber]))
    .then(() => Knex('evolutions').insert([levelEvolution, breedEvolution, stoneEvolution, alolaEvolution, spearowEvolution]));
  });

  describe('evolutions', () => {

    it('only gets the models with the associated evolution_family_id', () => {
      return Pokemon.forge(spearow).evolutions({})
      .then((evolutions) => {
        expect(evolutions).to.have.length(1);
        expect(evolutions[0].get('evolution_family_id')).to.eql(spearow.evolution_family_id);
      });
    });

    it('returns evolutions based on the generation filter', () => {
      return Pokemon.forge(pikachu).evolutions({ generation: 6 })
      .then((evolutions) => {
        expect(evolutions).to.have.length(3);
        expect(evolutions[0].get('evolving_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[0].get('evolved_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolved_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[2].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[2].get('evolved_pokemon_id')).to.eql(raichu.id);
      });
    });

    it('returns evolutions based on the game_family filter', () => {
      return Pokemon.forge(pikachu).evolutions({ game_family: goldSilver.id })
      .then((evolutions) => {
        expect(evolutions).to.have.length(3);
        expect(evolutions[0].get('evolving_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[0].get('evolved_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolved_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[2].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[2].get('evolved_pokemon_id')).to.eql(raichu.id);
      });
    });

    it('returns evolutions based on the region filter', () => {
      return Pokemon.forge(pikachu).evolutions({ region: 'alola' })
      .then((evolutions) => {
        expect(evolutions).to.have.length(3);
        expect(evolutions[0].get('evolving_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[0].get('evolved_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolved_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[2].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[2].get('evolved_pokemon_id')).to.eql(alolaRaichu.id);
      });
    });

    it('returns evolutions based on the regional filter', () => {
      return Pokemon.forge(pikachu).evolutions({ game_family: sunMoon.id, regional: true })
      .then((evolutions) => {
        expect(evolutions).to.have.length(3);
        expect(evolutions[0].get('evolving_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[0].get('evolved_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolved_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[2].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[2].get('evolved_pokemon_id')).to.eql(alolaRaichu.id);
      });
    });

    it('returns evolutions based on the generation and region filter together', () => {
      return Pokemon.forge(pikachu).evolutions({ generation: 7, region: 'national' })
      .then((evolutions) => {
        expect(evolutions).to.have.length(4);
        expect(evolutions[0].get('evolving_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[0].get('evolved_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[1].get('evolved_pokemon_id')).to.eql(pichu.id);
        expect(evolutions[2].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[2].get('evolved_pokemon_id')).to.eql(raichu.id);
        expect(evolutions[3].get('evolving_pokemon_id')).to.eql(pikachu.id);
        expect(evolutions[3].get('evolved_pokemon_id')).to.eql(alolaRaichu.id);
      });
    });

  });

  describe('virtuals', () => {

    describe('dex_number_properties', () => {

      it('converts an array of dex numbers to an object', () => {
        return new Pokemon({ id: pichu.id }).fetch({ withRelated: Pokemon.RELATED })
        .then((pokemon) => {
          expect(pokemon.get('dex_number_properties')).to.eql({
            gold_silver_id: 172,
            sun_moon_id: 24
          });
        });
      });

    });

    describe('capture_summary', () => {

      it('only includes the fields needed for the tracker view', () => {
        return new Pokemon({ id: pichu.id }).fetch({ withRelated: Pokemon.RELATED })
        .then((pokemon) => {
          expect(pokemon.get('capture_summary')).to.have.all.keys([
            'id',
            'national_id',
            'name',
            'generation',
            'game_family',
            'form',
            'box',
            'kanto_id',
            'johto_id',
            'hoenn_id',
            'sinnoh_id',
            'unova_id',
            'central_kalos_id',
            'coastal_kalos_id',
            'mountain_kalos_id',
            'alola_id',
            'gold_silver_id',
            'sun_moon_id'
          ]);
        });
      });

    });

    describe('summary', () => {

      it('only includes information necessary for the evolution tree', () => {
        expect(Pokemon.forge().get('summary')).to.have.all.keys([
          'id',
          'national_id',
          'name',
          'form'
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

    describe('sun_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ sun_location: 'Route 1, Route 2' }).get('sun_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ sun_location: null }).get('sun_locations')).to.eql([]);
      });

    });

    describe('moon_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ moon_location: 'Route 1, Route 2' }).get('moon_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ moon_location: null }).get('moon_locations')).to.eql([]);
      });

    });

    describe('us_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ us_location: 'Route 1, Route 2' }).get('us_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ us_location: null }).get('us_locations')).to.eql([]);
      });

    });

    describe('um_locations', () => {

      it('splits by commas', () => {
        expect(Pokemon.forge({ um_location: 'Route 1, Route 2' }).get('um_locations')).to.eql(['Route 1', 'Route 2']);
      });

      it('returns an empty array if the value does not exist', () => {
        expect(Pokemon.forge({ um_location: null }).get('um_locations')).to.eql([]);
      });

    });

  });

  describe('serialize', () => {

    it('returns the correct fields', () => {
      return new Pokemon({ id: pikachu.id }).fetch({ withRelated: Pokemon.RELATED })
      .then((pokemon) => pokemon.serialize({}))
      .then((json) => {
        expect(json).to.have.all.keys([
          'id',
          'national_id',
          'name',
          'generation',
          'game_family',
          'form',
          'box',
          'kanto_id',
          'johto_id',
          'hoenn_id',
          'sinnoh_id',
          'unova_id',
          'central_kalos_id',
          'coastal_kalos_id',
          'mountain_kalos_id',
          'alola_id',
          'red_blue_id',
          'sun_moon_id',
          'x_locations',
          'y_locations',
          'or_locations',
          'as_locations',
          'sun_locations',
          'moon_locations',
          'us_locations',
          'um_locations',
          'evolution_family'
        ]);
        expect(json.game_family.id).to.eql(redBlue.id);
        expect(json.evolution_family).to.have.all.keys([
          'pokemon',
          'evolutions'
        ]);
        expect(json.evolution_family.pokemon).to.have.length(3);
        expect(json.evolution_family.pokemon[0]).to.have.length(1);
        expect(json.evolution_family.pokemon[1]).to.have.length(1);
        expect(json.evolution_family.pokemon[2]).to.have.length(2);
        expect(json.evolution_family.pokemon[0][0]).to.have.all.keys([
          'id',
          'national_id',
          'name',
          'form'
        ]);
        expect(json.evolution_family.evolutions).to.have.length(2);
        expect(json.evolution_family.evolutions[0]).to.have.length(2);
        expect(json.evolution_family.evolutions[0][0]).to.have.all.keys([
          'trigger',
          'level',
          'stone',
          'held_item',
          'notes'
        ]);
      });
    });

    it('forces order of pokemon', () => {
      return Pokemon.forge(pikachu).serialize({})
      .then((json) => json.evolution_family.pokemon)
      .map((poke) => poke.map((p) => p.id))
      .then((poke) => {
        expect(poke[0]).to.eql([pichu.id]);
        expect(poke[1]).to.eql([pikachu.id]);
        expect(poke[2]).to.eql([raichu.id, alolaRaichu.id]);
      });
    });

    it('inserts the pokemon into evolutions if the pokemon does not evolve', () => {
      return Pokemon.forge(onix).serialize({})
      .then((json) => {
        expect(json.evolution_family.pokemon[0]).to.have.length(1);
        expect(json.evolution_family.pokemon[0][0].id).to.eql(onix.id);
      });
    });

  });

});

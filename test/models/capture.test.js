'use strict';

const Bookshelf = require('../../src/libraries/bookshelf');
const Box       = require('../../src/models/box');
const Capture   = require('../../src/models/capture');
const Pokemon   = require('../../src/models/pokemon');

const pokemon = Factory.build('pokemon');

const regionalBox = Factory.build('box', { regional: true, value: 'Regional', pokemon_id: pokemon.id });
const nationalBox = Factory.build('box', { regional: false, value: 'National', pokemon_id: pokemon.id });

const capture = Factory.build('capture', { pokemon_id: pokemon.id });

describe('capture model', () => {

  describe('serialize', () => {

    it('returns the correct fields', () => {
      const model = Capture.forge(capture);
      const pokemonModel = Pokemon.forge(pokemon);
      pokemonModel.relations.boxes = new Bookshelf.Collection([
        Box.forge(regionalBox),
        Box.forge(nationalBox)
      ]);
      model.relations.pokemon = pokemonModel;

      const json = model.serialize({});

      expect(json).to.have.all.keys([
        'pokemon',
        'dex_id',
        'captured'
      ]);
      expect(json.pokemon).to.have.all.keys([
        'id',
        'national_id',
        'name',
        'game_family',
        'form',
        'box'
      ]);
    });

    it('uses query to return the correct box', () => {
      const model = Capture.forge(capture);
      const pokemonModel = Pokemon.forge(pokemon);
      pokemonModel.relations.boxes = new Bookshelf.Collection([
        Box.forge(regionalBox),
        Box.forge(nationalBox)
      ]);
      model.relations.pokemon = pokemonModel;

      const json = model.serialize({
        query: {
          game_family: nationalBox.game_family_id,
          regional: nationalBox.regional
        }
      });

      expect(json.pokemon.box).to.eql(nationalBox.value);
    });

  });

});

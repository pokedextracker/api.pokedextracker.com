'use strict';

const Capture = require('../../src/models/capture');
const Pokemon = require('../../src/models/pokemon');

const pokemon = Factory.build('pokemon');

const capture = Factory.build('capture', { pokemon_id: pokemon.id });

describe('capture model', () => {

  describe('serialize', () => {

    it('returns the correct fields', () => {
      const model = Capture.forge(capture);
      model.relations.pokemon = Pokemon.forge(pokemon);
      const json = model.serialize();

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

  });

});

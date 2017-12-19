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
        'alola_id'
      ]);
    });

  });

});

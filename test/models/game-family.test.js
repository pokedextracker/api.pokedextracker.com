'use strict';

const GameFamily = require('../../src/models/game-family');

const gameFamily = Factory.build('game-family');

describe('game family model', () => {

  describe('serialize', () => {

    it('returns the correct fields', () => {
      const model = GameFamily.forge(gameFamily);
      const json = model.serialize();

      expect(json).to.have.all.keys([
        'id',
        'generation',
        'regional_total',
        'national_total',
        'order',
        'published'
      ]);
      expect(json.id).to.eql(gameFamily.id);
    });

  });

});

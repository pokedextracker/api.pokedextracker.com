'use strict';

const Game       = require('../../src/models/game');
const GameFamily = require('../../src/models/game-family');

const game = Factory.build('game');

const gameFamily = Factory.build('game-family');

describe('game model', () => {

  describe('serialize', () => {

    it('returns the correct fields', () => {
      const model = Game.forge(game);
      model.relations.game_family = GameFamily.forge(gameFamily);

      const json = model.serialize();

      expect(json).to.have.all.keys([
        'id',
        'name',
        'game_family',
        'order'
      ]);
      expect(json.id).to.eql(game.id);
      expect(json.game_family.id).to.eql(gameFamily.id);
    });

  });

});

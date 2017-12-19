'use strict';

const Knex   = require('../../../../src/libraries/knex');
const Server = require('../../../../src/server');

const gameFamily = Factory.build('game-family');

const game = Factory.build('game', { game_family_id: gameFamily.id });

describe('games integration', () => {

  describe('list', () => {

    beforeEach(() => {
      return Knex('game_families').insert(gameFamily)
      .then(() => Knex('games').insert(game));
    });

    it('returns a collection of games', () => {
      return Server.inject({
        method: 'GET',
        url: '/games'
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

});

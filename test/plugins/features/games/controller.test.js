'use strict';

const Controller = require('../../../../src/plugins/features/games/controller');
const Knex       = require('../../../../src/libraries/knex');

const publishedGameFamily   = Factory.build('game-family', { published: true });
const unpublishedGameFamily = Factory.build('game-family', { published: false });

const firstPublishedGame  = Factory.build('game', { game_family_id: publishedGameFamily.id, order: -2 });
const secondPublishedGame = Factory.build('game', { game_family_id: publishedGameFamily.id, order: -1 });
const unpublishedGame     = Factory.build('game', { game_family_id: unpublishedGameFamily.id });

describe('games controller', () => {

  describe('list', () => {

    beforeEach(() => {
      return Knex('game_families').insert([publishedGameFamily, unpublishedGameFamily])
      .then(() => Knex('games').insert([firstPublishedGame, secondPublishedGame, unpublishedGame]));
    });

    it('returns a collection of published games ordered by order descending', () => {
      return Controller.list()
      .get('models')
      .map((game) => game.id)
      .then((games) => {
        expect(games).to.have.length(2);
        expect(games[0]).to.eql(firstPublishedGame.id);
        expect(games[1]).to.eql(secondPublishedGame.id);
      });
    });

  });

});

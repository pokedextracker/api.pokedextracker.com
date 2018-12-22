'use strict';

const Knex     = require('../../src/libraries/knex');
const Location = require('../../src/models/location');

const gameFamily = Factory.build('game-family');

const game = Factory.build('game', { game_family_id: gameFamily.id });

const pokemon = Factory.build('pokemon', { game_family_id: gameFamily.id });

const location = Factory.build('location', { game_id: game.id, pokemon_id: pokemon.id });

describe('location model', () => {

  beforeEach(() => {
    return Knex('game_families').insert(gameFamily)
    .then(() => Knex('games').insert(game))
    .then(() => Knex('pokemon').insert(pokemon))
    .then(() => Knex('locations').insert(location));
  });

  describe('serialize', () => {

    it('returns the correct fields', () => {
      return new Location().fetch({ withRelated: Location.RELATED })
      .then((model) => model.serialize({}))
      .then((json) => {
        expect(json).to.have.all.keys([
          'game',
          'value'
        ]);
        expect(json.value).to.eql(['Route 1', 'Route 2']);
        expect(json.game.game_family.id).to.eql(gameFamily.id);
      });
    });

  });

});

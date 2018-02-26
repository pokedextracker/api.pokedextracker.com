'use strict';

const Bluebird = require('bluebird');

const Dex  = require('../../src/models/dex');
const Game = require('../../src/models/game');
const Knex = require('../../src/libraries/knex');

const user = Factory.build('user');

const gameFamily = Factory.build('game-family', { regional_total: 211, national_total: 721 });

const firstPokemon  = Factory.build('pokemon', { id: 1, national_id: 1, game_family_id: gameFamily.id });
const secondPokemon = Factory.build('pokemon', { id: 2, national_id: 2, game_family_id: gameFamily.id });

const game = Factory.build('game', { game_family_id: gameFamily.id });

const dex = Factory.build('dex', { user_id: user.id, game_id: game.id });

const firstCapture  = Factory.build('capture', { pokemon_id: firstPokemon.id, dex_id: dex.id });
const secondCapture = Factory.build('capture', { pokemon_id: secondPokemon.id, dex_id: dex.id });

describe('dex model', () => {

  describe('caught', () => {

    beforeEach(() => {
      return Knex('game_families').insert(gameFamily)
      .then(() => {
        return Bluebird.all([
          Knex('users').insert(user),
          Knex('games').insert(game),
          Knex('pokemon').insert([firstPokemon, secondPokemon])
        ]);
      })
      .then(() => Knex('dexes').insert(dex))
      .then(() => Knex('captures').insert([firstCapture, secondCapture]));
    });

    it('returns the count of captures associated with this dex', () => {
      return Dex.forge(dex).caught()
      .then((caught) => {
        expect(caught).to.eql(2);
      });
    });

  });

  describe('virtuals', () => {

    beforeEach(() => {
      return Knex('game_families').insert(gameFamily)
      .then(() => {
        return Bluebird.all([
          Knex('users').insert(user),
          Knex('games').insert(game)
        ]);
      })
      .then(() => Knex('dexes').insert(dex));
    });

    describe('total', () => {

      it('gets the total pokemon if it is not a regional dex', () => {
        return new Dex({ id: dex.id }).fetch({ withRelated: Dex.RELATED })
        .then((model) => {
          expect(model.get('total')).to.eql(gameFamily.national_total);
        });
      });

      it('gets the total pokemon if it is a regional dex', () => {
        return new Dex({ id: dex.id }).fetch()
        .then((model) => model.save({ regional: true }, { path: true }))
        .then((model) => model.refresh({ withRelated: Dex.RELATED }, { path: true }))
        .then((model) => {
          expect(model.get('total')).to.eql(gameFamily.regional_total);
        });
      });

    });

  });

  describe('serialize', () => {

    it('returns the correct fields', () => {
      const model = Dex.forge(dex);
      model.relations.game = Game.forge(game);

      return model.serialize()
      .then((json) => {
        expect(json).to.have.all.keys([
          'id',
          'user_id',
          'title',
          'slug',
          'shiny',
          'game',
          'regional',
          'caught',
          'total',
          'date_created',
          'date_modified'
        ]);
        expect(json.game.id).to.eql(game.id);
      });
    });

  });

});

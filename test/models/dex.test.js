'use strict';

const Bluebird = require('bluebird');

const Dex  = require('../../src/models/dex');
const Knex = require('../../src/libraries/knex');

const user = Factory.build('user');

const gameFamily = Factory.build('game-family');

const firstPokemon  = Factory.build('pokemon', { id: 1, national_id: 1, game_family_id: gameFamily.id });
const secondPokemon = Factory.build('pokemon', { id: 2, national_id: 2, game_family_id: gameFamily.id });

const dex = Factory.build('dex', { user_id: user.id });

const firstCapture  = Factory.build('capture', { pokemon_id: firstPokemon.id, dex_id: dex.id });
const secondCapture = Factory.build('capture', { pokemon_id: secondPokemon.id, dex_id: dex.id });

describe('dex model', () => {

  describe('caught', () => {

    beforeEach(() => {
      return Knex('game_families').insert(gameFamily)
      .then(() => {
        return Bluebird.all([
          Knex('users').insert(user),
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

    describe('total', () => {

      it('gets the total pokemon in a generation and region', () => {
        expect(Dex.forge({ generation: 6, region: 'national' }).get('total')).to.eql(721);
      });

    });

  });

  describe('serialize', () => {

    it('returns the correct fields', () => {
      return Dex.forge(dex).serialize()
      .then((json) => {
        expect(json).to.have.all.keys([
          'id',
          'user_id',
          'title',
          'slug',
          'shiny',
          'generation',
          'region',
          'caught',
          'total',
          'date_created',
          'date_modified'
        ]);
      });
    });

  });

});

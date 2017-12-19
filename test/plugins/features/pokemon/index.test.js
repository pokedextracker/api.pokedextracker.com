'use strict';

const Knex   = require('../../../../src/libraries/knex');
const Server = require('../../../../src/server');

const gameFamily = Factory.build('game-family');

const firstPokemon  = Factory.build('pokemon', { game_family_id: gameFamily.id });
const secondPokemon = Factory.build('pokemon', { game_family_id: gameFamily.id });

describe('pokemon integration', () => {

  beforeEach(() => {
    return Knex('game_families').insert(gameFamily);
  });

  describe('list', () => {

    beforeEach(() => {
      return Knex('pokemon').insert([firstPokemon, secondPokemon]);
    });

    it('returns a collection of pokemon', () => {
      return Server.inject({
        method: 'GET',
        url: '/pokemon'
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

  describe('retrieve', () => {

    beforeEach(() => {
      return Knex('pokemon').insert(firstPokemon);
    });

    it('returns an individual pokemon from its national ID', () => {
      return Server.inject({
        method: 'GET',
        url: `/pokemon/${firstPokemon.id}`
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

});

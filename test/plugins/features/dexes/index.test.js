'use strict';

const JWT = require('jsonwebtoken');

const Config = require('../../../../config');
const Knex   = require('../../../../src/libraries/knex');
const Server = require('../../../../src/server');

const user = Factory.build('user');

const oras = Factory.build('game-family', { id: 'omega_ruby_alpha_sapphire', order: 14 });

const omegaRuby = Factory.build('game', { id: 'omega_ruby', game_family_id: oras.id });

const firstDex  = Factory.build('dex', { user_id: user.id, game_id: omegaRuby.id });
const secondDex = Factory.build('dex', { user_id: user.id, title: 'Another', slug: 'another', game_id: omegaRuby.id });

const auth = `Bearer ${JWT.sign(user, Config.JWT_SECRET)}`;

describe('dexes integration', () => {

  beforeEach(() => {
    return Knex('game_families').insert(oras)
    .then(() => Knex('games').insert(omegaRuby));
  });

  describe('retrieve', () => {

    beforeEach(() => {
      return Knex('users').insert(user)
      .then(() => Knex('dexes').insert(firstDex));
    });

    it('returns a dex from the username and slug', () => {
      return Server.inject({
        method: 'GET',
        url: `/users/${user.username}/dexes/${firstDex.slug}`
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

  describe('create', () => {

    beforeEach(() => {
      return Knex('users').insert(user);
    });

    it('saves a dex', () => {
      return Server.inject({
        method: 'POST',
        url: `/users/${user.username}/dexes`,
        headers: { authorization: auth },
        payload: {
          title: 'Testing',
          shiny: false,
          generation: 6,
          region: 'national'
        }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

    it('requires authentication', () => {
      return Server.inject({
        method: 'POST',
        url: `/users/${user.username}/dexes`,
        payload: {
          title: 'Testing',
          shiny: false,
          generation: 6
        }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(401);
      });
    });

  });

  describe('update', () => {

    beforeEach(() => {
      return Knex('users').insert(user)
      .then(() => Knex('dexes').insert(firstDex));
    });

    it('updates a dex', () => {
      return Server.inject({
        method: 'POST',
        url: `/users/${user.username}/dexes/${firstDex.slug}`,
        headers: { authorization: auth },
        payload: { title: 'Testing' }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

    it('requires authentication', () => {
      return Server.inject({
        method: 'POST',
        url: `/users/${user.username}/dexes/${firstDex.slug}`,
        payload: { title: 'Testing' }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(401);
      });
    });

  });

  describe('delete', () => {

    beforeEach(() => {
      return Knex('users').insert(user)
      .then(() => Knex('dexes').insert([firstDex, secondDex]));
    });

    it('deletes a dex', () => {
      return Server.inject({
        method: 'DELETE',
        url: `/users/${user.username}/dexes/${firstDex.slug}`,
        headers: { authorization: auth }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

    it('requires authentication', () => {
      return Server.inject({
        method: 'DELETE',
        url: `/users/${user.username}/dexes/${firstDex.slug}`
      })
      .then((res) => {
        expect(res.statusCode).to.eql(401);
      });
    });

  });

});

'use strict';

const JWT = require('jsonwebtoken');

const Config = require('../../../../config');
const Knex   = require('../../../../src/libraries/knex');
const Server = require('../../../../src/server');
const User   = require('../../../../src/models/user');

const firstUser  = Factory.build('user');
const secondUser = Factory.build('user');

const oras = Factory.build('game-family', { id: 'omega_ruby_alpha_sapphire', order: 14 });

const omegaRuby = Factory.build('game', { id: 'omega_ruby', game_family_id: oras.id });

describe('users integration', () => {

  beforeEach(() => {
    return Knex('game_families').insert(oras)
    .then(() => Knex('games').insert(omegaRuby));
  });

  describe('list', () => {

    beforeEach(() => {
      return Knex('users').insert([firstUser, secondUser]);
    });

    it('returns a collection of users', () => {
      return Server.inject({
        method: 'GET',
        url: '/users'
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

  describe('retrieve', () => {

    beforeEach(() => {
      return Knex('users').insert(firstUser);
    });

    it('returns an individual user from its username', () => {
      return Server.inject({
        method: 'GET',
        url: `/users/${firstUser.username}`
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

  describe('create', () => {

    it('saves a user', () => {
      return Server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'test',
          password: 'testtest',
          referrer: 'http://test.com',
          title: 'Test',
          shiny: false,
          game: omegaRuby.id,
          regional: false
        }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

    it('saves an X-Forwarded-For IP address if present', () => {
      const ip = '123.123.123.123';
      const username = 'test';

      return Server.inject({
        method: 'POST',
        url: '/users',
        headers: { 'X-Forwarded-For': ip },
        payload: {
          username,
          password: 'testtest',
          title: 'Test',
          shiny: false,
          game: omegaRuby.id,
          regional: false
        }
      })
      .then(() => new User().where('username', username).fetch())
      .then((user) => {
        expect(user.get('last_ip')).to.eql(ip);
      });
    });

    it('saves the first X-Forwarded-For IP address if multiple are present', () => {
      const ips = ['123.123.123.123', '124.124.124.124'];
      const username = 'test';

      return Server.inject({
        method: 'POST',
        url: '/users',
        headers: { 'X-Forwarded-For': ips.join(',') },
        payload: {
          username,
          password: 'testtest',
          title: 'Test',
          shiny: false,
          game: omegaRuby.id,
          regional: false
        }
      })
      .then(() => new User().where('username', username).fetch())
      .then((user) => {
        expect(user.get('last_ip')).to.eql(ips[0]);
      });
    });

  });

  describe('update', () => {

    const auth = `Bearer ${JWT.sign(firstUser, Config.JWT_SECRET)}`;

    beforeEach(() => {
      return Knex('users').insert(firstUser);
    });

    it('updates a user', () => {
      return Server.inject({
        method: 'POST',
        url: `/users/${firstUser.username}`,
        headers: { authorization: auth },
        payload: { friend_code_3ds: '4321-4321-4321' }
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

});

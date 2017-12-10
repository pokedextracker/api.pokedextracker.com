'use strict';

const JWT = require('jsonwebtoken');

const Config = require('../../../../config');
const Knex   = require('../../../../src/libraries/knex');
const Server = require('../../../../src/server');
const Stripe = require('../../../../src/libraries/stripe');

const user = Factory.build('user');

const card = Factory.build('card');

const auth = `Bearer ${JWT.sign(user, Config.JWT_SECRET)}`;

describe('donations integration', () => {

  describe('create', () => {

    let amount;

    beforeEach(() => {
      amount = parseFloat((Math.random() * 100).toFixed(2));

      return Knex('users').insert(user);
    });

    it('accepts a donation with authentication', () => {
      return Stripe.tokens.create({ card })
      .then((token) => {
        return Server.inject({
          method: 'POST',
          url: `/donations`,
          headers: { authorization: auth },
          payload: {
            email: 'test@test.com',
            token: token.id,
            amount
          }
        });
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

    it('accepts a donation without authentication', () => {
      return Stripe.tokens.create({ card })
      .then((token) => {
        return Server.inject({
          method: 'POST',
          url: `/donations`,
          payload: {
            email: 'test@test.com',
            token: token.id,
            amount
          }
        });
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

});

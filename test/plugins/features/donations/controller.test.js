'use strict';

const Bluebird = require('bluebird');
const Sinon    = require('sinon');

const Controller = require('../../../../src/plugins/features/donations/controller');
const Errors     = require('../../../../src/libraries/errors');
const Knex       = require('../../../../src/libraries/knex');
const Stripe     = require('../../../../src/libraries/stripe');
const User       = require('../../../../src/models/user');

const user = Factory.build('user');

const card = Factory.build('card');

const userlessRequest = Factory.build('request', { auth: { credentials: null } });
const userRequest     = Factory.build('request', { auth: { credentials: user } });

describe('donations controller', () => {

  describe('create', () => {

    let sandbox;
    let amount;

    beforeEach(() => {
      sandbox = Sinon.sandbox.create();
      amount = parseFloat((Math.random() * 100).toFixed(2));

      return Knex('users').insert(user);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('creates a Stripe customer, charges the card, and then deletes the card', () => {
      sandbox.spy(Stripe.customers, 'create');
      sandbox.spy(Stripe.customers, 'deleteCard');

      return Stripe.tokens.create({ card })
      .then((token) => {
        return Controller.create({
          token: token.id,
          name: 'Test',
          email: 'test@test.com',
          amount,
          message: 'Thank you!'
        }, userlessRequest);
      })
      .then((response) => {
        expect(response.success).to.be.true;
        expect(Stripe.customers.create.called).to.be.true;

        const customer = Stripe.customers.deleteCard.firstCall.args[0];

        return Bluebird.all([
          Stripe.charges.list({ customer, limit: 1 }),
          Stripe.customers.retrieve(customer)
        ]);
      })
      .spread((charges, customer) => {
        expect(charges.data[0].amount).to.eql(parseInt(amount * 100));
        expect(customer.sources.data).to.be.empty;
      });
    });

    it('saves the stripe_id to the user if they are signed in', () => {
      sandbox.spy(Stripe.customers, 'deleteCard');

      return Stripe.tokens.create({ card })
      .then((token) => {
        return Controller.create({
          token: token.id,
          email: 'test@test.com',
          amount,
          message: 'Thank you!'
        }, userRequest);
      })
      .then(() => {
        const customer = Stripe.customers.deleteCard.firstCall.args[0];

        return new User({ id: user.id }).fetch()
        .then((u) => {
          expect(u.get('stripe_id')).to.eql(customer);
        });
      });
    });

    it('saves the stripe_id to the user if they are signed in', () => {
      sandbox.spy(Stripe.customers, 'update');

      return Stripe.customers.create()
      .then((customer) => new User({ id: user.id }).save({ stripe_id: customer.id }, { patch: true }))
      .then(() => Stripe.tokens.create({ card }))
      .then((token) => {
        return Controller.create({
          token: token.id,
          email: 'test@test.com',
          amount,
          message: 'Thank you!'
        }, userRequest);
      })
      .then(() => {
        expect(Stripe.customers.update.called).to.be.true;
      });
    });

    it('wraps any Stripe errors with a 422', () => {
      return Controller.create({
        token: 'bad_token',
        email: 'test@test.com',
        amount,
        message: 'Thank you!'
      }, userRequest)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.UnprocessableEntity);
      });
    });

  });

});

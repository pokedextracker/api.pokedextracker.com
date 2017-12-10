'use strict';

const Bluebird = require('bluebird');

const Errors = require('../../../libraries/errors');
const Stripe = require('../../../libraries/stripe');
const User   = require('../../../models/user');

exports.create = function (payload, request) {
  const auth = request.auth.credentials || {};
  let user;

  return Bluebird.try(() => {
    return auth.id && new User({ id: auth.id }).fetch().then((u) => user = u);
  })
  .then(() => {
    if (user && user.get('stripe_id')) {
      return Stripe.customers.update(user.get('stripe_id'), { source: payload.token });
    }

    return Stripe.customers.create({
      description: payload.name || auth.username,
      email: payload.email,
      source: payload.token,
      metadata: {
        id: auth.id,
        username: auth.username,
        name: payload.name
      }
    })
    .tap((customer) => user && user.save({ stripe_id: customer.id }));
  })
  .then((customer) => {
    return Stripe.charges.create({
      description: 'PokédexTracker Donation',
      statement_descriptor: 'POKEDEXTRACKER.COM',
      customer: customer.id,
      amount: parseInt(payload.amount * 100),
      currency: 'usd',
      metadata: {
        message: payload.message
      }
    });
  })
  .then((charge) => {
    return Stripe.customers.deleteCard(charge.customer, charge.source.id);
  })
  .then(() => ({ success: true }))
  .catch(Errors.GenericStripe, (err) => {
    throw new Errors.UnprocessableEntity(err.message);
  });
};

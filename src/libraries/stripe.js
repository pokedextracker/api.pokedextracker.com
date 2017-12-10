'use strict';

const Stripe = require('stripe');

const Config = require('../../config');

module.exports = Stripe(Config.STRIPE_API_KEY);

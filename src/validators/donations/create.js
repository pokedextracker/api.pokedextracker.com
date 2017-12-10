'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  name: Joi.string().max(100).trim(),
  email: Joi.string().email().max(100).trim().required(),
  token: Joi.string().max(100).required(),
  message: Joi.string().max(500).trim(),
  amount: Joi.number().min(1).max(10000).required()
})
.options({
  language: {
    number: { min: '!!The minimum donation we can accept is $1.00' }
  }
});

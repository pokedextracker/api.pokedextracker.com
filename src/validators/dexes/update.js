'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().max(300).trim(),
  shiny: Joi.boolean(),
  generation: Joi.number().integer().min(6).max(7),
  game: Joi.string().max(50).trim(),
  region: Joi.string().valid('national').when('generation', {
    is: 7,
    then: Joi.valid('alola')
  }),
  regional: Joi.boolean()
});

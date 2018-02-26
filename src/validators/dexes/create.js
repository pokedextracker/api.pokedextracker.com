'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().max(300).trim().required(),
  shiny: Joi.boolean().required(),
  game: Joi.string().max(50).trim().required(),
  regional: Joi.boolean().required()
});

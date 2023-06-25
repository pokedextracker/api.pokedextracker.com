'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().max(300).trim().required(),
  slug: Joi.string().max(300).trim(),
  shiny: Joi.boolean().required(),
  game: Joi.string().max(50).trim().required(),
  dex_type: Joi.number().integer().required()
});

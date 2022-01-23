'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  title: Joi.string().max(300).trim(),
  shiny: Joi.boolean(),
  game: Joi.string().max(50).trim(),
  dex_type: Joi.number().integer()
});

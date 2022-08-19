'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  username: Joi.string().token().max(20).trim().required(),
  password: Joi.string().min(8).max(72).required(),
  friend_code_3ds: Joi.string().regex(/^\d{4}-\d{4}-\d{4}$/).empty(['', null])
    .options({
      language: {
        string: { regex: { base: 'must be a valid 3DS friend code' } }
      }
    }),
  friend_code_switch: Joi.string().regex(/^SW-\d{4}-\d{4}-\d{4}$/).empty(['', null])
    .options({
      language: {
        string: { regex: { base: 'must be a valid Switch friend code' } }
      }
    }),
  first_pokemon_db: Joi.string().max(20).empty(['', null]),
  second_pokemon_db: Joi.string().max(20).empty(['', null]),
  referrer: Joi.string().empty(['', null]),
  title: Joi.string().max(300).trim().required(),
  shiny: Joi.boolean().required(),
  game: Joi.string().max(50).trim().required(),
  dex_type: Joi.number().integer().required()
});

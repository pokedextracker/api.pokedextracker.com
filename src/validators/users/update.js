'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  password: Joi.string().min(8).max(72).empty(['', null]),
  friend_code_3ds: Joi.string().regex(/^\d{4}-\d{4}-\d{4}$/).empty(['', null]).default(null)
    .options({
      language: {
        string: { regex: { base: 'must be a valid 3DS friend code' } }
      }
    }),
  friend_code_switch: Joi.string().regex(/^SW-\d{4}-\d{4}-\d{4}$/).empty(['', null]).default(null)
    .options({
      language: {
        string: { regex: { base: 'must be a valid Switch friend code' } }
      }
    }),
  first_pokemon_db: Joi.string().max(20).empty(['', null]),
  second_pokemon_db: Joi.string().max(20).empty(['', null])
});

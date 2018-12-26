'use strict';

const Joi = require('joi');

module.exports = Joi.object().keys({
  password: Joi.string().min(8).max(72).empty(['', null]),
  friend_code: Joi.string().regex(/^\d{4}-\d{4}-\d{4}$/).empty(['', null]).default(null)
    .options({
      language: {
        string: { regex: { base: 'must be a valid 3DS friend code' } }
      }
    }),
  '3ds_friend_code': Joi.string().regex(/^\d{4}-\d{4}-\d{4}$/).empty(['', null]).default(null)
    .options({
      language: {
        string: { regex: { base: 'must be a valid 3DS friend code' } }
      }
    }),
  switch_friend_code: Joi.string().regex(/^SW-\d{4}-\d{4}-\d{4}$/).empty(['', null]).default(null)
    .options({
      language: {
        string: { regex: { base: 'must be a valid Switch friend code' } }
      }
    })
});

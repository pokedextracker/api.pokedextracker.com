'use strict';

const Joi = require('joi');

module.exports = Joi.object({
  game_family: Joi.string().max(50).trim(),
  regional: Joi.when('game_family', {
    is: Joi.required(),
    then: Joi.boolean(),
    otherwise: Joi.forbidden()
  })
});

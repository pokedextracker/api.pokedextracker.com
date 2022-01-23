'use strict';

const Joi = require('joi');

module.exports = Joi.object({
  dex_type: Joi.number().integer()
});

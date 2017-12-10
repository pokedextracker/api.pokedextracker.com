'use strict';

module.exports = Factory.define('card')
  .attr('number', '4242424242424242')
  .attr('exp_month', 12)
  .attr('exp_year', () => new Date().getUTCFullYear() + 1)
  .attr('cvc', '123');

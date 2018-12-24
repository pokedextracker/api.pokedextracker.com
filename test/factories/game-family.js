'use strict';

module.exports = Factory.define('game-family')
  .sequence('id', (i) => `red_blue_${i}`)
  .attr('generation', 1)
  .attr('regional_total', 151)
  .attr('national_total', 151)
  .attr('regional_support', true)
  .attr('national_support', true)
  .sequence('order')
  .attr('published', false);

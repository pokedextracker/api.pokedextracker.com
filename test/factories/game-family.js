'use strict';

module.exports = Factory.define('game-family')
  .sequence('id', (i) => `red_blue_${i}`)
  .attr('generation', 1)
  .attr('regional_total', 151)
  .attr('national_total', 151)
  .sequence('order')
  .attr('published', false);

'use strict';

module.exports = Factory.define('game')
  .sequence('id', (i) => `red_${i}`)
  .attr('name', 'Red')
  .sequence('order');

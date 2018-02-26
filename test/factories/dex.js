'use strict';

module.exports = Factory.define('dex')
  .sequence('id')
  .attr('title', 'Test Living Dex')
  .attr('slug', 'test-living-dex')
  .attr('shiny', false)
  .attr('regional', false);

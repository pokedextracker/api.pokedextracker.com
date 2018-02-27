'use strict';

module.exports = Factory.define('pokemon')
  .sequence('id')
  .sequence('national_id')
  .sequence('evolution_family_id')
  .attr('name', '')
  .sequence('national_order');

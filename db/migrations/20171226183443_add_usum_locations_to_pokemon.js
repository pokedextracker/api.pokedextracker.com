'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('pokemon', (table) => {
    table.text('us_location');
    table.text('um_location');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('pokemon', (table) => {
    table.dropColumn('us_location');
    table.dropColumn('um_location');
  });
};

'use strict';

exports.up = function (Knex) {
  return Knex.schema.table('pokemon', (table) => {
    table.dropColumn('box');
  });
};

exports.down = function (Knex) {
  return Knex.schema.table('pokemon', (table) => {
    table.text('box');
  });
};

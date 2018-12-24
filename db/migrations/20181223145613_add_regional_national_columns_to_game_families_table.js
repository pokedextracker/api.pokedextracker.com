'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('game_families', (table) => {
    table.boolean('regional_support').notNullable().defaultTo(false);
    table.boolean('national_support').notNullable().defaultTo(false);
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.table('game_families', (table) => {
    table.dropColumn('regional_support');
    table.dropColumn('national_support');
  });
};

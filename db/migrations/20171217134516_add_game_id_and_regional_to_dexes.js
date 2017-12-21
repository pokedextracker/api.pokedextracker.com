'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('dexes', (table) => {
    table.text('game_id').references('id').inTable('games').index();
    table.boolean('regional');
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.table('dexes', (table) => {
    table.dropColumn('game_id');
    table.dropColumn('regional');
  });
};

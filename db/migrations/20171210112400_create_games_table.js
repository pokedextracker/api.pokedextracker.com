'use strict';

exports.up = function (Knex) {
  return Knex.schema.createTable('games', (table) => {
    table.text('id').primary();
    table.text('name').notNullable();
    table.text('game_family_id').references('id').inTable('game_families').notNullable().index();
    table.integer('order').notNullable().unique();
  });
};

exports.down = function (Knex) {
  return Knex.schema.dropTable('games');
};

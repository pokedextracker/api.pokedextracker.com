'use strict';

exports.up = function (Knex) {
  return Knex.schema.createTable('game_families', (table) => {
    table.text('id').primary();
    table.integer('generation').notNullable();
    table.integer('regional_total').notNullable();
    table.integer('national_total').notNullable();
    table.integer('order').notNullable().unique();
    table.boolean('published').notNullable().defaultTo(false);
  });
};

exports.down = function (Knex) {
  return Knex.schema.dropTable('game_families');
};

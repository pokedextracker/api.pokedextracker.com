'use strict';

exports.up = function (Knex) {
  return Knex.schema.table('pokemon', (table) => {
    table.dropColumn('generation');
    table.dropColumn('kanto_id');
    table.dropColumn('johto_id');
    table.dropColumn('hoenn_id');
    table.dropColumn('sinnoh_id');
    table.dropColumn('unova_id');
    table.dropColumn('central_kalos_id');
    table.dropColumn('coastal_kalos_id');
    table.dropColumn('mountain_kalos_id');
    table.dropColumn('alola_id');
  })
  .then(() => {
    return Knex.schema.table('dexes', (table) => {
      table.dropColumn('generation');
      table.dropColumn('region');
    });
  });
};

exports.down = function (Knex) {
  return Knex.schema.table('pokemon', (table) => {
    table.integer('generation');
    table.integer('kanto_id');
    table.integer('johto_id');
    table.integer('hoenn_id');
    table.integer('sinnoh_id');
    table.integer('unova_id');
    table.integer('central_kalos_id');
    table.integer('coastal_kalos_id');
    table.integer('mountain_kalos_id');
    table.integer('alola_id');
  })
  .then(() => {
    return Knex.schema.table('dexes', (table) => {
      table.integer('generation');
      table.text('region');
    });
  });
};

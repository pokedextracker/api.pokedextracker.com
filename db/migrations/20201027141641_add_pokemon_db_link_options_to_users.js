'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('users', (table) => {
    table.string('first_pokemon_db', 20).defaultTo('Bulbapedia');
    table.string('second_pokemon_db', 20).defaultTo('Serebii');
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.table('users', (table) => {
    table.dropColumn('first_pokemon_db');
    table.dropColumn('second_pokemon_db');
  });
};

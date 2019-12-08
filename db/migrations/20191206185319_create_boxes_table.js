'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.createTable('boxes', (table) => {
    table.primary(['game_family_id', 'regional', 'pokemon_id']);
    table.text('game_family_id').notNullable().references('id').inTable('game_families');
    table.boolean('regional').notNullable();
    table.integer('pokemon_id').notNullable().references('id').inTable('pokemon').onDelete('CASCADE').index();
    table.text('value').notNullable();
  })
  .then(() => Knex('pokemon'))
  .map((pokemon) => {
    return Promise.all([
      pokemon.box && Knex('boxes').insert({
        game_family_id: 'ultra_sun_ultra_moon',
        regional: false,
        pokemon_id: pokemon.id,
        value: pokemon.box
      }),
      pokemon.box && Knex('boxes').insert({
        game_family_id: 'sun_moon',
        regional: false,
        pokemon_id: pokemon.id,
        value: pokemon.box
      })
    ]);
  });
};

exports.down = function (Knex) {
  return Knex.schema.dropTable('boxes');
};

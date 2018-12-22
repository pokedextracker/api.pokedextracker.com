'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.createTable('locations', (table) => {
    table.primary(['game_id', 'pokemon_id']);
    table.text('game_id').references('id').inTable('games').onDelete('CASCADE').index();
    table.integer('pokemon_id').references('id').inTable('pokemon').onDelete('CASCADE').index();
    table.text('value').notNullable();
  })
  .then(() => Knex('pokemon'))
  .map((pokemon) => {
    return Promise.all([
      pokemon.x_location && Knex('locations').insert({
        game_id: 'x',
        pokemon_id: pokemon.id,
        value: pokemon.x_location
      }),
      pokemon.y_location && Knex('locations').insert({
        game_id: 'y',
        pokemon_id: pokemon.id,
        value: pokemon.y_location
      }),
      pokemon.or_location && Knex('locations').insert({
        game_id: 'omega_ruby',
        pokemon_id: pokemon.id,
        value: pokemon.or_location
      }),
      pokemon.as_location && Knex('locations').insert({
        game_id: 'alpha_sapphire',
        pokemon_id: pokemon.id,
        value: pokemon.as_location
      }),
      pokemon.sun_location && Knex('locations').insert({
        game_id: 'sun',
        pokemon_id: pokemon.id,
        value: pokemon.sun_location
      }),
      pokemon.moon_location && Knex('locations').insert({
        game_id: 'moon',
        pokemon_id: pokemon.id,
        value: pokemon.moon_location
      }),
      pokemon.us_location && Knex('locations').insert({
        game_id: 'ultra_sun',
        pokemon_id: pokemon.id,
        value: pokemon.us_location
      }),
      pokemon.um_location && Knex('locations').insert({
        game_id: 'ultra_moon',
        pokemon_id: pokemon.id,
        value: pokemon.um_location
      })
    ]);
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.dropTable('locations');
};

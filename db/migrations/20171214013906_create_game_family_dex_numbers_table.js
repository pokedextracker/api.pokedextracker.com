'use strict';

const FAMILIES = {
  kanto: ['red_blue', 'yellow', 'fire_red_leaf_green'],
  johto: ['gold_silver', 'crystal', 'heart_gold_soul_silver'],
  hoenn: ['ruby_sapphire', 'emerald', 'omega_ruby_alpha_sapphire'],
  sinnoh: ['diamond_pearl', 'platinum'],
  unova: ['black_white', 'black_2_white_2'],
  central_kalos: ['x_y'],
  coastal_kalos: ['x_y'],
  mountain_kalos: ['x_y'],
  alola: ['sun_moon']
};
const MAX_CENTRAL_KALOS_ID = 153;
const MAX_COASTAL_KALOS_ID = 153;

exports.up = function (Knex) {
  return Knex.schema.createTable('game_family_dex_numbers', (table) => {
    table.text('game_family_id').references('id').inTable('game_families').notNullable();
    table.integer('pokemon_id').references('id').inTable('pokemon').notNullable().index();
    table.integer('dex_number').notNullable();

    table.primary(['game_family_id', 'pokemon_id']);
  })
  .then(() => {
    return Promise.all([
      Knex('pokemon'),
      Knex('game_families').select('id')
    ]);
  })
  .spread((pokemon, families) => {
    families = families.map((family) => family.id);

    return Promise.all(pokemon.map((p) => {
      const rows = Object.keys(FAMILIES)
        .map((region) => {
          if (p[`${region}_id`] === null) {
            return null;
          }

          let number = p[`${region}_id`];

          if (region === 'coastal_kalos') {
            number += MAX_CENTRAL_KALOS_ID;
          } else if (region === 'mountain_kalos') {
            number += MAX_CENTRAL_KALOS_ID + MAX_COASTAL_KALOS_ID;
          }

          return FAMILIES[region].map((family) => {
            if (families.indexOf(family) === -1) {
              return null;
            }

            return {
              pokemon_id: p.id,
              game_family_id: family,
              dex_number: number
            };
          });
        })
        .filter((row) => row)
        .reduce((a, b) => a.concat(b), [])
        .filter((row) => row);

      return Knex('game_family_dex_numbers').insert(rows);
    }));
  });
};

exports.down = function (Knex) {
  return Knex.schema.dropTable('game_family_dex_numbers');
};

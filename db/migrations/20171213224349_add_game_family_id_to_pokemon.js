'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('pokemon', (table) => {
    table.text('game_family_id').references('id').inTable('game_families').index();
  })
  .then(() => {
    return Knex.raw(`
      UPDATE pokemon
      SET
        game_family_id = gf.id
      FROM (
        SELECT
          DISTINCT(f1.id),
          f1.generation
        FROM game_families f1
        INNER JOIN game_families f2 ON f1.generation = f2.generation
        GROUP BY
          1, 2
        HAVING f1.order = MIN(f2.order)
      ) AS gf
      WHERE
        pokemon.generation = gf.generation
    `);
  })
  .then(() => Knex.raw('ALTER TABLE pokemon ALTER COLUMN game_family_id SET NOT NULL'));
};

exports.down = function (Knex, Promise) {
  return Knex.schema.table('pokemon', (table) => {
    table.dropColumn('game_family_id');
  });
};

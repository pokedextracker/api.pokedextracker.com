'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('dex_types_pokemon', (table) => {
    table.integer('dex_number');
  })
  .then(() => {
    // Update the dex number for all regional dex types, pulling from
    // game_family_dex_numbers.
    return Knex.schema.raw(`
update dex_types_pokemon set dex_number = dn.dex_number from dex_types dt, game_family_dex_numbers dn where dt.id = dex_types_pokemon.dex_type_id and dn.game_family_id = dt.game_family_id and dn.pokemon_id = dex_types_pokemon.pokemon_id and dt.name = 'Regional';
    `);
  })
  .then(() => {
    // Update the dex number for all national dex types, pulling from national
    // IDs.
    return Knex.schema.raw(`
update dex_types_pokemon set dex_number = p.national_id from dex_types dt, pokemon p where dt.id = dex_types_pokemon.dex_type_id and p.id = dex_types_pokemon.pokemon_id and dt.name = 'Full National';
    `);
  })
  .then(() => {
    return Knex.schema.raw('ALTER TABLE dex_types_pokemon ALTER COLUMN dex_number SET NOT NULL');
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.raw(`UPDATE dexes SET regional = (dex_types.name = 'Regional') FROM dex_types WHERE dex_types.id = dexes.dex_type_id AND dexes.regional IS NULL`)
  .then(() => {
    return Knex.schema.table('dexes', (table) => {
      table.dropColumn('dex_type_id');
    });
  })
  .then(() => {
    return Knex.schema.raw('ALTER TABLE dexes ALTER COLUMN regional SET NOT NULL');
  });
};

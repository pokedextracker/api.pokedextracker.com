'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('dexes', (table) => {
    table.integer('dex_type_id').references('id').inTable('dex_types');
  })
  .then(() => {
    return Knex.schema.raw(`
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'x_y' and name = 'Regional') where game_id in ('x', 'y') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'x_y' and name = 'Full National') where game_id in ('x', 'y') and regional = false;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'omega_ruby_alpha_sapphire' and name = 'Regional') where game_id in ('omega_ruby', 'alpha_sapphire') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'omega_ruby_alpha_sapphire' and name = 'Full National') where game_id in ('omega_ruby', 'alpha_sapphire') and regional = false;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'sun_moon' and name = 'Regional') where game_id in ('sun', 'moon') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'sun_moon' and name = 'Full National') where game_id in ('sun', 'moon') and regional = false;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'ultra_sun_ultra_moon' and name = 'Regional') where game_id in ('ultra_sun', 'ultra_moon') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'ultra_sun_ultra_moon' and name = 'Full National') where game_id in ('ultra_sun', 'ultra_moon') and regional = false;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'lets_go_pikachu_eevee' and name = 'Regional') where game_id in ('lets_go_pikachu', 'lets_go_eevee') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'sword_shield' and name = 'Regional') where game_id in ('sword', 'shield') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'sword_shield' and name = 'Full National') where game_id in ('sword', 'shield') and regional = false;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'sword_shield_expansion_pass' and name = 'Regional') where game_id in ('sword_expansion_pass', 'shield_expansion_pass') and regional = true;
update dexes set dex_type_id = (select id from dex_types where game_family_id = 'sword_shield_expansion_pass' and name = 'Full National') where game_id in ('sword_expansion_pass', 'shield_expansion_pass') and regional = false;
    `);
  })
  .then(() => {
    return Knex.schema.raw('ALTER TABLE dexes ALTER COLUMN dex_type_id SET NOT NULL');
  })
  .then(() => {
    return Knex.schema.raw('ALTER TABLE dexes ALTER COLUMN regional DROP NOT NULL');
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

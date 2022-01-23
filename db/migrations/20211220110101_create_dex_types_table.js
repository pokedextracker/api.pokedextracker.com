'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.createTable('dex_types', (table) => {
    table.increments('id').index();
    table.text('name').notNullable();
    table.text('game_family_id').references('id').inTable('game_families').notNullable();
    table.integer('order').notNullable();
    table.specificType('tags', 'text[]');
  })
  .then(() => {
    return Knex.schema.createTable('dex_types_pokemon', (table) => {
      table.integer('dex_type_id').references('id').inTable('dex_types').notNullable();
      table.integer('pokemon_id').references('id').inTable('pokemon').notNullable();
      table.text('box');
      table.integer('order').notNullable();

      table.primary(['dex_type_id', 'pokemon_id']);
    });
  })
  .then(() => {
    // Populate the dex_types table with all of the current dex types.
    return Knex.schema.raw(`
insert into dex_types
  (game_family_id, name, "order", tags)
values
  ('x_y', 'Regional', 1, '{"regional"}'),
  ('x_y', 'Full National', 2, '{"full national"}'),
  ('omega_ruby_alpha_sapphire', 'Regional', 1, '{"regional"}'),
  ('omega_ruby_alpha_sapphire', 'Full National', 2, '{"full national"}'),
  ('sun_moon', 'Regional', 1, '{"regional"}'),
  ('sun_moon', 'Full National', 2, '{"full national"}'),
  ('ultra_sun_ultra_moon', 'Regional', 1, '{"regional"}'),
  ('ultra_sun_ultra_moon', 'Full National', 2, '{"full national"}'),
  ('lets_go_pikachu_eevee', 'Regional', 1, '{"regional"}'),
  ('sword_shield', 'Regional', 1, '{"regional"}'),
  ('sword_shield', 'Full National', 2, '{"full national"}'),
  ('sword_shield_expansion_pass', 'Regional', 1, '{"regional"}'),
  ('sword_shield_expansion_pass', 'Full National', 2, '{"full national"}')
;
    `)
    .catch((err) => {
      // Ideally, we could do a ON CONFLICT DO NOTHING, but our version of
      // Postgres doesn't support that. So we just catch the error, log it, and
      // move on.
      console.log('dex_types insert error:', err); // eslint-disable-line
    });
  })
  .then(() => {
    // Populate the dex_types_pokemon table with the current pokemon.
    return Knex.schema.raw(`
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'x_y' and name = 'Regional'), p.id, null, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'x_y' where national_id <= 721 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'x_y' and name = 'Full National'), p.id, null, row_number() over (order by p.national_id) from pokemon p where national_id <= 721 and national_order >= 0 and form is null order by p.national_id;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'omega_ruby_alpha_sapphire' and name = 'Regional'), p.id, null, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'omega_ruby_alpha_sapphire' where national_id <= 721 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'omega_ruby_alpha_sapphire' and name = 'Full National'), p.id, null, row_number() over (order by p.national_id) from pokemon p where national_id <= 721 and national_order >= 0 and form is null order by p.national_id;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'sun_moon' and name = 'Regional'), p.id, null, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'sun_moon' where national_id <= 802 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'sun_moon' and name = 'Full National'), p.id, b.value, row_number() over (order by form nulls first, p.national_id) from pokemon p left outer join boxes b on p.id = b.pokemon_id and b.regional = false and b.game_family_id = 'sun_moon' where national_id <= 802 and national_order >= 0 and (form is null or form in ('alola')) order by form nulls first, p.national_id;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'ultra_sun_ultra_moon' and name = 'Regional'), p.id, null, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'ultra_sun_ultra_moon' where national_id <= 807 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'ultra_sun_ultra_moon' and name = 'Full National'), p.id, b.value, row_number() over (order by form nulls first, p.national_id) from pokemon p left outer join boxes b on p.id = b.pokemon_id and b.regional = false and b.game_family_id = 'ultra_sun_ultra_moon' where national_id <= 807 and national_order >= 0 and (form is null or form in ('alola')) order by form nulls first, p.national_id;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'lets_go_pikachu_eevee' and name = 'Regional'), p.id, null, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'lets_go_pikachu_eevee' where national_id <= 809 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'sword_shield' and name = 'Regional'), p.id, b.value, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'sword_shield' left outer join boxes b on p.id = b.pokemon_id and b.regional = true and b.game_family_id = 'sword_shield' where national_id <= 890 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'sword_shield' and name = 'Full National'), p.id, b.value, row_number() over (order by form nulls first, p.national_id) from pokemon p left outer join boxes b on p.id = b.pokemon_id and b.regional = false and b.game_family_id = 'sword_shield' where national_id <= 898 and national_order >= 0 and (form is null or form in ('alola', 'galar', 'gigantamax')) order by form nulls first, p.national_id;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'sword_shield_expansion_pass' and name = 'Regional'), p.id, b.value, row_number() over (order by dn.dex_number) from pokemon p inner join game_family_dex_numbers dn on p.id = dn.pokemon_id and dn.game_family_id = 'sword_shield_expansion_pass' left outer join boxes b on p.id = b.pokemon_id and b.regional = true and b.game_family_id = 'sword_shield_expansion_pass' where national_id <= 898 order by dn.dex_number;
insert into dex_types_pokemon (dex_type_id, pokemon_id, box, "order") select (select id from dex_types where game_family_id = 'sword_shield_expansion_pass' and name = 'Full National'), p.id, b.value, row_number() over (order by form nulls first, p.national_id) from pokemon p left outer join boxes b on p.id = b.pokemon_id and b.regional = false and b.game_family_id = 'sword_shield_expansion_pass' where national_id <= 898 and national_order >= 0 and (form is null or form in ('alola', 'galar', 'gigantamax')) order by form nulls first, p.national_id;
    `)
    .catch((err) => {
      // Ideally, we could do a ON CONFLICT DO NOTHING, but our version of
      // Postgres doesn't support that. So we just catch the error, log it, and
      // move on.
      console.log('dex_types_pokemon insert error:', err); // eslint-disable-line
    });
  });
};

exports.down = function (Knex, Promise) {
  return Knex.schema.dropTable('dex_types_pokemon')
  .then(() => {
    return Knex.schema.dropTable('dex_types');
  });
};

// We need to disable the transaction since we can't prevent the inserts from
// failing.
exports.config = {
  transaction: false
};

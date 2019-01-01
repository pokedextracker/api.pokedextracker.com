'use strict';

const triggers = ['breed', 'level', 'stone', 'trade', 'candy'];

exports.up = function (Knex, Promise) {
  const array = triggers.map((trigger) => `'${trigger}'::text`).join(', ');

  return Knex.raw('ALTER TABLE evolutions DROP CONSTRAINT evolutions_trigger_check')
  .then(() => Knex.raw(`ALTER TABLE evolutions ADD CONSTRAINT evolutions_trigger_check CHECK (trigger = ANY (ARRAY[${array}])) NOT VALID`))
  .then(() => Knex.raw('ALTER TABLE evolutions VALIDATE CONSTRAINT evolutions_trigger_check'))
  .then(() => {
    return Knex.schema.table('evolutions', (table) => {
      table.integer('candy_count');
    });
  });
};

exports.down = function (Knex, Promise) {
  const array = triggers.filter((trigger) => trigger !== 'candy').map((trigger) => `'${trigger}'::text`).join(', ');

  return Knex.raw('ALTER TABLE evolutions DROP CONSTRAINT evolutions_trigger_check')
  .then(() => Knex.raw(`ALTER TABLE evolutions ADD CONSTRAINT evolutions_trigger_check CHECK (trigger = ANY (ARRAY[${array}])) NOT VALID`))
  .then(() => Knex.raw('ALTER TABLE evolutions VALIDATE CONSTRAINT evolutions_trigger_check'))
  .then(() => {
    return Knex.schema.table('evolutions', (table) => {
      table.dropColumn('candy_count');
    });
  });
};

exports.config = { transaction: false };

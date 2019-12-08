'use strict';

const triggers = ['breed', 'level', 'stone', 'trade', 'candy', 'other'];

exports.up = function (Knex, Promise) {
  const array = triggers.map((trigger) => `'${trigger}'::text`).join(', ');

  return Knex.raw('ALTER TABLE evolutions DROP CONSTRAINT evolutions_trigger_check')
  .then(() => Knex.raw(`ALTER TABLE evolutions ADD CONSTRAINT evolutions_trigger_check CHECK (trigger = ANY (ARRAY[${array}])) NOT VALID`))
  .then(() => Knex.raw('ALTER TABLE evolutions VALIDATE CONSTRAINT evolutions_trigger_check'));
};

exports.down = function (Knex, Promise) {
  const array = triggers.filter((trigger) => trigger !== 'other').map((trigger) => `'${trigger}'::text`).join(', ');

  return Knex.raw('ALTER TABLE evolutions DROP CONSTRAINT evolutions_trigger_check')
  .then(() => Knex.raw(`ALTER TABLE evolutions ADD CONSTRAINT evolutions_trigger_check CHECK (trigger = ANY (ARRAY[${array}])) NOT VALID`))
  .then(() => Knex.raw('ALTER TABLE evolutions VALIDATE CONSTRAINT evolutions_trigger_check'));
};

exports.config = { transaction: false };

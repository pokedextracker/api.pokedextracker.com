'use strict';

exports.up = function (Knex) {
  return Knex.raw('ALTER TABLE dexes ALTER COLUMN generation DROP NOT NULL, ALTER COLUMN region DROP NOT NULL');
};

exports.down = function (Knex) {
  return Knex.raw('ALTER TABLE dexes ALTER COLUMN generation SET NOT NULL, ALTER COLUMN region SET NOT NULL');
};

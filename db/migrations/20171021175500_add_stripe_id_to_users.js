'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.text('stripe_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('stripe_id');
  });
};

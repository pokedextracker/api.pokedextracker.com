'use strict';

exports.up = function (Knex) {
  return Knex.schema.table('users', (table) => {
    table.dropColumn('friend_code');
  });
};

exports.down = function (Knex) {
  return Knex.schema.table('users', (table) => {
    table.string('friend_code', 14);
  });
};

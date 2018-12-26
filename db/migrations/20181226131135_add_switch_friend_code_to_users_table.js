'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('users', (table) => {
    table.string('3ds_friend_code', 14);
    table.string('switch_friend_code', 17);
  })
  .then(() => Knex.raw('UPDATE users SET "3ds_friend_code" = friend_code'));
};

exports.down = function (Knex, Promise) {
  return Knex.schema.table('users', (table) => {
    table.dropColumn('3ds_friend_code');
    table.dropColumn('switch_friend_code');
  });
};

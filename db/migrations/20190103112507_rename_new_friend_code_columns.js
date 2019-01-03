'use strict';

exports.up = function (Knex, Promise) {
  return Knex.schema.table('users', (table) => {
    table.string('friend_code_3ds', 14);
    table.string('friend_code_switch', 17);
    table.dropColumn('3ds_friend_code');
    table.dropColumn('switch_friend_code');
  })
  .then(() => Knex.raw('UPDATE users SET friend_code_3ds = friend_code'));
};

exports.down = function (Knex, Promise) {
  return Knex.schema.table('users', (table) => {
    table.string('3ds_friend_code', 14);
    table.string('switch_friend_code', 17);
    table.dropColumn('friend_code_3ds');
    table.dropColumn('friend_code_switch');
  })
  .then(() => Knex.raw('UPDATE users SET "3ds_friend_code" = friend_code'));
};

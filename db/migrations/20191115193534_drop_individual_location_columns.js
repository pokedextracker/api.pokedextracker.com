'use strict';

exports.up = function (Knex) {
  return Knex.schema.table('pokemon', (table) => {
    table.dropColumn('x_location');
    table.dropColumn('y_location');
    table.dropColumn('or_location');
    table.dropColumn('as_location');
    table.dropColumn('sun_location');
    table.dropColumn('moon_location');
    table.dropColumn('us_location');
    table.dropColumn('um_location');
  });
};

exports.down = function (Knex) {
  return Knex.schema.table('pokemon', (table) => {
    table.text('x_location');
    table.text('y_location');
    table.text('or_location');
    table.text('as_location');
    table.text('sun_location');
    table.text('moon_location');
    table.text('us_location');
    table.text('um_location');
  });
};

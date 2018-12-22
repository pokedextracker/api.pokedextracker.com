'use strict';

const Knex = require('../src/libraries/knex');

beforeEach(() => {
  return Knex.raw('TRUNCATE users CASCADE')
  .then(() => Knex.raw('TRUNCATE captures CASCADE'))
  .then(() => Knex.raw('TRUNCATE dexes CASCADE'))
  .then(() => Knex.raw('TRUNCATE evolutions CASCADE'))
  .then(() => Knex.raw('TRUNCATE games CASCADE'))
  .then(() => Knex.raw('TRUNCATE game_families CASCADE'))
  .then(() => Knex.raw('TRUNCATE pokemon CASCADE'))
  .then(() => Knex.raw('TRUNCATE locations CASCADE'));
});

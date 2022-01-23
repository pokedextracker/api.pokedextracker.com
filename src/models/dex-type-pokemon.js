'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('DexTypePokemon', Bookshelf.Model.extend({
  tableName: 'dex_types_pokemon'
}));

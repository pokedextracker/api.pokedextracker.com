'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('GameFamilyDexNumber', Bookshelf.Model.extend({
  tableName: 'game_family_dex_numbers'
}));

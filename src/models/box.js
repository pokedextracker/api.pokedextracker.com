'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('Box', Bookshelf.Model.extend({
  tableName: 'boxes',
  serialize () {
    return {
      game_family_id: this.get('game_family_id'),
      regional: this.get('regional'),
      value: this.get('value')
    };
  }
}));

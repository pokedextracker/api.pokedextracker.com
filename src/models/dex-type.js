'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('DexType', Bookshelf.Model.extend({
  tableName: 'dex_types',
  pokemon () {
    return this.belongsToMany('Pokemon');
  },
  serialize () {
    return {
      id: this.get('id'),
      name: this.get('name'),
      game_family_id: this.get('game_family_id'),
      order: this.get('order'),
      tags: this.get('tags')
    };
  }
}, {
  RELATED: []
}));

'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('Evolution', Bookshelf.Model.extend({
  tableName: 'evolutions',
  hasTimestamps: ['date_created', 'date_modified'],
  evolving_pokemon () {
    return this.belongsTo('Pokemon', 'evolving_pokemon_id');
  },
  evolved_pokemon () {
    return this.belongsTo('Pokemon', 'evolved_pokemon_id');
  },
  serialize () {
    return {
      trigger: this.get('trigger'),
      level: this.get('level') || undefined,
      candy_count: this.get('candy_count') || undefined,
      stone: this.get('stone') || undefined,
      held_item: this.get('held_item') || undefined,
      notes: this.get('notes') || undefined
    };
  }
}, {
  RELATED: ['evolving_pokemon', 'evolved_pokemon']
}));

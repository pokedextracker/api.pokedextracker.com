'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('GameFamily', Bookshelf.Model.extend({
  tableName: 'game_families',
  serialize () {
    return {
      id: this.get('id'),
      generation: this.get('generation'),
      regional_total: this.get('regional_total'), // TODO: remove
      national_total: this.get('national_total'), // TODO: remove
      regional_support: this.get('regional_support'), // TODO: remove
      national_support: this.get('national_support'), // TODO: remove
      order: this.get('order'),
      published: this.get('published')
    };
  }
}));

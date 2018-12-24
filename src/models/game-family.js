'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('GameFamily', Bookshelf.Model.extend({
  tableName: 'game_families',
  serialize () {
    return {
      id: this.get('id'),
      generation: this.get('generation'),
      regional_total: this.get('regional_total'),
      national_total: this.get('national_total'),
      regional_support: this.get('regional_support'),
      national_support: this.get('national_support'),
      order: this.get('order'),
      published: this.get('published')
    };
  }
}));

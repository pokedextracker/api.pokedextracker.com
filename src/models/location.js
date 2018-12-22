'use strict';

const Bookshelf = require('../libraries/bookshelf');
const Game      = require('./game');

module.exports = Bookshelf.model('Location', Bookshelf.Model.extend({
  tableName: 'locations',
  game () {
    return this.belongsTo(Game, 'game_id');
  },
  serialize () {
    return {
      game: this.related('game').serialize(),
      value: this.get('value').split(', ')
    };
  }
}, {
  RELATED: ['game', 'game.game_family']
}));

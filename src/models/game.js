'use strict';

const Bookshelf  = require('../libraries/bookshelf');
const GameFamily = require('./game-family');

module.exports = Bookshelf.model('Game', Bookshelf.Model.extend({
  tableName: 'games',
  game_family () {
    return this.belongsTo(GameFamily, 'game_family_id');
  },
  serialize () {
    return {
      id: this.get('id'),
      name: this.get('name'),
      game_family: this.related('game_family').serialize(),
      order: this.get('order')
    };
  }
}, {
  RELATED: ['game_family']
}));

'use strict';

const Bookshelf = require('../libraries/bookshelf');
const Game      = require('./game');

// SPLIT_REGEX is used instead of just ", " to avoid splitting on "Let's Go,
// Pikachu!" and "Let's Go, Eevee!". The additional .filter is necessary after
// the .split because this regex produces an array with undefined as every
// other element.
const SPLIT_REGEX = /(?!Let's Go), (?!(Pikachu|Eevee))/g;

module.exports = Bookshelf.model('Location', Bookshelf.Model.extend({
  tableName: 'locations',
  game () {
    return this.belongsTo(Game, 'game_id');
  },
  serialize () {
    return {
      game: this.related('game').serialize(),
      value: this.get('value').split(SPLIT_REGEX).filter((v) => v)
    };
  }
}, {
  RELATED: ['game', 'game.game_family']
}));

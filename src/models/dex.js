'use strict';

const Bookshelf = require('../libraries/bookshelf');
const Game      = require('./game');
const Knex      = require('../libraries/knex');

module.exports = Bookshelf.model('Dex', Bookshelf.Model.extend({
  tableName: 'dexes',
  hasTimestamps: ['date_created', 'date_modified'],
  game () {
    return this.belongsTo(Game, 'game_id');
  },
  caught () {
    return Knex('captures').count().where('dex_id', this.get('id'))
    .then((res) => parseInt(res[0].count));
  },
  virtuals: {
    total () {
      if (this.get('regional')) {
        return this.related('game').related('game_family').get('regional_total');
      }

      return this.related('game').related('game_family').get('national_total');
    }
  },
  serialize () {
    return this.caught()
    .then((caught) => {
      return {
        id: this.get('id'),
        user_id: this.get('user_id'),
        title: this.get('title'),
        slug: this.get('slug'),
        shiny: this.get('shiny'),
        game: this.related('game').serialize(),
        regional: this.get('regional'),
        caught,
        total: this.get('total'),
        date_created: this.get('date_created'),
        date_modified: this.get('date_modified')
      };
    });
  }
}, {
  RELATED: ['game', 'game.game_family']
}));

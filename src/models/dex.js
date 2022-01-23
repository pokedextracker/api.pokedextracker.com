'use strict';

const Bluebird = require('bluebird');

const Bookshelf = require('../libraries/bookshelf');
const DexType   = require('./dex-type');
const Game      = require('./game');
const Knex      = require('../libraries/knex');

module.exports = Bookshelf.model('Dex', Bookshelf.Model.extend({
  tableName: 'dexes',
  hasTimestamps: ['date_created', 'date_modified'],
  game () {
    return this.belongsTo(Game, 'game_id');
  },
  dex_type () {
    return this.belongsTo(DexType, 'dex_type_id');
  },
  caught () {
    return Knex('captures').count().where('dex_id', this.get('id'))
    .then((res) => parseInt(res[0].count));
  },
  total () {
    return Knex('dex_types_pokemon').count().where('dex_type_id', this.get('dex_type_id'))
    .then((res) => parseInt(res[0].count));
  },
  serialize () {
    return Bluebird.all([
      this.caught(),
      this.total()
    ])
    .spread((caught, total) => {
      return {
        id: this.get('id'),
        user_id: this.get('user_id'),
        title: this.get('title'),
        slug: this.get('slug'),
        shiny: this.get('shiny'),
        game: this.related('game').serialize(),
        dex_type: this.related('dex_type').serialize(),
        regional: this.get('regional'), // TODO: remove
        caught,
        total,
        date_created: this.get('date_created'),
        date_modified: this.get('date_modified')
      };
    });
  }
}, {
  RELATED: ['game', 'game.game_family', 'dex_type'],
  RELATED_WITH_POKEMON: ['game', 'game.game_family', 'dex_type', { 'dex_type.pokemon': (qb) => qb.orderBy('order', 'ASC') }]
}));

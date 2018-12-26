'use strict';

const Bluebird = require('bluebird');

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.model('User', Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: ['date_created', 'date_modified'],
  dexes () {
    return this.hasMany('Dex');
  },
  virtuals: {
    summary () {
      return {
        id: this.get('id'),
        username: this.get('username'),
        friend_code: this.get('friend_code'),
        '3ds_friend_code': this.get('3ds_friend_code'),
        switch_friend_code: this.get('switch_friend_code'),
        date_created: this.get('date_created'),
        date_modified: this.get('date_modified')
      };
    }
  },
  serialize () {
    return Bluebird.all(this.related('dexes').map((dex) => dex.serialize()))
    .then((dexes) => {
      return {
        id: this.get('id'),
        username: this.get('username'),
        friend_code: this.get('friend_code'),
        '3ds_friend_code': this.get('3ds_friend_code'),
        switch_friend_code: this.get('switch_friend_code'),
        dexes,
        donated: Boolean(this.get('stripe_id')),
        date_created: this.get('date_created'),
        date_modified: this.get('date_modified')
      };
    });
  }
}, {
  RELATED: [{ dexes: (qb) => qb.orderBy('date_created', 'ASC') }, 'dexes.game', 'dexes.game.game_family']
}));

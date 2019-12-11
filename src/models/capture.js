'use strict';

const Bookshelf = require('../libraries/bookshelf');
const Dex       = require('./dex');
const Pokemon   = require('./pokemon');

module.exports = Bookshelf.model('Capture', Bookshelf.Model.extend({
  tableName: 'captures',
  hasTimestamps: ['date_created', 'date_modified'],
  // While this is a related model, it usually won't be fetched. Instead, the
  // dex will be pulled separately and associated manually with the capture.
  dex () {
    return this.belongsTo(Dex, 'dex_id');
  },
  pokemon () {
    return this.belongsTo(Pokemon, 'pokemon_id');
  },
  serialize (request) {
    const query = request.query || {};
    const dex = this.relations.dex;

    if (query.game_family === undefined && dex) {
      query.game_family = dex.related('game').related('game_family').get('id');
    }
    if (query.regional === undefined && dex) {
      query.regional = dex.get('regional');
    }

    return {
      dex_id: this.get('dex_id'),
      pokemon: this.related('pokemon').capture_summary(query),
      captured: this.get('captured')
    };
  }
}, {
  RELATED: ['pokemon', 'pokemon.boxes', 'pokemon.game_family', 'pokemon.game_family_dex_numbers']
}));

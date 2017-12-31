'use strict';

const Game = require('../../../models/game');

exports.list = function () {
  return new Game().query((qb) => {
    qb.innerJoin('game_families', 'games.game_family_id', 'game_families.id');
    qb.where('game_families.published', true);
    qb.orderByRaw('game_families.order DESC, games.order ASC');
  }).fetchAll({ withRelated: Game.RELATED });
};

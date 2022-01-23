'use strict';

const DexType = require('../../../models/dex-type');

exports.list = function () {
  return new DexType().query((qb) => {
    qb.innerJoin('game_families', 'dex_types.game_family_id', 'game_families.id');
    qb.orderByRaw('game_families.order DESC, dex_types.order ASC');
  }).fetchAll({ withRelated: DexType.RELATED });
};

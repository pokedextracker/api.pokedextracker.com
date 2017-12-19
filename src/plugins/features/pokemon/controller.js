'use strict';

const Errors  = require('../../../libraries/errors');
const Pokemon = require('../../../models/pokemon');

exports.list = function () {
  return new Pokemon().query((qb) => qb.orderBy('national_order')).fetchAll({ withRelated: Pokemon.RELATED });
};

exports.retrieve = function (id) {
  return new Pokemon({ id }).fetch({ require: true, withRelated: Pokemon.RELATED })
  .catch(Pokemon.NotFoundError, () => {
    throw new Errors.NotFound('pokemon');
  });
};

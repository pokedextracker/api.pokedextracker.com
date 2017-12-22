'use strict';

const LIMIT = 10000;

function upBatch (Knex) {
  return Knex.raw(`
    UPDATE dexes
    SET
      game_id = CASE WHEN generation = 6 THEN 'omega_ruby' ELSE 'sun' END,
      regional = region != 'national'
    WHERE
      id IN (SELECT id FROM dexes WHERE game_id IS NULL LIMIT ${LIMIT})
  `)
  .then((response) => {
    return response.rowCount === LIMIT ? upBatch(Knex) : null;
  });
}

function downBatch (Knex) {
  return Knex.raw(`
    UPDATE dexes
    SET
      game_id = NULL,
      regional = NULL
    WHERE
      id IN (SELECT id FROM dexes WHERE game_id IS NOT NULL LIMIT ${LIMIT})
  `)
  .then((response) => {
    return response.rowCount === LIMIT ? downBatch(Knex) : null;
  });
}

exports.up = function (Knex, Promise) {
  return upBatch(Knex)
  .then(() => {
    return Knex.raw(`
      BEGIN;
      ALTER TABLE dexes ALTER COLUMN game_id SET NOT NULL;
      ALTER TABLE dexes ALTER COLUMN regional SET NOT NULL;
      COMMIT;
    `);
  });
};

exports.down = function (Knex, Promise) {
  return Knex.raw(`
    BEGIN;
    ALTER TABLE dexes ALTER COLUMN game_id DROP NOT NULL;
    ALTER TABLE dexes ALTER COLUMN regional DROP NOT NULL;
    COMMIT;
  `)
  .then(() => downBatch(Knex));
};

exports.config = {
  transaction: false
};

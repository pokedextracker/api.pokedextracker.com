'use strict';

const Bluebird = require('bluebird');

const Capture    = require('../../../../src/models/capture');
const Controller = require('../../../../src/plugins/features/captures/controller');
const Errors     = require('../../../../src/libraries/errors');
const Knex       = require('../../../../src/libraries/knex');
const Pokemon    = require('../../../../src/models/pokemon');

const gameFamily = Factory.build('game-family');

const firstPokemon      = Factory.build('pokemon', { id: 1, national_id: 1, generation: 1, alola_id: 1, game_family_id: gameFamily.id });
const secondPokemon     = Factory.build('pokemon', { id: 2, national_id: 2, generation: 1, alola_id: 2, game_family_id: gameFamily.id });
const generationPokemon = Factory.build('pokemon', { id: 3, national_id: 3, generation: 2, hoenn_id: 1, game_family_id: gameFamily.id });

const user      = Factory.build('user');
const otherUser = Factory.build('user');

const dex       = Factory.build('dex', { user_id: user.id, generation: 1 });
const otherDex  = Factory.build('dex', { user_id: otherUser.id, generation: 1 });
const regionDex = Factory.build('dex', { title: 'Another', slug: 'another', user_id: user.id, generation: 1, region: 'alola' });

const firstCapture = Factory.build('capture', { pokemon_id: firstPokemon.id, dex_id: dex.id });
const otherCapture = Factory.build('capture', { pokemon_id: firstPokemon.id, dex_id: otherDex.id });

describe('captures controller', () => {

  beforeEach(() => {
    return Knex('game_families').insert(gameFamily)
    .then(() => {
      return Bluebird.all([
        Knex('pokemon').insert([firstPokemon, secondPokemon]),
        Knex('users').insert([user, otherUser])
      ]);
    })
    .then(() => Knex('dexes').insert([dex, otherDex, regionDex]))
    .then(() => Knex('captures').insert([firstCapture, otherCapture]));
  });

  describe('list', () => {

    it('returns a collection of captures filtered by dex_id, filling in those that do not exist', () => {
      return new Pokemon().query((qb) => qb.orderBy('id')).fetchAll()
      .get('models')
      .then((pokemon) => Controller.list({ dex: dex.id }, pokemon))
      .map((capture) => capture.serialize())
      .then((captures) => {
        expect(captures).to.have.length(2);
        expect(captures[0].pokemon.id).to.eql(firstPokemon.id);
        expect(captures[0].dex_id).to.eql(dex.id);
        expect(captures[0].captured).to.be.true;
        expect(captures[1].pokemon.id).to.eql(secondPokemon.id);
        expect(captures[1].dex_id).to.eql(dex.id);
        expect(captures[1].captured).to.be.false;
      });
    });

    it('filters out pokemon that are not included in the dex\'s generation', () => {
      return Knex('pokemon').insert(generationPokemon)
      .then(() => new Pokemon().query((qb) => qb.orderBy('id')).fetchAll())
      .get('models')
      .then((pokemon) => Controller.list({ dex: dex.id }, pokemon))
      .map((capture) => capture.serialize())
      .map((capture) => capture.pokemon.id)
      .then((captures) => {
        expect(captures).to.have.length(2);
        expect(captures).to.not.contain(generationPokemon.id);
      });
    });

    it('filters out pokemon that are not included in the dex\'s region', () => {
      return Knex('pokemon').insert(generationPokemon)
      .then(() => new Pokemon().query((qb) => qb.orderBy('id')).fetchAll())
      .get('models')
      .then((pokemon) => Controller.list({ dex: regionDex.id }, pokemon))
      .map((capture) => capture.serialize())
      .then((captures) => {
        expect(captures).to.have.length(2);
        captures.forEach((capture) => {
          expect(capture.pokemon[`${regionDex.region}_id`]).to.exist;
        });
      });
    });

    it('rejects for a dex id that does not exist', () => {
      return Controller.list({ dex: -1 })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

  });

  describe('create', () => {

    it('creates a capture with the specified dex', () => {
      return Controller.create({ pokemon: [secondPokemon.id], dex: dex.id }, { id: user.id })
      .then((captures) => {
        expect(captures).to.have.length(1);
        expect(captures.at(0).get('pokemon_id')).to.eql(secondPokemon.id);
        expect(captures.at(0).get('dex_id')).to.eql(dex.id);
        expect(captures.at(0).get('captured')).to.be.true;
      });
    });

    it('rejects with a bad pokemon id', () => {
      return Controller.create({ pokemon: [-1], dex: dex.id }, { id: user.id })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

    it('rejects when the user does not own the dex', () => {
      return Controller.create({ pokemon: [secondPokemon.id], dex: otherDex.id }, { id: user.id })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ForbiddenAction);
      });
    });

    it('rejects with a bad dex id', () => {
      return Controller.create({ pokemon: [secondPokemon.id], dex: -1 }, { id: user.id })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

    it('does not err for duplicate captures', () => {
      return Controller.create({ pokemon: [firstPokemon.id], dex: dex.id }, { id: user.id })
      .then((captures) => {
        expect(captures).to.have.length(1);
        expect(captures.at(0).get('pokemon_id')).to.eql(firstPokemon.id);
        expect(captures.at(0).get('captured')).to.be.true;
      });
    });

  });

  describe('delete', () => {

    it('deletes a capture', () => {
      return Controller.delete({ pokemon: [firstPokemon.id], dex: dex.id }, { id: user.id })
      .then((res) => {
        expect(res.deleted).to.be.true;

        return new Capture().where({ pokemon_id: firstPokemon.id, dex_id: dex.id }).fetch();
      })
      .then((capture) => {
        expect(capture).to.be.null;
      });
    });

    it('rejects with a bad dex id', () => {
      return Controller.delete({ pokemon: [firstPokemon.id], dex: -1 }, { id: user.id })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

    it('rejects when the user does not own the dex', () => {
      return Controller.delete({ pokemon: [firstPokemon.id], dex: otherDex.id }, { id: user.id })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ForbiddenAction);
      });
    });

  });

});

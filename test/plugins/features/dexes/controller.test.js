'use strict';

const Sinon = require('sinon');

const Capture    = require('../../../../src/models/capture');
const Controller = require('../../../../src/plugins/features/dexes/controller');
const Dex        = require('../../../../src/models/dex');
const Errors     = require('../../../../src/libraries/errors');
const Knex       = require('../../../../src/libraries/knex');

const firstUser  = Factory.build('user');
const secondUser = Factory.build('user');

const xy      = Factory.build('game-family', { id: 'x_y', order: 13 });
const oras    = Factory.build('game-family', { id: 'omega_ruby_alpha_sapphire', order: 14 });
const sunMoon = Factory.build('game-family', { id: 'sun_moon', order: 15 });

const x         = Factory.build('game', { id: 'x', game_family_id: xy.id });
const omegaRuby = Factory.build('game', { id: 'omega_ruby', game_family_id: oras.id });
const sun       = Factory.build('game', { id: 'sun', game_family_id: sunMoon.id });
const moon      = Factory.build('game', { id: 'moon', game_family_id: sunMoon.id });

const firstDex  = Factory.build('dex', { user_id: firstUser.id, game_id: sun.id });
const secondDex = Factory.build('dex', { user_id: firstUser.id, title: 'Another', slug: 'another', game_id: omegaRuby.id });

const oldGenPokemon      = Factory.build('pokemon', { id: 1, national_id: 1, game_family_id: oras.id });
const newGenPokemon      = Factory.build('pokemon', { id: 2, national_id: 2, game_family_id: sunMoon.id });
const otherRegionPokemon = Factory.build('pokemon', { id: 3, national_id: 3, game_family_id: xy.id });

const oldGenCapture      = Factory.build('capture', { pokemon_id: oldGenPokemon.id, dex_id: firstDex.id });
const newGenCapture      = Factory.build('capture', { pokemon_id: newGenPokemon.id, dex_id: firstDex.id });
const otherRegionCapture = Factory.build('capture', { pokemon_id: otherRegionPokemon.id, dex_id: firstDex.id });

const oldGenDexNumber      = Factory.build('game-family-dex-number', { pokemon_id: oldGenPokemon.id, game_family_id: oras.id });
const newGenDexNumber      = Factory.build('game-family-dex-number', { pokemon_id: newGenPokemon.id, game_family_id: sunMoon.id });
const otherRegionDexNumber = Factory.build('game-family-dex-number', { pokemon_id: otherRegionPokemon.id, game_family_id: xy.id });

describe('dexes controller', () => {

  beforeEach(() => {
    return Knex('game_families').insert([xy, oras, sunMoon])
    .then(() => Knex('games').insert([x, omegaRuby, sun, moon]));
  });

  describe('retrieve', () => {

    beforeEach(() => {
      return Knex('users').insert(firstUser)
      .then(() => Knex('dexes').insert(firstDex));
    });

    it('returns a dex from the username and slug', () => {
      return Controller.retrieve({ username: firstUser.username, slug: firstDex.slug })
      .then((dex) => {
        expect(dex.id).to.eql(firstDex.id);
      });
    });

    it('rejects if the username does not match with the slug', () => {
      return Controller.retrieve({ username: 'bad_username', slug: firstDex.slug })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

    it('rejects if the slug does not match with the username', () => {
      return Controller.retrieve({ username: firstUser.username, slug: 'bad-slug' })
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

  });

  describe('create', () => {

    const firstParams  = { username: firstUser.username };
    const secondParams = { username: secondUser.username };
    const title = 'Test';
    const shiny = false;
    const game = moon.id;
    const regional = true;

    beforeEach(() => {
      return Knex('users').insert(firstUser);
    });

    it('saves a dex', () => {
      return Controller.create(firstParams, { title, shiny, game, regional }, firstUser)
      .then((dex) => new Dex({ id: dex.get('id') }).fetch())
      .then((dex) => {
        expect(dex.get('title')).to.eql(title);
        expect(dex.get('shiny')).to.eql(shiny);
        expect(dex.get('game_id')).to.eql(game);
        expect(dex.get('regional')).to.eql(regional);
      });
    });

    it('rejects if trying to create a dex without a slug', () => {
      return Controller.create(firstParams, { title: '为什么', shiny, game, regional }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.EmptySlug);
      });
    });

    it('rejects if trying to create a dex for another user', () => {
      return Controller.create(secondParams, { title, shiny, game, regional }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ForbiddenAction);
      });
    });

    it('rejects if the title is already taken by the user', () => {
      return Knex('dexes').insert(firstDex)
      .then(() => Controller.create(firstParams, { title: firstDex.title, shiny, game, regional }, firstUser))
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ExistingDex);
      });
    });

    it('rejects if the slug is taken after the fetch', () => {
      Sinon.stub(Dex.prototype, 'save').throws(new Error('duplicate key value'));

      return Controller.create(firstParams, { title, shiny, game, regional }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ExistingDex);
      })
      .finally(() => {
        Dex.prototype.save.restore();
      });
    });

  });

  describe('update', () => {

    const firstParams  = { username: firstUser.username, slug: firstDex.slug };
    const secondParams = { username: secondUser.username, slug: 'other' };
    const title = 'Test';
    const shiny = true;
    const game = omegaRuby.id;
    const regional = true;

    beforeEach(() => {
      return Knex('users').insert([firstUser, secondUser])
      .then(() => Knex('pokemon').insert([oldGenPokemon, newGenPokemon, otherRegionPokemon]))
      .then(() => Knex('game_family_dex_numbers').insert([oldGenDexNumber, newGenDexNumber, otherRegionDexNumber]))
      .then(() => Knex('dexes').insert([firstDex, secondDex]))
      .then(() => Knex('captures').insert([oldGenCapture, newGenCapture, otherRegionCapture]));
    });

    it('updates a dex', () => {
      return Controller.update(firstParams, { shiny }, firstUser)
      .then((dex) => new Dex({ id: dex.get('id') }).fetch())
      .then((dex) => {
        expect(dex.get('shiny')).to.eql(shiny);
      });
    });

    it('updates the slug if the title is also being updated', () => {
      return Controller.update(firstParams, { title }, firstUser)
      .then((dex) => new Dex({ id: dex.get('id') }).fetch())
      .then((dex) => {
        expect(dex.get('title')).to.eql(title);
        expect(dex.get('slug')).to.eql('test');
      });
    });

    it('clears out newer generation captures if game is being updated', () => {
      return Controller.update(firstParams, { game }, firstUser)
      .then((dex) => new Capture().where('dex_id', dex.get('id')).fetchAll({ withRelated: Capture.RELATED }))
      .then((captures) => {
        expect(captures).to.have.length(2);
        captures.each((capture) => {
          expect(capture.related('pokemon').related('game_family').get('order')).to.be.at.most(oras.order);
        });
      });
    });

    it('clears out captures outside of the region if regional is being updated', () => {
      return Controller.update(firstParams, { regional }, firstUser)
      .then((dex) => new Capture().where('dex_id', dex.get('id')).fetchAll({ withRelated: Capture.RELATED }))
      .then((captures) => {
        expect(captures).to.have.length(1);
        captures.each((capture) => {
          expect(capture.related('pokemon').get('dex_number_properties')[`${sunMoon.id}_id`]).to.exist;
        });
      });
    });

    it('clears out captures outside of the region and are of a newer generation if regional and game is being updated', () => {
      return Controller.update(firstParams, { game, regional }, firstUser)
      .then((dex) => new Capture().where('dex_id', dex.get('id')).fetchAll({ withRelated: Capture.RELATED }))
      .then((captures) => {
        expect(captures).to.have.length(1);
        captures.each((capture) => {
          expect(capture.related('pokemon').get('game_family_id')).to.eql(oras.id);
          expect(capture.related('pokemon').get('dex_number_properties')[`${oras.id}_id`]).to.exist;
        });
      });
    });

    it('rejects if trying to update a dex to one with an empty slug', () => {
      return Controller.update(firstParams, { title: '为什么' }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.EmptySlug);
      });
    });

    it('rejects if trying to update a dex for another user', () => {
      return Controller.update(secondParams, { title }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ForbiddenAction);
      });
    });

    it('rejects if the dex does not exist', () => {
      return Controller.update(secondParams, { title }, secondUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

    it('rejects if the game does not exist', () => {
      return Controller.update(firstParams, { game: 'purple' }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

    it('rejects if the title is already taken by the user', () => {
      return Controller.update(firstParams, { title: secondDex.title }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ExistingDex);
      });
    });

  });

  describe('delete', () => {

    const firstParams  = { username: firstUser.username, slug: firstDex.slug };
    const secondParams = { username: secondUser.username, slug: 'other' };

    beforeEach(() => {
      return Knex('users').insert([firstUser, secondUser])
      .then(() => Knex('dexes').insert(firstDex));
    });

    it('deletes a dex', () => {
      return Knex('dexes').insert(secondDex)
      .then(() => Controller.delete(firstParams, firstUser))
      .then(() => new Dex({ id: firstDex.id }).fetch())
      .then((dex) => {
        expect(dex).to.not.exist;
      });
    });

    it('rejects if trying to delete your last dex', () => {
      return Controller.delete(firstParams, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.AtLeastOneDex);
      });
    });

    it('rejects if trying to delete a dex for another user', () => {
      return Controller.delete(secondParams, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ForbiddenAction);
      });
    });

    it('rejects if the dex does not exist', () => {
      return Controller.delete(secondParams, secondUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.NotFound);
      });
    });

  });

});

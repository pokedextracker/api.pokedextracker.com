'use strict';

const Sinon = require('sinon');

const Capture    = require('../../../../src/models/capture');
const Controller = require('../../../../src/plugins/features/dexes/controller');
const Dex        = require('../../../../src/models/dex');
const Errors     = require('../../../../src/libraries/errors');
const Knex       = require('../../../../src/libraries/knex');

const firstUser  = Factory.build('user');
const secondUser = Factory.build('user');

const firstDex  = Factory.build('dex', { user_id: firstUser.id, generation: 7 });
const secondDex = Factory.build('dex', { user_id: firstUser.id, title: 'Another', slug: 'another' });

const gameFamily = Factory.build('game-family');

const oldGenPokemon      = Factory.build('pokemon', { id: 1, national_id: 1, generation: firstDex.generation - 1, alola_id: 1, game_family_id: gameFamily.id });
const newGenPokemon      = Factory.build('pokemon', { id: 2, national_id: 2, generation: firstDex.generation, alola_id: 2, game_family_id: gameFamily.id });
const otherRegionPokemon = Factory.build('pokemon', { id: 3, national_id: 3, generation: firstDex.generation - 1, hoenn_id: 1, game_family_id: gameFamily.id });

const oldGenCapture      = Factory.build('capture', { pokemon_id: oldGenPokemon.id, dex_id: firstDex.id });
const newGenCapture      = Factory.build('capture', { pokemon_id: newGenPokemon.id, dex_id: firstDex.id });
const otherRegionCapture = Factory.build('capture', { pokemon_id: otherRegionPokemon.id, dex_id: firstDex.id });

describe('dexes controller', () => {

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
    const generation = 6;
    const region = 'national';

    beforeEach(() => {
      return Knex('users').insert(firstUser);
    });

    it('saves a dex', () => {
      return Controller.create(firstParams, { title, shiny, generation, region }, firstUser)
      .then((dex) => new Dex({ id: dex.get('id') }).fetch())
      .then((dex) => {
        expect(dex.get('title')).to.eql(title);
        expect(dex.get('shiny')).to.eql(shiny);
        expect(dex.get('generation')).to.eql(generation);
        expect(dex.get('region')).to.eql(region);
      });
    });

    it('rejects if trying to create a dex without a slug', () => {
      return Controller.create(firstParams, { title: '为什么', shiny, generation, region }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.EmptySlug);
      });
    });

    it('rejects if trying to create a dex for another user', () => {
      return Controller.create(secondParams, { title, shiny, generation, region }, firstUser)
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ForbiddenAction);
      });
    });

    it('rejects if the title is already taken by the user', () => {
      return Knex('dexes').insert(firstDex)
      .then(() => Controller.create(firstParams, { title: firstDex.title, shiny, generation, region }, firstUser))
      .catch((err) => err)
      .then((err) => {
        expect(err).to.be.an.instanceof(Errors.ExistingDex);
      });
    });

    it('rejects if the slug is taken after the fetch', () => {
      Sinon.stub(Dex.prototype, 'save').throws(new Error('duplicate key value'));

      return Controller.create(firstParams, { title, shiny, generation, region }, firstUser)
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
    const generation = oldGenPokemon.generation;
    const region = 'alola';

    beforeEach(() => {
      return Knex('users').insert([firstUser, secondUser])
      .then(() => Knex('game_families').insert(gameFamily))
      .then(() => Knex('pokemon').insert([oldGenPokemon, newGenPokemon, otherRegionPokemon]))
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

    it('clears out newer generation captures if generation is being updated', () => {
      return Controller.update(firstParams, { generation }, firstUser)
      .then((dex) => new Capture().where('dex_id', dex.get('id')).fetchAll({ withRelated: 'pokemon' }))
      .then((captures) => {
        expect(captures).to.have.length(2);
        captures.each((capture) => {
          expect(capture.related('pokemon').get('generation')).to.eql(generation);
        });
      });
    });

    it('clears out captures outside of the region if region is being updated', () => {
      return Controller.update(firstParams, { region }, firstUser)
      .then((dex) => new Capture().where('dex_id', dex.get('id')).fetchAll({ withRelated: 'pokemon' }))
      .then((captures) => {
        expect(captures).to.have.length(2);
        captures.each((capture) => {
          expect(capture.related('pokemon').get(`${region}_id`)).to.exist;
        });
      });
    });

    it('clears out captures outside of the region and are of a newer generation if region and generation is being updated', () => {
      return Controller.update(firstParams, { generation, region }, firstUser)
      .then((dex) => new Capture().where('dex_id', dex.get('id')).fetchAll({ withRelated: 'pokemon' }))
      .then((captures) => {
        expect(captures).to.have.length(1);
        captures.each((capture) => {
          expect(capture.related('pokemon').get('generation')).to.eql(generation);
          expect(capture.related('pokemon').get(`${region}_id`)).to.exist;
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

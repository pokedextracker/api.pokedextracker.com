'use strict';

const Joi = require('joi');

const DexesUpdateValidator = require('../../../src/validators/dexes/update');

describe('dexes update validator', () => {

  describe('title', () => {

    it('is optional', () => {
      const data = { shiny: false };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 300 characters', () => {
      const data = { title: 'a'.repeat(301), shiny: false };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { title: '   a   ', shiny: false };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.value.title).to.eql('a');
    });

  });

  describe('shiny', () => {

    it('is optional', () => {
      const data = { title: 'Test' };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error).to.not.exist;
    });

  });

  describe('game', () => {

    it('is optional', () => {
      const data = { title: 'Test', shiny: false };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 50 characters', () => {
      const data = { title: 'Test', shiny: false, game: 'a'.repeat(51) };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error.details[0].path).to.eql('game');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { title: 'Test', shiny: false, game: '   a   ' };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.value.game).to.eql('a');
    });

  });

  describe('regional', () => {

    it('is optional', () => {
      const data = { title: 'Test', shiny: false };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error).to.not.exist;
    });

    it('is allowed', () => {
      const data = { title: 'Test', shiny: false, regional: true };
      const result = Joi.validate(data, DexesUpdateValidator);

      expect(result.error).to.not.exist;
    });

  });

});

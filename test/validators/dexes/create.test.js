'use strict';

const Joi = require('joi');

const DexesCreateValidator = require('../../../src/validators/dexes/create');

describe('dexes create validator', () => {

  describe('title', () => {

    it('is required', () => {
      const data = { shiny: false, game: 'a', regional: false };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('limits to 300 characters', () => {
      const data = { title: 'a'.repeat(301), shiny: false, game: 'a', regional: false };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { title: '   a   ', shiny: false, game: 'a', regional: false };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.value.title).to.eql('a');
    });

  });

  describe('shiny', () => {

    it('is required', () => {
      const data = { title: 'Test' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('shiny');
      expect(result.error.details[0].type).to.eql('any.required');
    });

  });

  describe('game', () => {

    it('is required', () => {
      const data = { title: 'Test', shiny: false, regional: true };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('game');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('limits to 50 characters', () => {
      const data = { title: 'Test', shiny: false, game: 'a'.repeat(51), regional: true };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('game');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { title: 'Test', shiny: false, game: '   a   ', regional: true };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.value.game).to.eql('a');
    });

  });

  describe('regional', () => {

    it('is required', () => {
      const data = { title: 'Test', shiny: false, game: 'a' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('regional');
      expect(result.error.details[0].type).to.eql('any.required');
    });

  });

});

'use strict';

const Joi = require('joi');

const DexesCreateValidator = require('../../../src/validators/dexes/create');

describe('dexes create validator', () => {

  describe('title', () => {

    it('is required', () => {
      const data = { shiny: false, generation: 6, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('limits to 300 characters', () => {
      const data = { title: 'a'.repeat(301), shiny: false, generation: 6, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { title: '   a   ', shiny: false, generation: 6, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.value.title).to.eql('a');
    });

  });

  describe('shiny', () => {

    it('is required', () => {
      const data = { title: 'Test', generation: 6, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('shiny');
      expect(result.error.details[0].type).to.eql('any.required');
    });

  });

  describe('generation', () => {

    it('is optional', () => {
      const data = { title: 'Test', shiny: false, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows at least 6', () => {
      const data = { title: 'Test', shiny: false, generation: 6, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows at most 7', () => {
      const data = { title: 'Test', shiny: false, generation: 7, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows less than 6', () => {
      const data = { title: 'Test', shiny: false, generation: 5, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('generation');
      expect(result.error.details[0].type).to.eql('number.min');
    });

    it('disallows more than 7', () => {
      const data = { title: 'Test', shiny: false, generation: 8, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('generation');
      expect(result.error.details[0].type).to.eql('number.max');
    });

  });

  describe('game', () => {

    it('is optional', () => {
      const data = { title: 'Test', shiny: false, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 50 characters', () => {
      const data = { title: 'Test', shiny: false, game: 'a'.repeat(51), region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('game');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { title: 'Test', shiny: false, game: '   a   ', region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.value.game).to.eql('a');
    });

  });

  describe('region', () => {

    it('is optional', () => {
      const data = { title: 'Test', shiny: false, generation: 6 };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows national for gen 6', () => {
      const data = { title: 'Test', shiny: false, generation: 6, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows national for gen 7', () => {
      const data = { title: 'Test', shiny: false, generation: 7, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows alola for gen 6', () => {
      const data = { title: 'Test', shiny: false, generation: 6, region: 'alola' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('region');
      expect(result.error.details[0].type).to.eql('any.allowOnly');
    });

    it('allows alola for gen 7', () => {
      const data = { title: 'Test', shiny: false, generation: 7, region: 'alola' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows other regions', () => {
      const data = { title: 'Test', shiny: false, generation: 6, region: 'kalos' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error.details[0].path).to.eql('region');
      expect(result.error.details[0].type).to.eql('any.allowOnly');
    });

  });

  describe('regional', () => {

    it('is optional', () => {
      const data = { title: 'Test', shiny: false, region: 'national' };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('is allowed', () => {
      const data = { title: 'Test', shiny: false, region: 'national', regional: true };
      const result = Joi.validate(data, DexesCreateValidator);

      expect(result.error).to.not.exist;
    });

  });

});

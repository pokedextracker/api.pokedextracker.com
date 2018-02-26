'use strict';

const Joi = require('joi');

const PokemonRetrieveValidator = require('../../../src/validators/pokemon/retrieve');

describe('pokemon retrieve validator', () => {

  it('does not require all params', () => {
    const data = {};
    const result = Joi.validate(data, PokemonRetrieveValidator);

    expect(result.error).to.not.exist;
  });

  it('allows all params', () => {
    const data = { game_family: 'red_blue', regional: true };
    const result = Joi.validate(data, PokemonRetrieveValidator);

    expect(result.error).to.not.exist;
  });

  describe('game_family', () => {

    it('is optional', () => {
      const data = {};
      const result = Joi.validate(data, PokemonRetrieveValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 50 characters', () => {
      const data = { game_family: 'a'.repeat(51) };
      const result = Joi.validate(data, PokemonRetrieveValidator);

      expect(result.error.details[0].path).to.eql('game_family');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { game_family: '   a   ' };
      const result = Joi.validate(data, PokemonRetrieveValidator);

      expect(result.value.game_family).to.eql('a');
    });

  });

  describe('regional', () => {

    it('is optional', () => {
      const data = {};
      const result = Joi.validate(data, PokemonRetrieveValidator);

      expect(result.error).to.not.exist;
    });

    it('is not allowed by default', () => {
      const data = { regional: true };
      const result = Joi.validate(data, PokemonRetrieveValidator);

      expect(result.error.details[0].path).to.eql('regional');
      expect(result.error.details[0].type).to.eql('any.unknown');
    });

    it('is allowed if game_family is passed in', () => {
      const data = { game_family: 'red_blue', regional: true };
      const result = Joi.validate(data, PokemonRetrieveValidator);

      expect(result.value.regional).to.be.true;
    });

  });

});

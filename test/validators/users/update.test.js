'use strict';

const Joi = require('joi');

const UsersUpdateValidator = require('../../../src/validators/users/update');

describe('users update validator', () => {

  it('has no required params', () => {
    const data = {};
    const result = Joi.validate(data, UsersUpdateValidator);

    expect(result.error).to.not.exist;
  });

  describe('password', () => {

    it('requires at least 8 characters', () => {
      const data = { password: 'a'.repeat(7) };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.error.details[0].path).to.eql('password');
      expect(result.error.details[0].type).to.eql('string.min');
    });

    it('limits to 72 characters', () => {
      const data = { password: 'a'.repeat(73) };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.error.details[0].path).to.eql('password');
      expect(result.error.details[0].type).to.eql('string.max');
    });

  });

  describe('friend_code_3ds', () => {

    it('defaults to null', () => {
      const data = {};
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.value.friend_code_3ds).to.be.null;
    });

    it('allows null', () => {
      const data = { friend_code_3ds: null };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.value.friend_code_3ds).to.be.null;
    });

    it('converts the empty string to null', () => {
      const data = { friend_code_3ds: '' };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.value.friend_code_3ds).to.be.null;
    });

    it('allows codes in the format of 1234-1234-1234', () => {
      const data = { friend_code_3ds: '1234-1234-1234' };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows codes not in the format of 1234-1234-1234', () => {
      const data = { friend_code_3ds: '234-1234-1234' };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.error.details[0].path).to.eql('friend_code_3ds');
      expect(result.error.details[0].type).to.eql('string.regex.base');
      expect(result.error).to.match(/"friend_code_3ds" must be a valid 3DS friend code/);
    });

  });

  describe('friend_code_switch', () => {

    it('defaults to null', () => {
      const data = {};
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.value.friend_code_switch).to.be.null;
    });

    it('allows null', () => {
      const data = { friend_code_switch: null };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.value.friend_code_switch).to.be.null;
    });

    it('converts the empty string to null', () => {
      const data = { friend_code_switch: '' };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.value.friend_code_switch).to.be.null;
    });

    it('allows codes in the format of SW-1234-1234-1234', () => {
      const data = { friend_code_switch: 'SW-1234-1234-1234' };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows codes not in the format of SW-1234-1234-1234', () => {
      const data = { friend_code_switch: '1234-1234-1234' };
      const result = Joi.validate(data, UsersUpdateValidator);

      expect(result.error.details[0].path).to.eql('friend_code_switch');
      expect(result.error.details[0].type).to.eql('string.regex.base');
      expect(result.error).to.match(/"friend_code_switch" must be a valid Switch friend code/);
    });

  });

});

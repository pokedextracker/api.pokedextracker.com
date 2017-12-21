'use strict';

const Joi = require('joi');

const UsersCreateValidator = require('../../../src/validators/users/create');

describe('users create validator', () => {

  describe('username', () => {

    it('is required', () => {
      const data = { password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('username');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('allows alpha-numeric and underscore characters', () => {
      const data = { username: 'test_TEST', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows anything besides alpha-numeric and underscore characters', () => {
      const data = { username: 'test-TEST', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('username');
      expect(result.error.details[0].type).to.eql('string.token');
    });

    it('limits to 20 characters', () => {
      const data = { username: 'a'.repeat(21), password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('username');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims whitespace', () => {
      const username = '  testing ';
      const data = { username, password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.username).to.eql(username.trim());
    });

  });

  describe('password', () => {

    it('is required', () => {
      const data = { username: 'testing', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('password');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('requires at least 8 characters', () => {
      const data = { username: 'testing', password: 'a'.repeat(7), title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('password');
      expect(result.error.details[0].type).to.eql('string.min');
    });

    it('limits to 72 characters', () => {
      const data = { username: 'testing', password: 'a'.repeat(73), title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('password');
      expect(result.error.details[0].type).to.eql('string.max');
    });

  });

  describe('friend_code', () => {

    it('is optional', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('converts null to undefined', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: null, title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.friend_code).to.be.undefined;
    });

    it('converts the empty string to undefined', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.friend_code).to.be.undefined;
    });

    it('allows codes in the format of 1234-1234-1234', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '1234-1234-1234', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows codes not in the format of 1234-1234-1234', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '234-1234-1234', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('friend_code');
      expect(result.error.details[0].type).to.eql('string.regex.base');
      expect(result.error).to.match(/"friend_code" must be a 12-digit number/);
    });

  });

  describe('referrer', () => {

    it('is optional', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '1234-1234-1234', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('can be a string', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '1234-1234-1234', referrer: 'http://test.com', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
      expect(result.value.referrer).to.eql(data.referrer);
    });

    it('converts null to undefined', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '1234-1234-1234', referrer: null, title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.referrer).to.be.undefined;
    });

    it('converts the empty string to undefined', () => {
      const data = { username: 'testing', password: 'testtest', friend_code: '1234-1234-1234', referrer: '', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.referrer).to.be.undefined;
    });

  });

  describe('title', () => {

    it('is required', () => {
      const data = { username: 'testing', password: 'testtest', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('limits to 300 characters', () => {
      const data = { username: 'testing', password: 'testtest', title: 'a'.repeat(301), shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('title');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { username: 'testing', password: 'testtest', title: '   a   ', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.title).to.eql('a');
    });

  });

  describe('shiny', () => {

    it('is required', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test' };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('shiny');
      expect(result.error.details[0].type).to.eql('any.required');
    });

  });

  describe('generation', () => {

    it('is optional', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows at least 6', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, generation: 6 };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows at most 7', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, generation: 7 };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows less than 6', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, generation: 5 };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('generation');
      expect(result.error.details[0].type).to.eql('number.min');
    });

    it('disallows more than 7', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, generation: 8 };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('generation');
      expect(result.error.details[0].type).to.eql('number.max');
    });

  });

  describe('game', () => {

    it('is optional', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 50 characters', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, game: 'a'.repeat(51) };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('game');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, game: '   a   ' };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.value.game).to.eql('a');
    });

  });

  describe('region', () => {

    it('is optional', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows national', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, region: 'national' };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows alola', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, region: 'alola' };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows other regions', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, region: 'kalos' };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error.details[0].path).to.eql('region');
      expect(result.error.details[0].type).to.eql('any.allowOnly');
    });

  });

  describe('regional', () => {

    it('is optional', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('is allowed', () => {
      const data = { username: 'testing', password: 'testtest', title: 'Test', shiny: false, regional: true };
      const result = Joi.validate(data, UsersCreateValidator);

      expect(result.error).to.not.exist;
    });

  });

});

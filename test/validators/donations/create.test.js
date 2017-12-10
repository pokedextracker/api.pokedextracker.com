'use strict';

const Joi = require('joi');

const DonationsCreateValidator = require('../../../src/validators/donations/create');

describe('donations create validator', () => {

  describe('name', () => {

    it('is optional', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 100 characters', () => {
      const data = { name: 'a'.repeat(101), email: 'test@test.com', token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('name');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { name: '   a   ', email: 'test@test.com', token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.value.name).to.eql('a');
    });

  });

  describe('email', () => {

    it('is required', () => {
      const data = { token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('email');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('must be an email', () => {
      const data = { email: 'not an email', token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('email');
      expect(result.error.details[0].type).to.eql('string.email');
    });

    it('limits to 100 characters', () => {
      const data = { email: `${'a'.repeat(50)}@${'a'.repeat(50)}.com`, token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('email');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { email: '   test@test.com   ', token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.value.email).to.eql('test@test.com');
    });

  });

  describe('token', () => {

    it('is required', () => {
      const data = { email: 'test@test.com', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('token');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('limits to 100 characters', () => {
      const data = { email: 'test@test.com', token: 'a'.repeat(101), amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('token');
      expect(result.error.details[0].type).to.eql('string.max');
    });

  });

  describe('message', () => {

    it('is optional', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 12.34 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('limits to 500 characters', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 12.34, message: 'a'.repeat(501) };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('message');
      expect(result.error.details[0].type).to.eql('string.max');
    });

    it('trims excess whitespace', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 12.34, message: '   a   ' };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.value.message).to.eql('a');
    });

  });

  describe('amount', () => {

    it('is required', () => {
      const data = { email: 'test@test.com', token: 'token' };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('amount');
      expect(result.error.details[0].type).to.eql('any.required');
    });

    it('allows at least 1', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 1 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('allows at most 10,000', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 10000 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error).to.not.exist;
    });

    it('disallows less than 1', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 0.99 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('amount');
      expect(result.error.details[0].type).to.eql('number.min');
    });

    it('disallows more than 7', () => {
      const data = { email: 'test@test.com', token: 'token', amount: 10001 };
      const result = Joi.validate(data, DonationsCreateValidator);

      expect(result.error.details[0].path).to.eql('amount');
      expect(result.error.details[0].type).to.eql('number.max');
    });

  });

});

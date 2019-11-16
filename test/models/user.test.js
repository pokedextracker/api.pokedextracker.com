'use strict';

const Dex  = require('../../src/models/dex');
const User = require('../../src/models/user');

const user = Factory.build('user');

const dex = Factory.build('dex', { user_id: user.id });

describe('user model', () => {

  describe('virtuals', () => {

    describe('summary', () => {

      it('only includes the fields needed for the JWT', () => {
        expect(User.forge(user).get('summary')).to.have.all.keys([
          'id',
          'username',
          'friend_code_3ds',
          'friend_code_switch',
          'date_created',
          'date_modified'
        ]);
      });

    });

  });

  describe('serialize', () => {

    it('returns the correct fields', () => {
      const model = User.forge(user);
      model.relations.dexes = [Dex.forge(dex), Dex.forge(dex)];

      return model.serialize()
      .then((json) => {
        expect(json).to.have.all.keys([
          'id',
          'username',
          'friend_code_3ds',
          'friend_code_switch',
          'dexes',
          'donated',
          'date_created',
          'date_modified'
        ]);
        expect(json.dexes).to.have.length(2);
        expect(json.dexes[0].id).to.eql(dex.id);
        expect(json.dexes[1].id).to.eql(dex.id);
      });
    });

  });

});

'use strict';

const Server = require('../../../../src/server');

describe('health integration', () => {

  describe('health', () => {

    it('returns a 200', () => {
      return Server.inject({
        method: 'GET',
        url: '/health'
      })
      .then((res) => {
        expect(res.statusCode).to.eql(200);
      });
    });

  });

});

'use strict';

const Hapi = require('hapi');

const Config = require('../../../config');

describe('auth service plugin', () => {

  let server;

  beforeEach(() => {
    server = new Hapi.Server();
    server.connection({ port: 80 });

    return server.register([require('../../../src/plugins/services/auth')])
    .then(() => {
      server.route([{
        method: 'GET',
        path: '/public',
        config: {
          handler: (request, reply) => reply({})
        }
      }, {
        method: 'GET',
        path: '/private',
        config: {
          auth: 'token',
          handler: (request, reply) => reply(request.auth.credentials)
        }
      }]);
    });
  });

  it('does not do anything for public routes', () => {
    return server.inject({
      method: 'GET',
      url: '/public'
    })
    .then((res) => {
      expect(res.statusCode).to.eql(200);
    });
  });

  it('returns a 401 if no authentication is provided for private routes', () => {
    return server.inject({
      method: 'GET',
      url: '/private'
    })
    .then((res) => {
      expect(res.statusCode).to.eql(401);
    });
  });

  it('returns a 401 if invalid authentication is provided for private routes', () => {
    return server.inject({
      method: 'GET',
      url: '/private',
      headers: {
        authorization: `Bearer ${Config.JWT_TEST.substr(0, Config.JWT_TEST.length - 1)}`
      }
    })
    .then((res) => {
      expect(res.statusCode).to.eql(401);
    });
  });

  it('goes through if valid authentication is provided for private routes', () => {
    return server.inject({
      method: 'GET',
      url: '/private',
      headers: {
        authorization: `Bearer ${Config.JWT_TEST}`
      }
    })
    .then((res) => {
      expect(res.statusCode).to.eql(200);
      expect(res.result).to.contain.all.keys(['id', 'username']);
    });
  });

});

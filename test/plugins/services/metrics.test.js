'use strict';

const Hapi = require('hapi');

const Metrics = require('../../../src/libraries/metrics');

function parseStat (str) {
  const re = /^(.+?):(.+?)\|(.+?)\|#(.+)$/mg;
  const matches = re.exec(str);

  return {
    name: matches[1],
    value: Number(matches[2]),
    type: matches[3],
    tags: matches[4].split(',')
  };
}

describe('metrics service plugin', () => {

  let server;

  beforeEach(() => {
    server = new Hapi.Server();
    server.connection({ port: 80 });

    return server.register([
      require('../../../src/plugins/services/metrics/start'),
      require('../../../src/plugins/services/metrics/end')
    ])
    .then(() => {
      server.route([{
        method: 'GET',
        path: '/200',
        config: {
          handler: (request, reply) => setTimeout(() => reply({}), 50)
        }
      }, {
        method: 'POST',
        path: '/500',
        config: {
          handler: (request, reply) => reply(new Error('error'))
        }
      }]);
    });
  });

  it('records stats for successful responses', () => {
    return server.inject({
      method: 'GET',
      url: '/200'
    })
    .then(() => {
      const stat = parseStat(Metrics.mockBuffer[Metrics.mockBuffer.length - 1]);
      expect(stat.name).to.eql('api.http.request');
      expect(stat.value).to.be.above(50);
      expect(stat.tags).to.include('method:get');
      expect(stat.tags).to.include('status_code:200');
      expect(stat.tags).to.include('path:/200');
    });
  });

  it('records stats for unsuccessful responses', () => {
    return server.inject({
      method: 'POST',
      url: '/500'
    })
    .then(() => {
      const stat = parseStat(Metrics.mockBuffer[Metrics.mockBuffer.length - 1]);
      expect(stat.name).to.eql('api.http.request');
      expect(stat.tags).to.include('method:post');
      expect(stat.tags).to.include('status_code:500');
      expect(stat.tags).to.include('path:/500');
    });
  });

});

'use strict';

const Hapi = require('hapi');
const Util = require('util');

const Config = require('../config');

const server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    },
    routes: {
      cors: { credentials: true },
      log: true
    }
  }
});

server.connection({ port: Config.PORT });

server.register([
  {
    register: require('good'),
    options: {
      reporters: {
        slack: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ error: '*' }]
        }, {
          module: 'good-slack',
          args: [{ url: Config.SLACK_URL, format: '' }]
        }]
      }
    }
  },
  require('hapi-bookshelf-serializer'),
  require('./plugins/services/errors'),
  require('./plugins/services/auth'),
  require('./plugins/features/captures'),
  require('./plugins/features/dexes'),
  require('./plugins/features/donations'),
  require('./plugins/features/games'),
  require('./plugins/features/pokemon'),
  require('./plugins/features/sessions'),
  require('./plugins/features/users')
], (err) => {
  /* istanbul ignore if */
  if (err) {
    throw err;
  }
});

/* istanbul ignore next */
process.on('SIGTERM', () => {
  Util.log(`Draining server for ${Config.DRAIN_TIMEOUT}ms...`);
  server.stop({ timeout: Config.DRAIN_TIMEOUT }, () => {
    Util.log('Server stopped');
    process.exit(0);
  });
});

module.exports = server;

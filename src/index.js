'use strict';

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  require('newrelic');
}

const Config = require('../config');
const API    = require('./server');

API.start()
.then(() => API.log(['info', 'server'], `server started on port: ${Config.PORT}`));

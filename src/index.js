'use strict';

const Config = require('../config');
const API    = require('./server');

API.start()
.then(() => API.log(['info', 'server'], `server started on port: ${Config.PORT}`));

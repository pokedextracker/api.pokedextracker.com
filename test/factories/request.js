'use strict';

module.exports = Factory.define('request')
  .sequence('id', (i) => `${i}`)
  .attr('auth', ['auth'], (auth) => {
    const defaults = {
      credentials: {
        id: 1,
        username: 'test'
      }
    };

    return Object.assign(defaults, auth);
  });

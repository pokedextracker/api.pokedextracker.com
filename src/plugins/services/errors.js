'use strict';

const QUOTED_REGEX = /"\w+"/g;

exports.register = function (server, options, next) {

  server.ext('onPreResponse', (request, reply) => {
    if (!request.response.isBoom) {
      return reply.continue();
    } else {
      const err = request.response;
      let msg = err.message;

      if (err.output.statusCode === 400) {
        err.output.statusCode = 422;
      }

      /* istanbul ignore else */
      if (err.data && err.data.details && err.data.details.length >= 1) {
        msg = err.data.details.map((detail) => {
          /* istanbul ignore else */
          if (detail.message.match(QUOTED_REGEX)) {
            return detail.path + detail.message.replace(QUOTED_REGEX, '');
          } else {
            return detail.message;
          }
        }).join(' or ');
      } else if (err.output.payload.message) {
        msg = err.output.payload.message;
      } else {
        msg = err.output.payload.error;
      }

      err.output.payload = {
        error: {
          message: msg,
          status_code: err.output.statusCode
        }
      };

      reply.continue();
    }
  });

  next();

};

exports.register.attributes = {
  name: 'errors'
};

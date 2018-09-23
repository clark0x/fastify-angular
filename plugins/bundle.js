'use strict';

module.exports = function fastifyAngularBundle(fastify, opts, next) {
  fastify.register(require('./browser'), { prefix: '/', browser: opts.browser });

  fastify.setNotFoundHandler((request, reply) => {
    if (reply.renderNG) {
      request.detectedLng = opts.locale || request.detectedLng;
      reply.renderNG();
    } else {
      reply
        .code(404)
        .type('text/html')
        .send('TODO: send index.html')
      ;
    }
  });
  next();
};

'use strict';

function fastifyAngularBundle(fastify, opts, next) {
  fastify.register(require('./browser'), { prefix: '/', root: opts.browser });

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
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularBundle, {
  fastify     : '1.x',
  name        : 'fastify-angular-bundle',
});

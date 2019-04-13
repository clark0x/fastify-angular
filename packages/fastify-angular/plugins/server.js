'use strict';

function fastifyAngularServer(fastify, opts, next) {
  fastify.get('/*', (request, reply) => {
    reply.renderNG();
  });
  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularServer, {
  fastify     : '2.x',
  name        : 'fastify-angular-server',
  decorators  : {
    reply: ['renderNG'],
  },
  dependencies: ['fastify-angular-render'],
});

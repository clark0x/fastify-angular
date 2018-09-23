'use strict';

function fastifyAngularServer(instance, opts, next) {

  if (opts.i18nRoute) {
    instance.get(`/:${opts.i18nParam}/*`, (request, reply) => {
      reply.renderNG();
    });
  }

  instance.get('/*', (request, reply) => {
    reply.renderNG();
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularServer, {
  fastify     : '1.x',
  name        : 'fastify-angular-server',
  decorators  : {
    reply: ['renderNG'],
  },
  dependencies: ['fastify-language-engine'],
});

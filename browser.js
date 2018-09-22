'use strict';

const fp = require('fastify-plugin');

function fastifyAngularBrowser(instance, opts, next) {
  instance.register(require('fastify-static'), { prefix: '/', root: opts.browser });
  next();
}

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularBrowser, {
  fastify     : '1.x',
  name        : 'fastify-angular-browser',
  dependencies: ['fastify-static'],
});

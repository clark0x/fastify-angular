'use strict';

module.exports = function fastifyAngularBrowser(fastify, opts, next) {
  fastify.register(require('fastify-static'), { prefix: '/', root: opts.browser });
  next();
};

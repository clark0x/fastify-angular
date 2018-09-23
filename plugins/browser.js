'use strict';

module.exports = function fastifyAngularBrowser(instance, opts, next) {
  instance.register(require('fastify-static'), { prefix: '/', root: opts.browser });
  next();
};

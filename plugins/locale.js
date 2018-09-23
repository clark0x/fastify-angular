'use strict';

function fastifyAngularLocale(instance, opts, next) {

  instance.decorateRequest('locale', {
    getter() {
      return opts.locales && this.detectedLng || '';
    },
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularLocale, {
  fastify     : '1.x',
  name        : 'fastify-angular-locale',
});

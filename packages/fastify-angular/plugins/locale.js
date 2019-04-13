'use strict';

const { join } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');

function fastifyAngularLocale(fastify, opts, next) {
  opts.browser = opts.browser || join(process.pwd(), 'dist', 'browser');

  const locales = !opts.i18n ? [''] : readdirSync(opts.browser)
    .filter(name => existsSync(join(opts.browser, name)) && statSync(join(opts.browser, name)).isDirectory())
    .filter(name => existsSync(join(opts.browser, name)) && statSync(join(opts.browser, name, 'index.html')).isFile())
  ;

  fastify.decorate('supportedBrowserLocales', {
    getter() {
      return locales;
    },
  });

  fastify.decorateRequest('locale', {
    getter() {
      return opts.i18n && this.detectedLng || '';
    },
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularLocale, {
  fastify     : '2.x',
  name        : 'fastify-angular-locale',
});

'use strict';

const { join } = require('path');

const fastifyAngularServer = require('./plugins/server');
const fastifyAngularBundle = require('./plugins/bundle');

function fastifyAngular(fastify, opts, next) {
  opts.dist = opts.dist || join(process.cwd(), 'dist');
  opts.browser = opts.browser || join(opts.dist, 'browser');
  opts.server = opts.server || join(opts.dist, 'server');

  fastify
    .register(require('./plugins/locale'), {
      browser: opts.browser,
      i18n   : opts.i18n,
    })
    .after(() => {
      fastify.supportedBrowserLocales.forEach((locale) => {
        fastify.register(fastifyAngularBundle, {
          prefix : locale ? `/${locale}/` : '/',
          locale : locale,
          browser: join(opts.browser, locale),
        });
      });
    });

  if (opts.universal) {
    fastify
      .register(require('./plugins/origin'), {
        origin: opts.origin,
      })
      .register(require('./plugins/engine'), {
        i18n  : opts.i18n,
        server: opts.server,
      })
      .register(require('./plugins/render'), {
        browser: opts.browser,
      })
      .register(fastifyAngularServer, {});
  }

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngular, {
  fastify     : '2.x',
  name        : 'fastify-angular',
  dependencies: ['fastify-accepts'],
});

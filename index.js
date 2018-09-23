'use strict';

const { join } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');

const fastifyAngularServer = require('./plugins/server');
const fastifyAngularBundle = require('./plugins/bundle');

function fastifyAngular(fastify, opts, next) {
  opts.dist = opts.dist || join(process.cwd(), 'dist');

  if (opts.i18n) {
    opts.browser = opts.browser || join(opts.dist, 'browser');

    const locales = readdirSync(opts.browser)
      .filter(name => existsSync(join(opts.browser, name)) && statSync(join(opts.browser, name)).isDirectory())
      .filter(name => existsSync(join(opts.browser, name)) && statSync(join(opts.browser, name, 'index.html')).isFile())
    ;

    fastify.register(require('./plugins/locale'));

    locales.forEach((locale) => {
      fastify.register(fastifyAngularBundle, {
        prefix : `/${locale}/`,
        browser: join(opts.browser, locale),
      });
    });
  } else {
    opts.browser = opts.browser || opts.dist;

    fastify.register(fastifyAngularBundle, {
      prefix : '/',
      browser: opts.browser,
    });
  }

  if (opts.universal) {
    opts.browser = opts.browser || join(opts.dist, 'browser');
    opts.server = opts.server || join(opts.dist, 'server');

    const locales = opts.i18n && readdirSync(opts.server)
      .filter(name => existsSync(join(opts.server, name)) && statSync(join(opts.server, name)).isDirectory())
      .filter(name => existsSync(join(opts.server, name)) && statSync(join(opts.server, name, 'main.js')).isFile())
    ;

    fastify
      .register(require('./plugins/render'), {
        browser: opts.browser,
      })
      .register(require('./plugins/engine'), {
        server : opts.server,
        locales: locales,
      })
      .register(fastifyAngularServer, {
        prefix   : '/',
        i18nRoute: opts.i18nRoute,
        i18nParam: opts.i18nParam || 'lng',
      });
  }

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngular, {
  fastify     : '1.x',
  name        : 'fastify-angular',
  decorators  : {
    request: ['detectedLng'],
  },
  dependencies: ['fastify-language-parser'],
});

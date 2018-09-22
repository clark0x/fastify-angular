'use strict';

const { join } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');

const fp = require('fastify-plugin');

const fastifyAngularBrowser = require('./browser');
const fastifyAngularServer = require('./server');

function fastifyAngular(fastify, opts, next) {
  opts.dist = opts.dist || join(process.cwd(), 'dist');

  if (!opts.i18n && !opts.universal) {
    opts.browser = opts.browser || opts.dist;

    fastify.register(fastifyAngularBrowser, {
      prefix : '/',
      browser: opts.browser,
    });
  }

  if (!opts.i18n && opts.universal) {
    opts.browser = opts.browser || join(opts.dist, 'browser');
    opts.server = opts.server || join(opts.dist, 'server');

    fastify.register(fastifyAngularServer, {
      prefix : '/',
      browser: opts.browser,
      server : opts.server,
    });
  }

  if (opts.i18n) {
    opts.browser = opts.browser || join(opts.dist, 'browser');

    const locales = readdirSync(opts.browser)
      .filter(name => existsSync(join(opts.browser, name)) && statSync(join(opts.browser, name)).isDirectory())
      .filter(name => existsSync(join(opts.browser, name)) && statSync(join(opts.browser, name, 'index.html')).isFile())
    ;

    locales.forEach((locale) => {
      fastify.register(fastifyAngularBrowser, {
        prefix : `/${locale}/`,
        browser: join(opts.browser, locale),
      });
    });
  }

  if (opts.universal) {
    opts.browser = opts.browser || join(opts.dist, 'browser');
    opts.server = opts.server || join(opts.dist, 'server');

    const locales = opts.i18n && readdirSync(opts.server)
      .filter(name => existsSync(join(opts.server, name)) && statSync(join(opts.server, name)).isDirectory())
      .filter(name => existsSync(join(opts.server, name)) && statSync(join(opts.server, name, 'main.js')).isFile())
    ;

    fastify.register(fastifyAngularServer, {
      prefix   : `/`,
      browser  : opts.browser,
      server   : opts.server,
      i18nRoute: opts.i18nRoute,
      i18nParam: opts.i18nParam || 'lng',
      locales  : locales,
    });
  }

  next();
}

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

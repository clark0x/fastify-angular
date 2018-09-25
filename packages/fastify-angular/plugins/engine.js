'use strict';

const { join } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');

// Common Engine
const { ɵCommonEngine } = require('@nguniversal/common/engine');
// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const [CommonEngine] = [ɵCommonEngine];

function fastifyAngularEngine(fastify, opts, next) {
  const locales = !opts.i18n ? [''] : readdirSync(opts.server)
    .filter(name => existsSync(join(opts.server, name)) && statSync(join(opts.server, name)).isDirectory())
    .filter(name => existsSync(join(opts.server, name)) && statSync(join(opts.server, name, 'main.js')).isFile())
  ;

  fastify.decorate('supportedServerLocales', {
    getter() {
      return locales;
    },
  });

  const engines = locales.reduce((result, locale) => {
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(join(opts.server, locale, 'main'));
    result[locale] = new CommonEngine(AppServerModuleNgFactory, [provideModuleMap(LAZY_MODULE_MAP)]);
    return result;
  }, {});

  fastify.decorateReply('engine', {
    getter() {
      return engines[this.request.locale];
    },
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularEngine, {
  fastify     : '1.x',
  name        : 'fastify-angular-engine',
});

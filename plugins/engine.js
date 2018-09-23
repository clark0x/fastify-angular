'use strict';

const { join } = require('path');

// Common Engine
const { ɵCommonEngine } = require('@nguniversal/common/engine');
// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const [CommonEngine] = [ɵCommonEngine];

function fastifyAngularEngine(fastify, opts, next) {
  const locales = opts.locales || [''];

  const engines = locales.reduce((result, locale) => {
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(join(opts.server, locale, 'main'));
    result[locale] = new CommonEngine(AppServerModuleNgFactory, [provideModuleMap(LAZY_MODULE_MAP)]);
    return result;
  }, {});

  fastify.decorate('engine', {
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
  decorators  : {
    request: ['locale'],
  },
  dependencies: ['fastify-angular-locale'],
});

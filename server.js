'use strict';

import { join } from 'path';

import { enableProdMode } from '@angular/core';
// Common Engine
import { ɵCommonEngine as CommonEngine, ɵRenderOptions as RenderOptions } from '@nguniversal/common/engine';
// Import token
import { ɵREQUEST as REQUEST, ɵRESPONSE as RESPONSE } from '@nguniversal/common/tokens';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

function fastifyAngularServer(instance, opts, next) {
  const locales = opts.locales || [''];
  const engines = locales.reduce((result, locale) => {
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(join(opts.server, locale, 'main'));
    result[locale] = new CommonEngine(AppServerModuleNgFactory, [provideModuleMap(LAZY_MODULE_MAP)]);
    return result;
  }, {});

  instance.decorateRequest('locale', {
    getter() {
      return opts.locales && this.detectedLng || '';
    },
  });

  instance.decorateReply('engine', {
    getter() {
      return engines[this.request.locale];
    },
  });

  instance.decorateReply('renderNG', function () {
    const options = {
      url             : this.request.req.url,
      documentFilePath: join(opts.browser, this.request.locale, 'index.html'),
      providers       : [{ provide: REQUEST, useValue: this.request }, { provide: RESPONSE, useValue: this }],
    } as RenderOptions;

    this.engine.render(options)
      .then(html =>
        this.type('text/html').code(200).send(html),
      );
  });

  if (opts.i18nParam) {
    instance.get(`/:${opts.i18nParam}/*`, (request, reply) => {
      reply.renderNG();
    });
  }

  instance.get('/*', (request, reply) => {
    reply.renderNG();
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularServer, {
  fastify     : '1.x',
  name        : 'fastify-angular-server',
  decorators  : {
    request: ['detectedLng'],
  },
  dependencies: ['fastify-language-parser'],
});

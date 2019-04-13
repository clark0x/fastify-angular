import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

export = function server(fastify, opts, next) {

  fastify
    .register(require('fastify-accepts'))
    .register(require('fastify-language-parser'), {
      order        : ['header'],
      fallbackLng  : 'en',
      supportedLngs: ['zh', 'en'],
    })
    .register(require('fastify-angular'), {
      dist     : __dirname,
      i18n     : true,
      universal: true,
    });

  next();
};

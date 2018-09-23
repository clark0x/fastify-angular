import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as fastify       from 'fastify';
import { enableProdMode } from '@angular/core';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const PORT = +process.env.PORT || 4000;

// Fastify server
const app = fastify({
  logger             : {
    level: 'error',
  },
  trustProxy         : true,
  ignoreTrailingSlash: true,
});

app
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
  })
  .listen(PORT, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`Node Fastify server listening on ${address}`);
    console.log(app.printRoutes());
  });

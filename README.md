# fastify-angular

[![Greenkeeper badge](https://badges.greenkeeper.io/clarkorz/fastify-angular.svg)](https://greenkeeper.io/)

Fastify plugin for angular universal project w/ multiple locales.

## Install

```
yarn add fastify-angular
or
npm install --save fastify-angular
```

## Usage

Follow [angular/universal-starter](https://github.com/angular/universal-starter). Replace `server.ts` with following code.

```js
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as fastify       from 'fastify';
import { enableProdMode } from '@angular/core';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const PORT = +process.env.PORT || 4000;

// Fastify server
const app = fastify();

app
  .register(require('fastify-accepts'))
  .register(require('fastify-language-parser'), {
    order: ['header']
  })
  .register(require('fastify-angular'), {
    dist: __dirname,
    i18n: true,
    universal: true,
  })
  .listen(PORT, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`Node Fastify server listening on ${address}`);
  });
```

## Options

This plugin allow you to specify options:

- `dist` _optional_. The `dist` folder path for angular output. For the recommended dist structure, `__dirname` should work. Default to `${process.pwd()}/dist`.
- `i18n` _boolean_, _optional_. `true` for i18n project (multiple builds for each locale). Default to `false`.
- `universal` _boolean_, _optional_. `true` if this is an universal project (there will be a browser folder and a server folder under dist
folder).
Default to `false`.
- `browser` _string_, _optional_. browser folder for client side build.
- `server` _string_, _optional_. server folder for server side build.
- `origin` _string_, _optional_. Server origin which will be passed to angular as `APP_BASE_HREF`. Default to server address which determined after server started. e.g.: `http://127.0.0.1:4000`.

## Recommend Dist Structure

```
dist
  |- browser
    |- en
      |- index.html
      |-...
    |- zh
      |- index.html
      |-...
  |- server
    |- en
      |- main.js
    |- zh
      |- main.js
  |- prerender.js
  |- server.js
  |- static.paths.js
```

### Useful NPM Scripts

#### Scripts for [Build for Multiple Locales]((https://angular.io/guide/i18n#build-for-multiple-locales))

Use following scripts to build angular universal for multiple locales.
```
"build:ssr": "yarn build:bundle && yarn compile:server",
"compile:server": "tsc -p server.tsconfig.json",
"build:bundle": "DIST=dist CONF=production yarn build:i18n",
"build:i18n": "for lang in zh en; do LANG=$lang CONF=${CONF} DIST=${DIST} yarn build:lang:bundle; if [ $? -ne 0 ]; then echo ERROR; exit 666; fi; done",
"build:lang:bundle": "LANG=${LANG} CONF=${CONF} DIST=${DIST} yarn build:lang:browser && LANG=${LANG} CONF=${CONF} DIST=${DIST} yarn build:lang:server",
"build:lang:browser": "yarn build --configuration ${CONF} --output-path ${DIST}/browser/${LANG} --i18n-file src/locale/messages.${LANG}.xlf --i18n-locale ${LANG} --base-href /${LANG}/ ",
"build:lang:server": "ng run ng-universal-demo:server:${CONF} --output-path ${DIST}/server/${LANG}  --i18n-file src/locale/messages.${LANG}.xlf --i18n-locale ${LANG}",
```
`yarn build:ssr` will create dist folder as recommended above.

#### Scripts for Extract i18n

```
"xi18n": "yarn xi18n:aot && yarn xi18n:jit",
"xi18n:aot": "ng xi18n --i18n-locale en && xliffmerge --profile xliffmerge.json",
"xi18n:jit": "ngx-extractor -i \"src/**/*.ts\" -f xlf2 -o src/locale/runtime/messages.xlf -l en && xliffmerge --profile xliffmerge.runtime.json",
```
Use [ngx-i18nsupport](https://github.com/martinroob/ngx-i18nsupport) for better angular i18n workflow.

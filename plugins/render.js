'use strict';

const { join } = require('path');

// Import token
const { ɵREQUEST, ɵRESPONSE } = require('@nguniversal/common/tokens');

const [REQUEST, RESPONSE] = [ɵREQUEST, ɵRESPONSE];

function fastifyAngularRender(fastify, opts, next) {

  fastify.decorateReply('renderNG', function () {
    const options = {
      url             : this.request.req.url,
      documentFilePath: join(opts.browser, this.request.locale, 'index.html'),
      providers       : [{ provide: REQUEST, useValue: this.request }, { provide: RESPONSE, useValue: this }],
    };

    fastify.engine.render(options)
      .then(html =>
        this.type('text/html').code(200).send(html),
      );
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularRender, {
  fastify     : '1.x',
  name        : 'fastify-angular-render',
  decorators  : {
    fastify: ['engine'],
  },
  dependencies: ['fastify-language-engine'],
});

'use strict';

const { join } = require('path');

const { ɵREQUEST, ɵRESPONSE, ɵORIGIN_URL } = require('@nguniversal/common/tokens');

const [REQUEST, RESPONSE, ORIGIN_URL] = [ɵREQUEST, ɵRESPONSE, ɵORIGIN_URL];

function fastifyAngularRender(fastify, opts, next) {

  fastify.decorateReply('renderNG', function () {
    const options = {
      url             : this.request.req.url.replace(`/${this.request.locale}/`, '/'),
      documentFilePath: join(opts.browser, this.request.locale, 'index.html'),
      providers       : [
        { provide: REQUEST, useValue: this.request },
        { provide: RESPONSE, useValue: this },
        { provide: ORIGIN_URL, useValue: fastify.origin },
      ],
    };

    this.engine.render(options)
      .then(html =>
        this.type('text/html').send(html),
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
    fastify: ['origin'],
    reply  : ['engine'],
  },
  dependencies: ['fastify-angular-origin', 'fastify-angular-engine'],
});

'use strict';

module.exports = function fastifyAngularBundle(fastify, opts, next) {
  fastify
    .register(require('./browser'), {
      prefix : '/',
      browser: opts.browser,
    })
    .setNotFoundHandler((request, reply) => {
      request.detectedLng = opts.locale;
      if (reply.renderNG) {
        reply.renderNG();
      } else {
        reply
          .code(404)
          .type('text/html')
          .sendFile(join(opts.browser, 'index.html'))
        ;
      }
    });
  next();
};

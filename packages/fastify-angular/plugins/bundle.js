'use strict';

module.exports = function fastifyAngularBundle(fastify, opts, next) {
  fastify
    .register(require('./browser'), {
      prefix : '/',
      browser: opts.browser,
    })
    .setNotFoundHandler((request, reply) => {
      switch(request.type(['text', 'image', 'html'])) {
        case 'html':
        case 'text':
          request.detectedLng = opts.locale;
          reply.renderNG
            ? reply.renderNG()
            : reply.code(404).type('text/html').sendFile(join(opts.browser, 'index.html'));
          break;
        default:
          reply.code(404).send('');
          break;
      }
    });
  next();
};

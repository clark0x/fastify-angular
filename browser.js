'use strict';

module.exports = function fastifyAngularBrowser(instance, opts, next) {
  instance.register(require('fastify-static'), { prefix: '/', root: opts.browser });
  instance.setNotFoundHandler((request, reply) => {
    if (reply.renderNG) {
      request.detectedLng = opts.locale || request.detectedLng;
      reply.renderNG();
    } else {
      reply.code(404).type('text/plain').send('NOT FOUND');
    }
  });
  next();
};

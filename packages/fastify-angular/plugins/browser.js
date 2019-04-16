'use strict';

module.exports = function fastifyAngularBrowser(fastify, opts, next) {
  fastify.register(require('fastify-static'), {
    prefix: '/',
    root  : opts.browser,
    redirect: true,
    // By default, send support `index.html` files. We have to disable this feature while avoid response 403
    index : '<ignore>',
  });
  next();
};

'use strict';

function serverAddress(address, isHttps) {
  const isUnixSocket = typeof address === 'string';
  if (!isUnixSocket) {
    if (address.address.indexOf(':') === -1) {
      address = address.address + ':' + address.port;
    } else {
      address = '[' + address.address + ']:' + address.port;
    }
  }
  address = (isUnixSocket ? '' : ('http' + (isHttps ? 's' : '') + '://')) + address;
  return address;
}

function fastifyAngularOrigin(fastify, opts, next) {

  fastify.decorate('_origin', null);

  fastify.decorate('origin', {
    getter() {
      if (this._origin) {
        return this._origin;
      }
      this._origin = opts.origin || serverAddress(fastify.server.address());
      return this._origin;
    },
  });

  next();
}

const fp = require('fastify-plugin');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(fastifyAngularOrigin, {
  fastify: '2.x',
  name   : 'fastify-angular-origin',
});

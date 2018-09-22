import * as fastify               from 'fastify';
import * as fastifyAngular        from 'fastify-angular';
import * as fastifyLanguageParser from 'fastify-language-parser';

const PORT = +process.env.PORT || 4000;

// Fastify server
const app = fastify({
  logger: true,
});

app
  .register(fastifyLanguageParser, {
    order        : ['path', 'header'],
    fallbackLng  : 'en',
    supportedLngs: ['zh', 'en'],
    pathParam    : 'locale',
  })
  .register(fastifyAngular, {
    dist     : __dirname,
    i18n     : true,
    universal: true,
    i18nRoute: true,
  })
  .listen(PORT, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`Node Fastify server listening on ${address}`);
    console.log(app.printRoutes());
  });

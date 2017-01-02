var koa = require('koa');
var logger = require('koa-logger');

module.exports = function(options) {
  var app = koa();
  app.use(logger());

  var router = require('koa-router')({
    prefix: '/api'
  });
  router.get('/healthcheck', function * (next) {
    console.log('healthcheck');
    this.body = {healthy:true};
  });

  let measurementsRoutes = require('./routes/measurements')(options);
  let feedingsRoutes = require('./routes/feedings')(options);
  let aggregates = require('./routes/aggregates')(options);

  router.use('/measurements', measurementsRoutes.routes(), measurementsRoutes.allowedMethods());
  router.use('/feedings', feedingsRoutes.routes(), feedingsRoutes.allowedMethods());
  router.use('/aggregates', aggregates.routes(), aggregates.allowedMethods());
  app.use(router.routes(), router.allowedMethods());

  app.listen(options.apiPort);
  console.log(`API listening on Port: ${options.apiPort}`);
};
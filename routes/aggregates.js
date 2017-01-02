var Router = require('koa-router');
module.exports = function(options){
  let router = Router();
  let aggregates  = require('../controllers/aggregates')(options);

  router
    .get('/ohlcv/hour', aggregates.ohlcvByHour);

  return router;
};

var Router = require('koa-router');
module.exports = function(options){
  let router = Router();
  let aggregates  = require('../controllers/aggregates')(options);

  router
    .get('/', aggregates.all);

  return router;
};

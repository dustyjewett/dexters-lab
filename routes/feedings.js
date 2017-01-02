var Router = require('koa-router');
module.exports = function(options){
  let router = Router();
  let feedings = require('../controllers/feedings')(options);

  router
    .get('/', feedings.all);

  return router;
};

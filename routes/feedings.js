var Router = require('koa-router');
module.exports = function(options){
  let router = Router();
  let feedings  = require('../controllers/feedings')(options);

  router
    .get('/', feedings.all);
  router
    .post('/', feedings.create);
  router
    .get('/:feedingId', feedings.one);

  return router;
};

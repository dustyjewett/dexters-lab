var Router = require('koa-router');
module.exports = function(options){
  let router = Router();
  let measurements  = require('../controllers/measurements')(options);

  router
    .get('/', measurements.all);

  return router;
};

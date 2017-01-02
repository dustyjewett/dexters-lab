const Presenter = require('yayson')({
  adapter: 'sequelize'
}).Presenter;

class MeasurementPresenter extends Presenter {}
MeasurementPresenter.prototype.type = 'measurement';

module.exports = function({db}) {

  let all = function * all(next) {
    console.log('here');
    if ('GET' != this.method) return yield next;
    yield db.getMeasurements()
      .then((measurements) => {
        this.body = MeasurementPresenter.render(measurements);
      })
  };

  return {
    all
  };
};

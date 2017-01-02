const Presenter = require('yayson')({
  adapter: 'sequelize'
}).Presenter;

class AggregatePresenter extends Presenter {}
AggregatePresenter.prototype.type = 'aggregate';

module.exports = function({db}) {
  let ohlcvByHour = function * all(next) {
    if ('GET' != this.method) return yield next;
    yield db.getAggregates('hour')
      .then((aggregates) => {
        this.body = AggregatePresenter.render(aggregates);
      });
  };

  return {
    ohlcvByHour
  };
};

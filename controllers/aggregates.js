const Presenter = require('yayson')({
  adapter: 'sequelize'
}).Presenter;

class AggregatePresenter extends Presenter {}
AggregatePresenter.prototype.type = 'aggregate';

module.exports = function({db}) {
  let all = function * all(next) {
    if ('GET' != this.method) return yield next;
    yield db.getAggregates(this.query.group)
      .then((aggregates) => {
        this.body = AggregatePresenter.render(aggregates);
      });
  };

  return {
    all
  };
};

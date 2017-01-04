const Presenter = require('yayson')({
  adapter: 'sequelize'
}).Presenter;

class FeedingPresenter extends Presenter {}
FeedingPresenter.prototype.type = 'feeding';

module.exports = function({db, scale}) {

  let all = function* all(next) {
    if ('GET' != this.method) return yield next;
    yield db.getFeedings()
      .then((feedings) => {
        this.body = FeedingPresenter.render(feedings);
      });
  };

  let create = function* create(next) {
    yield db.createMeasurement(scale._prevWeight)
      .then((preMeasurement) => {
        return db.createFeeding(preMeasurement)
      })
      .then((feeding) => {
        this.body = FeedingPresenter.render(feeding);
      });
  };

  let one = function* one(next) {
    yield db.getFeeding(this.params.feedingId)
      .then((feeding) => {
        this.body = FeedingPresenter.render(feeding);
      });
  };

  return {
    all,
    create,
    one
  };
};

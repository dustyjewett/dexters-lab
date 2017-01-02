module.exports = function({db}) {
  let all = function * all(next) {
    if ('GET' != this.method) return yield next;
    this.body = db.getFeedings();
  };

  return {
    all
  };
};

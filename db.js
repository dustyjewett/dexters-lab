var Promise = require('bluebird');
var sqlite3 = require('sqlite3').verbose();
var Sequelize = require('sequelize');


module.exports = async function() {
  var sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/database.sqlite'
  });

  var Measurement = sequelize.define('measurement', {
    ounces: Sequelize.REAL
  });

  var Aggregate = sequelize.define('aggregate', {
    group: {
      type:   Sequelize.STRING
    },
    year: {
      type:   Sequelize.INTEGER
    },
    month: {
      type:   Sequelize.INTEGER
    },
    date: {
      type:   Sequelize.INTEGER
    },
    hour:     Sequelize.INTEGER,
    open:     Sequelize.REAL,
    high:     Sequelize.REAL,
    low:      Sequelize.REAL,
    closing:  Sequelize.REAL,
    volume:   Sequelize.REAL
  });
  await Measurement.sync();
  await Aggregate.sync();

  var saveFeeding = (ounces) => {
    let feeding = {
      timestamp: new Date(),
      ounces
    };
    diskdb.feedings.save(feeding);
  };

  var getFeedings = () => {
    return diskdb.measurements.find();
  };

  var saveMeasurement = (ounces) => {
    return Measurement.create({ounces});
  };

  var getMeasurements = function() {
    return Measurement.all();
  };

  let newMonthAg = function newMonthAg(year, month) {
    return { group:'month', year, month, date: 0, hour: 0, volume: 0 };
  };
  let newDateAg = function newDateAg(year, month, date) {
    return { group: 'date', year, month, date, hour: 0, volume: 0 };
  };
  let newHourAg = function newHourAg(year, month, date, hour) {
    return { group: 'hour', year, month, date, hour, volume: 0 };
  };

  var addMeasurementToAggregates = async (measurement) => {
    let year = measurement.createdAt.getFullYear();
    let month = measurement.createdAt.getMonth();
    let date = measurement.createdAt.getDate();
    let hour = measurement.createdAt.getHours();

    let [monthAg] = await Aggregate.findOrCreate({
      where: { group: 'month', year, month },
      defaults: newMonthAg(year, month)
    });
    let [dateAg] = await Aggregate.findOrCreate({
      where: { group: 'date', year, month, date },
      defaults: newDateAg(year, month, date)
    });
    let [hourAg] = await Aggregate.findOrCreate({
      where: { group: 'hour', year, month, date, hour},
      defaults: newHourAg(year, month, date, hour)
    });

    let [updatedMonth, updatedDate, updatedHour] = [monthAg, dateAg, hourAg].map((original) => {
      let current = measurement.ounces;
      let { opening, high, low, closing, diff, volume } = original;
      opening = opening || current;
      high = (!high || current > high) ? current : high;
      low = (!low || current < low) ? current : low;
      diff = closing - current;
      if (diff > 0) {
        volume = (volume || 0) + diff;
      }
      closing = current;
      return {opening, high, low, closing, volume};
    });
    console.log(monthAg);
    console.log(updatedMonth);
    await monthAg.updateAttributes(updatedMonth);
    await dateAg.updateAttributes(updatedDate);
    await hourAg.updateAttributes(updatedHour);

  };

  var getAggregates = (group) => {
    return Aggregate.findAll({where: {group}});
  };


  return {
    saveFeeding, getFeedings,
    saveMeasurement, getMeasurements,
    addMeasurementToAggregates, getAggregates
  };


};
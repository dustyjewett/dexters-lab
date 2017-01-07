var WebScale = require('webscale');
const EventEmitter = require('events');

class FakeScale extends EventEmitter {}

module.exports = function({fake, db}){
  let scale;
  if(fake) {
    scale = new FakeScale();

    // Simulate a 'full' dish that has a 1:10 chance of having .5-1.5oz eaten from it ever 10 seconds
    let weight = 10;
    scale._prevWeight = 10;
    setInterval(() => {
      if (weight > 0 && Math.floor(Math.random() * 10) === 1) {
        weight = Math.round((weight - (Math.random() + .5)) * 100) / 100;
        weight = (weight > 0) ? weight : 0;
        scale._prevWeight = weight;
        scale.emit('change:weight', weight);
      }
    }, 10000);

  } else {
    scale = new WebScale(0);
  }

  scale.on('change:weight', async function(ounces){
    console.log(`Weight Change: ${ounces}`);
    let measurement = await db.saveMeasurement(ounces);
    db.addMeasurementToAggregates(measurement);
  });
  scale.on('disconnected', function(error){
    console.log("Disconnected: ", error);
  });
  return scale;
};


var WebScale = require('webscale');
const EventEmitter = require('events');

class FakeScale extends EventEmitter {}

module.exports = function({fake, db}){
  let scale;
  if(fake) {
    scale = new FakeScale();

    // Simulate a 'full' dish that has a 1:10 chance of having .5-1.5oz eaten from it ever 10 seconds
    let weight = 10;
    setInterval(() => {
      if (true) { //weight > 0 && Math.floor(Math.random() * 10) === 1) {
        console.log("Starting Weight", weight);
        weight = Math.round((weight - (Math.random() + .5)) * 100) / 100;
        console.log("New Weight", weight);
        weight = (weight > 0) ? weight : 0;
        console.log("Corrected Weight", weight);
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
  return scale;
};

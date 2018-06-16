#!/usr/bin/env node
var program = require('commander');
var rp = require('request-promise-native');
//var SDC = require('statsd-client');

var Mixpanel = require('mixpanel');

program
  .option('-f, --fake', 'Fake Data (for testing)')
  .parse(process.argv);



async function main(){
  var mixpanel = Mixpanel.init('388b1cdc127f583cd2401f2e2838eb7e');
  // var statsdOptions = {
  //   host: 'stats.dusty.is',
  //   prefix: 'dexters-lab',
  //   debug: true,
  //   tcp: true
  // };

  let prefix = program.fake ? 'debug-' : '';
  if (program.fake) {
    // statsdOptions.prefix += '-fake'
  }
  // sdc = new SDC(statsdOptions);

  let reportWeight = (ounces) => {
    mixpanel.track(`${prefix}scale`, {
      ounces: ounces,
    });
    var options = {
      method: 'POST',
      uri: 'https://hooks.slack.com/services/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',
      body: {
        username: 'Dexter\'s Dish',
        icon_emoji: 'smile_cat',
        text: `Dish now at ${ounces} oz `
      },
      json: true
    };
    rp(options);
    // sdc.gauge('ounces', ounces);
  };

  let reportDisconnected = () => {
    // sdc.increment('disconnected');
    mixpanel.track(`${prefix}disconnect`);
    var options = {
      method: 'POST',
      uri: 'https://hooks.slack.com/services/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',
      body: {
        username: 'Dexter\'s Dish',
        icon_emoji: 'scream_cat',
        text: `Dish Disconnected :scream_cat:`
      },
      json: true
    };
    rp(options);
  };

  let options = {
    scale: require('./scale')({fake: program.fake, reportWeight, reportDisconnected})
  };

}

main();

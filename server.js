#!/usr/bin/env node
var program = require('commander');
var Promise = require('bluebird');
var SDC = require('statsd-client');

program
  .option('-f, --fake', 'Fake Data (for testing)')
  .parse(process.argv);

async function main(){
  var statsdOptions = {
    host: 'stats.dusty.is',
    prefix: 'dexters-lab',
    debug: true,
    tcp: true
  };
  if (program.fake) {
    statsdOptions.prefix += '-fake'
  }
  sdc = new SDC(statsdOptions);

  let options = {
    scale: require('./scale')({fake: program.fake, sdc})
  };

}

main();

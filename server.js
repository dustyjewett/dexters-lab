#!/usr/bin/env node
var program = require('commander');
var Promise = require('bluebird');


program
  .option('-f, --fake', 'Fake Data (for testing)')
  .option('-sp, --socket-port', 'Socket Port', parseInt)
  .option('-ap, --api-port', 'API Port', parseInt)
  .parse(process.argv);

async function main(){
  let db = await require('./db')();
  let options = {
    apiPort: program['api-port'] || 8000,
    socketPort: program['socket-port'] || 8080,
    fake: program.fake,
    db,
    scale: require('./scale')({fake: program.fake, db})
  };

  require('./api')(options);
  require('./sockets')(options);

}

main();

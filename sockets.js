var WS = require('ws');

module.exports = function(options) {
  let {scale, socketPort, db} = options;

  var wss = new WS.Server({port: socketPort});

  let sendWeight;

  let receiveMessage = function(message) {
    console.log(`received: ${message}`);
  };

  wss.on('connection', function(ws) {
    ws.on('message', receiveMessage );
    sendWeight = function(ounces){
      //console.log(`Sending Weight Change: ${ounces}`);
      try{
        ws.send(JSON.stringify({
          ounces: ounces
        }));
      } catch (e){
        scale.removeListener('change:weight', sendWeight);
      }
    };
    scale.on('change:weight', sendWeight);
    console.log('Connection Opened.');
  });

  wss.on('close', function() {
    console.log('Closing');
    scale.removeListener('change:weight', sendWeight);
  });

  console.log(`Websocket listening on Port: ${socketPort}`);
};


var silent = process.argv[2] === 'silent';

/**
 * Dependencies
 */

var Primus = require('primus')
  , PrimusResponder = require('primus-responder')
  , multiplex = require('primus-multiplex')
  , http = require('http');


// Boot server
var server = http.createServer()
  , primus = new Primus( server, {transformer: 'sockjs'} );

// Plugins
primus.use('responder', PrimusResponder);
primus.use('multiplex', multiplex);

primus.on('connection', function (spark) {
  silent || console.log('connection has the following headers', spark.headers);
  silent || console.log('connection was made from', spark.address);
  silent || console.log('connection id', spark.id);

  spark.on('data', function (data) {
    silent || console.log('received data from the client', data);
    spark.write({ foo: data });
  });

  // Handle incoming requests:
  spark.on('request', function(data, done) {
    silent || console.log('incoming REQUST for response');
    data.reqtouch = true;
    // Echo the received request data
    done(data);
  });
});

// Listen on port
var port = 3001;
console.log('Socket server on '+port);
server.listen(port, 'localhost');


var silent = process.argv[2] === 'silent';

/**
 * Dependencies
 */

var Primus = require('primus')
  , http = require('http');


// Boot server
var server = http.createServer()
  , primus = new Primus( server, {transformer: 'sockjs'} );


primus.on('connection', function (spark) {
  console.log('connection has the following headers', spark.headers);
  console.log('connection was made from', spark.address);
  console.log('connection id', spark.id);

  spark.on('data', function (data) {
    console.log('received data from the client', data);
    spark.write({ foo: data });
  });

  });
});

// Listen on port
var port = 3001
console.log('Socket server on '+port);
server.listen(port, 'localhost');

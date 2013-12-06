
/**
 * Dependencies
 */

var http = require('http');
var io = require('sockjs').createServer();;

/**
 * Socket handler
 */

io.on('connection', function ( conn ) {

  console.log('[connected]', conn.id );

  conn.on('data', function ( message ) {
    console.log('[data]', message );
    conn.write( message );
  });

  conn.on('close', function () {
    console.log('[closed]', conn.id );
  });

});

// Boot server
var server = http.createServer();
io.installHandlers( server );

// Listen on port 3001
server.listen(3001, 'localhost');

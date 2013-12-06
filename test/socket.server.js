
var silent = process.argv[2] === 'silent';

/**
 * Dependencies
 */

var http = require('http');
var io = require('sockjs').createServer( {log:function(){}});

/**
 * Socket handler
 */


io.on('connection', function ( conn ) {

  silent || console.log('[connected]', conn.id );

  conn.on('data', function ( message ) {
    silent || console.log('[data]', message );
    conn.write( message );
  });

  conn.on('close', function () {
    silent || console.log('[closed]', conn.id );
  });

});

// Boot server
var server = http.createServer();
io.installHandlers( server );

// Listen on port 3001
server.listen(3001, 'localhost');

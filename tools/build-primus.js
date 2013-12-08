
console.log('Writing Primus socket client file...');

var Primus = require('Primus')
  , primus = new Primus( require('http').createServer(), {transport:'sockjs'} );

// Dump base client library
var client = primus.library();

// Cut out the SockJS transport client
var reg = /\/\* SockJS[\s\S]*End of lib\/all\.js/;
var chunk = client.replace( reg, '' );

// Replace the Factory with something that doesn't require global `SockJS`
var str = /function Factory[\s\S]*undefined;[\s]*}/;
function Factory() {
  return require('sockjs-client');
}
chunk = chunk.replace( str, Factory.toString() );

// Finally, strip out some extra Primus Factory junk
chunk = chunk.replace( /\sif \(!Factory\)[\s\S]*`'\)\);\s*/, '' );

// Write to file system
var fs = require('fs');
try {
  fs.writeFileSync('./primus.js', chunk, 'utf-8');
}
catch( e ) { console.log('error', e ); }


// Output to console
console.log( 'Original Length:', client.length, 'bytes' );
console.log( 'File written: ', chunk.length, 'bytes' );

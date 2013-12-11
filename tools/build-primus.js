
/**
 * Primus includes a `primus.library()` function that generates a "Client".
 * Unfortunately this thing doesn't play nicely with browserify.
 * So this `build-primus.js` is about ripping out the parts of the
 * "Client" that shouldn't be there (sockjs), and modifying the plugins
 * so they work with the compiled adapter.
 *
 * Nasty. Yes. The only other option is rewriting the primus library parser.
 * Maybe once we hit version changing headaches. 'til then...
 */

console.log('Writing Primus socket client file...');

var Primus = require('Primus')
  , primus = new Primus( require('http').createServer(), {transport:'sockjs'} )
  , responder = require('primus-responder')
  , multiplex = require('primus-multiplex');


// -- Include plugins
primus.use('responder', responder);
primus.use('multiplex', multiplex);


// -- Generate initial client
// Dump base client library
var client = primus.library();



// -- Strip out SockJS and Factory
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



// -- Pull out the plugins
// Anon wrapper for plugins:
var wrapper = ';(function(Primus){%})(Primus);';

// Responder
var cr = /\s\(function\(\)\{var globa[\s\S]*al\)\{([\s\S]*)\}\);var exp[\s\S]*exp;\s}\)\(\);/;
var plugr = wrapper.replace( '%', cr.exec( chunk )[1] );
chunk = chunk.replace( cr, '' );

// Multiplexer
var mr = /;\(function \(Primus, undefined\) {([\s\S]*)\s\}\)\(Primus\);/;
var plugm = wrapper.replace( '%', mr.exec( chunk )[1] );
chunk = chunk.replace( mr, '' );
// Strip out the multiplexer 'require' method that eats it in browserify
var ss = /try {[\s]*Stream[\s\S]*catch \(e\) {([\s\S]*)}\s*\/\/ shortcut to slice/;
plugm = plugm.replace( ss, ss.exec( plugm )[1] );





// -- Reapply the plugins inside the Primus scope
chunk = chunk.replace( /return Primus; }\);/, plugr + '\n\n' + plugm + '\n\n\nreturn Primus; });' );



// --Write to file system
var fs = require('fs');
try {
  fs.writeFileSync('./primus.js', chunk, 'utf-8');
}
catch( e ) { console.log('error', e ); }



// -- Output to console
console.log( 'Original Length:', client.length, 'bytes' );
console.log( 'File written: ', chunk.length, 'bytes' );

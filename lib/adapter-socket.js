
/**
 * Dependencies
 */

var adapter = require('mekanika-adapter')
  , parse = require('./parsers')
  // Relies on `primus.js` being generated from `/tools/build-primus.js`
  // $ make build
  , Primus = require('../primus');


/**
 * Export adapter
 */

module.exports = exports = adapter('socket');


/**
 * Default configuration
 */

exports.config = {
    protocol: 'http'
  , host: 'localhost'
  , port: 80
  , methods: {
        create: 'create'
      , find: 'find'
      , update: 'update'
      , save: 'save'
      , remove: 'remove'
    }
  , socket: {}
};


/**
 * Internal socket references
 * @private
 */
var socket = exports.socket = {};


/**
 * Connects a socket, creating one if it doesn't exist
 *
 * @param {Function} [cb] Optional callback once connected, passed (err, handle)
 *
 * @returns this adapter
 */

exports.connect = function( cb ) {

  var url = parse.url( exports.config );

  // Shutdown any currently open socket
  if (socket.readyState === 3) {
    socket.once('end', function() { exports.connect( cb ); });
    return socket.end(), this;
  }

  // Create the new socket and connect
  var opts = {strategy:['online'], reconnect:{retries:1}};
  socket = exports.socket = Primus.connect( url, opts );

  var onOpen = function () {
    socket.removeListener( 'end', onError );
    if (cb) cb( null, socket );
  };

  var onError = function connectError( e ) {
    socket.removeListener( 'open', onOpen );
    if (cb) cb( e || new Error('Could not connect') );
  };

  socket.once( 'open', onOpen );
  socket.once( 'end', onError );

  // Enable `var adapter = require(...).connect();`
  return this;
};


/**
 * Disconnects the socket if connected
 *
 * @param {Function} [cb] Optional callback on disconnect (err, handle)
 *
 * @returns this adapter
 */

exports.disconnect = function( cb ) {

  // Callback socket pointer if no socket to disconnect
  if (!socket.readyState) return cb && cb( null, socket), this;

  // Disconnect the socket
  if (socket.readyState === 3) {
    // Only run the callback when we receive the end event
    if (cb) socket.once( 'end', function() { cb( null, socket ); } );
    socket.end();
  }
  // Socket is already closed, pass it back
  else if (cb) cb(null, socket);

  // Return adapter
  return this;
};


/**
 * Passes a query request object to a socket connection
 *
 * @param req query object
 */

exports.exec = function ( req, cb ) {

  var msg = parse.message( req, exports.config );

  var _send = function ( err ) {
    if (err) return cb && cb( err );

    socket.write( msg );
    if (cb) cb( null, true );
  };

  socket.readyState === 3 ? _send() : exports.connect( _send );

  return socket;
};

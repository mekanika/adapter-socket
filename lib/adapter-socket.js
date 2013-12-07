
/**
 * Dependencies
 */

var adapter = require('mekanika-adapter')
  , sockjs = require('sockjs-client')
  , parse = require('./parsers');


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
var socket = {};


/**
 * Connects a socket, creating one if it doesn't exist
 *
 * @param {Function} [cb] Optional callback once connected, passed (err, handle)
 *
 * @returns this adapter
 */

exports.connect = function( cb ) {

  // Shutdown any currently open socket
  if (socket.close) {
    if (socket.close())
      return socket.onclose = function() { exports.connect( cb ); }, this;
  }

  // Create the new socket and connect
  socket = sockjs( parse.url( exports.config ) );

  // Run the callback
  socket.onopen = function () {
    // Reset the onclose error check call
    socket.onclose = null;
    if (cb) cb( null, socket );
  };

  // Errors on connection show up in 'onclose'
  socket.onclose = cb || function() {};

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
  if (!socket.close) return cb && cb( null, socket), this;

  // Disconnect the socket
  if (socket.close()) {
    // Only run the callback when we receive the close event
    if (cb) socket.onclose = function () { cb( null, socket); };
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

    socket.send( msg );
    if (cb) cb( null, true );
  };

  socket.readyState === 1 ? _send() : exports.connect( _send );

  return socket;
};

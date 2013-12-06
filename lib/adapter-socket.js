
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
 * @param {Function} [cb] Optional callback once connected, passed (err, socket)
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
 *
 * @param req query object
 * @param {Function} cb Callback passed `( err, results )`
 */

exports.exec = function ( req, cb ) {

  throw new Error('Adapter not implemented');

};

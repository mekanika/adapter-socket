
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
 * Core adapter execution method
 *
 * @param req query object
 * @param {Function} cb Callback passed `( err, results )`
 */

exports.exec = function ( req, cb ) {

  throw new Error('Adapter not implemented');

};


/**
 * Dependencies
 */

var adapter = require('mekanika-adapter');


/**
 * Export adapter
 */

module.exports = exports = adapter('socket');


/**
 * Default configuration
 */

exports.config = {};


/**
 * Core adapter execution method
 *
 * @param req query object
 * @param {Function} cb Callback passed `( err, results )`
 */

exports.exec = function ( req, cb ) {

  throw new Error('Adapter not implemented');

};

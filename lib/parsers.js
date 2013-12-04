
/**
 * Expose module
 */

module.exports = exports;


/**
 * Generates a URL to connect sockets to
 *
 * @param cfg the configuration for the adapter
 *
 * @returns url string
 */

exports.url = function ( cfg ) {
  // Core URL
  var _url = cfg.protocol + '://' + cfg.host;

  // Optional 'special' port
  if (cfg.port !== '' && cfg.port+'' !== '80')
    _url += ':' + cfg.port;

  // Connect on a socket.io namespace `http://host.io/namespace`
  if (cfg.namespace)
    _url += '/' + cfg.namespace.replace( /\//g, '' );

  return _url;
};


/**
 * Generates a `message` name for the event to send to the socket
 *
 * @param req the query request object
 * @param cfg the configuration for the adapter
 *
 * @throws if `req.action` has no mapped event
 * @returns message to send to socket
 */

exports.message = function ( req, cfg ) {
  var mapped = cfg.methods[ req.action ];

  if (!mapped) {
    var err = 'Socket adapter cannot map an event for action: "%"';
    throw new Error( err.replace('%', req.action) );
  }

  return mapped;
};

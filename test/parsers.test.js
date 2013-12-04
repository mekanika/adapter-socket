
/**
 * Dependencies
 */

var expect = require('expect.js')
  , parse = require('../lib/parsers')
  , socket = require('../lib/adapter-socket');


describe('Parsers', function () {


  describe('.url( cfg )', function () {

    it('generates a URL string from config', function () {
      expect( parse.url( socket.config ) ).to.be( 'http://localhost' );
    });

    it('adds a :port if one specified and is not default (80)', function () {
      socket.config.port = 3000;
      expect( parse.url( socket.config ) ).to.be( 'http://localhost:3000' );
      socket.config.port = '';
      expect( parse.url( socket.config ) ).to.be( 'http://localhost' );
      // Reset the port
      socket.config.port = 80;
    });

    it('applies a namespace if one is specified', function () {
      socket.config.namespace = '/merp';
      expect( parse.url( socket.config ) ).to.be( 'http://localhost/merp' );
      socket.config.namespace = '';
    });

  });


  describe('.message( req, cfg )', function () {

    it('returns a mapped string based on `req.action`', function () {
      var cfg = socket.config;
      var actions = ['create', 'find', 'update', 'save', 'remove'];
      actions.forEach( function( a ) {
        expect( parse.message( {action:a}, cfg) ).to.be( a );
      });
    });

    it('throws if req.action does not map to an event', function () {
      var err;
      try {
        parse.message( {action:'^_^'}, socket.config );
      }
      catch( e ) { err = e; }
      expect( err ).to.be.an( Error );
      expect( err.message ).to.match( /map.*action/ );
    });

  });

});

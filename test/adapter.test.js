
/**
 * Dependencies
 */

var expect = require('expect.js')
  , socket = require('../lib/adapter-socket');


describe('Adapter', function () {

  it('implements an .exec( req, cb ) method', function () {
    expect( socket.hasOwnProperty( 'exec' ) ).to.be( true );
    expect( socket.exec.length ).to.be.above( 1 );
  });

  describe('.config', function () {

    it('.protocol set to `http`', function () {
      expect( socket.config.protocol ).to.be( 'http' );
    });

    it('.host set to `localhost`', function () {
      expect( socket.config.host ).to.be( 'localhost' );
    });

    it('.port set to `80`', function () {
      expect( socket.config.port ).to.be( 80 );
    });

    it('.methods map reflects default query actions', function () {
      var actions = ['create', 'find', 'update', 'save', 'remove'];
      expect( socket.config.methods ).to.only.have.keys( actions );
      // Test that methods are mapped to their same name by default
      actions.forEach( function(a) {
        expect( socket.config.methods[a] ).to.be( a );
      });
    });

    it('.socketio defaults are empty', function () {
      expect( socket.config.socketio ).to.be.empty();
    });

  });

});


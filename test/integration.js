

describe('Adapter browser tests (require socket server on 3001)', function () {

  // Apply test server config
  beforeEach( function () {
    socket.config.port = 3001;
  });

  // Return config to earlier defaults
  after( function () {
    socket.config.port = 80;
  });



  describe('.connect( cb )', function () {

    it('creates a new socket firing callback( err, socket )', function ( done ) {
      socket.connect( function (err,res) {
        if (!err) {
          expect( res ).to.an.instanceof( SockJS );
          done();
        }
        else throw new Error( err );
      });
    });

    it('callsback an error if connect fails (onclose)', function ( done ) {
      socket.config.port = 21121;
      socket.connect( function( err, res ) {
        expect( err ).to.exist;
        expect( err.type ).to.equal( 'close' );
        expect( err.code ).to.equal( 1002 );
        expect( res ).to.not.exist;
        done();
      });
    });

    it('removes the connect error event if no error', function ( done ) {
      socket.connect( function (err, res) {
        expect( err ).to.be.null;
        expect( res.onclose ).to.be.null;
        done();
      });
    });

    it('disconnects a connected socket on .connect', function ( done ) {
      socket.connect( function (err, res) {
        var sid = res._server;

        socket.connect( function (err, res) {
          expect( err ).to.not.exist;
          expect( res._server ).to.not.eql( sid );
          done();
        });
      });

    });

    it('returns the adapter', function () {
      expect( socket.connect() ).to.equal( socket );
    });

  });

});



describe('Adapter browser tests (require socket server on 3001)', function () {

  // Apply test server config
  beforeEach( function () {
    socket.config.port = 3001;
    // Ensures 'bad' connections don't constantly retry
    socket.config.socket = {strategy:['online'], reconnect:{retries:1}};
  });

  // Return config to earlier defaults
  after( function () {
    socket.config.port = 80;
  });


  // Map internal Primus readyState
  var state = {
    OPENING: 1,
    CLOSED: 2,
    OPEN: 3
  }

  describe('.connect( cb )', function () {

    it('creates a new socket firing callback( err, socket )', function ( done ) {
      socket.connect( function first(err,res) {
        expect( err ).to.not.exist;
        // Primus instances are EventEmitters
        expect( res.constructor.name ).to.equal( 'EventEmitter' );
        expect( res.readyState ).to.equal( state.OPEN );
        done();
      });
    });

    it('callsback an error if connect fails (onclose)', function ( done ) {
      socket.config.port = 21121;
      socket.connect( function second( err, res ) {
        expect( err ).to.exist;
        expect( res ).to.not.exist;
        done();
      });
    });

    it('removes the connect error event if no error', function ( done ) {
      socket.connect( function (err, res) {
        expect( err ).to.be.null;

        expect( res.listeners('end') ).to.have.length( 1 );
        // process.nexTick -- runs the 'remove' event and returns to 0 (primus)
        setTimeout( function(){
          expect( res.listeners('end') ).to.have.length( 0 );
          done();
        }, 0 );
      });
    });

    it('disconnects a connected socket on .connect', function ( done ) {
      socket.connect( function (err, res) {
        res.on( 'end', function() {
          done()
        })

        socket.connect();
      });

    });

    it('uses adapter.config.socket config as connect options', function () {
      // Shorthand
      var cfg = socket.config.socket;
      var sockOpts = socket.socket.options;
      // Only need one check (see `beforeEach` for where this is set)
      expect( sockOpts.reconnect ).to.eql( cfg.reconnect );
    });

    it('returns the adapter', function (done) {
      expect( socket.connect( done ) ).to.equal( socket );
    });

  });


  describe('.disconnect( cb )', function () {

    it('disconnects the socket connection', function ( done ) {
      socket.connect( function (err, res) {
        expect( err ).to.not.exist;
        res.once( 'end', function() {
          done();
        });
        socket.disconnect();
      });
    });

    it('runs the callback(err, socket) if provided', function ( done ) {
      socket.connect( function (err, res) {
        expect( err ).to.not.exist;
        socket.disconnect( function (err, res) {
          expect( res.readyState ).to.eql( state.CLOSED );
          done();
        });
      });
    });

    it('runs callback even when already disconnected', function ( done ) {
      socket.connect( function (err, res) {
        socket.disconnect( function(err,res) {
          socket.disconnect( function( err, res ) {
            expect( err ).to.not.exist;
            expect( res.readyState ).to.eql( state.CLOSED );
            done();
          });
        });
      });
    });

    it('runs callback even if no socket ever present', function ( done ) {
      socket.socket = null;
      socket.disconnect( function() {
        expect( arguments ).to.have.length( 2 );
        done();
      })
    });

  });


  describe('.exec( req, cb )', function () {

    it('returns a socket', function (done) {
      var sock = socket.exec( {action:'find'}, done );
      // Duck type primus Socket
      expect( sock.constructor.name ).to.equal( 'EventEmitter' );
      expect( sock.readyState ).to.exist;
    });

    it('passes errors to callback', function ( done ) {
      // Force connection to a dead port
      socket.config.port = 12267;
      socket.disconnect( function() {

        socket.exec( {action:'find'}, function (err, res) {
          expect( err ).to.exist;
          done();
        });

      });

    });

    it('passes success flag to callback once sent', function ( done ) {
      socket.exec( {action:'find'}, function (err, res) {
        expect( err ).to.not.exist;
        expect( res ).to.be.true;
        done();
      });
    });

  });

});


# adapter-socket

Mekanika socket adapter. **WIP. Do not use.**

Built on top of [Primus](https://github.com/primus/primus), using [SockJS](https://github.com/sockjs/sockjs-node) as the transport mediator.

Primus adds:

- Reconnect handling (with a backoff reconnect strategy)
- Offline detection
- Stream compatible interface for client/server

Plugins used:

- [Multiplex](https://github.com/cayasso/primus-multiplex): adds multiplex 'channels' to single socket
- [Responder](https://github.com/swissmanu/primus-responder): REQ-REP pattern for requests


## License

MIT

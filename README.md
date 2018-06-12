# x-platform-ws

The cross-platform `WebSocket` wrapper in Javascript, imitating the API of the `ws` package on browser.

## Installation

First make sure you have `node` and `npm` (Comes with [Node](https://nodejs.org)) installed, then run:

```console
  $ npm install x-platform-ws --save
```

Bingo! You're made it!

### Further information

If you are `x-platform-ws` in a project with [browserify](http://browserify.org/) or [webpack](https://webpack.js.org/), everything will be working fine.

If not, you should add `events` and `buffer` to your dependencies. They are peer dependencies of `x-platform-ws` so you have to install them manually. (Webpack and browserify have them installed and automatically bundled for browsers)

## Usage

```javascript
  const WebSocket = require('x-platform-ws');
  const ws = new WebSocket('wss://echo.websocket.org');
  ws.on('message', data => console.log(data));
  ws.on('open', () => console.log('Opened!'));
  ws.on('close', (code, reason) => console.log(`Closed: code=${code}, reason=${reason}`));
  setTimeout(() => ws.close(), 10000);
```

It is almost compatible with the client in the [`ws`](https://github.com/websockets/ws) package, with some noticable differences:
- The `options` parameter of the `WebSocket` constructor is only effective on the node side.
- The `ping()` and `pong()` methods are not supported in the browser. See [this SO thread](https://stackoverflow.com/questions/10585355/sending-websocket-ping-pong-frame-from-browser) for explanations.
- The [UNIX domain sockets](https://en.wikipedia.org/wiki/Unix_domain_socket) are not supported in the browser.
- The `'fragment'` [`binaryType`](https://github.com/websockets/ws/blob/master/doc/ws.md#websocketbinarytype) is not supported on the browser.

For the `ws` api, see [the official docs](https://github.com/websockets/ws/blob/master/doc/ws.md).

## Features

- Support using `'nodebuffer'` as `binaryType` with almost 100% compatibility. (Thanks to the `buffer` npm package)
- Support using `on()`, `once()` and other methods of the Node `EventEmitter` class. (Thanks to the `events` npm package)

## Development

First clone the repository:

```console
  $ git clone https://github.com/std4453/x-platform-ws
```
Then, change to working dir:

```console
  $ cd x-platform-ws
```

And:

```console
  $ npm install
```

Now play with it as you like!

## Versioning

We use [semantic versioning](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/std4453/x-platform-ws/tags).

## Authors

- __std4453__ - [me@std4453.com](mailto:me@std4453.com)

## License

This project is licensed under the MIT License, see [LICENSE](https://github.com/std4453/x-platform-ws/blob/master/LICENSE) for details.

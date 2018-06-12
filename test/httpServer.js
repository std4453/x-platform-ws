const Koa = require('koa');
const serve = require('koa-static');

const { fromServer, fromCallback } = require('./promisify');
const { httpPort, host } = require('./locations');

let server;

module.exports = {
    start() {
        if (typeof server !== 'undefined') {
            console.log('Http server already started');
            return Promise.resolve(server);
        }
        server = new Koa().use(serve('.')).listen(httpPort, host);
        server.on('listening', () => console.log(`Http server listening on http://${host}:${httpPort}`));
        server.on('close', () => console.log('Http server closed'));
        return fromServer(server);
    },
    stop: () => {
        if (typeof server === 'undefined') {
            console.log('Http server not yet started');
            return Promise.resolve();
        }
        return fromCallback(server, server.close)();
    },
};

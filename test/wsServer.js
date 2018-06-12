const { Server } = require('ws');

const { fromServer, fromCallback } = require('./promisify');
const { wsPort, host } = require('./locations');

const onMessage = ws => data => ws.send(data);
let server;

module.exports = {
    start() {
        if (typeof server !== 'undefined') {
            console.log('WebSocket server already started');
            return Promise.resolve(server);
        }
        server = new Server({
            port: wsPort,
            host,
        });
        server.on('connection', socket => socket.on('message', onMessage(socket)));
        server.on('listening', () => console.log(`WebSocket server listening on ws://${host}:${wsPort}`));
        server.on('close', () => console.log('WebSocket server closed'));
        return fromServer(server);
    },
    stop: () => {
        if (typeof server === 'undefined') {
            console.log('WebSocket server not yet started');
            return Promise.resolve();
        }
        return fromCallback(server, server.close)();
    },
};

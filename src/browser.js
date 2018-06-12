const EventEmitter = require('events');
const { Buffer } = require('buffer');
const delegate = require('delegates');

const callWhenExist = (fn, ...args) => { if (typeof fn === 'function') fn(...args); };

class MockWebSocket extends EventEmitter {
    constructor(url, protocols) {
        super();

        Object.defineProperty(this, 'ws', {
            value: new WebSocket(url, protocols),
            writable: false,
            enumerable: true,
        });

        this.ws.addEventListener('open', () => this.emit('open'));
        this.ws.addEventListener('close', ({ code, reason }) => this.emit('close', code, reason));
        this.ws.addEventListener('error', (e) => {
            const error = e.error || new Error('Server error'); // some clients don't have e.error
            this.emit('error', error);
            callWhenExist(this.onerror, error);
        });

        this.ws.addEventListener('message', (event) => {
            const transformed = this.transformMessage(event.data);
            this.emit('message', transformed);
            const transformedEvent = transformed === event.data ? event : new MessageEvent(
                event.type, {
                    data: transformed,
                    origin: event.origin,
                    lastEventId: event.lastEventId,
                    source: event.source,
                    ports: event.ports,
                });
            callWhenExist(this.onmessage, transformedEvent);
        });

        let binaryType = 'nodebuffer';
        this.ws.binaryType = 'arraybuffer';
        Object.defineProperty(this, 'binaryType', {
            enumerable: true,
            get() {
                return binaryType;
            },
            set(value) {
                binaryType = value;
                this.ws.binaryType = value === 'nodebuffer' ? 'arraybuffer' : value;
            },
        });
    }

    transformMessage(data) {
        if (this.binaryType !== 'nodebuffer') return data;
        return Buffer.from(data);
    }

    send(data, _, callback) {
        // since Buffers are Uint8Arrays, they can be sent directly
        this.ws.send(data);
        callWhenExist(callback);
    }

    terminate() {
        this.close();
    }
}

delegate(MockWebSocket, 'ws')
    .access('protocol')
    .access('extensions')
    .access('onopen')
    .access('onclose')
    .getter('readyState')
    .getter('url')
    .getter('bufferedAmount')
    .method('close');

module.exports = MockWebSocket;

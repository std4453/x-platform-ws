const EventEmitter = require('events');
const Buffer = require('buffer');

const callWhenExist = (fn, ...args) => { if (typeof fn === 'function') fn(...args); };
const synchronize = (src, dst, name, readonly = false) => {
    Object.defineProperty(dst, name, {
        enumerable: true,
        get() { return src[name]; },
        ...(readonly ? {
            writable: false,
        } : {
            set(value) { src[name] = value; }, // eslint-disable-line no-param-reassign
        }),
    });
};

class MockWebSocket extends EventEmitter {
    constructor(url, protocols) {
        super();

        Object.defineProperty(this, 'ws', {
            value: new WebSocket(url, protocols),
            writable: false,
            enumerable: true,
        });

        this.ws.addEventListener('open', () => this.emit('open'));
        this.ws.addEventListener('open', () => callWhenExist(this.onopen));
        this.ws.addEventListener('close', ({ code, reason }) => this.emit('close', code, reason));
        this.ws.addEventListener('close', e => callWhenExist(this.onclose, e));
        this.ws.addEventListener('error', (e) => {
            const error = e.error || new Error('Server error'); // non-null
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

        synchronize(this, this.ws, 'protocol');
        synchronize(this, this.ws, 'readyState', true);
        synchronize(this, this.ws, 'url', true);
        synchronize(this, this.ws, 'bufferedAmount', true);
        synchronize(this, this.ws, 'extensions');

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

    close(code, reason) {
        this.ws.close(code, reason);
    }

    terminate() {
        this.close();
    }
}

module.exports = MockWebSocket;

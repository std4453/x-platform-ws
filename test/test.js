const { describe, it } = require('mocha');
const assert = require('assert');

const { fromClient, fromCloseable, fromEvent } = require('./promisify');
const { wsUrl } = require('./locations');

const closeCode = 4000;

module.exports = function test(key) {
    /* eslint-disable global-require, import/no-dynamic-require */
    const { Buffer } = require({ node: 'buffer', browser: 'buffer/' }[key]);
    const WebSocket = require('./isomorphic')(key);
    /* eslint-enable global-require, import/no-dynamic-require */

    it('should correctly connect', () => new Promise(async (resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        ws.on('error', err => reject(new Error(`Error caught while connecting: ${err}`)));
        ws.on('close', (code) => {
            if (code !== closeCode) reject(new Error('Not closed by client!'));
        }); // only close from client
        await fromClient(ws);
        ws.close(closeCode);
        await fromCloseable(ws);
        resolve();
    }));

    const expect = (binaryType, send, receive, assertFn = assert.deepStrictEqual) =>
        () => new Promise(async (resolve, reject) => {
            const ws = new WebSocket(wsUrl);
            ws.binaryType = binaryType;
            ws.on('error', err => reject(new Error(`Error caught while connecting: ${err}`)));
            ws.on('close', (code) => {
                if (code !== closeCode) reject(new Error('Not closed by client!'));
            }); // only close from client
            await fromClient(ws);
            ws.send(send);
            ws.once('message', (data) => {
                try {
                    assertFn(data, receive);
                } catch (e) {
                    reject(e);
                }
            });
            await fromEvent('message')(ws);
            ws.close(closeCode);
            await fromCloseable(ws);
            resolve();
        });

    describe('while sending and receiving', () => {
        const testString = `A quick brown fox jumps over a lazy dog\n
        我能吞下玻璃而不伤到自己\n
        おれば人間にやめぞ！ジョジョ！\n
        Herzliche glückwunsch`;

        describe('strings', () => {
            ['arraybuffer', 'nodebuffer'].forEach((mode) => {
                it(`should behave correctly in ${mode} mode`,
                    expect(mode, testString, testString));
            });
        });
        describe('ArrayBuffers', () => {
            const source = [1347212985, -2081793628, 951873215, -1762159382]; // random big numbers
            it('should encode and decode correctly',
                expect('arraybuffer', Int32Array.from(source).buffer, null,
                    data => assert.deepStrictEqual(Array.from(new Int32Array(data)), source)));
        });
        describe('node Buffers', () => {
            it('should encode and decode correctly',
                expect('nodebuffer', Buffer.from(testString), null,
                    data => assert.strictEqual(data.toString(), testString)));
        });
        describe('ArrayBuffer and node Buffer', () => {
            const source = [0x00, 0x35, 0xF9, 0x43, 0x15, 0xA7, 0x55, 0xD0]; // random bytes
            it('should encode and decode correctly',
                expect('nodebuffer', Uint8Array.from(source).buffer, null,
                    data => assert.deepStrictEqual(Array.from(data), source)));
        });
        describe('node Buffer and ArrayBuffer', () => {
            const source = [0x00, 0x35, 0xF9, 0x43, 0x15, 0xA7, 0x55, 0xD0]; // random bytes
            it('should encode and decode correctly',
                expect('arraybuffer', Buffer.from(source), null,
                    data => assert.deepStrictEqual(Array.from(new Uint8Array(data)), source)));
        });
    });
};

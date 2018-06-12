const { describe, before, after } = require('mocha');

const wsServer = require('./wsServer');
const test = require('./test');

/* eslint-disable prefer-arrow-callback */
describe('in node.js', function outer() {
    before(() => wsServer.start());
    after(() => wsServer.stop());

    test.call(this, 'node');
});
/* eslint-enable prefer-arrow-callback */

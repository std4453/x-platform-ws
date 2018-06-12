const NodeWS = require('../src/index');
const BrowserWS = require('../src/browser');

module.exports = key => ({ node: NodeWS, browser: BrowserWS })[key];

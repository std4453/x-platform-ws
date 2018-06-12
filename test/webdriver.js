const webdriverio = require('webdriverio');

let webdriver;

const start = () => {
    if (typeof webdriver !== 'undefined') {
        console.log('WebdriverIO already started');
        return webdriver;
    }
    const wdio = webdriverio
        .remote({ desiredCapabilities: { browserName: 'chrome' } })
        .init();
    webdriver = wdio;
    return wdio;
};

const stop = () => {
    if (typeof webdriver === 'undefined') {
        console.log('WebdriverIO not yet started');
        return;
    }
    webdriver.end().catch(err => console.log(err));
};

module.exports = { start, stop };

const constants = {
    host: 'localhost',

    httpPort: 8080,
    httpIndex: 'test/index.html',

    wsPort: 8081,
    wsIndex: 'echo',
};

module.exports = {
    ...constants,
    httpUrl: `http://${constants.host}:${constants.httpPort}/${constants.httpIndex}`,
    wsUrl: `ws://${constants.host}:${constants.wsPort}/${constants.wsIndex}`,
};

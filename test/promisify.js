const fromEvent = eventName => target => new Promise(resolve => target.once(eventName, resolve));
const fromServer = fromEvent('listening');
const fromClient = fromEvent('open');
const fromCloseable = fromEvent('close');
const fromCallback = (target, fn) => () => new Promise(resolve => fn.call(target, resolve));

module.exports = { fromEvent, fromServer, fromClient, fromCloseable, fromCallback };

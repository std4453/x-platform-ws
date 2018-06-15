"use strict";

require("core-js/modules/es6.object.assign");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var EventEmitter = require('events');

var _require = require('buffer'),
    Buffer = _require.Buffer;

var delegate = require('delegates');

var isCallable = require('is-callable');

var MockWebSocket =
/*#__PURE__*/
function (_EventEmitter) {
  _inheritsLoose(MockWebSocket, _EventEmitter);

  function MockWebSocket(url, protocols) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.ws = new WebSocket(url, protocols);

    _this.ws.addEventListener('open', function () {
      return _this.emit('open');
    });

    _this.ws.addEventListener('close', function (_ref) {
      var code = _ref.code,
          reason = _ref.reason;
      return _this.emit('close', code, reason);
    });

    _this.ws.addEventListener('error', function (e) {
      var error = e.error || new Error('Server error'); // some clients don't have e.error

      _this.emit('error', error);

      if (isCallable(_this.onerror)) _this.onerror(error);
    });

    _this.ws.addEventListener('message', function (event) {
      var transformed = _this.transformMessage(event.data);

      _this.emit('message', transformed);

      var transformedEvent = transformed === event.data ? event : new MessageEvent(event.type, Object.assign({}, event, {
        data: transformed
      }));
      if (isCallable(_this.onmessage)) _this.onmessage(transformedEvent);
    });

    _this._binaryType = 'nodebuffer';
    _this.ws.binaryType = 'arraybuffer';
    return _this;
  }

  var _proto = MockWebSocket.prototype;

  _proto.transformMessage = function transformMessage(data) {
    if (this.binaryType !== 'nodebuffer') return data;
    return Buffer.from(data);
  };

  _proto.send = function send(data, _, callback) {
    this.ws.send(data); // since Buffers are Uint8Arrays, they can be sent directly

    if (isCallable(callback)) callback();
  };

  _proto.terminate = function terminate() {
    this.close();
  };

  _createClass(MockWebSocket, [{
    key: "binaryType",
    get: function get() {
      return this._binaryType;
    },
    set: function set(value) {
      this._binaryType = value;
      this.ws.binaryType = value === 'nodebuffer' ? 'arraybuffer' : value;
    }
  }]);

  return MockWebSocket;
}(EventEmitter);

delegate(MockWebSocket, 'ws').access('protocol').access('extensions').access('onopen').access('onclose').getter('readyState').getter('url').getter('bufferedAmount').method('close');
module.exports = MockWebSocket;
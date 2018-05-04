'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var I = require('infestines');
var K = require('kefir');
var L = require('kefir.partial.lenses');
var U = require('karet.util');

var INITIAL = 'initial';
var initial = { type: INITIAL };

var UP = 'up';
var DOWN = 'down';
var TYPE = 'type';
var EVENT = 'event';
var LOADED = 'loaded';
var TOTAL = 'total';
var XHR = 'xhr';

var LOADSTART = 'loadstart';
var PROGRESS = 'progress';
var TIMEOUT = 'timeout';
var LOAD = 'load';
var ERROR = 'error';

var eventTypes = [LOADSTART, PROGRESS, TIMEOUT, LOAD, ERROR];

var perform = /*#__PURE__*/U.through(U.template, /*#__PURE__*/U.flatMapLatest(function (_ref) {
  var url = _ref.url,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? 'GET' : _ref$method,
      _ref$headers = _ref.headers,
      headers = _ref$headers === undefined ? I.array0 : _ref$headers,
      _ref$body = _ref.body,
      body = _ref$body === undefined ? null : _ref$body,
      _ref$responseType = _ref.responseType,
      responseType = _ref$responseType === undefined ? '' : _ref$responseType,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === undefined ? 0 : _ref$timeout,
      _ref$withCredentials = _ref.withCredentials,
      withCredentials = _ref$withCredentials === undefined ? false : _ref$withCredentials;
  return K.stream(function (_ref2) {
    var emit = _ref2.emit,
        end = _ref2.end;

    var xhr = new XMLHttpRequest();
    var state = { xhr: xhr, up: initial, down: initial };
    var update = function update(dir, type) {
      return function (event) {
        emit(state = L.set(dir, { type: type, event: event }, state));
      };
    };
    eventTypes.forEach(function (type) {
      xhr.addEventListener(type, update(DOWN, type));
      xhr.upload.addEventListener(type, update(UP, type));
    });
    xhr.addEventListener('readystatechange', function (event) {
      emit(L.set(EVENT, event, state));
    });
    xhr.addEventListener('loadend', function (event) {
      end(emit(L.set(EVENT, event, state)));
    });
    xhr.open(method, url);
    xhr.responseType = responseType;
    xhr.timeout = timeout;
    xhr.withCredentials = withCredentials;
    headers.forEach(function (hv) {
      xhr.setRequestHeader(hv[0], hv[1]);
    });
    xhr.send(body);
    return function () {
      xhr.abort();
    };
  });
}), U.toProperty);

var is = function is(values) {
  return function (dir) {
    return L.get([dir, TYPE, function (value) {
      return values.includes(value);
    }]);
  };
};
var hasStarted = /*#__PURE__*/is(eventTypes);
var isProgressing = /*#__PURE__*/is([PROGRESS, LOADSTART]);
var hasSucceeded = /*#__PURE__*/is([LOAD]);
var hasFailed = /*#__PURE__*/is([ERROR]);
var hasTimedOut = /*#__PURE__*/is([TIMEOUT]);
var hasEnded = /*#__PURE__*/is([LOAD, ERROR, TIMEOUT]);
var loaded = function loaded(dir) {
  return L.get([dir, EVENT, LOADED]);
};
var total = function total(dir) {
  return L.get([dir, EVENT, TOTAL]);
};

var upHasStarted = /*#__PURE__*/hasStarted(UP);
var upIsProgressing = /*#__PURE__*/isProgressing(UP);
var upHasSucceeded = /*#__PURE__*/hasSucceeded(UP);
var upHasFailed = /*#__PURE__*/hasFailed(UP);
var upHasTimedOut = /*#__PURE__*/hasTimedOut(UP);
var upHasEnded = /*#__PURE__*/hasEnded(UP);
var upLoaded = /*#__PURE__*/loaded(UP);
var upTotal = /*#__PURE__*/total(UP);

var downHasStarted = /*#__PURE__*/hasStarted(DOWN);
var downIsProgressing = /*#__PURE__*/isProgressing(DOWN);
var downHasSucceeded = /*#__PURE__*/hasSucceeded(DOWN);
var downHasFailed = /*#__PURE__*/hasFailed(DOWN);
var downHasTimedOut = /*#__PURE__*/hasTimedOut(DOWN);
var downHasEnded = /*#__PURE__*/hasEnded(DOWN);
var downLoaded = /*#__PURE__*/loaded(DOWN);
var downTotal = /*#__PURE__*/total(DOWN);

var readyState = /*#__PURE__*/L.get([XHR, 'readyState']);
var response = /*#__PURE__*/U.through( /*#__PURE__*/L.get([XHR, 'response']), /*#__PURE__*/U.skipDuplicates(I.acyclicEqualsU));
var responseType = /*#__PURE__*/L.get([XHR, 'responseType']);
var status = /*#__PURE__*/L.get([XHR, 'status']);
var statusText = /*#__PURE__*/L.get([XHR, 'statusText']);

var isHttpSuccess = /*#__PURE__*/U.lift(function (status) {
  return 200 <= status && status < 300;
});

exports.perform = perform;
exports.upHasStarted = upHasStarted;
exports.upIsProgressing = upIsProgressing;
exports.upHasSucceeded = upHasSucceeded;
exports.upHasFailed = upHasFailed;
exports.upHasTimedOut = upHasTimedOut;
exports.upHasEnded = upHasEnded;
exports.upLoaded = upLoaded;
exports.upTotal = upTotal;
exports.downHasStarted = downHasStarted;
exports.downIsProgressing = downIsProgressing;
exports.downHasSucceeded = downHasSucceeded;
exports.downHasFailed = downHasFailed;
exports.downHasTimedOut = downHasTimedOut;
exports.downHasEnded = downHasEnded;
exports.downLoaded = downLoaded;
exports.downTotal = downTotal;
exports.readyState = readyState;
exports.response = response;
exports.responseType = responseType;
exports.status = status;
exports.statusText = statusText;
exports.isHttpSuccess = isHttpSuccess;

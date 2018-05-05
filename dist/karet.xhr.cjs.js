'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var I = require('infestines');
var K = require('kefir');
var L = require('kefir.partial.lenses');
var U = require('karet.util');

var initial = { type: 'initial' };

var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

var XHR = 'xhr';
var UP = 'up';
var DOWN = 'down';

var perform = /*#__PURE__*/U.through(U.template, /*#__PURE__*/U.flatMapLatest(function (_ref) {
  var url = _ref.url,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? 'GET' : _ref$method,
      _ref$user = _ref.user,
      user = _ref$user === undefined ? null : _ref$user,
      _ref$password = _ref.password,
      password = _ref$password === undefined ? null : _ref$password,
      _ref$headers = _ref.headers,
      headers = _ref$headers === undefined ? I.array0 : _ref$headers,
      overrideMimeType = _ref.overrideMimeType,
      _ref$body = _ref.body,
      body = _ref$body === undefined ? null : _ref$body,
      responseType = _ref.responseType,
      timeout = _ref.timeout,
      withCredentials = _ref.withCredentials;
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
      emit(state = L.set('event', event, state));
    });
    xhr.addEventListener('loadend', function (event) {
      end(emit(state = L.set('event', event, state)));
    });
    xhr.open(method, url, true, user, password);
    if (responseType) xhr.responseType = responseType;
    if (timeout) xhr.timeout = timeout;
    if (withCredentials) xhr.withCredentials = withCredentials;
    headers.forEach(function (hv) {
      xhr.setRequestHeader(hv[0], hv[1]);
    });
    if (overrideMimeType) xhr.overrideMimeType(overrideMimeType);
    xhr.send(body);
    return function () {
      xhr.abort();
    };
  });
}), U.toProperty);

var isOneOf = /*#__PURE__*/I.curry(function (values, value) {
  return values.includes(value);
});
var is = /*#__PURE__*/I.curry(function (values, dir) {
  return L.get([dir, 'type', isOneOf(values)]);
});
var hasStarted = /*#__PURE__*/is(eventTypes);
var isProgressing = /*#__PURE__*/is(['progress', 'loadstart']);
var hasSucceeded = /*#__PURE__*/is(['load']);
var hasFailed = /*#__PURE__*/is(['error']);
var hasTimedOut = /*#__PURE__*/is(['timeout']);
var hasEnded = /*#__PURE__*/is(['load', 'error', 'timeout']);
var event = /*#__PURE__*/I.curry(function (prop, dir) {
  return L.get([dir, 'event', prop]);
});
var loaded = /*#__PURE__*/event('loaded');
var total = /*#__PURE__*/event('total');
var error = /*#__PURE__*/event('error');

var upHasStarted = /*#__PURE__*/hasStarted(UP);
var upIsProgressing = /*#__PURE__*/isProgressing(UP);
var upHasSucceeded = /*#__PURE__*/hasSucceeded(UP);
var upHasFailed = /*#__PURE__*/hasFailed(UP);
var upHasTimedOut = /*#__PURE__*/hasTimedOut(UP);
var upHasEnded = /*#__PURE__*/hasEnded(UP);
var upLoaded = /*#__PURE__*/loaded(UP);
var upTotal = /*#__PURE__*/total(UP);
var upError = /*#__PURE__*/error(UP);

var downHasStarted = /*#__PURE__*/hasStarted(DOWN);
var downIsProgressing = /*#__PURE__*/isProgressing(DOWN);
var downHasSucceeded = /*#__PURE__*/hasSucceeded(DOWN);
var downHasFailed = /*#__PURE__*/hasFailed(DOWN);
var downHasTimedOut = /*#__PURE__*/hasTimedOut(DOWN);
var downHasEnded = /*#__PURE__*/hasEnded(DOWN);
var downLoaded = /*#__PURE__*/loaded(DOWN);
var downTotal = /*#__PURE__*/total(DOWN);
var downError = /*#__PURE__*/error(DOWN);

var readyState = /*#__PURE__*/L.get([XHR, 'readyState']);
var response = /*#__PURE__*/U.through( /*#__PURE__*/L.get([XHR, 'response']), /*#__PURE__*/U.skipDuplicates(I.acyclicEqualsU));
var responseType = /*#__PURE__*/L.get([XHR, 'responseType']);
var responseURL = /*#__PURE__*/L.get([XHR, 'responseURL']);
var responseText = /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get(['responseType', /*#__PURE__*/isOneOf(['', 'text'])])), 'responseText']);
var responseXML = /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get(['responseType', /*#__PURE__*/isOneOf(['', 'document'])])), 'responseXML']);
var status = /*#__PURE__*/L.get([XHR, 'status']);
var statusText = /*#__PURE__*/L.get([XHR, 'statusText']);
var responseHeader = /*#__PURE__*/I.curry(function (header, xhr) {
  return L.get([XHR, L.reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })], xhr);
});
var allResponseHeaders = /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})]);
var timeout = /*#__PURE__*/L.get([XHR, 'timeout']);
var withCredentials = /*#__PURE__*/L.get([XHR, 'withCredentials']);

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
exports.upError = upError;
exports.downHasStarted = downHasStarted;
exports.downIsProgressing = downIsProgressing;
exports.downHasSucceeded = downHasSucceeded;
exports.downHasFailed = downHasFailed;
exports.downHasTimedOut = downHasTimedOut;
exports.downHasEnded = downHasEnded;
exports.downLoaded = downLoaded;
exports.downTotal = downTotal;
exports.downError = downError;
exports.readyState = readyState;
exports.response = response;
exports.responseType = responseType;
exports.responseURL = responseURL;
exports.responseText = responseText;
exports.responseXML = responseXML;
exports.status = status;
exports.statusText = statusText;
exports.responseHeader = responseHeader;
exports.allResponseHeaders = allResponseHeaders;
exports.timeout = timeout;
exports.withCredentials = withCredentials;
exports.isHttpSuccess = isHttpSuccess;

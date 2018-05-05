(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('infestines'), require('kefir'), require('kefir.partial.lenses'), require('karet.util')) :
  typeof define === 'function' && define.amd ? define(['exports', 'infestines', 'kefir', 'kefir.partial.lenses', 'karet.util'], factory) :
  (factory((global.karet = global.karet || {}, global.karet.xhr = {}),global.I,global.Kefir,global.kefir.partial.lenses,global.karet.util));
}(this, (function (exports,I,K,L,U) { 'use strict';

  var initial = { type: 'initial' };

  var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

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
        emit(state = L.set('event', event, state));
      });
      xhr.addEventListener('loadend', function (event) {
        end(emit(state = L.set('event', event, state)));
      });
      xhr.open(method, url, true, user, password);
      xhr.responseType = responseType;
      xhr.timeout = timeout;
      xhr.withCredentials = withCredentials;
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

  var is = /*#__PURE__*/I.curry(function (values, dir) {
    return L.get([dir, 'type', function (value) {
      return values.includes(value);
    }]);
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

  var readyState = /*#__PURE__*/L.get(['xhr', 'readyState']);
  var response = /*#__PURE__*/U.through( /*#__PURE__*/L.get(['xhr', 'response']), /*#__PURE__*/U.skipDuplicates(I.acyclicEqualsU));
  var responseType = /*#__PURE__*/L.get(['xhr', 'responseType']);
  var responseURL = /*#__PURE__*/L.get(['xhr', 'responseURL']);
  var status = /*#__PURE__*/L.get(['xhr', 'status']);
  var statusText = /*#__PURE__*/L.get(['xhr', 'statusText']);
  var responseHeader = /*#__PURE__*/I.curry(function (header, xhr) {
    return L.get(['xhr', L.reread(function (xhr) {
      return xhr.getResponseHeader(header);
    })], xhr);
  });
  var allResponseHeaders = /*#__PURE__*/L.get(['xhr', /*#__PURE__*/L.reread(function (xhr) {
    return xhr.getAllResponseHeaders();
  })]);

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
  exports.status = status;
  exports.statusText = statusText;
  exports.responseHeader = responseHeader;
  exports.allResponseHeaders = allResponseHeaders;
  exports.isHttpSuccess = isHttpSuccess;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

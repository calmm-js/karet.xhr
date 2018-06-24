(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('infestines'), require('kefir'), require('kefir.partial.lenses'), require('karet.lift')) :
  typeof define === 'function' && define.amd ? define(['exports', 'infestines', 'kefir', 'kefir.partial.lenses', 'karet.lift'], factory) :
  (factory((global.karet = global.karet || {}, global.karet.xhr = {}),global.I,global.Kefir,global.kefir.partial.lenses,global.karet.lift));
}(this, (function (exports,I,K,L,F) { 'use strict';

  var setName = function (to, name) {
    return I.defineNameU(to, name);
  };

  var initial = { type: 'initial' };

  var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

  var XHR = 'xhr';
  var UP = 'up';
  var DOWN = 'down';

  var performPlain = function perform(_ref) {
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
        if (!xhr.status) xhr.abort();
      };
    });
  };

  function perform(argsIn) {
    var args = F.combine([argsIn], I.id);
    return (args !== argsIn ? args.flatMapLatest(performPlain) : performPlain(args)).toProperty();
  }

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
  var isHttpSuccessU = function isHttpSuccess(status) {
    return 200 <= status && status < 300;
  };

  var upHasStarted = /*#__PURE__*/setName( /*#__PURE__*/hasStarted(UP), 'upHasStarted');
  var upIsProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressing(UP), 'upIsProgressing');
  var upHasSucceeded = /*#__PURE__*/setName( /*#__PURE__*/hasSucceeded(UP), 'upHasSucceeded');
  var upHasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailed(UP), 'upHasFailed');
  var upHasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOut(UP), 'upHasTimedOut');
  var upHasEnded = /*#__PURE__*/setName( /*#__PURE__*/hasEnded(UP), 'upHasEnded');
  var upLoaded = /*#__PURE__*/setName( /*#__PURE__*/loaded(UP), 'upLoaded');
  var upTotal = /*#__PURE__*/setName( /*#__PURE__*/total(UP), 'upTotal');
  var upError = /*#__PURE__*/setName( /*#__PURE__*/error(UP), 'upError');

  var downHasStarted = /*#__PURE__*/setName( /*#__PURE__*/hasStarted(DOWN), 'downHasStarted');
  var downIsProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressing(DOWN), 'downIsProgressing');
  var downHasSucceeded = /*#__PURE__*/setName( /*#__PURE__*/hasSucceeded(DOWN), 'downHasSucceeded');
  var downHasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailed(DOWN), 'downHasFailed');
  var downHasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOut(DOWN), 'downHasTimedOut');
  var downHasEnded = /*#__PURE__*/setName( /*#__PURE__*/hasEnded(DOWN), 'downHasEnded');
  var downLoaded = /*#__PURE__*/setName( /*#__PURE__*/loaded(DOWN), 'downLoaded');
  var downTotal = /*#__PURE__*/setName( /*#__PURE__*/total(DOWN), 'downTotal');
  var downError = /*#__PURE__*/setName( /*#__PURE__*/error(DOWN), 'downError');

  var readyState = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'readyState']), 'readyState');
  var response = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U( /*#__PURE__*/L.get([XHR, 'response']), function (xs) {
    return xs.skipDuplicates(I.acyclicEqualsU);
  }), 'response');
  var responseFull = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U(function (xs) {
    return xs.filter(function (xhr) {
      return readyState(xhr) === 4;
    });
  }, response), 'responseFull');
  var responseType = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'responseType']), 'responseType');
  var responseURL = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'responseURL']), 'responseURL');
  var responseText = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get(['responseType', /*#__PURE__*/isOneOf(['', 'text'])])), 'responseText']), 'responseText');
  var responseXML = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get(['responseType', /*#__PURE__*/isOneOf(['', 'document'])])), 'responseXML']), 'responseXML');
  var status = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'status']), 'status');
  var statusIsHttpSuccess = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'status', isHttpSuccessU]), 'statusIsHttpSuccess');
  var statusText = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'statusText']), 'statusText');
  var responseHeader = /*#__PURE__*/I.curryN(2, function responseHeader(header) {
    return L.get([XHR, L.reread(function (xhr) {
      return xhr.getResponseHeader(header);
    })]);
  });
  var allResponseHeaders = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.reread(function (xhr) {
    return xhr.getAllResponseHeaders();
  })]), 'allResponseHeaders');
  var timeout = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'timeout']), 'timeout');
  var withCredentials = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'withCredentials']), 'withCredentials');

  var isHttpSuccess = /*#__PURE__*/F.lift(isHttpSuccessU);

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
  exports.responseFull = responseFull;
  exports.responseType = responseType;
  exports.responseURL = responseURL;
  exports.responseText = responseText;
  exports.responseXML = responseXML;
  exports.status = status;
  exports.statusIsHttpSuccess = statusIsHttpSuccess;
  exports.statusText = statusText;
  exports.responseHeader = responseHeader;
  exports.allResponseHeaders = allResponseHeaders;
  exports.timeout = timeout;
  exports.withCredentials = withCredentials;
  exports.isHttpSuccess = isHttpSuccess;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

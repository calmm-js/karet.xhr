import { array0, curry, acyclicEqualsU } from 'infestines';
import { stream } from 'kefir';
import { set, get, when, reread } from 'kefir.partial.lenses';
import { through, template, flatMapLatest, toProperty, skipDuplicates, lift } from 'karet.util';

var initial = { type: 'initial' };

var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

var XHR = 'xhr';
var UP = 'up';
var DOWN = 'down';

var perform = /*#__PURE__*/through(template, /*#__PURE__*/flatMapLatest(function (_ref) {
  var url = _ref.url,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? 'GET' : _ref$method,
      _ref$user = _ref.user,
      user = _ref$user === undefined ? null : _ref$user,
      _ref$password = _ref.password,
      password = _ref$password === undefined ? null : _ref$password,
      _ref$headers = _ref.headers,
      headers = _ref$headers === undefined ? array0 : _ref$headers,
      overrideMimeType = _ref.overrideMimeType,
      _ref$body = _ref.body,
      body = _ref$body === undefined ? null : _ref$body,
      responseType = _ref.responseType,
      timeout = _ref.timeout,
      withCredentials = _ref.withCredentials;
  return stream(function (_ref2) {
    var emit = _ref2.emit,
        end = _ref2.end;

    var xhr = new XMLHttpRequest();
    var state = { xhr: xhr, up: initial, down: initial };
    var update = function update(dir, type) {
      return function (event) {
        emit(state = set(dir, { type: type, event: event }, state));
      };
    };
    eventTypes.forEach(function (type) {
      xhr.addEventListener(type, update(DOWN, type));
      xhr.upload.addEventListener(type, update(UP, type));
    });
    xhr.addEventListener('readystatechange', function (event) {
      emit(state = set('event', event, state));
    });
    xhr.addEventListener('loadend', function (event) {
      end(emit(state = set('event', event, state)));
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
}), toProperty);

var isOneOf = /*#__PURE__*/curry(function (values, value) {
  return values.includes(value);
});
var is = /*#__PURE__*/curry(function (values, dir) {
  return get([dir, 'type', isOneOf(values)]);
});
var hasStarted = /*#__PURE__*/is(eventTypes);
var isProgressing = /*#__PURE__*/is(['progress', 'loadstart']);
var hasSucceeded = /*#__PURE__*/is(['load']);
var hasFailed = /*#__PURE__*/is(['error']);
var hasTimedOut = /*#__PURE__*/is(['timeout']);
var hasEnded = /*#__PURE__*/is(['load', 'error', 'timeout']);
var event = /*#__PURE__*/curry(function (prop, dir) {
  return get([dir, 'event', prop]);
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

var readyState = /*#__PURE__*/get([XHR, 'readyState']);
var response = /*#__PURE__*/through( /*#__PURE__*/get([XHR, 'response']), /*#__PURE__*/skipDuplicates(acyclicEqualsU));
var responseType = /*#__PURE__*/get([XHR, 'responseType']);
var responseURL = /*#__PURE__*/get([XHR, 'responseURL']);
var responseText = /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get(['responseType', /*#__PURE__*/isOneOf(['', 'text'])])), 'responseText']);
var responseXML = /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get(['responseType', /*#__PURE__*/isOneOf(['', 'document'])])), 'responseXML']);
var status = /*#__PURE__*/get([XHR, 'status']);
var statusText = /*#__PURE__*/get([XHR, 'statusText']);
var responseHeader = /*#__PURE__*/curry(function (header, xhr) {
  return get([XHR, reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })], xhr);
});
var allResponseHeaders = /*#__PURE__*/get([XHR, /*#__PURE__*/reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})]);
var timeout = /*#__PURE__*/get([XHR, 'timeout']);
var withCredentials = /*#__PURE__*/get([XHR, 'withCredentials']);

var isHttpSuccess = /*#__PURE__*/lift(function (status) {
  return 200 <= status && status < 300;
});

export { perform, upHasStarted, upIsProgressing, upHasSucceeded, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, upError, downHasStarted, downIsProgressing, downHasSucceeded, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, downError, readyState, response, responseType, responseURL, responseText, responseXML, status, statusText, responseHeader, allResponseHeaders, timeout, withCredentials, isHttpSuccess };

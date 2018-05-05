import { array0, curry, acyclicEqualsU } from 'infestines';
import { stream } from 'kefir';
import { set, get, reread } from 'kefir.partial.lenses';
import { through, template, flatMapLatest, toProperty, skipDuplicates, lift } from 'karet.util';

var initial = { type: 'initial' };

var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

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
      _ref$responseType = _ref.responseType,
      responseType = _ref$responseType === undefined ? '' : _ref$responseType,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === undefined ? 0 : _ref$timeout,
      _ref$withCredentials = _ref.withCredentials,
      withCredentials = _ref$withCredentials === undefined ? false : _ref$withCredentials;
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
}), toProperty);

var is = /*#__PURE__*/curry(function (values, dir) {
  return get([dir, 'type', function (value) {
    return values.includes(value);
  }]);
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

var readyState = /*#__PURE__*/get(['xhr', 'readyState']);
var response = /*#__PURE__*/through( /*#__PURE__*/get(['xhr', 'response']), /*#__PURE__*/skipDuplicates(acyclicEqualsU));
var responseType = /*#__PURE__*/get(['xhr', 'responseType']);
var responseURL = /*#__PURE__*/get(['xhr', 'responseURL']);
var status = /*#__PURE__*/get(['xhr', 'status']);
var statusText = /*#__PURE__*/get(['xhr', 'statusText']);
var responseHeader = /*#__PURE__*/curry(function (header, xhr) {
  return get(['xhr', reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })], xhr);
});
var allResponseHeaders = /*#__PURE__*/get(['xhr', /*#__PURE__*/reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})]);

var isHttpSuccess = /*#__PURE__*/lift(function (status) {
  return 200 <= status && status < 300;
});

export { perform, upHasStarted, upIsProgressing, upHasSucceeded, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, upError, downHasStarted, downIsProgressing, downHasSucceeded, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, downError, readyState, response, responseType, responseURL, status, statusText, responseHeader, allResponseHeaders, isHttpSuccess };

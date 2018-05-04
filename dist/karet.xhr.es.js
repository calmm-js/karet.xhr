import { array0, acyclicEqualsU } from 'infestines';
import { stream } from 'kefir';
import { set, get } from 'kefir.partial.lenses';
import { through, template, flatMapLatest, toProperty, skipDuplicates, lift } from 'karet.util';

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

var perform = /*#__PURE__*/through(template, /*#__PURE__*/flatMapLatest(function (_ref) {
  var url = _ref.url,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? 'GET' : _ref$method,
      _ref$headers = _ref.headers,
      headers = _ref$headers === undefined ? array0 : _ref$headers,
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
      emit(set(EVENT, event, state));
    });
    xhr.addEventListener('loadend', function (event) {
      end(emit(set(EVENT, event, state)));
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
}), toProperty);

var is = function is(values) {
  return function (dir) {
    return get([dir, TYPE, function (value) {
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
  return get([dir, EVENT, LOADED]);
};
var total = function total(dir) {
  return get([dir, EVENT, TOTAL]);
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

var readyState = /*#__PURE__*/get([XHR, 'readyState']);
var response = /*#__PURE__*/through( /*#__PURE__*/get([XHR, 'response']), /*#__PURE__*/skipDuplicates(acyclicEqualsU));
var responseType = /*#__PURE__*/get([XHR, 'responseType']);
var status = /*#__PURE__*/get([XHR, 'status']);
var statusText = /*#__PURE__*/get([XHR, 'statusText']);

var isHttpSuccess = /*#__PURE__*/lift(function (status) {
  return 200 <= status && status < 300;
});

export { perform, upHasStarted, upIsProgressing, upHasSucceeded, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, downHasStarted, downIsProgressing, downHasSucceeded, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, readyState, response, responseType, status, statusText, isHttpSuccess };

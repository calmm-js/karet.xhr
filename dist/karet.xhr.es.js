import { defineNameU, array0, id, curry, pipe2U, acyclicEqualsU, curryN } from 'infestines';
import { stream } from 'kefir';
import { set, get, when, reread } from 'kefir.partial.lenses';
import { combine, lift } from 'karet.lift';

var setName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, name) {
  return defineNameU(to, name);
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
};

function perform(argsIn) {
  var args = combine([argsIn], id);
  return (args !== argsIn ? args.flatMapLatest(performPlain) : performPlain(args)).toProperty();
}

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

var readyState = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'readyState']), 'readyState');
var response = /*#__PURE__*/setName( /*#__PURE__*/pipe2U( /*#__PURE__*/get([XHR, 'response']), function (xs) {
  return xs.skipDuplicates(acyclicEqualsU);
}), 'response');
var responseFull = /*#__PURE__*/setName( /*#__PURE__*/pipe2U(function (xs) {
  return xs.filter(function (xhr) {
    return readyState(xhr) === 4;
  });
}, response), 'responseFull');
var responseType = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'responseType']), 'responseType');
var responseURL = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'responseURL']), 'responseURL');
var responseText = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get(['responseType', /*#__PURE__*/isOneOf(['', 'text'])])), 'responseText']), 'responseText');
var responseXML = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get(['responseType', /*#__PURE__*/isOneOf(['', 'document'])])), 'responseXML']), 'responseXML');
var status = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'status']), 'status');
var statusIsHttpSuccess = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'status', isHttpSuccessU]), 'statusIsHttpSuccess');
var statusText = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'statusText']), 'statusText');
var responseHeader = /*#__PURE__*/curryN(2, function responseHeader(header) {
  return get([XHR, reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })]);
});
var allResponseHeaders = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})]), 'allResponseHeaders');
var timeout = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'timeout']), 'timeout');
var withCredentials = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'withCredentials']), 'withCredentials');

var isHttpSuccess = /*#__PURE__*/lift(isHttpSuccessU);

export { perform, upHasStarted, upIsProgressing, upHasSucceeded, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, upError, downHasStarted, downIsProgressing, downHasSucceeded, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, downError, readyState, response, responseFull, responseType, responseURL, responseText, responseXML, status, statusIsHttpSuccess, statusText, responseHeader, allResponseHeaders, timeout, withCredentials, isHttpSuccess };

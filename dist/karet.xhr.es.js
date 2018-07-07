import { combine, lift } from 'karet.lift';
import { curry, isString, isNumber, defineNameU, id, isArray, isFunction, pipe2U, acyclicEqualsU, curryN } from 'infestines';
import { Observable, stream } from 'kefir';
import { set, get, is, when, reread } from 'kefir.partial.lenses';
import { validate, freeFn, tuple, props, optional, cases, arrayId, accept } from 'partial.lenses.validation';

//

var isObservable = function isObservable(x) {
  return x instanceof Observable;
};

var skipDuplicates = /*#__PURE__*/curry(function skipDuplicates(eq, xs) {
  return isObservable(xs) ? xs.skipDuplicates(eq) : xs;
});

var filter = /*#__PURE__*/curry(function filter(pr, xs) {
  if (isObservable(xs)) {
    return xs.filter(pr);
  } else if (pr(xs)) {
    return xs;
  } else {
    throw Error(pr.name);
  }
});

//

var string = isString;
var boolean = function boolean(x) {
  return typeof x === 'boolean';
};
var number = isNumber;

//

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
var EVENT = 'event';

var performPlain = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : validate(freeFn(tuple(props({
  url: string,
  method: optional(string),
  user: optional(string),
  password: optional(string),
  headers: optional(cases([isArray, arrayId(tuple(string, accept))], [function (x) {
    return null != x && isFunction(x.keys);
  }, accept], [accept])),
  overrideMimeType: optional(string),
  body: optional(accept),
  responseType: optional(string),
  timeout: optional(number),
  withCredentials: optional(boolean)
})), accept)))(function perform(_ref) {
  var url = _ref.url,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? 'GET' : _ref$method,
      _ref$user = _ref.user,
      user = _ref$user === undefined ? null : _ref$user,
      _ref$password = _ref.password,
      password = _ref$password === undefined ? null : _ref$password,
      headers = _ref.headers,
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
      emit(state = set(EVENT, event, state));
    });
    xhr.addEventListener('loadend', function (event) {
      end(emit(state = set(EVENT, event, state)));
    });
    xhr.open(method, url, true, user, password);
    if (responseType) xhr.responseType = responseType;
    if (timeout) xhr.timeout = timeout;
    if (withCredentials) xhr.withCredentials = withCredentials;
    if (null != headers) {
      if (isFunction(headers.keys)) {
        headers = Array.from(headers);
      }
      if (isArray(headers)) {
        headers.forEach(function (hv) {
          xhr.setRequestHeader(hv[0], hv[1]);
        });
      } else {
        for (var header in headers) {
          xhr.setRequestHeader(header, headers[header]);
        }
      }
    }
    if (overrideMimeType) xhr.overrideMimeType(overrideMimeType);
    xhr.send(body);
    return function () {
      if (!xhr.status) xhr.abort();
    };
  });
});

function perform(argsIn) {
  var args = combine([argsIn], id);
  return (args !== argsIn ? args.flatMapLatest(performPlain) : performPlain(args)).toProperty();
}

var isOneOf = /*#__PURE__*/curry(function (values, value) {
  return values.includes(value);
});
var is$1 = /*#__PURE__*/curry(function (values, dir) {
  return get([dir, 'type', isOneOf(values)]);
});
var hasStarted = /*#__PURE__*/is$1(eventTypes);
var isProgressing = /*#__PURE__*/is$1(['progress', 'loadstart']);
var hasSucceeded = /*#__PURE__*/is$1(['load']);
var hasFailed = /*#__PURE__*/is$1(['error']);
var hasTimedOut = /*#__PURE__*/is$1(['timeout']);
var hasEnded = /*#__PURE__*/is$1(['load', 'error', 'timeout']);
var event = /*#__PURE__*/curry(function (prop, dir) {
  return get([dir, EVENT, prop]);
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
var isDone = /*#__PURE__*/defineNameU( /*#__PURE__*/get([EVENT, 'type', /*#__PURE__*/is('loadend')]), 'isDone');
var response = /*#__PURE__*/setName( /*#__PURE__*/pipe2U( /*#__PURE__*/get([XHR, 'response']), /*#__PURE__*/skipDuplicates(acyclicEqualsU)), 'response');
var responseFull = /*#__PURE__*/setName( /*#__PURE__*/pipe2U( /*#__PURE__*/filter(isDone), response), 'responseFull');
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

export { perform, upHasStarted, upIsProgressing, upHasSucceeded, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, upError, downHasStarted, downIsProgressing, downHasSucceeded, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, downError, readyState, isDone, response, responseFull, responseType, responseURL, responseText, responseXML, status, statusIsHttpSuccess, statusText, responseHeader, allResponseHeaders, timeout, withCredentials, isHttpSuccess };

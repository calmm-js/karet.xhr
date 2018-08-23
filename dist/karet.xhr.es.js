import { combine, lift } from 'karet.lift';
import { curry, isString, isNumber, defineNameU, isFunction, id, object0, isArray, pipe2U, curryN, acyclicEqualsU, assign } from 'infestines';
import { Observable, stream } from 'kefir';
import { set, get, array, cross, reread, identity, inverse, keyed, transform, ifElse, modifyOp, branch, cond, setOp, keys, is, when } from 'kefir.partial.lenses';
import { accept, arrayId, tuple, and, acceptWith, validate, freeFn, props, optional, propsOr, or, cases } from 'partial.lenses.validation';

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

var toLower = function toLower(s) {
  return s.toLowerCase();
};

//

var string = isString;
var boolean = function boolean(x) {
  return x === !!x;
};
var number = isNumber;

//

var setName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, name) {
  return defineNameU(to, name);
};

var copyName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, from) {
  return defineNameU(to, from.name);
};

var initial = { type: 'initial' };

var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

var XHR = 'xhr';
var UP = 'up';
var DOWN = 'down';
var EVENT = 'event';

var hasKeys = function hasKeys(x) {
  return isFunction(x.keys);
};

var isNil = function isNil(x) {
  return x == null;
};
var headerValue = accept;
var headersArray = /*#__PURE__*/arrayId( /*#__PURE__*/tuple(string, headerValue));
var headersMap = /*#__PURE__*/and( /*#__PURE__*/acceptWith(function (xs) {
  return Array.from(xs);
}), headersArray, /*#__PURE__*/acceptWith(function (xs) {
  return new Map(xs);
}));

var performPlain = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : validate(freeFn(tuple(props({
  url: string,
  method: optional(string),
  user: optional(string),
  password: optional(string),
  headers: propsOr(headerValue, object0),
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
    if (responseType) {
      xhr.responseType = responseType;
      if (responseType === 'json' && xhr.responseType !== 'json') state = set('parse', true, state);
    }
    if (timeout) xhr.timeout = timeout;
    if (withCredentials) xhr.withCredentials = withCredentials;
    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
    if (overrideMimeType) xhr.overrideMimeType(overrideMimeType);
    xhr.send(body);
    return function () {
      if (!xhr.status) xhr.abort();
    };
  });
});

var toLowerKeyedObject = /*#__PURE__*/get([/*#__PURE__*/array( /*#__PURE__*/cross([/*#__PURE__*/reread(toLower), identity])), /*#__PURE__*/inverse(keyed)]);

var normalizeOptions = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : validate(freeFn(tuple(or(isString, propsOr(accept, {
  headers: optional(cases([isNil, accept], [isArray, headersArray], [hasKeys, headersMap], [propsOr(headerValue, object0)]))
}))), accept)))( /*#__PURE__*/transform( /*#__PURE__*/ifElse(isString, /*#__PURE__*/modifyOp(function (url) {
  return { url: url, headers: object0 };
}), /*#__PURE__*/branch({
  headers: /*#__PURE__*/cond([isNil, /*#__PURE__*/setOp(object0)], [isArray, /*#__PURE__*/modifyOp(toLowerKeyedObject)], [hasKeys, /*#__PURE__*/modifyOp( /*#__PURE__*/pipe2U(Array.from, toLowerKeyedObject))], [[keys, /*#__PURE__*/modifyOp(toLower)]])
}))));

function perform(argsIn) {
  var args = combine([argsIn], normalizeOptions);
  return (isObservable(args) ? args.flatMapLatest(performPlain) : performPlain(args)).toProperty();
}

function tryParse(json) {
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
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

var getAfter = /*#__PURE__*/curryN(3, function (predicate, getter) {
  return copyName(pipe2U(filter(predicate), getter), getter);
});

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
var headersReceived = /*#__PURE__*/defineNameU( /*#__PURE__*/get([XHR, 'readyState', function (state) {
  return 2 <= state;
}]), 'headersReceived');
var isDone = /*#__PURE__*/defineNameU( /*#__PURE__*/get([EVENT, 'type', /*#__PURE__*/is('loadend')]), 'isDone');
var response = /*#__PURE__*/setName( /*#__PURE__*/pipe2U( /*#__PURE__*/lift(function (_ref3) {
  var xhr = _ref3.xhr,
      parse = _ref3.parse;

  var response = xhr.response;
  return parse ? tryParse(response) : response;
}), /*#__PURE__*/skipDuplicates(acyclicEqualsU)), 'response');
var responseFull = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isDone, response), 'responseFull');
var responseType = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'responseType']), 'responseType');
var responseURL = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'responseURL']), 'responseURL');
var responseText = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get(['responseType', /*#__PURE__*/isOneOf(['', 'text'])])), 'responseText']), 'responseText');
var responseXML = /*#__PURE__*/getAfter(isDone, /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get(['responseType', /*#__PURE__*/isOneOf(['', 'document'])])), 'responseXML']), 'responseXML'));
var status = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'status']), 'status');
var statusIsHttpSuccess = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'status', isHttpSuccessU]), 'statusIsHttpSuccess');
var statusText = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'statusText']), 'statusText');
var responseHeader = /*#__PURE__*/curryN(2, function responseHeader(header) {
  return getAfter(headersReceived, setName(get([XHR, reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })]), 'responseHeader'));
});
var allResponseHeaders = /*#__PURE__*/getAfter(headersReceived, /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})]), 'allResponseHeaders'));
var timeout = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'timeout']), 'timeout');
var withCredentials = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, 'withCredentials']), 'withCredentials');

var isHttpSuccess = /*#__PURE__*/lift(isHttpSuccessU);

var mergeOptions = /*#__PURE__*/lift(function mergeOptions(defaults, overrides) {
  var headers = assign({}, defaults.headers, overrides.headers);
  return assign({}, defaults, overrides, { headers: headers });
});

var performWith = /*#__PURE__*/curry(function performWith(defaults, overrides) {
  return perform(mergeOptions(normalizeOptions(defaults), normalizeOptions(overrides)));
});

var performJson = /*#__PURE__*/setName( /*#__PURE__*/performWith({
  responseType: 'json',
  headers: { 'Content-Type': 'application/json' }
}), 'performJson');

var getJson = /*#__PURE__*/setName( /*#__PURE__*/pipe2U(performJson, responseFull), 'getJson');

export { perform, upHasStarted, upIsProgressing, upHasSucceeded, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, upError, downHasStarted, downIsProgressing, downHasSucceeded, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, downError, readyState, headersReceived, isDone, response, responseFull, responseType, responseURL, responseText, responseXML, status, statusIsHttpSuccess, statusText, responseHeader, allResponseHeaders, timeout, withCredentials, isHttpSuccess, performWith, performJson, getJson };

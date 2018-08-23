'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var F = require('karet.lift');
var I = require('infestines');
var K = require('kefir');
var L = require('kefir.partial.lenses');
var V = require('partial.lenses.validation');

//

var isObservable = function isObservable(x) {
  return x instanceof K.Observable;
};

var skipDuplicates = /*#__PURE__*/I.curry(function skipDuplicates(eq, xs) {
  return isObservable(xs) ? xs.skipDuplicates(eq) : xs;
});

var filter = /*#__PURE__*/I.curry(function filter(pr, xs) {
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

var string = I.isString;
var boolean = function boolean(x) {
  return x === !!x;
};
var number = I.isNumber;

//

var setName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, name) {
  return I.defineNameU(to, name);
};

var copyName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, from) {
  return I.defineNameU(to, from.name);
};

var initial = { type: 'initial' };

var eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error'];

var XHR = 'xhr';
var UP = 'up';
var DOWN = 'down';
var EVENT = 'event';

var hasKeys = function hasKeys(x) {
  return I.isFunction(x.keys);
};

var isNil = function isNil(x) {
  return x == null;
};
var headerValue = V.accept;
var headersArray = /*#__PURE__*/V.arrayId( /*#__PURE__*/V.tuple(string, headerValue));
var headersMap = /*#__PURE__*/V.and( /*#__PURE__*/V.acceptWith(function (xs) {
  return Array.from(xs);
}), headersArray, /*#__PURE__*/V.acceptWith(function (xs) {
  return new Map(xs);
}));

var performPlain = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? I.id : V.validate(V.freeFn(V.tuple(V.props({
  url: string,
  method: V.optional(string),
  user: V.optional(string),
  password: V.optional(string),
  headers: V.propsOr(headerValue, I.object0),
  overrideMimeType: V.optional(string),
  body: V.optional(V.accept),
  responseType: V.optional(string),
  timeout: V.optional(number),
  withCredentials: V.optional(boolean)
})), V.accept)))(function perform(_ref) {
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
      emit(state = L.set(EVENT, event, state));
    });
    xhr.addEventListener('loadend', function (event) {
      end(emit(state = L.set(EVENT, event, state)));
    });
    xhr.open(method, url, true, user, password);
    if (responseType) {
      xhr.responseType = responseType;
      if (responseType === 'json' && xhr.responseType !== 'json') state = L.set('parse', true, state);
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

var toLowerKeyedObject = /*#__PURE__*/L.get([/*#__PURE__*/L.array( /*#__PURE__*/L.cross([/*#__PURE__*/L.reread(toLower), L.identity])), /*#__PURE__*/L.inverse(L.keyed)]);

var normalizeOptions = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? I.id : V.validate(V.freeFn(V.tuple(V.or(I.isString, V.propsOr(V.accept, {
  headers: V.optional(V.cases([isNil, V.accept], [I.isArray, headersArray], [hasKeys, headersMap], [V.propsOr(headerValue, I.object0)]))
}))), V.accept)))( /*#__PURE__*/L.transform( /*#__PURE__*/L.ifElse(I.isString, /*#__PURE__*/L.modifyOp(function (url) {
  return { url: url, headers: I.object0 };
}), /*#__PURE__*/L.branch({
  headers: /*#__PURE__*/L.cond([isNil, /*#__PURE__*/L.setOp(I.object0)], [I.isArray, /*#__PURE__*/L.modifyOp(toLowerKeyedObject)], [hasKeys, /*#__PURE__*/L.modifyOp( /*#__PURE__*/I.pipe2U(Array.from, toLowerKeyedObject))], [[L.keys, /*#__PURE__*/L.modifyOp(toLower)]])
}))));

function perform(argsIn) {
  var args = F.combine([argsIn], normalizeOptions);
  return (isObservable(args) ? args.flatMapLatest(performPlain) : performPlain(args)).toProperty();
}

function tryParse(json) {
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
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
  return L.get([dir, EVENT, prop]);
});
var loaded = /*#__PURE__*/event('loaded');
var total = /*#__PURE__*/event('total');
var error = /*#__PURE__*/event('error');
var isHttpSuccessU = function isHttpSuccess(status) {
  return 200 <= status && status < 300;
};

var getAfter = /*#__PURE__*/I.curryN(3, function (predicate, getter) {
  return copyName(I.pipe2U(filter(predicate), getter), getter);
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

var readyState = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'readyState']), 'readyState');
var headersReceived = /*#__PURE__*/I.defineNameU( /*#__PURE__*/L.get([XHR, 'readyState', function (state) {
  return 2 <= state;
}]), 'headersReceived');
var isDone = /*#__PURE__*/I.defineNameU( /*#__PURE__*/L.get([EVENT, 'type', /*#__PURE__*/L.is('loadend')]), 'isDone');
var response = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U( /*#__PURE__*/F.lift(function (_ref3) {
  var xhr = _ref3.xhr,
      parse = _ref3.parse;

  var response = xhr.response;
  return parse ? tryParse(response) : response;
}), /*#__PURE__*/skipDuplicates(I.acyclicEqualsU)), 'response');
var responseFull = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isDone, response), 'responseFull');
var responseType = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'responseType']), 'responseType');
var responseURL = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'responseURL']), 'responseURL');
var responseText = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get(['responseType', /*#__PURE__*/isOneOf(['', 'text'])])), 'responseText']), 'responseText');
var responseXML = /*#__PURE__*/getAfter(isDone, /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get(['responseType', /*#__PURE__*/isOneOf(['', 'document'])])), 'responseXML']), 'responseXML'));
var status = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'status']), 'status');
var statusIsHttpSuccess = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'status', isHttpSuccessU]), 'statusIsHttpSuccess');
var statusText = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'statusText']), 'statusText');
var responseHeader = /*#__PURE__*/I.curryN(2, function responseHeader(header) {
  return getAfter(headersReceived, setName(L.get([XHR, L.reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })]), 'responseHeader'));
});
var allResponseHeaders = /*#__PURE__*/getAfter(headersReceived, /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})]), 'allResponseHeaders'));
var timeout = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'timeout']), 'timeout');
var withCredentials = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, 'withCredentials']), 'withCredentials');

var isHttpSuccess = /*#__PURE__*/F.lift(isHttpSuccessU);

var mergeOptions = /*#__PURE__*/F.lift(function mergeOptions(defaults, overrides) {
  var headers = I.assign({}, defaults.headers, overrides.headers);
  return I.assign({}, defaults, overrides, { headers: headers });
});

var performWith = /*#__PURE__*/I.curry(function performWith(defaults, overrides) {
  return perform(mergeOptions(normalizeOptions(defaults), normalizeOptions(overrides)));
});

var performJson = /*#__PURE__*/setName( /*#__PURE__*/performWith({
  responseType: 'json',
  headers: { 'Content-Type': 'application/json' }
}), 'performJson');

var getJson = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U(performJson, responseFull), 'getJson');

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
exports.headersReceived = headersReceived;
exports.isDone = isDone;
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
exports.performWith = performWith;
exports.performJson = performJson;
exports.getJson = getJson;

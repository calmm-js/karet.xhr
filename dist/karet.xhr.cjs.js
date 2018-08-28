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

var skipAcyclicEquals = /*#__PURE__*/skipDuplicates(I.acyclicEqualsU);

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

var ADD_EVENT_LISTENER = 'addEventListener';
var DOWN = 'down';
var ERROR = 'error';
var EVENT = 'event';
var INITIAL = 'initial';
var JSON = 'json';
var LOAD = 'load';
var LOADED = 'loaded';
var LOADEND = 'loadend';
var LOADSTART = 'loadstart';
var OVERRIDE_MIME_TYPE = 'overrideMimeType';
var PARSE = 'parse';
var PROGRESS = 'progress';
var READYSTATECHANGE = 'readystatechange';
var READY_STATE = 'readyState';
var RESPONSE = 'response';
var RESPONSE_TEXT = 'responseText';
var RESPONSE_TYPE = 'responseType';
var RESPONSE_URL = 'responseURL';
var RESPONSE_XML = 'responseXML';
var STATUS = 'status';
var STATUS_TEXT = 'statusText';
var TIMEOUT = 'timeout';
var TOTAL = 'total';
var TYPE = 'type';
var UP = 'up';
var WITH_CREDENTIALS = 'withCredentials';
var XHR = 'xhr';

var initial = { type: INITIAL };

var eventTypes = [LOADSTART, PROGRESS, TIMEOUT, LOAD, ERROR];

var hasKeys = function hasKeys(x) {
  return I.isFunction(x.keys);
};

var isNil = function isNil(x) {
  return null == x;
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
})), V.accept)))(function perform(args) {
  return K.stream(function (_ref) {
    var emit = _ref.emit,
        end = _ref.end;

    var url = args.url;
    var method = args.method;
    var user = args.user;
    var password = args.password;
    var headers = args.headers;
    var overrideMimeType = args[OVERRIDE_MIME_TYPE];
    var body = args.body;
    var responseType = args[RESPONSE_TYPE];
    var timeout = args[TIMEOUT];
    var withCredentials = args[WITH_CREDENTIALS];

    var xhr = new XMLHttpRequest();
    var state = { xhr: xhr, up: initial, down: initial };
    var update = function update(dir, type) {
      return function (event) {
        emit(state = L.set(dir, { type: type, event: event }, state));
      };
    };
    eventTypes.forEach(function (type) {
      xhr[ADD_EVENT_LISTENER](type, update(DOWN, type));
      xhr.upload[ADD_EVENT_LISTENER](type, update(UP, type));
    });
    xhr[ADD_EVENT_LISTENER](READYSTATECHANGE, function (event) {
      emit(state = L.set(EVENT, event, state));
    });
    xhr[ADD_EVENT_LISTENER](LOADEND, function (event) {
      end(emit(state = L.set(EVENT, event, state)));
    });
    xhr.open(isNil(method) ? 'GET' : method, url, true, isNil(user) ? null : user, isNil(password) ? null : password);
    if (responseType) {
      xhr[RESPONSE_TYPE] = responseType;
      if (responseType === JSON && xhr[RESPONSE_TYPE] !== JSON) state = L.set(PARSE, true, state);
    }
    if (timeout) xhr[TIMEOUT] = timeout;
    if (withCredentials) xhr[WITH_CREDENTIALS] = withCredentials;
    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
    if (overrideMimeType) xhr[OVERRIDE_MIME_TYPE](overrideMimeType);
    xhr.send(isNil(body) ? null : body);
    return function () {
      if (!xhr[STATUS]) xhr.abort();
    };
  });
});

var toLowerKeyedObject = /*#__PURE__*/L.get([/*#__PURE__*/L.array( /*#__PURE__*/L.cross([/*#__PURE__*/L.reread(toLower), L.identity])), /*#__PURE__*/L.inverse(L.keyed)]);

var normalizeOptions = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? I.id : V.validate(V.modifyAfter(V.freeFn(V.tuple(V.or(string, V.propsOr(V.accept, {
  headers: V.optional(V.cases([isNil, V.accept], [I.isArray, headersArray], [hasKeys, headersMap], [V.propsOr(headerValue, I.object0)]))
}))), V.accept), F.lift)))( /*#__PURE__*/L.transform( /*#__PURE__*/L.ifElse(I.isString, /*#__PURE__*/L.modifyOp(function (url) {
  return { url: url, headers: I.object0 };
}), /*#__PURE__*/L.branch({
  headers: /*#__PURE__*/L.cond([isNil, /*#__PURE__*/L.setOp(I.object0)], [I.isArray, /*#__PURE__*/L.modifyOp(toLowerKeyedObject)], [hasKeys, /*#__PURE__*/L.modifyOp( /*#__PURE__*/I.pipe2U(Array.from, toLowerKeyedObject))], [[L.keys, /*#__PURE__*/L.modifyOp(toLower)]])
}))));

function perform(argsIn) {
  var args = normalizeOptions(argsIn);
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
  return L.get([dir, TYPE, isOneOf(values)]);
});
var hasStartedOn = /*#__PURE__*/is(eventTypes);
var isProgressingOn = /*#__PURE__*/is([PROGRESS, LOADSTART]);
var load = [LOAD];
var hasCompletedOn = /*#__PURE__*/is(load);
var hasFailedOn = /*#__PURE__*/is([ERROR]);
var hasTimedOutOn = /*#__PURE__*/is([TIMEOUT]);
var ended = [LOAD, ERROR, TIMEOUT];
var hasEndedOn = /*#__PURE__*/is(ended);

var event = /*#__PURE__*/I.curry(function (prop, op, dir) {
  return op([dir, EVENT, prop]);
});
var loadedOn = /*#__PURE__*/event(LOADED, L.sum);
var totalOn = /*#__PURE__*/event(TOTAL, L.sum);
var errorsWithOn = /*#__PURE__*/event(ERROR);

var isHttpSuccessU = function isHttpSuccess(status) {
  return 200 <= status && status < 300;
};

var getAfter = /*#__PURE__*/I.curryN(3, function (predicate, getter) {
  return I.pipe2U(filter(predicate), getter);
});

var either = /*#__PURE__*/L.branches(DOWN, UP);

var upHasStarted = /*#__PURE__*/setName( /*#__PURE__*/hasStartedOn(UP), 'upHasStarted');
var upIsProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressingOn(UP), 'upIsProgressing');
var upHasCompleted = /*#__PURE__*/setName( /*#__PURE__*/hasCompletedOn(UP), 'upHasCompleted');
var upHasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailedOn(UP), 'upHasFailed');
var upHasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOutOn(UP), 'upHasTimedOut');
var upHasEnded = /*#__PURE__*/setName( /*#__PURE__*/hasEndedOn(UP), 'upHasEnded');
var upLoaded = /*#__PURE__*/setName( /*#__PURE__*/loadedOn(UP), 'upLoaded');
var upTotal = /*#__PURE__*/setName( /*#__PURE__*/totalOn(UP), 'upTotal');
var upError = /*#__PURE__*/setName( /*#__PURE__*/errorsWithOn(L.get, UP), 'upError');

var downHasStarted = /*#__PURE__*/setName( /*#__PURE__*/hasStartedOn(DOWN), 'downHasStarted');
var downIsProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressingOn(DOWN), 'downIsProgressing');
var downHasCompleted = /*#__PURE__*/setName( /*#__PURE__*/hasCompletedOn(DOWN), 'downHasCompleted');
var downHasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailedOn(DOWN), 'downHasFailed');
var downHasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOutOn(DOWN), 'downHasTimedOut');
var downHasEnded = /*#__PURE__*/setName( /*#__PURE__*/hasEndedOn(DOWN), 'downHasEnded');
var downLoaded = /*#__PURE__*/setName( /*#__PURE__*/loadedOn(DOWN), 'downLoaded');
var downTotal = /*#__PURE__*/setName( /*#__PURE__*/totalOn(DOWN), 'downTotal');
var downError = /*#__PURE__*/setName( /*#__PURE__*/errorsWithOn(L.get, DOWN), 'downError');

var readyState = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, READY_STATE]), READY_STATE);
var isStatusAvailable = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, READY_STATE, function (state) {
  return 2 <= state;
}]), 'isStatusAvailable');
var isDone = /*#__PURE__*/setName( /*#__PURE__*/is([LOADEND], EVENT), 'isDone');
var isProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressingOn(either), 'isProgressing');
var hasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailedOn(either), 'hasFailed');
var hasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOutOn(either), 'hasTimedOut');
var loaded = /*#__PURE__*/setName( /*#__PURE__*/loadedOn(either), 'loaded');
var total = /*#__PURE__*/setName( /*#__PURE__*/totalOn(either), 'total');
var errors = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U( /*#__PURE__*/errorsWithOn(L.collect, either), skipAcyclicEquals), 'errors');
var response = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U( /*#__PURE__*/F.lift(function (_ref2) {
  var xhr = _ref2.xhr,
      parse = _ref2.parse;

  var response = xhr[RESPONSE];
  return parse ? tryParse(response) : response;
}), skipAcyclicEquals), RESPONSE);
var responseFull = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isDone, response), 'responseFull');
var responseType = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, RESPONSE_TYPE]), RESPONSE_TYPE);
var responseURL = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/L.get([XHR, RESPONSE_URL])), RESPONSE_URL);
var responseText = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get([RESPONSE_TYPE, /*#__PURE__*/isOneOf(['', 'text'])])), RESPONSE_TEXT]), RESPONSE_TEXT);
var responseXML = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isDone, /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.when( /*#__PURE__*/L.get([RESPONSE_TYPE, /*#__PURE__*/isOneOf(['', 'document'])])), RESPONSE_XML])), RESPONSE_XML);
var status = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/L.get([XHR, STATUS])), STATUS);
var statusIsHttpSuccess = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, STATUS, isHttpSuccessU]), 'statusIsHttpSuccess');
var statusText = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/L.get([XHR, STATUS_TEXT])), STATUS_TEXT);

var responseHeader = /*#__PURE__*/I.curryN(2, function responseHeader(header) {
  return getAfter(isStatusAvailable, L.get([XHR, L.reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })]));
});
var allResponseHeaders = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/L.get([XHR, /*#__PURE__*/L.reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})])), 'allResponseHeaders');

var timeout = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, TIMEOUT]), TIMEOUT);
var withCredentials = /*#__PURE__*/setName( /*#__PURE__*/L.get([XHR, WITH_CREDENTIALS]), WITH_CREDENTIALS);

var isHttpSuccess = /*#__PURE__*/F.lift(isHttpSuccessU);

var mergeOptions = /*#__PURE__*/F.lift(function mergeOptions(defaults, overrides) {
  var headers = I.assign({}, defaults.headers, overrides.headers);
  return I.assign({}, defaults, overrides, { headers: headers });
});

var performWith = /*#__PURE__*/I.curry(function performWith(defaults, overrides) {
  return perform(mergeOptions(normalizeOptions(defaults), normalizeOptions(overrides)));
});

var performJson = /*#__PURE__*/setName( /*#__PURE__*/performWith({
  responseType: JSON,
  headers: { 'Content-Type': 'application/json' }
}), 'performJson');

var getJson = /*#__PURE__*/setName( /*#__PURE__*/I.pipe2U(performJson, responseFull), 'getJson');

var typeIsSuccess = [TYPE, /*#__PURE__*/isOneOf([INITIAL, LOAD])];

var hasSucceeded = /*#__PURE__*/setName( /*#__PURE__*/L.and( /*#__PURE__*/L.branch({
  event: [TYPE, /*#__PURE__*/L.is(LOADEND)],
  up: typeIsSuccess,
  down: typeIsSuccess,
  xhr: [STATUS, isHttpSuccessU]
})), 'hasSucceeded');

var renamed = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function renamed(fn, name) {
  var warned = false;
  return setName(function deprecated(x) {
    if (!warned) {
      warned = true;
      console.warn('karet.xhr: `' + name + '` has been renamed to `' + fn.name + '`');
    }
    return fn(x);
  }, name);
};

var downHasSucceeded = /*#__PURE__*/renamed(downHasCompleted, 'downHasSucceeded');
var headersReceived = /*#__PURE__*/renamed(isStatusAvailable, 'headersReceived');
var upHasSucceeded = /*#__PURE__*/renamed(upHasCompleted, 'upHasSucceeded');

exports.perform = perform;
exports.upHasStarted = upHasStarted;
exports.upIsProgressing = upIsProgressing;
exports.upHasCompleted = upHasCompleted;
exports.upHasFailed = upHasFailed;
exports.upHasTimedOut = upHasTimedOut;
exports.upHasEnded = upHasEnded;
exports.upLoaded = upLoaded;
exports.upTotal = upTotal;
exports.upError = upError;
exports.downHasStarted = downHasStarted;
exports.downIsProgressing = downIsProgressing;
exports.downHasCompleted = downHasCompleted;
exports.downHasFailed = downHasFailed;
exports.downHasTimedOut = downHasTimedOut;
exports.downHasEnded = downHasEnded;
exports.downLoaded = downLoaded;
exports.downTotal = downTotal;
exports.downError = downError;
exports.readyState = readyState;
exports.isStatusAvailable = isStatusAvailable;
exports.isDone = isDone;
exports.isProgressing = isProgressing;
exports.hasFailed = hasFailed;
exports.hasTimedOut = hasTimedOut;
exports.loaded = loaded;
exports.total = total;
exports.errors = errors;
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
exports.hasSucceeded = hasSucceeded;
exports.downHasSucceeded = downHasSucceeded;
exports.headersReceived = headersReceived;
exports.upHasSucceeded = upHasSucceeded;

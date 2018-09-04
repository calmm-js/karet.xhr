import { lift } from 'karet.lift';
import { curry, acyclicEqualsU, pipe2U, isString, isNumber, defineNameU, freeze, isFunction, id, object0, isArray, curryN, assign } from 'infestines';
import { Observable, constant, Stream, never, stream, constantError } from 'kefir';
import { set, get, array, cross, reread, identity, inverse, keyed, transform, ifElse, modifyOp, branch, cond, setOp, keys, sum, branches, collect, when, and, is } from 'kefir.partial.lenses';
import { accept, arrayId, tuple, and as and$1, acceptWith, validate, freeFn, props, optional, propsOr, modifyAfter, or, cases } from 'partial.lenses.validation';

//

var isObservable = function isObservable(x) {
  return x instanceof Observable;
};

var toObservable = function toObservable(x) {
  return isObservable(x) ? x : constant(x);
};

var toProperty = function toProperty(x) {
  return x instanceof Stream ? x.toProperty() : x;
};

var never$1 = /*#__PURE__*/never();

var skipDuplicates = /*#__PURE__*/curry(function skipDuplicates(eq, xs) {
  return isObservable(xs) ? xs.skipDuplicates(eq) : xs;
});

var skipAcyclicEquals = /*#__PURE__*/skipDuplicates(acyclicEqualsU);

var filter = /*#__PURE__*/curry(function filter(pr, xs) {
  if (isObservable(xs)) {
    return xs.filter(pr);
  } else if (pr(xs)) {
    return xs;
  } else {
    throw Error(pr.name);
  }
});

var flatMapLatestToProperty = /*#__PURE__*/curry(function flatMapLatestToProperty(fn, x) {
  return isObservable(x) ? toProperty(x.flatMapLatest(pipe2U(fn, toObservable))) : toProperty(fn(x));
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

var ADD_EVENT_LISTENER = 'addEventListener';
var DOWN = 'down';
var ERROR = 'error';
var EVENT = 'event';
var INITIAL = 'initial';
var JSON_ = 'json';
var LOAD = 'load';
var LOADED = 'loaded';
var LOADEND = 'loadend';
var LOADSTART = 'loadstart';
var MAP = 'map';
var OVERRIDE_MIME_TYPE = 'overrideMimeType';
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

var typeInitial = /*#__PURE__*/freeze({ type: INITIAL });
var typeLoadend = /*#__PURE__*/freeze({ type: LOADEND });
var typeLoad = /*#__PURE__*/freeze({ type: LOAD });

var eventTypes = [LOADSTART, PROGRESS, TIMEOUT, LOAD, ERROR];

var hasKeys = function hasKeys(x) {
  return isFunction(x.keys);
};

var isNil = function isNil(x) {
  return null == x;
};
var headerValue = accept;
var headersArray = /*#__PURE__*/arrayId( /*#__PURE__*/tuple(string, headerValue));
var headersMap = /*#__PURE__*/and$1( /*#__PURE__*/acceptWith(function (xs) {
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
})), accept)))(function perform(args) {
  return stream(function (_ref) {
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
    var state = { xhr: xhr, up: typeInitial, down: typeInitial, map: id };
    var update = function update(dir, type) {
      return function (event) {
        if (type !== PROGRESS || state[dir].type !== LOAD) emit(state = set(dir, { type: type, event: event }, state));
      };
    };
    eventTypes.forEach(function (type) {
      xhr[ADD_EVENT_LISTENER](type, update(DOWN, type));
      xhr.upload[ADD_EVENT_LISTENER](type, update(UP, type));
    });
    xhr[ADD_EVENT_LISTENER](READYSTATECHANGE, function (event) {
      emit(state = set(EVENT, event, state));
    });
    xhr[ADD_EVENT_LISTENER](LOADEND, function (event) {
      end(emit(state = set(EVENT, event, state)));
    });
    xhr.open(isNil(method) ? 'GET' : method, url, true, isNil(user) ? null : user, isNil(password) ? null : password);
    if (responseType) {
      xhr[RESPONSE_TYPE] = responseType;
      if (responseType === JSON_ && xhr[RESPONSE_TYPE] !== JSON_) state = set(MAP, tryParse, state);
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

var toLowerKeyedObject = /*#__PURE__*/get([/*#__PURE__*/array( /*#__PURE__*/cross([/*#__PURE__*/reread(toLower), identity])), /*#__PURE__*/inverse(keyed)]);

var normalizeOptions = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : validate(modifyAfter(freeFn(tuple(or(string, propsOr(accept, {
  headers: optional(cases([isNil, accept], [isArray, headersArray], [hasKeys, headersMap], [propsOr(headerValue, object0)]))
}))), accept), lift)))( /*#__PURE__*/transform( /*#__PURE__*/ifElse(isString, /*#__PURE__*/modifyOp(function (url) {
  return { url: url, headers: object0 };
}), /*#__PURE__*/branch({
  headers: /*#__PURE__*/cond([isNil, /*#__PURE__*/setOp(object0)], [isArray, /*#__PURE__*/modifyOp(toLowerKeyedObject)], [hasKeys, /*#__PURE__*/modifyOp( /*#__PURE__*/pipe2U(Array.from, toLowerKeyedObject))], [[keys, /*#__PURE__*/modifyOp(toLower)]])
}))));

var perform = /*#__PURE__*/setName( /*#__PURE__*/pipe2U(normalizeOptions, /*#__PURE__*/flatMapLatestToProperty(performPlain)), 'perform');

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
  return get([dir, TYPE, isOneOf(values)]);
});
var hasStartedOn = /*#__PURE__*/is$1(eventTypes);
var isProgressingOn = /*#__PURE__*/is$1([PROGRESS, LOADSTART]);
var load = [LOAD];
var hasCompletedOn = /*#__PURE__*/is$1(load);
var hasFailedOn = /*#__PURE__*/is$1([ERROR]);
var hasTimedOutOn = /*#__PURE__*/is$1([TIMEOUT]);
var ended = [LOAD, ERROR, TIMEOUT];
var hasEndedOn = /*#__PURE__*/is$1(ended);

var event = /*#__PURE__*/curry(function (prop, op, dir) {
  return op([dir, EVENT, prop]);
});
var loadedOn = /*#__PURE__*/event(LOADED, sum);
var totalOn = /*#__PURE__*/event(TOTAL, sum);
var errorsWithOn = /*#__PURE__*/event(ERROR);

var isHttpSuccessU = function isHttpSuccess(status) {
  return 200 <= status && status < 300;
};

var getAfter = /*#__PURE__*/curryN(3, function (predicate, getter) {
  return pipe2U(filter(predicate), getter);
});

var either = /*#__PURE__*/branches(DOWN, UP);

var upHasStarted = /*#__PURE__*/setName( /*#__PURE__*/hasStartedOn(UP), 'upHasStarted');
var upIsProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressingOn(UP), 'upIsProgressing');
var upHasCompleted = /*#__PURE__*/setName( /*#__PURE__*/hasCompletedOn(UP), 'upHasCompleted');
var upHasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailedOn(UP), 'upHasFailed');
var upHasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOutOn(UP), 'upHasTimedOut');
var upHasEnded = /*#__PURE__*/setName( /*#__PURE__*/hasEndedOn(UP), 'upHasEnded');
var upLoaded = /*#__PURE__*/setName( /*#__PURE__*/loadedOn(UP), 'upLoaded');
var upTotal = /*#__PURE__*/setName( /*#__PURE__*/totalOn(UP), 'upTotal');
var upError = /*#__PURE__*/setName( /*#__PURE__*/errorsWithOn(get, UP), 'upError');

var downHasStarted = /*#__PURE__*/setName( /*#__PURE__*/hasStartedOn(DOWN), 'downHasStarted');
var downIsProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressingOn(DOWN), 'downIsProgressing');
var downHasCompleted = /*#__PURE__*/setName( /*#__PURE__*/hasCompletedOn(DOWN), 'downHasCompleted');
var downHasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailedOn(DOWN), 'downHasFailed');
var downHasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOutOn(DOWN), 'downHasTimedOut');
var downHasEnded = /*#__PURE__*/setName( /*#__PURE__*/hasEndedOn(DOWN), 'downHasEnded');
var downLoaded = /*#__PURE__*/setName( /*#__PURE__*/loadedOn(DOWN), 'downLoaded');
var downTotal = /*#__PURE__*/setName( /*#__PURE__*/totalOn(DOWN), 'downTotal');
var downError = /*#__PURE__*/setName( /*#__PURE__*/errorsWithOn(get, DOWN), 'downError');

var readyState = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, READY_STATE]), READY_STATE);
var isStatusAvailable = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, READY_STATE, function (state) {
  return 2 <= state;
}]), 'isStatusAvailable');
var isDone = /*#__PURE__*/setName( /*#__PURE__*/is$1([LOADEND], EVENT), 'isDone');
var isProgressing = /*#__PURE__*/setName( /*#__PURE__*/isProgressingOn(either), 'isProgressing');
var hasFailed = /*#__PURE__*/setName( /*#__PURE__*/hasFailedOn(either), 'hasFailed');
var hasTimedOut = /*#__PURE__*/setName( /*#__PURE__*/hasTimedOutOn(either), 'hasTimedOut');
var loaded = /*#__PURE__*/setName( /*#__PURE__*/loadedOn(either), 'loaded');
var total = /*#__PURE__*/setName( /*#__PURE__*/totalOn(either), 'total');
var errors = /*#__PURE__*/setName( /*#__PURE__*/pipe2U( /*#__PURE__*/errorsWithOn(collect, either), skipAcyclicEquals), 'errors');
var response = /*#__PURE__*/setName( /*#__PURE__*/getAfter(downHasCompleted, /*#__PURE__*/pipe2U( /*#__PURE__*/lift(function (_ref2) {
  var xhr = _ref2.xhr,
      map = _ref2.map;
  return map(xhr[RESPONSE]);
}), skipAcyclicEquals)), RESPONSE);

var responseType = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, RESPONSE_TYPE]), RESPONSE_TYPE);
var responseURL = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/get([XHR, RESPONSE_URL])), RESPONSE_URL);
var responseText = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get([RESPONSE_TYPE, /*#__PURE__*/isOneOf(['', 'text'])])), RESPONSE_TEXT]), RESPONSE_TEXT);
var responseXML = /*#__PURE__*/setName( /*#__PURE__*/getAfter(downHasCompleted, /*#__PURE__*/get([XHR, /*#__PURE__*/when( /*#__PURE__*/get([RESPONSE_TYPE, /*#__PURE__*/isOneOf(['', 'document'])])), RESPONSE_XML])), RESPONSE_XML);
var status = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/get([XHR, STATUS])), STATUS);
var statusIsHttpSuccess = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, STATUS, isHttpSuccessU]), 'statusIsHttpSuccess');
var statusText = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/get([XHR, STATUS_TEXT])), STATUS_TEXT);

var responseHeader = /*#__PURE__*/curryN(2, function responseHeader(header) {
  return getAfter(isStatusAvailable, get([XHR, reread(function (xhr) {
    return xhr.getResponseHeader(header);
  })]));
});
var allResponseHeaders = /*#__PURE__*/setName( /*#__PURE__*/getAfter(isStatusAvailable, /*#__PURE__*/get([XHR, /*#__PURE__*/reread(function (xhr) {
  return xhr.getAllResponseHeaders();
})])), 'allResponseHeaders');

var timeout = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, TIMEOUT]), TIMEOUT);
var withCredentials = /*#__PURE__*/setName( /*#__PURE__*/get([XHR, WITH_CREDENTIALS]), WITH_CREDENTIALS);

var isHttpSuccess = /*#__PURE__*/lift(isHttpSuccessU);

var mergeOptions = /*#__PURE__*/lift(function mergeOptions(defaults, overrides) {
  var headers = assign({}, defaults.headers, overrides.headers);
  return assign({}, defaults, overrides, { headers: headers });
});

var performWith = /*#__PURE__*/curry(function performWith(defaults, overrides) {
  return perform(mergeOptions(normalizeOptions(defaults), normalizeOptions(overrides)));
});

var performJson = /*#__PURE__*/setName( /*#__PURE__*/performWith({
  responseType: JSON_,
  headers: { 'Content-Type': 'application/json' }
}), 'performJson');

var typeIsSuccess = [TYPE, /*#__PURE__*/isOneOf([INITIAL, LOAD])];

var hasSucceeded = /*#__PURE__*/setName( /*#__PURE__*/and( /*#__PURE__*/branch({
  event: [TYPE, /*#__PURE__*/is(LOADEND)],
  up: typeIsSuccess,
  down: typeIsSuccess,
  xhr: [STATUS, isHttpSuccessU]
})), 'hasSucceeded');

var getJson = /*#__PURE__*/setName( /*#__PURE__*/pipe2U(performJson, /*#__PURE__*/flatMapLatestToProperty(function (xhr) {
  if (hasSucceeded(xhr)) {
    return response(xhr);
  } else if (isDone(xhr) && (hasFailed(xhr) || hasTimedOut(xhr))) {
    return constantError(xhr);
  } else {
    return never$1;
  }
})), 'getJson');

var result = /*#__PURE__*/setName( /*#__PURE__*/getAfter(hasSucceeded, response), 'result');

var of = function of(response) {
  return {
    event: typeLoadend,
    up: typeInitial,
    down: typeLoad,
    xhr: { status: 200, response: response },
    map: id
  };
};

var chain = /*#__PURE__*/curry(function chain(fn, xhr) {
  return flatMapLatestToProperty(function (x) {
    return hasSucceeded(x) ? fn(response(x)) : x;
  }, xhr);
});

var map = /*#__PURE__*/curry(function map(fn, xhr) {
  return chain(pipe2U(fn, of), xhr);
});

var ap = /*#__PURE__*/curry(function ap(f, x) {
  return chain(function (f) {
    return map(f, x);
  }, f);
});

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
var responseFull = /*#__PURE__*/renamed(response, 'responseFull');
var upHasSucceeded = /*#__PURE__*/renamed(upHasCompleted, 'upHasSucceeded');

export { perform, upHasStarted, upIsProgressing, upHasCompleted, upHasFailed, upHasTimedOut, upHasEnded, upLoaded, upTotal, upError, downHasStarted, downIsProgressing, downHasCompleted, downHasFailed, downHasTimedOut, downHasEnded, downLoaded, downTotal, downError, readyState, isStatusAvailable, isDone, isProgressing, hasFailed, hasTimedOut, loaded, total, errors, response, responseType, responseURL, responseText, responseXML, status, statusIsHttpSuccess, statusText, responseHeader, allResponseHeaders, timeout, withCredentials, isHttpSuccess, performWith, performJson, hasSucceeded, getJson, result, of, chain, map, ap, downHasSucceeded, headersReceived, responseFull, upHasSucceeded };

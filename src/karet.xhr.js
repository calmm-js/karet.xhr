import * as F from 'karet.lift'
import * as I from 'infestines'
import * as K from 'kefir'
import * as L from 'kefir.partial.lenses'
import * as V from 'partial.lenses.validation'

//

import {delayUnsub} from './delay-unsub'

//

const isObservable = x => x instanceof K.Observable

const toObservable = x => (isObservable(x) ? x : K.constant(x))

const toProperty = x => (x instanceof K.Stream ? x.toProperty() : x)

const never = K.never()

const skipDuplicates = I.curry(function skipDuplicates(eq, xs) {
  return isObservable(xs) ? xs.skipDuplicates(eq) : xs
})

const skipAcyclicEquals = skipDuplicates(I.acyclicEqualsU)

const filter = I.curry(function filter(pr, xs) {
  if (isObservable(xs)) {
    return xs.filter(pr)
  } else if (pr(xs)) {
    return xs
  } else {
    throw Error(pr.name)
  }
})

const flatMapProperty = I.curry(function flatMapProperty(xyO, x) {
  return isObservable(x)
    ? toProperty(x.flatMapLatest(I.pipe2U(xyO, toObservable)))
    : toProperty(xyO(x))
})

const mapProperty = I.curry(function map(xy, x) {
  return isObservable(x) ? toProperty(x.map(xy)) : xy(x)
})

//

const toLower = s => s.toLowerCase()

//

const string = I.isString
const boolean = x => x === !!x
const number = I.isNumber

//

const setName = process.env.NODE_ENV === 'production' ? x => x : I.defineNameU

const ADD_EVENT_LISTENER = 'addEventListener'
const DOWN = 'down'
const ERROR = 'error'
const EVENT = 'event'
const INITIAL = 'initial'
const JSON_ = 'json'
const LOAD = 'load'
const LOADED = 'loaded'
const LOADEND = 'loadend'
const LOADSTART = 'loadstart'
const MAP = 'map'
const OVERRIDE_MIME_TYPE = 'overrideMimeType'
const PROGRESS = 'progress'
const READYSTATECHANGE = 'readystatechange'
const READY_STATE = 'readyState'
const RESPONSE = 'response'
const RESPONSE_TEXT = 'responseText'
const RESPONSE_TYPE = 'responseType'
const RESPONSE_URL = 'responseURL'
const RESPONSE_XML = 'responseXML'
const STATUS = 'status'
const STATUS_TEXT = 'statusText'
const TIMEOUT = 'timeout'
const TOTAL = 'total'
const TYPE = 'type'
const UP = 'up'
const WITH_CREDENTIALS = 'withCredentials'
const XHR = 'xhr'

const typeInitial = I.freeze({type: INITIAL})
const typeLoadend = I.freeze({type: LOADEND})
const typeLoad = I.freeze({type: LOAD})

const eventTypes = [LOADSTART, PROGRESS, LOAD, TIMEOUT, ERROR]

const simpleSettings = [
  OVERRIDE_MIME_TYPE,
  RESPONSE_TYPE,
  TIMEOUT,
  WITH_CREDENTIALS
]

const hasKeys = x => I.isFunction(x.keys)

const isNil = x => null == x
const headerValue = V.accept
const headersArray = V.arrayId(V.tuple(string, headerValue))
const headersMap = V.and(
  V.acceptWith(xs => Array.from(xs)),
  headersArray,
  V.acceptWith(xs => new Map(xs))
)

const performPlain = (process.env.NODE_ENV === 'production'
  ? I.id
  : V.validate(
      V.freeFn(
        V.tuple(
          V.props({
            body: V.optional(V.accept),
            headers: V.propsOr(headerValue, I.object0),
            method: V.optional(string),
            overrideMimeType: V.optional(string),
            password: V.optional(string),
            responseType: V.optional(string),
            timeout: V.optional(number),
            url: string,
            user: V.optional(string),
            withCredentials: V.optional(boolean)
          })
        ),
        V.accept
      )
    ))(function perform(args) {
  return delayUnsub(
    K.stream(({emit, end}) => {
      const method = args.method
      const user = args.user
      const password = args.password
      const headers = args.headers
      const body = args.body

      const xhr = new XMLHttpRequest()
      let state = {down: typeInitial, map: I.id, up: typeInitial, xhr}
      const update = (dir, type) => event => {
        if (type !== PROGRESS || state[dir].type !== LOAD)
          emit((state = L.set(dir, {event, type}, state)))
      }
      eventTypes.forEach(type => {
        xhr[ADD_EVENT_LISTENER](type, update(DOWN, type))
        xhr.upload[ADD_EVENT_LISTENER](type, update(UP, type))
      })
      xhr[ADD_EVENT_LISTENER](READYSTATECHANGE, event => {
        emit((state = L.set(EVENT, event, state)))
      })
      xhr[ADD_EVENT_LISTENER](LOADEND, event => {
        end(emit((state = L.set(EVENT, event, state))))
      })
      xhr.open(
        isNil(method) ? 'GET' : method,
        args.url,
        true,
        isNil(user) ? null : user,
        isNil(password) ? null : password
      )
      simpleSettings.forEach(key => {
        const value = args[key]
        if (value) xhr[key] = value
      })
      if (args[RESPONSE_TYPE] === JSON_ && xhr[RESPONSE_TYPE] !== JSON_) {
        // IE11 workaround
        state = L.set(MAP, tryParse, state)
      }
      for (const header in headers) {
        xhr.setRequestHeader(header, headers[header])
      }
      xhr.send(isNil(body) ? null : body)
      return () => {
        if (!xhr[STATUS]) xhr.abort()
      }
    })
  )
})

const toLowerKeyedObject = L.get([
  L.array(L.cross([L.reread(toLower), L.identity])),
  L.inverse(L.keyed)
])

const normalizeOptions = (process.env.NODE_ENV === 'production'
  ? I.id
  : V.validate(
      V.modifyAfter(
        V.freeFn(
          V.tuple(
            V.or(
              string,
              V.propsOr(V.accept, {
                headers: V.optional(
                  V.cases(
                    [isNil, V.accept],
                    [I.isArray, headersArray],
                    [hasKeys, headersMap],
                    [V.propsOr(headerValue, I.object0)]
                  )
                )
              })
            )
          ),
          V.accept
        ),
        F.lift
      )
    ))(
  L.transform(
    L.ifElse(
      I.isString,
      L.modifyOp(url => ({headers: I.object0, url})),
      L.branch({
        headers: L.cond(
          [isNil, L.setOp(I.object0)],
          [I.isArray, L.modifyOp(toLowerKeyedObject)],
          [hasKeys, L.modifyOp(I.pipe2U(Array.from, toLowerKeyedObject))],
          [[L.keys, L.modifyOp(toLower)]]
        )
      })
    )
  )
)

export const perform = setName(
  I.pipe2U(normalizeOptions, flatMapProperty(performPlain)),
  'perform'
)

function tryParse(json) {
  try {
    return JSON.parse(json)
  } catch (_) {
    return null
  }
}

const isOneOf = I.curry((values, value) => values.includes(value))
const is = I.curry((values, dir) => L.get([dir, TYPE, isOneOf(values)]))
const hasStartedOn = is(eventTypes)
const isProgressingOn = is([PROGRESS, LOADSTART])
const load = [LOAD]
const hasCompletedOn = is(load)
const hasErroredOn = is([ERROR])
const hasTimedOutOn = is([TIMEOUT])
const ended = [LOAD, TIMEOUT, ERROR]
const hasEndedOn = is(ended)
const failed = [ERROR, TIMEOUT]
const hasFailedOn = is(failed)

const event = I.curry((prop, op, dir) => op([dir, EVENT, prop]))
const loadedOn = event(LOADED, L.sum)
const totalOn = event(TOTAL, L.sum)
const errorsWithOn = event(ERROR)

const isHttpSuccessU = function isHttpSuccess(status) {
  return 200 <= status && status < 300
}

const getAfter = I.curryN(3, (predicate, getter) =>
  I.pipe2U(filter(predicate), getter)
)

const either = L.branches(DOWN, UP)

export const upHasStarted = setName(hasStartedOn(UP), 'upHasStarted')
export const upIsProgressing = setName(isProgressingOn(UP), 'upIsProgressing')
export const upHasCompleted = setName(hasCompletedOn(UP), 'upHasCompleted')
export const upHasFailed = setName(hasErroredOn(UP), 'upHasFailed')
export const upHasErrored = setName(hasErroredOn(UP), 'upHasErrored')
export const upHasTimedOut = setName(hasTimedOutOn(UP), 'upHasTimedOut')
export const upHasEnded = setName(hasEndedOn(UP), 'upHasEnded')
export const upLoaded = setName(loadedOn(UP), 'upLoaded')
export const upTotal = setName(totalOn(UP), 'upTotal')
export const upError = setName(errorsWithOn(L.get, UP), 'upError')

export const downHasStarted = setName(hasStartedOn(DOWN), 'downHasStarted')
export const downIsProgressing = setName(
  isProgressingOn(DOWN),
  'downIsProgressing'
)
export const downHasCompleted = setName(
  hasCompletedOn(DOWN),
  'downHasCompleted'
)
export const downHasFailed = setName(hasFailedOn(DOWN), 'downHasFailed')
export const downHasErrored = setName(hasErroredOn(DOWN), 'downHasErrored')
export const downHasTimedOut = setName(hasTimedOutOn(DOWN), 'downHasTimedOut')
export const downHasEnded = setName(hasEndedOn(DOWN), 'downHasEnded')
export const downLoaded = setName(loadedOn(DOWN), 'downLoaded')
export const downTotal = setName(totalOn(DOWN), 'downTotal')
export const downError = setName(errorsWithOn(L.get, DOWN), 'downError')

export const readyState = setName(L.get([XHR, READY_STATE]), READY_STATE)
export const isStatusAvailable = setName(
  L.get([XHR, READY_STATE, state => 2 <= state]),
  'isStatusAvailable'
)
export const isDone = setName(is([LOADEND], EVENT), 'isDone')
export const isProgressing = setName(isProgressingOn(either), 'isProgressing')
export const hasErrored = setName(hasErroredOn(either), 'hasErrored')
export const hasTimedOut = setName(hasTimedOutOn(either), 'hasTimedOut')
export const loaded = setName(loadedOn(either), 'loaded')
export const total = setName(totalOn(either), 'total')
export const errors = setName(
  I.pipe2U(errorsWithOn(L.collect, either), skipAcyclicEquals),
  'errors'
)
export const response = setName(
  getAfter(
    downHasCompleted,
    I.pipe2U(F.lift(({xhr, map}) => map(xhr[RESPONSE])), skipAcyclicEquals)
  ),
  RESPONSE
)

export const responseType = setName(L.get([XHR, RESPONSE_TYPE]), RESPONSE_TYPE)
export const responseURL = setName(
  getAfter(isStatusAvailable, L.get([XHR, RESPONSE_URL])),
  RESPONSE_URL
)
export const responseText = setName(
  L.get([
    XHR,
    L.when(L.get([RESPONSE_TYPE, isOneOf(['', 'text'])])),
    RESPONSE_TEXT
  ]),
  RESPONSE_TEXT
)
export const responseXML = setName(
  getAfter(
    downHasCompleted,
    L.get([
      XHR,
      L.when(L.get([RESPONSE_TYPE, isOneOf(['', 'document'])])),
      RESPONSE_XML
    ])
  ),
  RESPONSE_XML
)
export const status = setName(
  getAfter(isStatusAvailable, L.get([XHR, STATUS])),
  STATUS
)
export const statusIsHttpSuccess = setName(
  L.get([XHR, STATUS, isHttpSuccessU]),
  'statusIsHttpSuccess'
)
export const statusText = setName(
  getAfter(isStatusAvailable, L.get([XHR, STATUS_TEXT])),
  STATUS_TEXT
)

export const responseHeader = I.curryN(2, function responseHeader(header) {
  return getAfter(
    isStatusAvailable,
    L.get([XHR, L.reread(xhr => xhr.getResponseHeader(header))])
  )
})
export const allResponseHeaders = setName(
  getAfter(
    isStatusAvailable,
    L.get([XHR, L.reread(xhr => xhr.getAllResponseHeaders())])
  ),
  'allResponseHeaders'
)

export const timeout = setName(L.get([XHR, TIMEOUT]), TIMEOUT)
export const withCredentials = setName(
  L.get([XHR, WITH_CREDENTIALS]),
  WITH_CREDENTIALS
)

export const isHttpSuccess = F.lift(isHttpSuccessU)

const mergeOptions = F.lift(function mergeOptions(defaults, overrides) {
  const headers = I.assign({}, defaults.headers, overrides.headers)
  return I.assign({}, defaults, overrides, {headers})
})

export const performWith = I.curry(function performWith(defaults, overrides) {
  return perform(
    mergeOptions(normalizeOptions(defaults), normalizeOptions(overrides))
  )
})

export const performJson = setName(
  performWith({
    headers: {'Content-Type': 'application/json'},
    responseType: JSON_
  }),
  'performJson'
)

const typeIsSuccess = [TYPE, isOneOf([INITIAL, LOAD])]

export const hasSucceeded = setName(
  L.and(
    L.branch({
      down: typeIsSuccess,
      event: [TYPE, L.is(LOADEND)],
      up: typeIsSuccess,
      xhr: [STATUS, isHttpSuccessU]
    })
  ),
  'hasSucceeded'
)

export const hasFailed = F.lift(function hasFailed(xhr) {
  return (
    (isStatusAvailable(xhr) && !statusIsHttpSuccess(xhr)) ||
    downHasFailed(xhr) ||
    upHasFailed(xhr)
  )
})

export const getJson = setName(
  I.pipe2U(
    performJson,
    flatMapProperty(xhr => {
      if (hasSucceeded(xhr)) {
        return response(xhr)
      } else if (isDone(xhr) && (hasErrored(xhr) || hasTimedOut(xhr))) {
        return K.constantError(xhr)
      } else {
        return never
      }
    })
  ),
  'getJson'
)

export const result = setName(getAfter(hasSucceeded, response), 'result')

//

const mergeTypes = (x, y) => {
  const xIndex = eventTypes.indexOf(x)
  const yIndex = eventTypes.indexOf(y)
  return xIndex < yIndex ? x : y
}

const mergeEvents = (x, y) => ({
  event: {
    loaded: (L.get(LOADED, x[EVENT]) || 0) + (L.get(LOADED, y[EVENT]) || 0),
    total: (L.get(TOTAL, x[EVENT]) || 0) + (L.get(TOTAL, y[EVENT]) || 0)
  },
  type: mergeTypes(x[TYPE], y[TYPE])
})

const mergeXHRs = (x, y) => ({
  down: mergeEvents(x[DOWN], y[DOWN]),
  event: y[EVENT][TYPE] === LOADEND ? x[EVENT] : y[EVENT],
  map: y[MAP],
  up: mergeEvents(x[UP], y[UP]),
  xhr: y[XHR]
})

//

const getAllResponseHeaders = I.always('')
const getResponseHeader = I.always(null)

export const of = response => ({
  down: typeLoad,
  event: typeLoadend,
  map: I.id,
  up: typeInitial,
  xhr: {
    getAllResponseHeaders,
    getResponseHeader,
    readyState: 4,
    response,
    status: 200,
    statusText: 'OK'
  }
})

export const chain = I.curryN(2, function chain(xy) {
  return flatMapProperty(x =>
    hasSucceeded(x)
      ? mapProperty(y => (hasFailed(y) ? y : mergeXHRs(x, y)), xy(response(x)))
      : x
  )
})

export const map = I.curryN(2, function map(xy) {
  return chain(x => of(xy(x)))
})

export const ap = I.curry(function ap(xy, x) {
  return chain(xy => map(xy, x), xy)
})

export const Succeeded = I.Monad(map, of, ap, chain)

//

export const apParallel = I.curry(function apParallel(xy, x) {
  return flatMapProperty(
    xy =>
      hasFailed(xy)
        ? xy
        : mapProperty(
            x =>
              hasSucceeded(xy)
                ? hasSucceeded(x)
                  ? mergeXHRs(mergeXHRs(xy, x), of(response(xy)(response(x))))
                  : hasFailed(x)
                  ? x
                  : mergeXHRs(xy, x)
                : mergeXHRs(xy, x),
            x
          ),
    xy
  )
})

export const Parallel = I.Applicative(map, of, apParallel)

const typeIsString = [TYPE, I.isString]

export const isXHR = setName(
  L.and(
    L.branch({
      down: typeIsString,
      map: I.isFunction,
      up: typeIsString,
      xhr: [READY_STATE, I.isNumber]
    })
  ),
  'isXHR'
)

export const IdentitySucceeded = I.IdentityOrU(isXHR, Succeeded)
export const IdentityParallel = I.IdentityOrU(isXHR, Parallel)

export const template = setName(
  L.get([
    L.traverse(IdentityParallel, I.id, F.inTemplate(isXHR)),
    L.ifElse(isXHR, [], of)
  ]),
  'template'
)

export const apply = I.curry(function apply(xsy, xs) {
  return map(xs => xsy.apply(null, xs), template(xs))
})

export const tap = I.curryN(2, function tap(action) {
  return map(result => (action(result), result))
})

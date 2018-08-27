import * as F from 'karet.lift'
import * as I from 'infestines'
import * as K from 'kefir'
import * as L from 'kefir.partial.lenses'
import * as V from 'partial.lenses.validation'

//

const isObservable = x => x instanceof K.Observable

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

//

const toLower = s => s.toLowerCase()

//

const string = I.isString
const boolean = x => x === !!x
const number = I.isNumber

//

const setName =
  process.env.NODE_ENV === 'production'
    ? x => x
    : (to, name) => I.defineNameU(to, name)

const ADD_EVENT_LISTENER = 'addEventListener'
const DOWN = 'down'
const ERROR = 'error'
const EVENT = 'event'
const INITIAL = 'initial'
const JSON = 'json'
const LOAD = 'load'
const LOADED = 'loaded'
const LOADEND = 'loadend'
const LOADSTART = 'loadstart'
const OVERRIDE_MIME_TYPE = 'overrideMimeType'
const PARSE = 'parse'
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

const initial = {type: INITIAL}

const eventTypes = [LOADSTART, PROGRESS, TIMEOUT, LOAD, ERROR]

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
          })
        ),
        V.accept
      )
    ))(function perform(args) {
  return K.stream(({emit, end}) => {
    const url = args.url
    const method = args.method
    const user = args.user
    const password = args.password
    const headers = args.headers
    const overrideMimeType = args[OVERRIDE_MIME_TYPE]
    const body = args.body
    const responseType = args[RESPONSE_TYPE]
    const timeout = args[TIMEOUT]
    const withCredentials = args[WITH_CREDENTIALS]

    const xhr = new XMLHttpRequest()
    let state = {xhr, up: initial, down: initial}
    const update = (dir, type) => event => {
      emit((state = L.set(dir, {type, event}, state)))
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
      url,
      true,
      isNil(user) ? null : user,
      isNil(password) ? null : password
    )
    if (responseType) {
      xhr[RESPONSE_TYPE] = responseType
      if (responseType === JSON && xhr[RESPONSE_TYPE] !== JSON)
        state = L.set(PARSE, true, state)
    }
    if (timeout) xhr[TIMEOUT] = timeout
    if (withCredentials) xhr[WITH_CREDENTIALS] = withCredentials
    for (const header in headers) {
      xhr.setRequestHeader(header, headers[header])
    }
    if (overrideMimeType) xhr[OVERRIDE_MIME_TYPE](overrideMimeType)
    xhr.send(isNil(body) ? null : body)
    return () => {
      if (!xhr[STATUS]) xhr.abort()
    }
  })
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
      L.modifyOp(url => ({url, headers: I.object0})),
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

export function perform(argsIn) {
  const args = normalizeOptions(argsIn)
  return (isObservable(args)
    ? args.flatMapLatest(performPlain)
    : performPlain(args)
  ).toProperty()
}

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
const hasFailedOn = is([ERROR])
const hasTimedOutOn = is([TIMEOUT])
const ended = [LOAD, ERROR, TIMEOUT]
const hasEndedOn = is(ended)

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
export const upHasFailed = setName(hasFailedOn(UP), 'upHasFailed')
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
export const hasFailed = setName(hasFailedOn(either), 'hasFailed')
export const hasTimedOut = setName(hasTimedOutOn(either), 'hasTimedOut')
export const loaded = setName(loadedOn(either), 'loaded')
export const total = setName(totalOn(either), 'total')
export const errors = setName(
  I.pipe2U(errorsWithOn(L.collect, either), skipAcyclicEquals),
  'errors'
)
export const response = setName(
  I.pipe2U(
    F.lift(({xhr, parse}) => {
      const response = xhr[RESPONSE]
      return parse ? tryParse(response) : response
    }),
    skipAcyclicEquals
  ),
  RESPONSE
)
export const responseFull = setName(getAfter(isDone, response), 'responseFull')
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
    isDone,
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
    responseType: JSON,
    headers: {'Content-Type': 'application/json'}
  }),
  'performJson'
)

export const getJson = setName(I.pipe2U(performJson, responseFull), 'getJson')

const typeIsSuccess = [TYPE, isOneOf([INITIAL, LOAD])]

export const hasSucceeded = setName(
  L.and(
    L.branch({
      event: [TYPE, L.is(LOADEND)],
      up: typeIsSuccess,
      down: typeIsSuccess,
      xhr: [STATUS, isHttpSuccessU]
    })
  ),
  'hasSucceeded'
)

const renamed =
  process.env.NODE_ENV === 'production'
    ? x => x
    : function renamed(fn, name) {
        let warned = false
        return setName(function deprecated(x) {
          if (!warned) {
            warned = true
            console.warn(
              'karet.xhr: `' + name + '` has been renamed to `' + fn.name + '`'
            )
          }
          return fn(x)
        }, name)
      }

export const downHasSucceeded = renamed(downHasCompleted, 'downHasSucceeded')
export const headersReceived = renamed(isStatusAvailable, 'headersReceived')
export const upHasSucceeded = renamed(upHasCompleted, 'upHasSucceeded')

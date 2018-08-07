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

const string = I.isString
const boolean = x => x === !!x
const number = I.isNumber

//

const setName =
  process.env.NODE_ENV === 'production'
    ? x => x
    : (to, name) => I.defineNameU(to, name)

const copyName =
  process.env.NODE_ENV === 'production'
    ? x => x
    : (to, from) => I.defineNameU(to, from.name)

const initial = {type: 'initial'}

const eventTypes = ['loadstart', 'progress', 'timeout', 'load', 'error']

const XHR = 'xhr'
const UP = 'up'
const DOWN = 'down'
const EVENT = 'event'

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
            headers: V.optional(
              V.cases(
                [I.isArray, V.arrayId(V.tuple(string, V.accept))],
                [x => null != x && I.isFunction(x.keys), V.accept],
                [V.accept]
              )
            ),
            overrideMimeType: V.optional(string),
            body: V.optional(V.accept),
            responseType: V.optional(string),
            timeout: V.optional(number),
            withCredentials: V.optional(boolean)
          })
        ),
        V.accept
      )
    ))(function perform({
  url,
  method = 'GET',
  user = null,
  password = null,
  headers,
  overrideMimeType,
  body = null,
  responseType,
  timeout,
  withCredentials
}) {
  return K.stream(({emit, end}) => {
    const xhr = new XMLHttpRequest()
    let state = {xhr, up: initial, down: initial}
    const update = (dir, type) => event => {
      emit((state = L.set(dir, {type, event}, state)))
    }
    eventTypes.forEach(type => {
      xhr.addEventListener(type, update(DOWN, type))
      xhr.upload.addEventListener(type, update(UP, type))
    })
    xhr.addEventListener('readystatechange', event => {
      emit((state = L.set(EVENT, event, state)))
    })
    xhr.addEventListener('loadend', event => {
      end(emit((state = L.set(EVENT, event, state))))
    })
    xhr.open(method, url, true, user, password)
    if (responseType) xhr.responseType = responseType
    if (timeout) xhr.timeout = timeout
    if (withCredentials) xhr.withCredentials = withCredentials
    if (null != headers) {
      if (I.isFunction(headers.keys)) {
        headers = Array.from(headers)
      }
      if (I.isArray(headers)) {
        headers.forEach(hv => {
          xhr.setRequestHeader(hv[0], hv[1])
        })
      } else {
        for (const header in headers) {
          xhr.setRequestHeader(header, headers[header])
        }
      }
    }
    if (overrideMimeType) xhr.overrideMimeType(overrideMimeType)
    xhr.send(body)
    return () => {
      if (!xhr.status) xhr.abort()
    }
  })
})

const toOptions = args => (I.isString(args) ? {url: args} : args)

export function perform(argsIn) {
  const args = F.combine([argsIn], toOptions)
  return (isObservable(args)
    ? args.flatMapLatest(performPlain)
    : performPlain(args)
  ).toProperty()
}

const isOneOf = I.curry((values, value) => values.includes(value))
const is = I.curry((values, dir) => L.get([dir, 'type', isOneOf(values)]))
const hasStarted = is(eventTypes)
const isProgressing = is(['progress', 'loadstart'])
const hasSucceeded = is(['load'])
const hasFailed = is(['error'])
const hasTimedOut = is(['timeout'])
const hasEnded = is(['load', 'error', 'timeout'])
const event = I.curry((prop, dir) => L.get([dir, EVENT, prop]))
const loaded = event('loaded')
const total = event('total')
const error = event('error')
const isHttpSuccessU = function isHttpSuccess(status) {
  return 200 <= status && status < 300
}

const getAfter = I.curryN(3, (predicate, getter) =>
  copyName(I.pipe2U(filter(predicate), getter), getter)
)

export const upHasStarted = setName(hasStarted(UP), 'upHasStarted')
export const upIsProgressing = setName(isProgressing(UP), 'upIsProgressing')
export const upHasSucceeded = setName(hasSucceeded(UP), 'upHasSucceeded')
export const upHasFailed = setName(hasFailed(UP), 'upHasFailed')
export const upHasTimedOut = setName(hasTimedOut(UP), 'upHasTimedOut')
export const upHasEnded = setName(hasEnded(UP), 'upHasEnded')
export const upLoaded = setName(loaded(UP), 'upLoaded')
export const upTotal = setName(total(UP), 'upTotal')
export const upError = setName(error(UP), 'upError')

export const downHasStarted = setName(hasStarted(DOWN), 'downHasStarted')
export const downIsProgressing = setName(
  isProgressing(DOWN),
  'downIsProgressing'
)
export const downHasSucceeded = setName(hasSucceeded(DOWN), 'downHasSucceeded')
export const downHasFailed = setName(hasFailed(DOWN), 'downHasFailed')
export const downHasTimedOut = setName(hasTimedOut(DOWN), 'downHasTimedOut')
export const downHasEnded = setName(hasEnded(DOWN), 'downHasEnded')
export const downLoaded = setName(loaded(DOWN), 'downLoaded')
export const downTotal = setName(total(DOWN), 'downTotal')
export const downError = setName(error(DOWN), 'downError')

export const readyState = setName(L.get([XHR, 'readyState']), 'readyState')
export const headersReceived = I.defineNameU(
  L.get([XHR, 'readyState', state => 2 <= state]),
  'headersReceived'
)
export const isDone = I.defineNameU(
  L.get([EVENT, 'type', L.is('loadend')]),
  'isDone'
)
export const response = setName(
  I.pipe2U(L.get([XHR, 'response']), skipDuplicates(I.acyclicEqualsU)),
  'response'
)
export const responseFull = setName(getAfter(isDone, response), 'responseFull')
export const responseType = setName(
  L.get([XHR, 'responseType']),
  'responseType'
)
export const responseURL = setName(L.get([XHR, 'responseURL']), 'responseURL')
export const responseText = setName(
  L.get([
    XHR,
    L.when(L.get(['responseType', isOneOf(['', 'text'])])),
    'responseText'
  ]),
  'responseText'
)
export const responseXML = getAfter(
  isDone,
  setName(
    L.get([
      XHR,
      L.when(L.get(['responseType', isOneOf(['', 'document'])])),
      'responseXML'
    ]),
    'responseXML'
  )
)
export const status = setName(L.get([XHR, 'status']), 'status')
export const statusIsHttpSuccess = setName(
  L.get([XHR, 'status', isHttpSuccessU]),
  'statusIsHttpSuccess'
)
export const statusText = setName(L.get([XHR, 'statusText']), 'statusText')
export const responseHeader = I.curryN(2, function responseHeader(header) {
  return getAfter(
    headersReceived,
    setName(
      L.get([XHR, L.reread(xhr => xhr.getResponseHeader(header))]),
      'responseHeader'
    )
  )
})
export const allResponseHeaders = getAfter(
  headersReceived,
  setName(
    L.get([XHR, L.reread(xhr => xhr.getAllResponseHeaders())]),
    'allResponseHeaders'
  )
)
export const timeout = setName(L.get([XHR, 'timeout']), 'timeout')
export const withCredentials = setName(
  L.get([XHR, 'withCredentials']),
  'withCredentials'
)

export const isHttpSuccess = F.lift(isHttpSuccessU)

const mergeOptions = F.lift(function mergeOptions(defaults, overrides) {
  return I.assign({}, toOptions(defaults), toOptions(overrides))
})

export const performWith = I.curry(function performWith(defaults, overrides) {
  return perform(mergeOptions(defaults, overrides))
})

export const getJson = setName(
  I.pipe2U(performWith({responseType: 'json'}), responseFull),
  'getJson'
)

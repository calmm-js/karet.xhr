import * as I from 'infestines'
import * as K from 'kefir'
import * as L from 'kefir.partial.lenses'
import * as U from 'karet.util'

const INITIAL = 'initial'
const initial = {type: INITIAL}

const UP = 'up'
const DOWN = 'down'
const TYPE = 'type'
const EVENT = 'event'
const LOADED = 'loaded'
const TOTAL = 'total'
const XHR = 'xhr'

const LOADSTART = 'loadstart'
const PROGRESS = 'progress'
const TIMEOUT = 'timeout'
const LOAD = 'load'
const ERROR = 'error'

const eventTypes = [LOADSTART, PROGRESS, TIMEOUT, LOAD, ERROR]

export const perform = U.through(
  U.template,
  U.flatMapLatest(
    ({
      url,
      method = 'GET',
      headers = I.array0,
      body = null,
      responseType = '',
      timeout = 0,
      withCredentials = false
    }) =>
      K.stream(({emit, end}) => {
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
          emit(L.set(EVENT, event, state))
        })
        xhr.addEventListener('loadend', event => {
          end(emit(L.set(EVENT, event, state)))
        })
        xhr.open(method, url)
        xhr.responseType = responseType
        xhr.timeout = timeout
        xhr.withCredentials = withCredentials
        headers.forEach(hv => {
          xhr.setRequestHeader(hv[0], hv[1])
        })
        xhr.send(body)
        return () => {
          xhr.abort()
        }
      })
  ),
  U.toProperty
)

const is = values => dir => L.get([dir, TYPE, value => values.includes(value)])
const hasStarted = is(eventTypes)
const isProgressing = is([PROGRESS, LOADSTART])
const hasSucceeded = is([LOAD])
const hasFailed = is([ERROR])
const hasTimedOut = is([TIMEOUT])
const hasEnded = is([LOAD, ERROR, TIMEOUT])
const loaded = dir => L.get([dir, EVENT, LOADED])
const total = dir => L.get([dir, EVENT, TOTAL])

export const upHasStarted = hasStarted(UP)
export const upIsProgressing = isProgressing(UP)
export const upHasSucceeded = hasSucceeded(UP)
export const upHasFailed = hasFailed(UP)
export const upHasTimedOut = hasTimedOut(UP)
export const upHasEnded = hasEnded(UP)
export const upLoaded = loaded(UP)
export const upTotal = total(UP)

export const downHasStarted = hasStarted(DOWN)
export const downIsProgressing = isProgressing(DOWN)
export const downHasSucceeded = hasSucceeded(DOWN)
export const downHasFailed = hasFailed(DOWN)
export const downHasTimedOut = hasTimedOut(DOWN)
export const downHasEnded = hasEnded(DOWN)
export const downLoaded = loaded(DOWN)
export const downTotal = total(DOWN)

export const readyState = L.get([XHR, 'readyState'])
export const response = U.through(
  L.get([XHR, 'response']),
  U.skipDuplicates(I.acyclicEqualsU)
)
export const responseType = L.get([XHR, 'responseType'])
export const status = L.get([XHR, 'status'])
export const statusText = L.get([XHR, 'statusText'])

export const isHttpSuccess = U.lift(status => 200 <= status && status < 300)

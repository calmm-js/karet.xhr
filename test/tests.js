import * as I from 'infestines'
import * as K from 'kefir'
import * as R from 'ramda'

import * as XHR from './generated/dist/karet.xhr.es.js'

function show(x) {
  switch (typeof x) {
    case 'string':
    case 'object':
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const toExpr = f =>
  f
    .toString()
    .replace(/\s+/g, ' ')
    .replace(/^\s*function\s*\(\s*\)\s*{\s*(return\s*)?/, '')
    .replace(/\s*;?\s*}\s*$/, '')
    .replace(/function\s*(\([a-zA-Z0-9, ]*\))\s*/g, '$1 => ')
    .replace(/\(([^),]+)\) =>/, '$1 =>')
    .replace(/{\s*return\s*([^{;]+)\s*;\s*}/g, '$1')
    .replace(/\(0, [^.]*[.]([^)]*)\)/g, '$1')
    .replace(/\$\d+/g, '')

const testEq = (expect, thunk) =>
  it(`${toExpr(thunk)} => ${show(expect)}`, done => {
    const actual = thunk()
    function check(actual) {
      if (!R.equals(actual, expect)) {
        done(new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`))
      } else {
        done()
      }
    }
    if (actual instanceof K.Property) {
      actual.bufferBy(K.never()).observe({value: check, error: check})
    } else {
      check(actual)
    }
  })

const testThrows = thunk =>
  it(`${toExpr(thunk)} => throws`, () => {
    try {
      thunk()
    } catch (_) {
      return
    }
    throw Error('Did not throw as expected.')
  })

if (process.env.NODE_ENV !== 'production') {
  describe('Argument validation', () => {
    testThrows(() => XHR.perform({}))
    testThrows(() =>
      XHR.perform({
        url: {not: 'a string'},
        headers: new Map(),
        withCredentials: 'not boolean',
        unknownParameter: 'bar'
      })
    )
  })

  describe('Names of exported functions', () => {
    it('match their export names', () => {
      for (const k in XHR) {
        const v = XHR[k]
        if (R.is(Function, v) && v.name !== k)
          throw Error(`Name of exported function '${k}' was '${v.name}'`)
      }
    })
  })
}

describe('XHR', () => {
  const startingWithNonXHRs = xhr =>
    K.concat([K.sequentially(0, [false, {}, undefined]), xhr]).toProperty()

  testEq(['', 'Hello, world!'], () =>
    XHR.responseText(
      XHR.perform({
        url: 'http://localhost:3000/text',
        method: 'GET',
        timeout: 10000,
        withCredentials: true
      })
    )
  )
  testEq(['world'], () =>
    XHR.responseHeader('user', XHR.perform({url: 'http://localhost:3000/text'}))
  )
  testEq(['got something'], () =>
    XHR.allResponseHeaders(
      XHR.perform({url: 'http://localhost:3000/text'})
    ).map(text => (text ? 'got something' : text))
  )
  testEq([false, true], () =>
    XHR.statusIsHttpSuccess(XHR.perform({url: 'http://localhost:3000/text'}))
  )
  testEq(['Hello, mocha!'], () =>
    XHR.response(
      XHR.perform({
        url: K.constant('http://localhost:3000/text'),
        timeout: 10000,
        overrideMimeType: 'text/plain',
        user: 'browser',
        password: 'testing',
        headers: K.constant({user: 'mocha'})
      })
    )
  )
  testEq([{user: 'world'}], () =>
    XHR.getJson(K.constant('http://localhost:3000/json'))
  )
  testEq(['http://localhost:3000/json'], () =>
    XHR.responseURL(XHR.performJson('http://localhost:3000/json'))
  )
  testEq([true, false], () =>
    XHR.isProgressing(XHR.performJson({url: 'http://localhost:3000/json'}))
  )
  testEq([false, true, false], () =>
    XHR.isProgressing(
      startingWithNonXHRs(XHR.performJson({url: 'http://localhost:3000/json'}))
    )
  )
  testEq([0, 16], () =>
    XHR.loaded(
      startingWithNonXHRs(XHR.performJson({url: 'http://localhost:3000/json'}))
    )
  )
  testEq([0, 16], () =>
    XHR.total(
      startingWithNonXHRs(XHR.performJson({url: 'http://localhost:3000/json'}))
    )
  )
  testEq([[]], () =>
    XHR.errors(
      startingWithNonXHRs(XHR.performJson({url: 'http://localhost:3000/json'}))
    )
  )
  testEq([false], () =>
    XHR.hasFailed(
      startingWithNonXHRs(XHR.performJson({url: 'http://localhost:3000/json'}))
    )
  )
  testEq([false, true], () =>
    XHR.hasSucceeded(
      startingWithNonXHRs(XHR.performJson({url: 'http://localhost:3000/json'}))
    )
  )
  testEq([{user: '101'}], () =>
    XHR.response(
      XHR.perform({
        url: 'http://localhost:3000/json',
        responseType: 'json',
        headers: K.constant(new Map([['user', 101]]))
      })
    )
  )
  testEq(['[object Object]'], () =>
    XHR.responseXML(
      XHR.perform(
        K.constant({
          url: 'http://localhost:3000/xml',
          responseType: 'document',
          headers: new Map([['user', {}]])
        })
      )
    ).map(xml => xml.firstChild.textContent)
  )
  testEq(['Still there?'], () =>
    XHR.response(
      XHR.perform({url: 'http://localhost:3000/slow', timeout: 2000})
    )
  )
  testEq([], () =>
    XHR.response(XHR.perform({url: 'http://localhost:3000/slow', timeout: 200}))
  )
  testEq([false, true], () =>
    XHR.hasTimedOut(
      XHR.perform({url: 'http://localhost:3000/slow', timeout: 200})
    )
  )
  testEq(['failed'], () =>
    XHR.getJson({
      url: 'http://localhost:3000/slow',
      timeout: 200
    })
      .flatMapErrors(_ => K.constant('failed'))
      .toProperty()
  )
  testEq([false], () =>
    XHR.hasSucceeded(
      XHR.perform({url: 'http://localhost:3000/slow', timeout: 200})
    )
  )
  testEq([false], () =>
    XHR.hasTimedOut(
      XHR.perform({url: 'http://localhost:3000/slow', timeout: 2000})
    ).takeUntilBy(K.later(200, 'anything'))
  )
  testEq([{returnTo: 'sender'}], () =>
    XHR.response(
      XHR.performJson({
        url: 'http://localhost:3000/echo',
        method: 'POST',
        body: JSON.stringify({returnTo: 'sender'})
      })
    )
  )
  testEq([true, 'Still there?'], () =>
    XHR.perform({url: 'http://localhost:3000/slow', timeout: 2000})
      .map(xhr => {
        try {
          return XHR.response(xhr)
        } catch (e) {
          return e.message === 'downHasCompleted'
        }
      })
      .skipDuplicates(R.equals)
  )
  testEq([true], () =>
    XHR.perform({url: 'http://localhost:3000/text'})
      .map(XHR.isDone)
      .filter(R.identity)
  )
  testEq([null], () => XHR.getJson('http://localhost:3000/text'))
  testEq([{user: 'WORLD'}], () =>
    I.seq(
      XHR.performJson({
        url: 'http://localhost:3000/echo',
        method: 'POST',
        body: JSON.stringify({url: 'HTTP://LOCALHOST:3000/JSON'})
      }),
      XHR.ap(XHR.of(R.map(R.toLower))),
      XHR.chain(({url}) => XHR.performJson(url)),
      XHR.map(R.map(R.toUpper)),
      XHR.result
    )
  )
  testEq([['Hello, world!', {user: 'world'}]], () =>
    XHR.result(
      XHR.apply(R.pair, [
        XHR.perform('http://localhost:3000/text'),
        XHR.performJson('http://localhost:3000/json')
      ])
    )
  )
  testEq(
    {
      allResponseHeaders: '',
      errors: [],
      hasFailed: false,
      hasTimedOut: false,
      isDone: true,
      isProgressing: false,
      isStatusAvailable: true,
      loaded: 0,
      responseHeader: null,
      status: 200,
      statusIsHttpSuccess: true,
      statusText: 'OK',
      total: 0
    },
    () =>
      R.map(fn => fn(XHR.of(101)), {
        allResponseHeaders: XHR.allResponseHeaders,
        errors: XHR.errors,
        hasFailed: XHR.hasFailed,
        hasTimedOut: XHR.hasTimedOut,
        isDone: XHR.isDone,
        isProgressing: XHR.isProgressing,
        isStatusAvailable: XHR.isStatusAvailable,
        loaded: XHR.loaded,
        responseHeader: XHR.responseHeader('foo'),
        status: XHR.status,
        statusIsHttpSuccess: XHR.statusIsHttpSuccess,
        statusText: XHR.statusText,
        total: XHR.total
      })
  )
})

describe('XHR deprecated', () => {
  testEq([false, true], () =>
    XHR.downHasSucceeded(XHR.perform('http://localhost:3000/json'))
  )
})

describe('IE11 workarounds', () => {
  let progressEvent = null
  let progressAction = null
  const addEventListener = target => (type, action) => {
    if (type === 'progress') {
      progressAction = action
      target.addEventListener(type, e => {
        progressEvent = e
        action(e)
      })
    } else if (type === 'load') {
      target.addEventListener(type, e => {
        action(e)
        if (progressEvent && progressAction) {
          progressAction(progressEvent)
        }
      })
    } else {
      target.addEventListener(type, action)
    }
  }
  const uploadHandler = {
    get: (target, prop) =>
      prop === 'addEventListener' ? addEventListener(target) : target.prop
  }
  class XMLHttpRequestIE11 extends XMLHttpRequest {
    set responseType(type) {
      if (type !== 'json') super.responseType = type
    }
    get upload() {
      return new Proxy(super.upload, uploadHandler)
    }
  }
  testEq([{user: 'WORLD'}], () => {
    window.XMLHttpRequest = XMLHttpRequestIE11
    return I.seq(
      XHR.performJson({
        url: 'http://localhost:3000/echo',
        method: 'POST',
        body: JSON.stringify({url: 'HTTP://LOCALHOST:3000/JSON'})
      }),
      XHR.ap(XHR.of(R.map(R.toLower))),
      XHR.chain(({url}) => XHR.performJson(url)),
      XHR.map(R.map(R.toUpper)),
      XHR.result
    )
  })
  testEq([null], () => {
    window.XMLHttpRequest = XMLHttpRequestIE11
    return XHR.getJson('http://localhost:3000/text')
  })
})

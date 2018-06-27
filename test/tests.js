import * as K from 'kefir'
import * as R from 'ramda'

import * as XHR from '../dist/karet.xhr.cjs'

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

const testEq = (expect, thunk) =>
  it(`${toExpr(thunk)} => ${show(expect)}`, done => {
    const actual = thunk()
    function check(actual) {
      if (!R.equals(actual, expect))
        throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
      done()
    }
    if (actual instanceof K.Property) {
      actual.take(1).observe({value: check, error: check})
    } else {
      check(actual)
    }
  })

const testThrows = thunk =>
  it(`${toExpr(thunk)} => theows`, () => {
    try {
      thunk()
    } catch (_) {
      return
    }
    throw Error('Did not throw as expected.')
  })

describe('smoke test', () => {
  testEq(
    true,
    () =>
      XHR.perform({url: 'https://github.com/calmm-js/karet.xhr'}) instanceof
      K.Property
  )
})

if (process.env.NODE_ENV !== 'production') {
  describe('argument validation', () => {
    testThrows(() => XHR.perform({}))
    testThrows(() => XHR.perform({url: 'foo', unknownParameter: 'bar'}))
  })
}

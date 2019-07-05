# <a id="karet-xhr"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#karet-xhr) [Karet XHR](#karet-xhr) &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.xhr.svg?style=social)](https://github.com/calmm-js/karet.xhr)

This library allows one to [_declare_](#declare)
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)s,
[_compose_](#compose) them, and [_observe_](#observe) them through
[Kefir](https://kefirjs.github.io/kefir/)
[properties](https://kefirjs.github.io/kefir/#about-observables). This makes it
easy to implement many kinds of use cases ranging from just getting the response
data to visualizing the progress of non-trivial compositions of ongoing upload
and/or download requests and displaying potential errors.

Examples:

- The [Giphy](https://codesandbox.io/s/q9j8v8w1nq) CodeSandbox uses this library
  to do simple JSON GET requests.
- The [GitHub repository search](https://codesandbox.io/s/l5271q0r2l)
  CodeSandbox uses this library to do JSON GET requests and exercises much of
  the API of this library as an example.

[![npm version](https://badge.fury.io/js/karet.xhr.svg)](http://badge.fury.io/js/karet.xhr)
[![Build Status](https://travis-ci.org/calmm-js/karet.xhr.svg?branch=master)](https://travis-ci.org/calmm-js/karet.xhr)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.xhr/master.svg)](https://codecov.io/github/calmm-js/karet.xhr?branch=master)
[![](https://david-dm.org/calmm-js/karet.xhr.svg)](https://david-dm.org/calmm-js/karet.xhr)
[![](https://david-dm.org/calmm-js/karet.xhr/dev-status.svg)](https://david-dm.org/calmm-js/karet.xhr?type=dev)

## <a id="contents"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#contents) [Contents](#contents)

- [Reference](#reference)
  - [Just give me the data!](#just-give-me-the-data)
    - [`XHR.getJson(url | {url[, ...options]}) ~> varies`](#XHR-getJson)
  - [Declare](#declare)
    - [`XHR.perform(url | {url[, ...options]}) ~> xhr`](#XHR-perform)
    - [`XHR.performJson(url | {url[, ...options]}) ~> xhr`](#XHR-performJson)
    - [`XHR.performWith(url | {...options}, url | {...options}) ~> xhr`](#XHR-performWith)
  - [Compose](#compose)
    - [Basic combinators](#basic-combinators)
      - [`XHR.ap(xhrAtoB, xhrA) ~> xhrB`](#XHR-ap)
      - [`XHR.apParallel(xhrAtoB, xhrA) ~> xhrB`](#XHR-apParallel)
      - [`XHR.chain(A => xhrB, xhrA) ~> xhrB`](#XHR-chain)
      - [`XHR.map(A => B, xhrA) ~> xhrB`](#XHR-map)
      - [`XHR.of(A) ~> xhrA`](#XHR-of)
    - [Additional combinators](#additional-combinators)
      - [`XHR.apply((...As) => B, [...xhrAs]) ~> xhrB`](#XHR-apply)
      - [`XHR.tap(A => ignored, xhrA) ~> xhrA`](#XHR-tap)
      - [`XHR.template([ ... xhr ... ] | { ... xhr ... }) ~> xhr`](#XHR-template)
    - [Algebras](#algebras)
      - [`XHR.IdentityParallel ~> applicative`](#XHR-IdentityParallel)
      - [`XHR.IdentitySucceeded ~> monad`](#XHR-IdentitySucceeded)
      - [`XHR.Parallel ~> applicative`](#XHR-Parallel)
      - [`XHR.Succeeded ~> monad`](#XHR-Succeeded)
  - [Observe](#observe)
    - [Result](#result)
      - [`XHR.hasFailed(xhr) ~> boolean`](#XHR-hasFailed)
      - [`XHR.hasSucceeded(xhr) ~> boolean`](#XHR-hasSucceeded)
      - [`XHR.result(xhrA) ~> A`](#XHR-result)
    - [Overall state](#overall-state)
      - [Progression](#progression)
        - [`XHR.isDone(xhr) ~> boolean`](#XHR-isDone)
        - [`XHR.isProgressing(xhr) ~> boolean`](#XHR-isProgressing)
        - [`XHR.isStatusAvailable(xhr) ~> boolean`](#XHR-isStatusAvailable)
      - [End state](#end-state)
        - [`XHR.hasErrored(xhr) ~> boolean`](#XHR-hasErrored)
        - [`XHR.hasTimedOut(xhr) ~> boolean`](#XHR-hasTimedOut)
      - [Errors on failure](#errors-on-failure)
        - [`XHR.errors(xhr) ~> [...exceptions]`](#XHR-errors)
      - [Request status](#request-status)
        - [`XHR.status(xhr) ~> number`](#XHR-status)
        - [`XHR.statusIsHttpSuccess(xhr) ~> boolean`](#XHR-statusIsHttpSuccess)
        - [`XHR.statusText(xhr) ~> string`](#XHR-statusText)
      - [Data transfer](#data-transfer)
        - [`XHR.loaded(xhr) ~> number`](#XHR-loaded)
        - [`XHR.total(xhr) ~> number`](#XHR-total)
      - [Response headers](#response-headers)
        - [`XHR.allResponseHeaders(xhr) ~> string`](#XHR-allResponseHeaders)
        - [`XHR.responseHeader(header, xhr) ~> string`](#XHR-responseHeader)
      - [Response data](#response-data)
        - [`XHR.response(xhr) ~> varies`](#XHR-response)
        - [`XHR.responseText(xhr) ~> string`](#XHR-responseText)
        - [`XHR.responseXML(xhr) ~> document`](#XHR-responseXML)
      - [Response URL](#response-url)
        - [`XHR.responseURL(xhr) ~> string`](#XHR-responseURL)
      - [Request parameters](#request-parameters)
        - [`XHR.responseType(xhr) ~> string`](#XHR-responseType)
        - [`XHR.timeout(xhr) ~> number`](#XHR-timeout)
        - [`XHR.withCredentials(xhr) ~> boolean`](#XHR-withCredentials)
      - [Ready state](#ready-state)
        - [`XHR.readyState(xhr) ~> number`](#XHR-readyState)
    - [Download state](#download-state)
      - [`XHR.downError(xhr) ~> exception`](#XHR-downError)
      - [`XHR.downHasCompleted(xhr) ~> boolean`](#XHR-downHasCompleted)
      - [`XHR.downHasEnded(xhr) ~> boolean`](#XHR-downHasEnded)
      - [`XHR.downHasErrored(xhr) ~> boolean`](#XHR-downHasErrored)
      - [`XHR.downHasStarted(xhr) ~> boolean`](#XHR-downHasStarted)
      - [`XHR.downHasTimedOut(xhr) ~> boolean`](#XHR-downHasTimedOut)
      - [`XHR.downIsProgressing(xhr) ~> boolean`](#XHR-downIsProgressing)
      - [`XHR.downLoaded(xhr) ~> number`](#XHR-downLoaded)
      - [`XHR.downTotal(xhr) ~> number`](#XHR-downTotal)
    - [Upload state](#upload-state)
      - [`XHR.upError(xhr) ~> exception`](#XHR-upError)
      - [`XHR.upHasCompleted(xhr) ~> boolean`](#XHR-upHasCompleted)
      - [`XHR.upHasEnded(xhr) ~> boolean`](#XHR-upHasEnded)
      - [`XHR.upHasErrored(xhr) ~> boolean`](#XHR-upHasErrored)
      - [`XHR.upHasStarted(xhr) ~> boolean`](#XHR-upHasStarted)
      - [`XHR.upHasTimedOut(xhr) ~> boolean`](#XHR-upHasTimedOut)
      - [`XHR.upIsProgressing(xhr) ~> boolean`](#XHR-upIsProgressing)
      - [`XHR.upLoaded(xhr) ~> number`](#XHR-upLoaded)
      - [`XHR.upTotal(xhr) ~> number`](#XHR-upTotal)
  - [Auxiliary](#auxiliary)
    - [`XHR.isHttpSuccess(number) ~> boolean`](#XHR-isHttpSuccess)
    - [`XHR.isXHR(any) ~> boolean`](#XHR-isXHR)

## <a id="reference"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#reference) [Reference](#reference)

The interface of this library consists of named exports. Typically one just
imports the library as:

```jsx
import * as XHR from 'karet.xhr'
```

Using this library, one [declares](#declare) observable
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)s,
[composes](#compose) them, and then [observes](#observe) the ongoing XHR using
the accessors for the [result](#result), [overall](#overall-state),
[download](#download-state), and [upload](#upload-state) state.

### <a id="just-give-me-the-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#just-give-me-the-data) [Just give me the data!](#just-give-me-the-data)

If you just want to GET some JSON...

#### <a id="XHR-getJson"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-getJson) [`XHR.getJson(url | {url,[, ...options]}) ~> varies`](#XHR-getJson)

`XHR.getJson` returns an observable that emits the [full response](#XHR-result)
after the [XHR has succeeded](#XHR-hasSucceeded). In case the XHR produces an
error or times out, the XHR is emitted as an error event. See
[`XHR.perform`](#XHR-perform) for the options.

Note that this function is provided for simplistic usages where one does not
need the full composability and observability advantages of this library.

For example:

```js
I.seq(
  XHR.getJson(`https://api.github.com/search/users?q=polytypic`),
  R.map(L.get(L.query('html_url'))),
  log
)
```

### <a id="declare"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#declare) [Declare](#declare)

XHRs are declared by specifying all the parameters that affect the execution of
an XHR to [`XHR.perform`](#XHR-perform), which then returns an observable
[property](https://kefirjs.github.io/kefir/#about-observables) that can be
subscribed to in order to perform the declared XHR.

#### <a id="XHR-perform"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-perform) [`XHR.perform(url | {url[, ...options]}) ~> xhr`](#XHR-perform)

`XHR.perform` creates an observable
[property](https://kefirjs.github.io/kefir/#about-observables) that represents
the state of an ongoing
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
The request is started once the property is subscribed to and is automatically
[aborted](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort)
in case the property is fully unsubscribed from before it has ended. See also
[`XHR.performWith`](#XHR-performWith) and [`XHR.performJson`](#XHR-performJson).

Only the `url` parameter is required and can be passed as a string. Other
parameters have their XHR default values:

| Parameter                                                                                              | Default     | Explanation                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`method`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open)                       | `'GET'`     | [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to use.                                                                                                                                                                                                           |
| [`user`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open)                         | `null`      | User name for authentication.                                                                                                                                                                                                                                                                      |
| [`password`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open)                     | `null`      | Password for authentication.                                                                                                                                                                                                                                                                       |
| [`headers`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader)          | `null`      | An array of `[header, value]` pairs, a plain object of `{header: value}` properties, a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), or a [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object mapping headers to values. |
| [`overrideMimeType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType) | `undefined` | If specified overrides the MIME type provided by the server.                                                                                                                                                                                                                                       |
| [`body`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send)                         | `null`      | A body of data to be sent.                                                                                                                                                                                                                                                                         |
| [`responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)         | `''`        | Specifies type of [response](#XHR-response) data.                                                                                                                                                                                                                                                  |
| [`timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout)                   | `0`         | Number of milliseconds or `0` for infinite.                                                                                                                                                                                                                                                        |
| [`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)   | `false`     | Whether cross-site `Access-Control` should use credentials.                                                                                                                                                                                                                                        |

In addition to a plain object, the argument to `XHR.perform` is allowed to be an
observable property or contain observable properties, in which case the property
created by `XHR.perform` performs the XHR with the
[latest](https://kefirjs.github.io/kefir/#flat-map-latest) argument values.

Note that typically one does not explicitly subscribe to the property, but one
rather computes a desired view of the property, such as a view of the succeeded
[response](#XHR-result), and combines that further into some more interesting
property.

WARNING: Setting `responseType` to `'json'` is not supported by IE 11. This
library implements a workaround by calling `JSON.parse` on the returned data in
case setting `responseType` to `'json'` fails. In case the response does not
parse, then [`XHR.response`](#XHR-response) returns `null`.

#### <a id="XHR-performJson"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-peformJson) [`XHR.performJson(url | {url[, ...options]}) ~> xhr`](#XHR-performJson)

`XHR.performJson` is shorthand for [`XHR.performWith({responseType: 'json', headers: {'Content-Type': 'application/json'}})`](#XHR-performWith).

#### <a id="XHR-performWith"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-performWith) [`XHR.performWith(url | {...options}, url | {...options}) ~> xhr`](#XHR-performWith)

`XHR.performWith` is a curried function that allows one to define a
[`XHR.perform`](#XHR-perform) like function with default parameters. The
defaults (first parameter) are merged with the overrides (second parameter).
Headers are also merged. See [`XHR.perform`](#XHR-perform) for the parameters.

For example:

```jsx
const get = XHR.performWith({responseType: 'json', timeout: 30 * 1000})
// ...
get(url)
```

### <a id="compose"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#compose) [Compose](#compose)

Multiple XHRs can be composed together to appear and be treated simply as a
single XHR.

#### <a id="basic-combinators"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#basic-combinators) [Basic combinators](#basic-combinators)

##### <a id="XHR-ap"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-ap) [`XHR.ap(xhrAtoB, xhrA) ~> xhrB`](#XHR-ap)

`XHR.ap` implements a static land compatible
[`ap`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#apply)
function for composing succeeding XHRs. The XHRs are performed sequentially.
See also [`XHR.apParallel`](#XHR-apParallel) and [`XHR.apply`](#XHR-apply).

##### <a id="XHR-apParallel"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-apParallel) [`XHR.apParallel(xhrAtoB, xhrA) ~> xhrB`](#XHR-apParallel)

`XHR.apParallel` implements a static land compatible
[`ap`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#apply)
function for composing succeeding XHRs. The XHRs are performed in parallel.
See also [`XHR.ap`](#XHR-ap) and [`XHR.apply`](#XHR-apply).

##### <a id="XHR-chain"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-chain) [`XHR.chain(A => xhrB, xhrA) ~> xhrB`](#XHR-chain)

`XHR.chain` implements a static land compatible
[`chain`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#chain)
function for composing succeeding XHRs.

##### <a id="XHR-map"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-map) [`XHR.map(A => B, xhrA) ~> xhrB`](#XHR-map)

`XHR.map` implements a static land compatible
[`map`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#functor)
function for composing succeeding XHRs.

##### <a id="XHR-of"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-of) [`XHR.of(A) ~> xhrA`](#XHR-of)

`XHR.of` implements a static land compatible
[`of`](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative)
function for composing succeeding XHRs.

#### <a id="additional-combinators"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#additional-combinators) [Additional combinators](#additional-combinators)

##### <a id="XHR-apply"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-apply) [`XHR.apply((...As) => B, [...xhrAs]) ~> xhrB`](#XHR-apply)

`XHR.apply` maps the given XHRs through the given function. Unlike with
[`XHR.ap`](#XHR-ap), the XHRs are performed in parallel.

##### <a id="XHR-tap"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-tap) [`XHR.tap(A => ignored, xhrA) ~> xhrA`](#XHR-tap)

`XHR.tap` wraps the XHR so that the given action is called with the response
after the XHR has succeeded. If the XHR does not succeed, the action will not
be called.

Note that `XHR.tap(action)` is roughly equivalent to

```jsx
XHR.map(response => {
  action(response)
  return response
})
```

##### <a id="XHR-template"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-template) [`XHR.template([ ... xhr ... ] | { ... xhr ... }) ~> xhr`](#XHR-template)

`XHR.template` transforms a nested template of plain arrays and objects possibly
containing XHRs into a XHR. The XHRs are performed in parallel.

#### <a id="algebras"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#algebras) [Algebras](#algebras)

[Static Land](https://github.com/rpominov/static-land) compatible algebras can
be used with other Static Land compatible libraries such as [Partial
Lenses](https://github.com/calmm-js/partial.lenses/) to perform more complex
XHRs.

For example:

```js
I.seq(
  XHR.performJson(
    `https://api.github.com/search/repositories?q=user:calmm-js&sort=stars`
  ),
  XHR.map(
    L.collect([
      'items',
      L.limit(2, L.flat(L.when(R.has('description')))),
      L.pick({
        description: 'description',
        url: 'svn_url',
        issues: 'issues_url'
      })
    ])
  ),
  XHR.chain(
    L.traverse(
      XHR.Parallel,
      issues =>
        I.seq(
          XHR.performJson(issues.replace(/{.*}$/, '')),
          XHR.map(
            L.collect(
              L.limit(3, L.flat(L.pick({title: 'title', url: 'html_url'})))
            )
          )
        ),
      [L.elems, 'issues']
    )
  ),
  XHR.result,
  log
)
```

##### <a id="XHR-IdentityParallel"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-IdentityParallel) [`XHR.IdentityParallel ~> applicative`](#XHR-IdentityParallel)

`XHR.IdentityParallel` is a static land compatible
[applicative](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative)
that manipulates XHRs like [`XHR.Parallel`](#XHR-Parallel) or plain data.

##### <a id="XHR-IdentitySucceeded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-IdentitySucceeded) [`XHR.IdentitySucceeded ~> monad`](#XHR-IdentitySucceeded)

`XHR.IdentitySucceeded` is a static land compatible
[monad](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
that manipulates XHRs like [`XHR.Succeeded`](#XHR-Succeeded) or plain data.

##### <a id="XHR-Parallel"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-Parallel) [`XHR.Parallel ~> applicative`](#XHR-Parallel)

`XHR.Parallel` is a static land compatible
[applicative](https://github.com/rpominov/static-land/blob/master/docs/spec.md#applicative)
that allows one to compose parallel XHR requests. In case any XHR fails, the
composed XHR produces the first failed XHR. In case all XHRs succeed, the
composed XHR produces the combined XHR as the [result](#XHR-result).

##### <a id="XHR-Succeeded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-Succeeded) [`XHR.Succeeded ~> monad`](#XHR-Succeeded)

`XHR.Succeeded` is a static land compatible
[monad](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
comprised of the [`XHR.ap`](#XHR-ap), [`XHR.chain`](#XHR-chain),
[`XHR.map`](#XHR-map), and [`XHR.of`](#XHR-of) combinators that allows one to
compose sequences of XHR requests that stop as soon as the first XHR does not
[succeed](#XHR-hasSucceeded).

### <a id="observe"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#observe) [Observe](#observe)

Ongoing XHRs can be observed both for their varying properties such as [the
number of bytes transferred](#XHR-loaded) and for their [results](#XHR-result).

#### <a id="result"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#result) [Result](#result)

##### <a id="XHR-hasFailed"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasFailed) [`XHR.hasFailed(xhr) ~> boolean`](#XHR-hasFailed)

`XHR.hasFailed` returns a possibly observable boolean property of an ongoing XHR
that is true if its HTTP status does not indicate [success](#XHR-isHttpSuccess)
or the download or the upload operation has [errored](#XHR-hasErrored) or [timed
out](#XHR-hasTimedOut).

##### <a id="XHR-hasSucceeded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasSucceeded) [`XHR.hasSucceeded(xhr) ~> boolean`](#XHR-hasSucceeded)

`XHR.hasSucceeded` returns a possibly observable boolean property of an ongoing
XHR that is true if the XHR [is done](#XHR-isDone), its HTTP [status indicates
success](#XHR-statusIsHttpSuccess), and neither
[download](#XHR-downHasCompleted) or [upload](#XHR-upHasCompleted) has errored
or timed out.

##### <a id="XHR-result"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-result) [`XHR.result(xhrA) ~> A`](#XHR-result)

`XHR.result` returns the response of a [succeeded](#XHR-hasSucceeded) XHR. Note
that [`XHR.response`](#XHR-response) allows one to obtain the response before
the XHR [is done](#XHR-isDone) and even when the XHR has (partially) failed.

#### <a id="overall-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#overall-state) [Overall state](#overall-state)

##### <a id="progression"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#progression) [Progression](#progression)

###### <a id="XHR-isStatusAvailable"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isStatusAvailable) [`XHR.isStatusAvailable(xhr) ~> boolean`](#XHR-isStatusAvailable)

`XHR.isStatusAvailable` returns a possibly observable boolean property that
tells whether HTTP status and response headers have been received and can be
obtained. See also [`XHR.status`](#XHR-status),
[`XHR.statusText`](#XHR-statusText),
[`XHR.allResponseHeaders`](#XHR-allResponseHeaders), and
[`XHR.responseHeader`](#XHR-responseHeader).

###### <a id="XHR-isDone"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isDone) [`XHR.isDone(xhr) ~> boolean`](#XHR-isDone)

`XHR.isDone` returns a possibly observable boolean property that tells whether
the XHR operation is complete (whether success or failure). See also
[`XHR.hasSucceeded`](#XHR-hasSucceeded).

###### <a id="XHR-isProgressing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isProgressing) [`XHR.isProgressing(xhr) ~> boolean`](#XHR-isProgressing)

`XHR.isProgressing` returns a possibly observable boolean property that tells
whether the XHR operation has started, but has not yet [ended](#XHR-isDone).

##### <a id="end-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#end-state) [End state](#end-state)

###### <a id="XHR-hasErrored"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasErrored) [`XHR.hasErrored(xhr) ~> boolean`](#XHR-hasErrored)

`XHR.hasErrored` returns a possibly observable boolean property of an ongoing
XHR that is true when either [download](#XHR-downHasErrored) or
[upload](#XHR-upHasErrored) has errored.

###### <a id="XHR-hasTimedOut"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasTimedOut) [`XHR.hasTimedOut(xhr) ~> boolean`](#XHR-hasTimedOut)

`XHR.hasTimedOut` returns a possibly observable boolean property of an ongoing
XHR that is true when either [download](#XHR-downHasTimedOut) or
[upload](#XHR-upHasTimedOut) has timed out.

##### <a id="errors-on-failure"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#errors-on-failure) [Errors on failure](#errors-on-failure)

###### <a id="XHR-errors"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-errors) [`XHR.errors(xhr) ~> [...exceptions]`](#XHR-errors)

`XHR.errors` returns a possibly observable array of errors from
[download](#XHR-downError) and [upload](#XHR-upError). The array will contain 0
to 2 errors.

##### <a id="request-status"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#request-status) [Request status](#request-status)

###### <a id="XHR-status"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-status) [`XHR.status(xhr) ~> number`](#XHR-status)

`XHR.status` returns a possibly observable property that emits the
[`status`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status)
after the HTTP status has been received. When called on a non-observable XHR,
[`readyState` must be 2](#XHR-isStatusAvailable) or an `Error` will be thrown.

###### <a id="XHR-statusIsHttpSuccess"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-statusIsHttpSuccess) [`XHR.statusIsHttpSuccess(xhr) ~> boolean`](#XHR-statusIsHttpSuccess)

`XHR.statusIsHttpSuccess(xhr)` is shorthand for
`XHR.isHttpSuccess(XHR.status(xhr))`. Note that HTTP status is usually received
before the [download](#XHR-downHasCompleted) and [upload](#XHR-upHasCompleted)
phases have completed. See also [`XHR.hasSucceeded`](#XHR-hasSucceeded),
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

###### <a id="XHR-statusText"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-statusText) [`XHR.statusText(xhr) ~> string`](#XHR-statusText)

`XHR.statusText` returns a possibly observable property of the
[`statusText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText)
after the HTTP status has been received. When called on a non-observable XHR,
[`readyState` must be 2](#XHR-isStatusAvailable) or an `Error` will be thrown.

##### <a id="data-transfer"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#data-transfer) [Data transfer](#data-transfer)

###### <a id="XHR-loaded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-loaded) [`XHR.loaded(xhr) ~> number`](#XHR-loaded)

`XHR.loaded` returns a possibly observable property of the sum of
[downloaded](#XHR-downLoaded) and [uploaded](#XHR-upLoaded) bytes.

###### <a id="XHR-total"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-total) [`XHR.total(xhr) ~> number`](#XHR-total)

`XHR.loaded` returns a possibly observable property of the sum of [total
download](#XHR-downTotal) and [total upload](#XHR-upTotal) bytes.

##### <a id="response-headers"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#response-headers) [Response headers](#response-headers)

###### <a id="XHR-allResponseHeaders"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-allResponseHeaders) [`XHR.allResponseHeaders(xhr) ~> string`](#XHR-allResponseHeaders)

`XHR.allResponseHeaders` returns a possibly observable property that emits the
value of
[`getAllResponseHeaders()`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)
after the HTTP headers have been received. When called on a non-observable XHR,
its [`readyState` must be 2](#XHR-isStatusAvailable) or an `Error` will be thrown.

###### <a id="XHR-responseHeader"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseHeader) [`XHR.responseHeader(header, xhr) ~> string`](#XHR-responseHeader)

`XHR.responseHeader` returns a possibly observable property that emits the value
of
[`getResponseHeader(header)`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getResponseHeader)
for specified `header` after the HTTP headers have been received. When called
on a non-observable XHR, its [`readyState` must be 2](#XHR-isStatusAvailable) or
an `Error` will be thrown.

##### <a id="response-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#response-data) [Response data](#response-data)

###### <a id="XHR-response"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-response) [`XHR.response(xhr) ~> varies`](#XHR-response)

`XHR.response` returns a possibly observable property that emits the
[`response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
after the [download operation of the XHR has completed](#XHR-downHasCompleted).
When called on a non-observable XHR, the download operation must be completed or
an `Error` will be thrown. See also [`XHR.result`](#XHR-result), and
[`XHR.responseText`](#XHR-responseText).

###### <a id="XHR-responseText"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseText) [`XHR.responseText(xhr) ~> string`](#XHR-responseText)

`XHR.responseText` returns a possibly observable property of the
[`responseText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText)
property of an ongoing XHR. `XHR.responseText` is for observing the received
response data before the data has been completely received. See also
[`XHR.response`](#XHR-response).

###### <a id="XHR-responseXML"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseXML) [`XHR.responseXML(xhr) ~> document`](#XHR-responseXML)

`XHR.responseXML` returns a possibly observable property of the
[`responseXML`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML)
property after the XHR has completed. When called on a non-observable XHR, the
download operation must be completed or an `Error` will be thrown. See also
[`XHR.response`](#XHR-response).

##### <a id="response-url"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#response-url) [Response URL](#response-url)

###### <a id="XHR-responseURL"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseURL) [`XHR.responseURL(xhr) ~> string`](#XHR-responseURL)

`XHR.responseURL` returns a possibly observable property of the
[`responseURL`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL)
property after the HTTP headers have been received. When called on a
non-observable XHR, its [`readyState` must be 2](#XHR-isStatusAvailable) or an
`Error` will be thrown.

##### <a id="request-parameters"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#request-parameters) [Request parameters](#request-parameters)

###### <a id="XHR-responseType"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseType) [`XHR.responseType(xhr) ~> string`](#XHR-responseType)

`XHR.responseType` returns a possibly observable property of the
[`responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
of an ongoing XHR.

###### <a id="XHR-timeout"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-timeout) [`XHR.timeout(xhr) ~> number`](#XHR-timeout)

`XHR.timeout` returns a possibly observable property of the
[`timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout)
property of an ongoing XHR.

###### <a id="XHR-withCredentials"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-withCredentials) [`XHR.withCredentials(xhr) ~> boolean`](#XHR-withCredentials)

`XHR.withCredentials` returns a possibly observable property of the
[`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
property of an ongoing XHR.

##### <a id="ready-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#ready-state) [Ready state](#ready-state)

###### <a id="XHR-readyState"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-readyState) [`XHR.readyState(xhr) ~> number`](#XHR-readyState)

`XHR.readyState` returns a possibly observable property of the
[`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)
of an ongoing XHR.

#### <a id="download-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#download-state) [Download state](#download-state)

##### <a id="XHR-downError"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downError) [`XHR.downError(xhr) ~> exception`](#XHR-downError)

`XHR.downError` returns a possibly observable property of the
[`error`](https://developer.mozilla.org/en-US/docs/Web/Events/error) property of
an errored XHR.

##### <a id="XHR-downHasEnded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasEnded) [`XHR.downHasEnded(xhr) ~> boolean`](#XHR-downHasEnded)

`XHR.downHasEnded` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has
[ended](https://developer.mozilla.org/en-US/docs/Web/Events/loadend).

##### <a id="XHR-downHasErrored"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasErrored) [`XHR.downHasErrored(xhr) ~> boolean`](#XHR-downHasErrored)

`XHR.downHasErrored` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has
[errored](https://developer.mozilla.org/en-US/docs/Web/Events/error).

##### <a id="XHR-downHasStarted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasStarted) [`XHR.downHasStarted(xhr) ~> boolean`](#XHR-downHasStarted)

`XHR.downHasStarted` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has
[started](https://developer.mozilla.org/en-US/docs/Web/Events/loadstart).

##### <a id="XHR-downHasCompleted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasCompleted) [`XHR.downHasCompleted(xhr) ~> boolean`](#XHR-downHasCompleted)

`XHR.downHasCompleted` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has been [completed
successfully](https://developer.mozilla.org/en-US/docs/Web/Events/load). Note
that this does not take into account the HTTP response status, see
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

##### <a id="XHR-downHasTimedOut"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasTimedOut) [`XHR.downHasTimedOut(xhr) ~> boolean`](#XHR-downHasTimedOut)

`XHR.downHasTimedOut` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has [timed
out](https://developer.mozilla.org/en-US/docs/Web/Events/timeout).

##### <a id="XHR-downIsProgressing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downIsProgressing) [`XHR.downIsProgressing(xhr) ~> boolean`](#XHR-downIsProgressing)

`XHR.downIsProgressing` returns a possibly observable boolean property that
tells whether the download operation of an ongoing XHR is
[progressing](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

##### <a id="XHR-downLoaded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downLoaded) [`XHR.downLoaded(xhr) ~> number`](#XHR-downLoaded)

`XHR.downLoaded` returns a possibly observable property of the
[`loaded`](https://developer.mozilla.org/en-US/docs/Web/Events/progress)
property of an ongoing XHR.

##### <a id="XHR-downTotal"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downTotal) [`XHR.downTotal(xhr) ~> number`](#XHR-downTotal)

`XHR.downTotal` returns a possibly observable property of the
[`total`](https://developer.mozilla.org/en-US/docs/Web/Events/progress) property
of an ongoing XHR.

#### <a id="upload-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#upload-state) [Upload state](#upload-state)

##### <a id="XHR-upError"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upError) [`XHR.upError(xhr) ~> exception`](#XHR-upError)

`XHR.upError` returns a possibly observable property of the
[`error`](https://developer.mozilla.org/en-US/docs/Web/Events/error) property of
an errored XHR.

##### <a id="XHR-upHasEnded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasEnded) [`XHR.upHasEnded(xhr) ~> boolean`](#XHR-upHasEnded)

`XHR.upHasEnded` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has
[ended](https://developer.mozilla.org/en-US/docs/Web/Events/loadend).

##### <a id="XHR-upHasErrored"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasErrored) [`XHR.upHasErrored(xhr) ~> boolean`](#XHR-upHasErrored)

`XHR.upHasErrored` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has
[errored](https://developer.mozilla.org/en-US/docs/Web/Events/error).

##### <a id="XHR-upHasStarted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasStarted) [`XHR.upHasStarted(xhr) ~> boolean`](#XHR-upHasStarted)

`XHR.upHasStarted` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has
[started](https://developer.mozilla.org/en-US/docs/Web/Events/loadstart).

##### <a id="XHR-upHasCompleted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasCompleted) [`XHR.upHasCompleted(xhr) ~> boolean`](#XHR-upHasCompleted)

`XHR.upHasCompleted` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has [completed
successfully](https://developer.mozilla.org/en-US/docs/Web/Events/load). Note
that this does not take into account the HTTP response status, see
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

##### <a id="XHR-upHasTimedOut"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasTimedOut) [`XHR.upHasTimedOut(xhr) ~> boolean`](#XHR-upHasTimedOut)

`XHR.upHasTimedOut` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has [timed
out](https://developer.mozilla.org/en-US/docs/Web/Events/timeout).

##### <a id="XHR-upIsProgressing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upIsProgressing) [`XHR.upIsProgressing(xhr) ~> boolean`](#XHR-upIsProgressing)

`XHR.upIsProgressing` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR is
[progressing](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

##### <a id="XHR-upLoaded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upLoaded) [`XHR.upLoaded(xhr) ~> number`](#XHR-upLoaded)

`XHR.upLoaded` returns a possibly observable property of the
[`loaded`](https://developer.mozilla.org/en-US/docs/Web/Events/progress)
property of an ongoing XHR.

##### <a id="XHR-upTotal"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upTotal) [`XHR.upTotal(xhr) ~> number`](#XHR-upTotal)

`XHR.upTotal` returns a possibly observable property of the
[`total`](https://developer.mozilla.org/en-US/docs/Web/Events/progress) property
of an ongoing XHR.

### <a id="auxiliary"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#auxiliary) [Auxiliary](#auxiliary)

#### <a id="XHR-isHttpSuccess"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isHttpSuccess) [`XHR.isHttpSuccess(number) ~> boolean`](#XHR-isHttpSuccess)

`XHR.isHttpSuccess` returns a possibly observable property of whether the given
numeric property is in the range 2xx of [HTTP success
codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success).
See also [`XHR.statusIsHttpSuccess`](#XHR-statusIsHttpSuccess).

#### <a id="XHR-isXHR"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isXHR) [`XHR.isXHR(any) ~> boolean`](#XHR-isXHR)

`XHR.isXHR` returns a possibly observable boolean property that tells whether
the given value is a XHR.

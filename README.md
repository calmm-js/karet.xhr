# <a id="karet-xhr"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#karet-xhr) [Karet XHR](#karet-xhr) &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.xhr.svg?style=social)](https://github.com/calmm-js/karet.xhr)

This library provides a thin wrapper over the standard
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
API allowing one to perform XHRs by observing the state of ongoing requests as
observable [Kefir](https://kefirjs.github.io/kefir/)
[properties](https://kefirjs.github.io/kefir/#about-observables).  The benefit
of this approach is that it makes it easy to implement many kinds of use cases
ranging from just getting the response data to visualizing the progress of
ongoing upload and/or download and displaying potential errors.  See also [Karet
FR](https://github.com/calmm-js/karet.fr).

Examples:
* The [Giphy](https://codesandbox.io/s/q9j8v8w1nq) CodeSandbox uses this library
  to do simple JSON GET requests.
* The [GitHub repository search](https://codesandbox.io/s/l5271q0r2l)
  CodeSandbox uses this library to do JSON GET requests and exercises much of
  the API of this library as an example.

[![npm version](https://badge.fury.io/js/karet.xhr.svg)](http://badge.fury.io/js/karet.xhr)
[![Build Status](https://travis-ci.org/calmm-js/karet.xhr.svg?branch=master)](https://travis-ci.org/calmm-js/karet.xhr)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.xhr/master.svg)](https://codecov.io/github/calmm-js/karet.xhr?branch=master)
[![](https://david-dm.org/calmm-js/karet.xhr.svg)](https://david-dm.org/calmm-js/karet.xhr)
[![](https://david-dm.org/calmm-js/karet.xhr/dev-status.svg)](https://david-dm.org/calmm-js/karet.xhr?type=dev)

## <a id="contents"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#contents) [Contents](#contents)

* [Reference](#reference)
  * [Convenience](#convenience)
    * [`XHR.getJson(url | {url[, ...]}) ~> varies`](#XHR-getJson)
    * [`XHR.performJson(url | {url[, ...]}) ~> xhr`](#XHR-performJson)
    * [`XHR.performWith(url | {...}, url | {...}) ~> xhr`](#XHR-performWith)
    * [`XHR.hasSucceeded(xhr) ~> boolean`](#XHR-hasSucceeded)
  * [Starting](#starting)
    * [`XHR.perform(url | {url[, method, user, password, headers, overrideMimeType, body, responseType, timeout, withCredentials]}) ~> xhr`](#XHR-perform)
  * [Overall state](#overall-state)
    * [Progression](#progression)
      * [`XHR.isDone(xhr) ~> boolean`](#XHR-isDone)
      * [`XHR.isProgressing(xhr) ~> boolean`](#XHR-isProgressing)
      * [`XHR.isStatusAvailable(xhr) ~> boolean`](#XHR-isStatusAvailable)
    * [End state](#end-state)
      * [`XHR.hasFailed(xhr) ~> boolean`](#XHR-hasFailed)
      * [`XHR.hasTimedOut(xhr) ~> boolean`](#XHR-hasTimedOut)
    * [Errors on failure](#errors-on-failure)
      * [`XHR.errors(xhr) ~> [exception]`](#XHR-errors)
    * [Request status](#request-status)
      * [`XHR.status(xhr) ~> number`](#XHR-status)
      * [`XHR.statusIsHttpSuccess(xhr) ~> boolean`](#XHR-statusIsHttpSuccess)
      * [`XHR.statusText(xhr) ~> string`](#XHR-statusText)
    * [Data transfer](#data-transfer)
      * [`XHR.loaded(xhr) ~> number`](#XHR-loaded)
      * [`XHR.total(xhr) ~> number`](#XHR-total)
    * [Response headers](#response-headers)
      * [`XHR.allResponseHeaders(xhr) ~> string`](#XHR-allResponseHeaders)
      * [`XHR.responseHeader(header, xhr) ~> string`](#XHR-responseHeader)
    * [Response data](#response-data)
      * [`XHR.response(xhr) ~> varies`](#XHR-response)
      * [`XHR.responseFull(xhr) ~> varies`](#XHR-responseFull)
      * [`XHR.responseText(xhr) ~> string`](#XHR-responseText)
      * [`XHR.responseXML(xhr) ~> document`](#XHR-responseXML)
    * [Response URL](#response-url)
      * [`XHR.responseURL(xhr) ~> string`](#XHR-responseURL)
    * [Request parameters](#request-parameters)
      * [`XHR.responseType(xhr) ~> string`](#XHR-responseType)
      * [`XHR.timeout(xhr) ~> number`](#XHR-timeout)
      * [`XHR.withCredentials(xhr) ~> boolean`](#XHR-withCredentials)
    * [Ready state](#ready-state)
      * [`XHR.readyState(xhr) ~> number`](#XHR-readyState)
  * [Download state](#download-state)
    * [`XHR.downError(xhr) ~> exception`](#XHR-downError)
    * [`XHR.downHasCompleted(xhr) ~> boolean`](#XHR-downHasCompleted)
    * [`XHR.downHasEnded(xhr) ~> boolean`](#XHR-downHasEnded)
    * [`XHR.downHasFailed(xhr) ~> boolean`](#XHR-downHasFailed)
    * [`XHR.downHasStarted(xhr) ~> boolean`](#XHR-downHasStarted)
    * [`XHR.downHasTimedOut(xhr) ~> boolean`](#XHR-downHasTimedOut)
    * [`XHR.downIsProgressing(xhr) ~> boolean`](#XHR-downIsProgressing)
    * [`XHR.downLoaded(xhr) ~> number`](#XHR-downLoaded)
    * [`XHR.downTotal(xhr) ~> number`](#XHR-downTotal)
  * [Upload state](#upload-state)
    * [`XHR.upError(xhr) ~> exception`](#XHR-upError)
    * [`XHR.upHasCompleted(xhr) ~> boolean`](#XHR-upHasCompleted)
    * [`XHR.upHasEnded(xhr) ~> boolean`](#XHR-upHasEnded)
    * [`XHR.upHasFailed(xhr) ~> boolean`](#XHR-upHasFailed)
    * [`XHR.upHasStarted(xhr) ~> boolean`](#XHR-upHasStarted)
    * [`XHR.upHasTimedOut(xhr) ~> boolean`](#XHR-upHasTimedOut)
    * [`XHR.upIsProgressing(xhr) ~> boolean`](#XHR-upIsProgressing)
    * [`XHR.upLoaded(xhr) ~> number`](#XHR-upLoaded)
    * [`XHR.upTotal(xhr) ~> number`](#XHR-upTotal)
  * [Auxiliary](#auxiliary)
    * [`XHR.isHttpSuccess(number) ~> boolean`](#XHR-isHttpSuccess)
  * [Deprecated](#deprecated)
    * ~~[`XHR.downHasSucceeded(xhr) ~> boolean`](#XHR-downHasSucceeded)~~
    * ~~[`XHR.headersReceived(xhr) ~> boolean`](#XHR-headersReceived)~~
    * ~~[`XHR.upHasSucceeded(xhr) ~> boolean`](#XHR-upHasSucceeded)~~

## <a id="reference"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#reference) [Reference](#reference)

The interface of this library consists of named exports.  Typically one just
imports the library as:

```jsx
import * as XHR from 'karet.xhr'
```

Using this library, one first [creates](#starting) an observable property
representing the state of an
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
using [`XHR.perform`](#XHR-perform) and then observes the ongoing XHR state
using the accessors for [overall](#overall-state), [download](#download-state),
and [upload](#upload-state) state.

### <a id="convenience"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#convenience) [Convenience](#convenience)

#### <a id="XHR-getJson"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-getJson) [`XHR.getJson(url | {url,[, ...]}) ~> varies`](#XHR-getJson)

`XHR.getJson(arg)` returns an observable that emits the [full
response](#XHR-responseFull) after the [XHR has succeeded](#XHR-hasSucceeded).
In case the XHR fails or times out, the XHR is emitted as an error.

#### <a id="XHR-performJson"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-peformJson) [`XHR.performJson(url | {url[, ...]}) ~> xhr`](#XHR-performJson)

`XHR.performJson` is shorthand for [`XHR.performWith({responseType:
'json', headers: {'Content-Type': 'application/json'}})`](#XHR-performWith).

#### <a id="XHR-performWith"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-performWith) [`XHR.performWith(url | {...}, url | {...}) ~> xhr`](#XHR-performWith)

`XHR.performWith` is a curried function that allows one to define a
[`XHR.perform`](#XHR-perform) like function with default parameters.  The
defaults (first parameter) are merged with the overrides (second parameter).
Headers are also merged.  See [`XHR.perform`](#XHR-perform) for the parameters.

For example:

```jsx
const get = XHR.performWith({responseType: 'json', timeout: 30*1000})
// ...
get(url)
```

#### <a id="XHR-hasSucceeded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasSucceeded) [`XHR.hasSucceeded(xhr) ~> boolean`](#XHR-hasSucceeded)

`XHR.hasSucceeded` returns a possibly observable boolean property of an ongoing
XHR that is true if the XHR [is done](#XHR-isDone), its HTTP [status indicates
success](#XHR-statusIsHttpSuccess), and neither
[download](#XHR-downHasCompleted) or [upload](#XHR-upHasCompleted) has failed or
timed out.

### <a id="starting"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#starting) [Starting](#starting)

#### <a id="XHR-perform"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-perform) [`XHR.perform(url | {url[, method, user, password, headers, overrideMimeType, body, responseType, timeout, withCredentials]}) ~> xhr`](#XHR-perform)

`XHR.perform` creates an observable
[property](https://kefirjs.github.io/kefir/#about-observables) that represents
the state of an ongoing
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
The request is started once the property is subscribed to and is automatically
[aborted](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort)
in case the property is fully unsubscribed from before it has ended.  See also
[`XHR.performWith`](#XHR-performWith).

Only the `url` parameter is required and can be passed as a string.  Other
parameters have their XHR default values:

| Parameter | Default | Explanation
| --------- | ------- | -----------
| [`method`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) | `'GET'` | [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to use.
| [`user`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) | `null` | User name for authentication.
| [`password`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) | `null` | Password for authentication.
| [`headers`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader) | `null` | An array of `[header, value]` pairs, a plain object of `{header: value}` properties, a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), or a [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object mapping headers to values.
| [`overrideMimeType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType) | `undefined` | If specified overrides the MIME type provided by the server.
| [`body`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send) | `null` | A body of data to be sent.
| [`responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) | `''` | Specifies type of [response](#XHR-response) data.
| [`timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout) | `0` | Number of milliseconds or `0` for infinite.
| [`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) | `false` | Whether cross-site `Access-Control` should use credentials.

In addition to a plain object, the argument to `XHR.perform` is allowed to be an
observable property or contain observable properties, in which case the property
created by `XHR.perform` performs the XHR with the
[latest](https://kefirjs.github.io/kefir/#flat-map-latest) argument values.

Note that typically one does not explicitly subscribe to the property, but one
rather computes a desired view of the property, such as a view of the
[response](#XHR-response), and combines that further into some more interesting
property.

WARNING: Setting `responseType` to `'json'` is not supported by IE 11.  This
library implements a workaround by calling `JSON.parse` on the returned data in
case setting `responseType` to `'json'` fails.  In case the response does not
parse, then [`XHR.response`](#XHR-response) and
[`XHR.responseFull`](XHR-responseFull) return `null`.

See this live [GitHub repository search](https://codesandbox.io/s/l5271q0r2l)
CodeSandbox for an example.

### <a id="overall-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#overall-state) [Overall state](#overall-state)

#### <a id="progression"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#progression) [Progression](#progression)

##### <a id="XHR-isStatusAvailable"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isStatusAvailable) [`XHR.isStatusAvailable(xhr) ~> boolean`](#XHR-isStatusAvailable)

`XHR.isStatusAvailable` returns a possibly observable boolean property that
tells whether HTTP status and response headers have been received and can be
obtained.  See also [`XHR.status`](#XHR-status),
[`XHR.statusText`](#XHR-statusText),
[`XHR.allResponseHeaders`](#XHR-allResponseHeaders), and
[`XHR.responseHeader`](#XHR-responseHeader).

##### <a id="XHR-isDone"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isDone) [`XHR.isDone(xhr) ~> boolean`](#XHR-isDone)

`XHR.isDone` returns a possibly observable boolean property that tells whether
the XHR operation is complete (whether success or failure).

##### <a id="XHR-isProgressing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isProgressing) [`XHR.isProgressing(xhr) ~> boolean`](#XHR-isProgressing)

`XHR.isProgressing` returns a possibly observable boolean property that tells
whether the XHR operation has started, but has not yet [completed](#XHR-isDone).

#### <a id="end-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#end-state) [End state](#end-state)

##### <a id="XHR-hasFailed"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasFailed) [`XHR.hasFailed(xhr) ~> boolean`](#XHR-hasFailed)

`XHR.hasFailed` returns a possibly observable boolean property of an ongoing XHR
that is true when either [download](#XHR-downHasFailed) or
[upload](#XHR-upHasFailed) has failed.

##### <a id="XHR-hasTimedOut"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-hasTimedOut) [`XHR.hasTimedOut(xhr) ~> boolean`](#XHR-hasTimedOut)

`XHR.hasTimedOut` returns a possibly observable boolean property of an ongoing
XHR that is true when either [download](#XHR-downHasTimedOut) or
[upload](#XHR-upHasTimedOut) has timed out.

#### <a id="errors-on-failure"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#errors-on-failure) [Errors on failure](#errors-on-failure)

##### <a id="XHR-errors"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-errors) [`XHR.errors(xhr) ~> [exception]`](#XHR-errors)

`XHR.errors` returns a possibly observable array of errors from
[download](#XHR-downError) and [upload](#XHR-upError).  The array will contain 0
to 2 errors.

#### <a id="request-status"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#request-status) [Request status](#request-status)

##### <a id="XHR-status"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-status) [`XHR.status(xhr) ~> number`](#XHR-status)

`XHR.status` returns a possibly observable property that emits the
[`status`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status)
after the HTTP status has been received.  When called on a non-observable XHR,
[`readyState` must be 2](#XHR-isStatusAvailable) or an `Error` will be thrown.

##### <a id="XHR-statusIsHttpSuccess"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-statusIsHttpSuccess) [`XHR.statusIsHttpSuccess(xhr) ~> boolean`](#XHR-statusIsHttpSuccess)

`XHR.statusIsHttpSuccess(xhr)` is shorthand for
`XHR.isHttpSuccess(XHR.status(xhr))`.  See also [`XHR.status`](#XHR-status) and
[`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

##### <a id="XHR-statusText"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-statusText) [`XHR.statusText(xhr) ~> string`](#XHR-statusText)

`XHR.statusText` returns a possibly observable property of the
[`statusText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText)
after the HTTP status has been received.  When called on a non-observable XHR,
[`readyState` must be 2](#XHR-isStatusAvailable) or an `Error` will be thrown.

#### <a id="data-transfer"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#data-transfer) [Data transfer](#data-transfer)

##### <a id="XHR-loaded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-loaded) [`XHR.loaded(xhr) ~> number`](#XHR-loaded)

`XHR.loaded` returns a possibly observable property of the sum of
[downloaded](#XHR-downLoaded) and [uploaded](#XHR-upLoaded) bytes.

##### <a id="XHR-total"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-total) [`XHR.total(xhr) ~> number`](#XHR-total)

`XHR.loaded` returns a possibly observable property of the sum of [total
download](#XHR-downTotal) and [total upload](#XHR-upTotal) bytes.

#### <a id="response-headers"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#response-headers) [Response headers](#response-headers)

##### <a id="XHR-allResponseHeaders"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-allResponseHeaders) [`XHR.allResponseHeaders(xhr) ~> string`](#XHR-allResponseHeaders)

`XHR.allResponseHeaders` returns a possibly observable property that emits the
value of
[`getAllResponseHeaders()`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)
after the HTTP headers have been received.  When called on a non-observable XHR,
its [`readyState` must be 2](#XHR-isStatusAvailable) or an `Error` will be thrown.

##### <a id="XHR-responseHeader"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseHeader) [`XHR.responseHeader(header, xhr) ~> string`](#XHR-responseHeader)

`XHR.responseHeader` returns a possibly observable property that emits the value
of
[`getResponseHeader(header)`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getResponseHeader)
for specified `header` after the HTTP headers have been received.  When called
on a non-observable XHR, its [`readyState` must be 2](#XHR-isStatusAvailable) or
an `Error` will be thrown.

#### <a id="response-data"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#response-data) [Response data](#response-data)

##### <a id="XHR-response"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-response) [`XHR.response(xhr) ~> varies`](#XHR-response)

`XHR.response` returns a possibly observable property of the
[`response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
of an ongoing XHR.  See also [`XHR.responseFull`](#XHR-responseFull).

##### <a id="XHR-responseFull"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseFull) [`XHR.responseFull(xhr) ~> varies`](#XHR-responseFull)

`XHR.responseFull` returns a possibly observable property that emits the
[`response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
after the [download operation of the XHR has completed](#XHR-downHasCompleted).
When called on a non-observable XHR, the download operation must be completed or
an `Error` will be thrown.  See also [`XHR.response`](#XHR-response).

##### <a id="XHR-responseText"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseText) [`XHR.responseText(xhr) ~> string`](#XHR-responseText)

`XHR.responseText` returns a possibly observable property of the
[`responseText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText)
property of an ongoing XHR.

##### <a id="XHR-responseXML"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseXML) [`XHR.responseXML(xhr) ~> document`](#XHR-responseXML)

`XHR.responseXML` returns a possibly observable property of the
[`responseXML`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML)
property after the XHR has completed.  When called on a non-observable XHR, its
[`readyState` must be 4](#XHR-isDone) or an `Error` will be thrown.  See also
[`XHR.response`](#XHR-response).

#### <a id="response-url"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#response-url) [Response URL](#response-url)

##### <a id="XHR-responseURL"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseURL) [`XHR.responseURL(xhr) ~> string`](#XHR-responseURL)

`XHR.responseURL` returns a possibly observable property of the
[`responseURL`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL)
property after the HTTP headers have been received.  When called on a
non-observable XHR, its [`readyState` must be 2](#XHR-isStatusAvailable) or an
`Error` will be thrown.

#### <a id="request-parameters"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#request-parameters) [Request parameters](#request-parameters)

##### <a id="XHR-responseType"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-responseType) [`XHR.responseType(xhr) ~> string`](#XHR-responseType)

`XHR.responseType` returns a possibly observable property of the
[`responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
of an ongoing XHR.

##### <a id="XHR-timeout"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-timeout) [`XHR.timeout(xhr) ~> number`](#XHR-timeout)

`XHR.timeout` returns a possibly observable property of the
[`timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout)
property of an ongoing XHR.

##### <a id="XHR-withCredentials"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-withCredentials) [`XHR.withCredentials(xhr) ~> boolean`](#XHR-withCredentials)

`XHR.withCredentials` returns a possibly observable property of the
[`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
property of an ongoing XHR.

#### <a id="ready-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#ready-state) [Ready state](#ready-state)

##### <a id="XHR-readyState"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-readyState) [`XHR.readyState(xhr) ~> number`](#XHR-readyState)

`XHR.readyState` returns a possibly observable property of the
[`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)
of an ongoing XHR.

### <a id="download-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#download-state) [Download state](#download-state)

#### <a id="XHR-downError"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downError) [`XHR.downError(xhr) ~> exception`](#XHR-downError)

`XHR.downError` returns a possibly observable property of the
[`error`](https://developer.mozilla.org/en-US/docs/Web/Events/error) property of
a failed XHR.

#### <a id="XHR-downHasEnded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasEnded) [`XHR.downHasEnded(xhr) ~> boolean`](#XHR-downHasEnded)

`XHR.downHasEnded` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has
[ended](https://developer.mozilla.org/en-US/docs/Web/Events/loadend).

#### <a id="XHR-downHasFailed"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasFailed) [`XHR.downHasFailed(xhr) ~> boolean`](#XHR-downHasFailed)

`XHR.downHasFailed` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has
[failed](https://developer.mozilla.org/en-US/docs/Web/Events/error).

#### <a id="XHR-downHasStarted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasStarted) [`XHR.downHasStarted(xhr) ~> boolean`](#XHR-downHasStarted)

`XHR.downHasStarted` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has
[started](https://developer.mozilla.org/en-US/docs/Web/Events/loadstart).

#### <a id="XHR-downHasCompleted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasCompleted) [`XHR.downHasCompleted(xhr) ~> boolean`](#XHR-downHasCompleted)

`XHR.downHasCompleted` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has been [completed
successfully](https://developer.mozilla.org/en-US/docs/Web/Events/load).  Note
that this does not take into account the HTTP response status, see
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

#### <a id="XHR-downHasTimedOut"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasTimedOut) [`XHR.downHasTimedOut(xhr) ~> boolean`](#XHR-downHasTimedOut)

`XHR.downHasTimedOut` returns a possibly observable boolean property that tells
whether the download operation of an ongoing XHR has [timed
out](https://developer.mozilla.org/en-US/docs/Web/Events/timeout).

#### <a id="XHR-downIsProgressing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downIsProgressing) [`XHR.downIsProgressing(xhr) ~> boolean`](#XHR-downIsProgressing)

`XHR.downIsProgressing` returns a possibly observable boolean property that
tells whether the download operation of an ongoing XHR is
[progressing](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

#### <a id="XHR-downLoaded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downLoaded) [`XHR.downLoaded(xhr) ~> number`](#XHR-downLoaded)

`XHR.downLoaded` returns a possibly observable property of the
[`loaded`](https://developer.mozilla.org/en-US/docs/Web/Events/progress)
property of an ongoing XHR.

#### <a id="XHR-downTotal"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downTotal) [`XHR.downTotal(xhr) ~> number`](#XHR-downTotal)

`XHR.downTotal` returns a possibly observable property of the
[`total`](https://developer.mozilla.org/en-US/docs/Web/Events/progress) property
of an ongoing XHR.

### <a id="upload-state"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#upload-state) [Upload state](#upload-state)

#### <a id="XHR-upError"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upError) [`XHR.upError(xhr) ~> exception`](#XHR-upError)

`XHR.upError` returns a possibly observable property of the
[`error`](https://developer.mozilla.org/en-US/docs/Web/Events/error) property of
a failed XHR.

#### <a id="XHR-upHasEnded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasEnded) [`XHR.upHasEnded(xhr) ~> boolean`](#XHR-upHasEnded)

`XHR.upHasEnded` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has
[ended](https://developer.mozilla.org/en-US/docs/Web/Events/loadend).

#### <a id="XHR-upHasFailed"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasFailed) [`XHR.upHasFailed(xhr) ~> boolean`](#XHR-upHasFailed)

`XHR.upHasFailed` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has
[failed](https://developer.mozilla.org/en-US/docs/Web/Events/error).

#### <a id="XHR-upHasStarted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasStarted) [`XHR.upHasStarted(xhr) ~> boolean`](#XHR-upHasStarted)

`XHR.upHasStarted` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has
[started](https://developer.mozilla.org/en-US/docs/Web/Events/loadstart).

#### <a id="XHR-upHasCompleted"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasCompleted) [`XHR.upHasCompleted(xhr) ~> boolean`](#XHR-upHasCompleted)

`XHR.upHasCompleted` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has [completed
successfully](https://developer.mozilla.org/en-US/docs/Web/Events/load).  Note
that this does not take into account the HTTP response status, see
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

#### <a id="XHR-upHasTimedOut"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasTimedOut) [`XHR.upHasTimedOut(xhr) ~> boolean`](#XHR-upHasTimedOut)

`XHR.upHasTimedOut` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR has [timed
out](https://developer.mozilla.org/en-US/docs/Web/Events/timeout).

#### <a id="XHR-upIsProgressing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upIsProgressing) [`XHR.upIsProgressing(xhr) ~> boolean`](#XHR-upIsProgressing)

`XHR.upIsProgressing` returns a possibly observable boolean property that tells
whether the upload operation of an ongoing XHR is
[progressing](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

#### <a id="XHR-upLoaded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upLoaded) [`XHR.upLoaded(xhr) ~> number`](#XHR-upLoaded)

`XHR.upLoaded` returns a possibly observable property of the
[`loaded`](https://developer.mozilla.org/en-US/docs/Web/Events/progress)
property of an ongoing XHR.

#### <a id="XHR-upTotal"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upTotal) [`XHR.upTotal(xhr) ~> number`](#XHR-upTotal)

`XHR.upTotal` returns a possibly observable property of the
[`total`](https://developer.mozilla.org/en-US/docs/Web/Events/progress) property
of an ongoing XHR.

### <a id="auxiliary"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#auxiliary) [Auxiliary](#auxiliary)

#### <a id="XHR-isHttpSuccess"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-isHttpSuccess) [`XHR.isHttpSuccess(number) ~> boolean`](#XHR-isHttpSuccess)

`XHR.isHttpSuccess` returns a possibly observable property of whether the given
numeric property is in the range 2xx of [HTTP success
codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success).
See also [`XHR.statusIsHttpSuccess`](#XHR-statusIsHttpSuccess).

### <a id="deprecated"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#deprecated) [Deprecated](#deprecated)

#### <a id="XHR-downHasSucceeded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-downHasSucceeded) ~~[`XHR.downHasSucceeded(xhr) ~> boolean`](#XHR-downHasSucceeded)~~

`XHR.downHasSucceeded` has been renamed to
[`XHR.downHasCompleted`](#XHR-downHasCompleted).

#### <a id="XHR-headersReceived"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-headersReceived) ~~[`XHR.headersReceived(xhr) ~> boolean`](#XHR-headersReceived)~~

`XHR.headersReceived` has been renamed to
[`XHR.isStatusAvailable`](#XHR-isStatusAvailable).

#### <a id="XHR-upHasSucceeded"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.xhr/index.html#XHR-upHasSucceeded) ~~[`XHR.upHasSucceeded(xhr) ~> boolean`](#XHR-upHasSucceeded)~~

`XHR.upHasSucceeded` has been renamed to
[`XHR.upHasCompleted`](#XHR-upHasCompleted).

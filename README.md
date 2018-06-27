# <a id="karet-xhr"></a> [≡](#contents) Karet XHR &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.xhr.svg?style=social)](https://github.com/calmm-js/karet.xhr)

This library provides a thin wrapper over the standard
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
API allowing one to perform XHRs by observing the state of ongoing requests as
observable [Kefir](https://kefirjs.github.io/kefir/)
[properties](https://kefirjs.github.io/kefir/#about-observables).  The benefit
of this approach is that it makes it easy to implement many kinds of use cases
ranging from just getting the response data to visualizing the progress of
ongoing upload and/or download and displaying potential errors.

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

## <a id="contents"></a> [≡](#contents) Contents

* [Reference](#reference)
  * [Starting](#starting)
    * [`XHR.perform({url[, method, user, password, headers, overrideMimeType, body, responseType, timeout, withCredentials]}) ~> xhr`](#XHR-perform)
  * [Overall state](#overall-state)
    * [`XHR.allResponseHeaders(xhr) ~> string`](#XHR-allResponseHeaders)
    * [`XHR.readyState(xhr) ~> number`](#XHR-readyState)
    * [`XHR.response(xhr) ~> varies`](#XHR-response)
    * [`XHR.responseFull(xhr) ~> varies`](#XHR-responseFull)
    * [`XHR.responseHeader(header, xhr) ~> string`](#XHR-responseHeader)
    * [`XHR.responseText(xhr) ~> string`](#XHR-responseText)
    * [`XHR.responseType(xhr) ~> string`](#XHR-responseType)
    * [`XHR.responseURL(xhr) ~> string`](#XHR-responseURL)
    * [`XHR.responseXML(xhr) ~> document`](#XHR-responseXML)
    * [`XHR.status(xhr) ~> number`](#XHR-status)
    * [`XHR.statusIsHttpSuccess(xhr) ~> number`](#XHR-statusIsHttpSuccess)
    * [`XHR.statusText(xhr) ~> string`](#XHR-statusText)
    * [`XHR.timeout(xhr) ~> number`](#XHR-timeout)
    * [`XHR.withCredentials(xhr) ~> boolean`](#XHR-withCredentials)
  * [Download state](#download-state)
    * [`XHR.downError(xhr) ~> exception`](#XHR-downError)
    * [`XHR.downHasEnded(xhr) ~> boolean`](#XHR-downHasEnded)
    * [`XHR.downHasFailed(xhr) ~> boolean`](#XHR-downHasFailed)
    * [`XHR.downHasStarted(xhr) ~> boolean`](#XHR-downHasStarted)
    * [`XHR.downHasSucceeded(xhr) ~> boolean`](#XHR-downHasSucceeded)
    * [`XHR.downHasTimedOut(xhr) ~> boolean`](#XHR-downHasTimedOut)
    * [`XHR.downIsProgressing(xhr) ~> boolean`](#XHR-downIsProgressing)
    * [`XHR.downLoaded(xhr) ~> number`](#XHR-downLoaded)
    * [`XHR.downTotal(xhr) ~> number`](#XHR-downTotal)
  * [Upload state](#upload-state)
    * [`XHR.upError(xhr) ~> exception`](#XHR-upError)
    * [`XHR.upHasEnded(xhr) ~> boolean`](#XHR-upHasEnded)
    * [`XHR.upHasFailed(xhr) ~> boolean`](#XHR-upHasFailed)
    * [`XHR.upHasStarted(xhr) ~> boolean`](#XHR-upHasStarted)
    * [`XHR.upHasSucceeded(xhr) ~> boolean`](#XHR-upHasSucceeded)
    * [`XHR.upHasTimedOut(xhr) ~> boolean`](#XHR-upHasTimedOut)
    * [`XHR.upIsProgressing(xhr) ~> boolean`](#XHR-upIsProgressing)
    * [`XHR.upLoaded(xhr) ~> number`](#XHR-upLoaded)
    * [`XHR.upTotal(xhr) ~> number`](#XHR-upTotal)
  * [Auxiliary](#auxiliary)
    * [`XHR.isHttpSuccess(number) ~> boolean`](#XHR-isHttpSuccess)

## <a id="reference"></a> [≡](#contents) Reference

The interface of this library consists of named exports.  Typically one just
imports the library as:

```js
import * as XHR from 'karet.xhr'
```

Using this library, one first [creates](#starting) an observable property
representing the state of an
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
using [`XHR.perform`](#XHR-perform) and then observes the ongoing XHR state
using the accessors for [overall](#overall-state), [download](#download-state),
and [upload](#upload-state) state.

### <a id="starting"></a> [≡](#contents) [Starting](#starting)

#### <a id="XHR-perform"></a> [≡](#contents) [`XHR.perform({url[, method, user, password, headers, overrideMimeType, body, responseType, timeout, withCredentials]}) ~> xhr`](#XHR-perform)

`XHR.perform` creates an observable
[property](https://kefirjs.github.io/kefir/#about-observables) that represents
the state of an ongoing
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
The request is started once the property is subscribed to and is automatically
[aborted](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort)
in case the property is fully unsubscribed from before it has ended.

Only the `url` parameter is required.  Other parameters have their XHR default
values:

| Parameter | Default | Explanation
| --------- | ------- | -----------
| [`method`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) | `'GET'` | [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to use.
| [`user`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) | `null` | User name for authentication.
| [`password`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open) | `null` | Password for authentication.
| [`headers`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader) | `[]` | An array of `[header, value]` pairs, or a plain object, [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), or [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) mapping headers to values.
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

See this live [GitHub repository search](https://codesandbox.io/s/l5271q0r2l)
CodeSandbox for an example.

### <a id="overall-state"></a> [≡](#contents) [Overall state](#overall-state)

#### <a id="XHR-allResponseHeaders"></a> [≡](#contents) [`XHR.allResponseHeaders(xhr) ~> string`](#XHR-allResponseHeaders)

`XHR.allResponseHeaders` returns an observable property of
[`getAllResponseHeaders()`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)
of an ongoing XHR.

#### <a id="XHR-readyState"></a> [≡](#contents) [`XHR.readyState(xhr) ~> number`](#XHR-readyState)

`XHR.readyState` returns an observable property of the
[`readyState`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)
of an ongoing XHR.

#### <a id="XHR-response"></a> [≡](#contents) [`XHR.response(xhr) ~> varies`](#XHR-response)

`XHR.response` returns an observable property of the
[`response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
of an ongoing XHR.  See also [`XHR.responseFull`](#XHR-responseFull).

#### <a id="XHR-responseFull"></a> [≡](#contents) [`XHR.responseFull(xhr) ~> varies`](#XHR-responseFull)

`XHR.responseFull` returns an observable property that emits the
[`response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
after the XHR has completed.  See also [`XHR.response`](#XHR-response).

#### <a id="XHR-responseHeader"></a> [≡](#contents) [`XHR.responseHeader(header, xhr) ~> string`](#XHR-responseHeader)

`XHR.responseHeader` returns an observable property for given `header` of
[`getResponseHeader(header)`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getResponseHeader)
of an ongoing XHR.

#### <a id="XHR-responseText"></a> [≡](#contents) [`XHR.responseText(xhr) ~> string`](#XHR-responseText)

`XHR.responseText` returns an observable property of the
[`responseText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText)
property of an ongoing XHR.

#### <a id="XHR-responseType"></a> [≡](#contents) [`XHR.responseType(xhr) ~> string`](#XHR-responseType)

`XHR.responseType` returns an observable property of the
[`responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
of an ongoing XHR.

#### <a id="XHR-responseURL"></a> [≡](#contents) [`XHR.responseURL(xhr) ~> string`](#XHR-responseURL)

`XHR.responseURL` returns an observable property of the
[`responseURL`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL)
of an ongoing XHR.

#### <a id="XHR-responseXML"></a> [≡](#contents) [`XHR.responseXML(xhr) ~> document`](#XHR-responseXML)

`XHR.responseXML` returns an observable property of the
[`responseXML`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML)
property of an ongoing XHR.

#### <a id="XHR-status"></a> [≡](#contents) [`XHR.status(xhr) ~> number`](#XHR-status)

`XHR.status` returns an observable property of the
[`status`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status)
of an ongoing XHR.

#### <a id="XHR-statusIsHttpSuccess"></a> [≡](#contents) [`XHR.statusIsHttpSuccess(xhr) ~> boolean`](#XHR-statusIsHttpSuccess)

`XHR.statusIsHttpSuccess(xhr)` is shorthand for
`XHR.isHttpSuccess(XHR.status(xhr))`.  See also [`XHR.status`](#XHR-status) and
[`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

#### <a id="XHR-statusText"></a> [≡](#contents) [`XHR.statusText(xhr) ~> string`](#XHR-statusText)

`XHR.statusText` returns an observable property of the
[`statusText`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText)
of an ongoing XHR.

#### <a id="XHR-timeout"></a> [≡](#contents) [`XHR.timeout(xhr) ~> number`](#XHR-timeout)

`XHR.timeout` returns an observable property of the
[`timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout)
property of an ongoing XHR.

#### <a id="XHR-withCredentials"></a> [≡](#contents) [`XHR.withCredentials(xhr) ~> boolean`](#XHR-withCredentials)

`XHR.withCredentials` returns an observable property of the
[`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
property of an ongoing XHR.

### <a id="download-state"></a> [≡](#contents) [Download state](#download-state)

#### <a id="XHR-downError"></a> [≡](#contents) [`XHR.downError(xhr) ~> exception`](#XHR-downError)

`XHR.downError` returns an observable property of the
[`error`](https://developer.mozilla.org/en-US/docs/Web/Events/error) property of
a failed XHR.

#### <a id="XHR-downHasEnded"></a> [≡](#contents) [`XHR.downHasEnded(xhr) ~> boolean`](#XHR-downHasEnded)

`XHR.downHasEnded` returns an observable boolean property that tells whether the
download operation of an ongoing XHR has
[ended](https://developer.mozilla.org/en-US/docs/Web/Events/loadend).

#### <a id="XHR-downHasFailed"></a> [≡](#contents) [`XHR.downHasFailed(xhr) ~> boolean`](#XHR-downHasFailed)

`XHR.downHasFailed` returns an observable boolean property that tells whether
the download operation of an ongoing XHR has
[failed](https://developer.mozilla.org/en-US/docs/Web/Events/error).

#### <a id="XHR-downHasStarted"></a> [≡](#contents) [`XHR.downHasStarted(xhr) ~> boolean`](#XHR-downHasStarted)

`XHR.downHasStarted` returns an observable boolean property that tells whether
the download operation of an ongoing XHR has
[started](https://developer.mozilla.org/en-US/docs/Web/Events/loadstart).

#### <a id="XHR-downHasSucceeded"></a> [≡](#contents) [`XHR.downHasSucceeded(xhr) ~> boolean`](#XHR-downHasSucceeded)

`XHR.downHasSucceeded` returns an observable boolean property that tells whether
the download operation of an ongoing XHR has
[succeeded](https://developer.mozilla.org/en-US/docs/Web/Events/load).  Note
that this does not take into account the HTTP response status, see
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

#### <a id="XHR-downHasTimedOut"></a> [≡](#contents) [`XHR.downHasTimedOut(xhr) ~> boolean`](#XHR-downHasTimedOut)

`XHR.downHasTimedOut` returns an observable boolean property that tells whether
the download operation of an ongoing XHR has [timed
out](https://developer.mozilla.org/en-US/docs/Web/Events/timeout).

#### <a id="XHR-downIsProgressing"></a> [≡](#contents) [`XHR.downIsProgressing(xhr) ~> boolean`](#XHR-downIsProgressing)

`XHR.downIsProgressing` returns an observable boolean property that tells
whether the download operation of an ongoing XHR is
[progressing](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

#### <a id="XHR-downLoaded"></a> [≡](#contents) [`XHR.downLoaded(xhr) ~> number`](#XHR-downLoaded)

`XHR.downLoaded` returns an observable property of the
[`loaded`](https://developer.mozilla.org/en-US/docs/Web/Events/progress)
property of an ongoing XHR.

#### <a id="XHR-downTotal"></a> [≡](#contents) [`XHR.downTotal(xhr) ~> number`](#XHR-downTotal)

`XHR.downTotal` returns an observable property of the
[`total`](https://developer.mozilla.org/en-US/docs/Web/Events/progress) property
of an ongoing XHR.

### <a id="upload-state"></a> [≡](#contents) [Upload state](#upload-state)

#### <a id="XHR-upError"></a> [≡](#contents) [`XHR.upError(xhr) ~> exception`](#XHR-upError)

`XHR.upError` returns an observable property of the
[`error`](https://developer.mozilla.org/en-US/docs/Web/Events/error) property of
a failed XHR.

#### <a id="XHR-upHasEnded"></a> [≡](#contents) [`XHR.upHasEnded(xhr) ~> boolean`](#XHR-upHasEnded)

`XHR.upHasEnded` returns an observable boolean property that tells whether the
upload operation of an ongoing XHR has
[ended](https://developer.mozilla.org/en-US/docs/Web/Events/loadend).

#### <a id="XHR-upHasFailed"></a> [≡](#contents) [`XHR.upHasFailed(xhr) ~> boolean`](#XHR-upHasFailed)

`XHR.upHasFailed` returns an observable boolean property that tells whether the
upload operation of an ongoing XHR has
[failed](https://developer.mozilla.org/en-US/docs/Web/Events/error).

#### <a id="XHR-upHasStarted"></a> [≡](#contents) [`XHR.upHasStarted(xhr) ~> boolean`](#XHR-upHasStarted)

`XHR.upHasStarted` returns an observable boolean property that tells whether the
upload operation of an ongoing XHR has
[started](https://developer.mozilla.org/en-US/docs/Web/Events/loadstart).

#### <a id="XHR-upHasSucceeded"></a> [≡](#contents) [`XHR.upHasSucceeded(xhr) ~> boolean`](#XHR-upHasSucceeded)

`XHR.upHasSucceeded` returns an observable boolean property that tells whether
the upload operation of an ongoing XHR has
[succeeded](https://developer.mozilla.org/en-US/docs/Web/Events/load).  Note
that this does not take into account the HTTP response status, see
[`XHR.status`](#XHR-status) and [`XHR.isHttpSuccess`](#XHR-isHttpSuccess).

#### <a id="XHR-upHasTimedOut"></a> [≡](#contents) [`XHR.upHasTimedOut(xhr) ~> boolean`](#XHR-upHasTimedOut)

`XHR.upHasTimedOut` returns an observable boolean property that tells whether
the upload operation of an ongoing XHR has [timed
out](https://developer.mozilla.org/en-US/docs/Web/Events/timeout).

#### <a id="XHR-upIsProgressing"></a> [≡](#contents) [`XHR.upIsProgressing(xhr) ~> boolean`](#XHR-upIsProgressing)

`XHR.upIsProgressing` returns an observable boolean property that tells whether
the upload operation of an ongoing XHR is
[progressing](https://developer.mozilla.org/en-US/docs/Web/Events/progress).

#### <a id="XHR-upLoaded"></a> [≡](#contents) [`XHR.upLoaded(xhr) ~> number`](#XHR-upLoaded)

`XHR.upLoaded` returns an observable property of the
[`loaded`](https://developer.mozilla.org/en-US/docs/Web/Events/progress)
property of an ongoing XHR.

#### <a id="XHR-upTotal"></a> [≡](#contents) [`XHR.upTotal(xhr) ~> number`](#XHR-upTotal)

`XHR.upTotal` returns an observable property of the
[`total`](https://developer.mozilla.org/en-US/docs/Web/Events/progress) property
of an ongoing XHR.

### <a id="auxiliary"></a> [≡](#contents) [Auxiliary](#auxiliary)

#### <a id="XHR-isHttpSuccess"></a> [≡](#contents) [`XHR.isHttpSuccess(number) ~> boolean`](#XHR-isHttpSuccess)

`XHR.isHttpSuccess` returns an observable property of whether the given numeric
property is in the range 2xx of [HTTP success
codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success).
See also [`XHR.statusIsHttpSuccess`](#XHR-statusIsHttpSuccess).

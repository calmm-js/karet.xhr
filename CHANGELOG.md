# Karet XHR Changelog

## 0.6.0

Renamed

* `XHR.responseFull` to `XHR.response`

and dropped the old `XHR.response` function, because getting the full response
is what one normally wants to do and having `XHR.response` return partial
results seems unnecessarily error prone.  The valid use cases of the old
`XHR.response` can be implemented through `XHR.responseText`.

## 0.5.0

Changed `XHR.responseFull` to require that the download has completed
successfully.

Changed `XHR.getJson` to wait that the XHR has completed successfully with a
HTTP success status and to emit the XHR as an error in case the XHR fails or
times out.

## 0.4.0

Renamed

* `XHR.downHasSucceeded` to `XHR.downHasCompleted`, and
* `XHR.upHasSucceeded` to `XHR.upHasCompleted`

to avoid them being confused with having the entire HTTP request being
successful.

Also renamed

* `XHR.headersReceived` to `XHR.isStatusAvailable`

so that it sounds like a query.

Changed `XHR.status`, `XHR.statusText`, `XHR.responseURL`, and `XHR.responseXML`
to wait for / require a meaningful ready state.

## 0.3.1

Fixed a bug introduced in 0.3.0 where observables were not properly eliminated
from `perform` parameters in non-production mode.

## 0.3.0

`performWith` now also merges default headers with override headers.
`performJson` also includes header `Content-Type: application/json`.

## 0.2.0

Previously `allResponseHeaders` and `responseHeader` produced `''` and `null`,
respectively, before the HTTP headers were received.  Now they only emit their
results after the HTTP headers have been received.

Previously `responseXML` produced `null` before the XHR was completed.  Now it
only produces its result after the XHR has been completed like `responseFull`.

## 0.1.3

Fixed a bug.  Previously the XHR was aborted unconditionally after unsubscribing
from the returned property.  Aborting a completed XHR clears the XHR object,
which we don't want as we want the XHR values to remain readable.  Now the XHR
is aborted only if the status is 0.

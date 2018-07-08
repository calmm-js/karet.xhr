# 0.2.0

Previously `allResponseHeaders` and `responseHeader` produced `''` and `null`,
respectively, before the HTTP headers were received.  Now they only emit their
results after the HTTP headers have been received.

Previously `responseXML` produced `null` before the XHR was completed.  Now it
only produces its result after the XHR has been completed like `responseFull`.

# 0.1.3

Fixed a bug.  Previously the XHR was aborted unconditionally after unsubscribing
from the returned property.  Aborting a completed XHR clears the XHR object,
which we don't want as we want the XHR values to remain readable.  Now the XHR
is aborted only if the status is 0.

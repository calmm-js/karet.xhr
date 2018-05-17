# 0.1.3

Fixed a bug.  Previously the XHR was aborted unconditionally after unsubscribing
from the returned property.  Aborting a completed XHR clears the XHR object,
which we don't want as we want the XHR values to remain readable.  Now the XHR
is aborted only if the status is 0.

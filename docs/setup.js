window.L = window.Kefir.partial.lenses
window.XHR = window.karet.xhr
window.log = function() {
  var Kefir = window.Kefir
  var log = console.log
  var xs = []
  for (let i = 0; i < arguments.length; ++i) {
    var x = arguments[i]
    xs.push(x instanceof Kefir.Observable ? x : Kefir.constant(x))
  }
  var log = console.log
  function logs(xs) {
    log.apply(console, xs)
  }
  Kefir.combine(xs).observe(logs, logs)
}

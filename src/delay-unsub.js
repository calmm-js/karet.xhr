import * as I from 'infestines'
import * as K from 'kefir'

const TIMER = 't'
const SOURCE = 's'
const HANDLER = 'h'

const TYPE = 'type'
const VALUE = 'value'
const END = 'end'

const DelayUnsub = I.inherit(
  function DelayUnsub(source) {
    const self = this
    K.Property.call(self)
    self[SOURCE] = source
    self[HANDLER] = self[TIMER] = 0
  },
  K.Property,
  {
    _onActivation() {
      const self = this
      if (self[TIMER]) {
        clearTimeout(self[TIMER])
        self[TIMER] = 0
      } else {
        self[SOURCE].onAny(
          (self[HANDLER] = e => {
            const t = e[TYPE]
            if (t === VALUE) {
              self._emitValue(e[VALUE])
            } else if (t === END) {
              self._emitEnd()
            } else {
              self._emitError(e[VALUE])
            }
          })
        )
      }
    },
    _onDeactivation() {
      const self = this
      self[TIMER] = setTimeout(() => {
        self[SOURCE].offAny(self[HANDLER])
        self[HANDLER] = self[TIMER] = 0
      }, 0)
    }
  }
)

export const delayUnsub = source => new DelayUnsub(source)

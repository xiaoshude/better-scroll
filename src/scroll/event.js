/**
 * 这可以做一个通用的事件mixin
 * 被这个处理后的对象都具有事件机制
 *
 */

export function eventMixin(BScroll) {
  BScroll.prototype.on = function (type, fn, context = this) {
    if (!this._events[type]) {
      this._events[type] = []
    }

    this._events[type].push([fn, context])
  }

  BScroll.prototype.once = function (type, fn, context = this) {
    let fired = false

    function magic() {
      this.off(type, magic)

      if (!fired) {
        fired = true
        fn.apply(context, arguments)
      }
    }

    this.on(type, magic)
  }

  BScroll.prototype.off = function (type, fn) {
    let _events = this._events[type]
    if (!_events) {
      return
    }

    let count = _events.length
    while (count--) {
      if (_events[count][0] === fn) {
        // 这里完全可以slice掉啊 置为undefined 虽然不会执行了 但回导致数组里有很多无用数据啊
        _events[count][0] = undefined
      }
    }
  }

  BScroll.prototype.trigger = function (type) {
    let events = this._events[type]
    if (!events) {
      return
    }

    let len = events.length
    let eventsCopy = [...events]
    for (let i = 0; i < len; i++) {
      let event = eventsCopy[i]
      let [fn, context] = event
      if (fn) {
        fn.apply(context, [].slice.call(arguments, 1))
      }
    }
  }
}

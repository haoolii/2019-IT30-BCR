'use strict'

/**
 * 倒數計時器，onComplete onChange兩個hoock
 * @param {*} time 倒數的時間
 */
var timeclock = function () {
  var _total_time = 0
  var _time = 0
  var _change_cbs = []
  var _complete_cbs = []
  var _during_time = 0

  var onComplete = function (cb) {
    if (typeof cb !== 'function') { throw new Error('NOT FUNCTION TYPE') }
    _complete_cbs.push(cb)
  }

  var onChange = function (cb) {
    if (typeof cb !== 'function') { throw new Error('NOT FUNCTION TYPE') }
    _change_cbs.push(cb)
  }

  var emitComplete = function () {
    _complete_cbs.map(e => e())
  }

  var emitChange = function (second) {
    _change_cbs.map(e => e(second))
  }

  var start = function (time) {
    _time = time
    _total_time = time
    emitChange(_total_time - _during_time)
    var _interval = setInterval(() => {
      if (_time <= 0) {
        clearInterval(_interval)
        emitComplete()
      } else {
        _time -= 1000
        _during_time += 1000
        emitChange(_total_time - _during_time)
      }
    }, 1000)
  }

  return {
    onComplete,
    onChange,
    start
  }
}

module.exports = timeclock
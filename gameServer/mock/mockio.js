var mockio = function() {
  var _cbs = {}
  this.on = function(event, listener) {
    if (!_cbs[event]) _cbs[event] = []
    _cbs[event].push(listener)
  }

  this.emit = function(cmd) {
    var args = [].slice.call(arguments, 1)
    for (var i in _cbs[cmd]) {
      _cbs[cmd][i](...args)
    }
  }
}
module.exports = new mockio()

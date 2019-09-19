var mockSocket = function(id) {
  this._id = id
  var _cbs = {}

  this.on = function(event, listener) {
    if (!_cbs[event]) _cbs[event] = []
    _cbs[event].push(listener)
  }

  this.off = function(event, listener) {
    if (!_cbs[event]) _cbs[event] = []
    var i = _cbs[event].indexOf(listener)
    _cbs[event][i] = null
    _cbs[event].splice(i, 1)
  }

  this.emit = function(cmd) {
    var args = [].slice.call(arguments, 1)
    for (var i in _cbs[cmd]) {
      _cbs[cmd][i](...args)
    }
  }
}
module.exports = mockSocket

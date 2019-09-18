const mockio = require('../mock/mockio')
const cmd = require('../../cmd')
const MainController = require('./MainController')
const auth = require('../middleware/auth')

var WsController = function() {
  var io = null
  var usersSocket = {}

  MainController.initWs(this)

  this.initSocket = function(http) {
    io = require('socket.io')(http)
    io.use(auth)
    // io
    ___socket(io)
  }

  this.notifyAll = function(ntf, data) {
    console.log(Object.keys(usersSocket))
  }

  this.notifyPeerError = function(id, err) {
    if (usersSocket[id]) {
      usersSocket[id].emit('99999999', { error: err })
    } else {
      console.log('NOT CONNECTED')
    }
  }

  this.notifyPeer = function(id, ntf, data) {
    if (usersSocket[id]) {
      usersSocket[id].emit(ntf, data)
    } else {
      console.log('NOT CONNECTED')
    }
  }
  var ___socket = function(_io) {
    _io.on('connection', function(socket) {
      socket.emit('connect')
      var rqs = (reqkey, reskey, id, data) => {
        MainController.onWs(reqkey, id, data)
          .then(res => socket.emit(reskey, { result: res }))
          .catch(err => socket.emit(reskey, { error: err }))
      }
      usersSocket[socket._id] = socket

      socket.on(cmd.REQ_USER_TB_SITDOWN, data => {
        rqs(cmd.REQ_USER_TB_SITDOWN, cmd.RES_USER_TB_SITDOWN, socket._id, data)
      })

      socket.on(cmd.REQ_USER_LOGIN, data => {
        rqs(cmd.REQ_USER_LOGIN, cmd.RES_USER_LOGIN, socket._id, data)
      })

      socket.on(cmd.REQ_USER_INFO, data => {
        rqs(cmd.REQ_USER_INFO, cmd.RES_USER_INFO, socket._id, data)
      })

      socket.on(cmd.REQ_USER_BET_INFO, data => {
        rqs(cmd.REQ_USER_BET_INFO, cmd.RES_USER_BET_INFO, socket._id, data)
      })

      socket.on(cmd.REQ_TB_INFO, data => {
        rqs(cmd.REQ_TB_INFO, cmd.RES_TB_INFO, socket._id, data)
      })

      socket.on(cmd.REQ_USER_BETOUT, data => {
        rqs(cmd.REQ_USER_BETOUT, cmd.RES_USER_BETOUT, socket._id, data)
      })

      socket.on('disconnect', socket => {
        usersSocket[socket.id] = null
        delete usersSocket[socket.id]
        console.log('user disconnect')
      })
    })
  }
}
module.exports = new WsController()

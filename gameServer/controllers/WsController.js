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
    // io.use(auth)
    // io
    ___socket(mockio)
  }

  this.notifyPeerError = function(id, err) {
    if (usersSocket[id]) {
      usersSocket[id].emit('99999999', { error: err })
    } else {
      console.log(`id :${id} notifyPeerError NOT CONNECTED`)
    }
  }

  this.notifyPeer = function(id, ntf, cst, data) {
    if (usersSocket[id]) {
      usersSocket[id].emit(ntf, cst, data)
    } else {
      console.log(`id :${id} notifyPeer  NOT CONNECTED`)
    }
  }
  var ___socket = function(_io) {
    _io.on('connection', function(socket) {
      socket.emit('connect')

      const __rqs = (reqkey, reskey, id, data) => {
        MainController.onWs(reqkey, id, data)
          .then(res => socket.emit(reskey, { result: res }))
          .catch(err => socket.emit(reskey, { error: err }))
      }
      usersSocket[socket._id] = socket

      socket.on(cmd.REQ_USER_TB_SITDOWN, data => {
        __rqs(
          cmd.REQ_USER_TB_SITDOWN,
          cmd.RES_USER_TB_SITDOWN,
          socket._id,
          data
        )
      })

      socket.on(cmd.REQ_USER_LOGIN, data => {
        __rqs(cmd.REQ_USER_LOGIN, cmd.RES_USER_LOGIN, socket._id, data)
      })

      socket.on(cmd.REQ_USER_INFO, data => {
        __rqs(cmd.REQ_USER_INFO, cmd.RES_USER_INFO, socket._id, data)
      })

      socket.on(cmd.REQ_USER_BET_INFO, data => {
        __rqs(cmd.REQ_USER_BET_INFO, cmd.RES_USER_BET_INFO, socket._id, data)
      })

      socket.on(cmd.REQ_TB_INFO, data => {
        __rqs(cmd.REQ_TB_INFO, cmd.RES_TB_INFO, socket._id, data)
      })

      socket.on(cmd.REQ_USER_BETOUT, data => {
        __rqs(cmd.REQ_USER_BETOUT, cmd.RES_USER_BETOUT, socket._id, data)
      })

      socket.on('disconnect', socket => {
        __rqs(cmd.REQ_USER_LOGOUT, cmd.RES_USER_LOGOUT, socket._id)
        usersSocket[socket._id] = null
        delete usersSocket[socket._id]
      })
    })
  }
}
module.exports = new WsController()

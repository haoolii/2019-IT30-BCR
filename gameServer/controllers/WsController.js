const mockio = require('../mock/mockio')
const cmd = require('../../cmd')
const BetController = require('./BetController')
const UserController = require('./UserController')
const TableController = require('./TableController')

var wsController = function() {
  var io = null

  this.initSocket = function(http) {
    io = require('socket.io')(http)
  }

  mockio.on('connection', function(socket) {
    socket.emit('SYS', 'YOU ARE CONNECTED!')

    socket.on(cmd.REQ_USER_LOGIN, id => {
      setTimeout(() => {
        socket.emit(cmd.RES_USER_LOGIN, '成功登入')
      }, 500)
    })

    socket.on(cmd.REQ_USER_INFO, id => {
      UserController.GET_USER_INFO(id).then(data => {
        socket.emit(cmd.RES_USER_INFO, data)
      })
    })

    socket.on(cmd.REQ_USER_BET_INFO, id => {
      BetController.GET_USER_BETINFO(id).then(data => {
        socket.emit(cmd.RES_USER_BET_INFO, data)
      })
    })

    socket.on(cmd.REQ_TB_INFO, tbid => {
      TableController.GET_TB_INFO(tbid).then(data => {
        socket.emit(cmd.RES_TB_INFO, data)
      })
    })

    socket.on(cmd.REQ_USER_LOGIN, id => {
      setTimeout(() => {
        socket.emit(cmd.RES_USER_LOGIN, 'success')
      }, 500)
    })

    socket.on('disconnect', () => {
      console.log('user disconnect')
    })
  })
}
module.exports = new wsController()

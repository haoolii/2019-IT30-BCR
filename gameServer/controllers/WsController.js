const mockio = require('../mock/mockio')
const cmd = require('../../cmd')
const BetController = require('./BetController')
const UserController = require('./UserController')
const TableController = require('./TableController')

var wsController = function () {
  var io = null
  var usersSocket = {}

  this.initSocket = function (http) {
    io = require('socket.io')(http)
  }

  mockio.on('connection', function (socket) {
    socket.emit('SYS', 'YOU ARE CONNECTED!')
    usersSocket[socket.id] = socket

    socket.on(cmd.REQ_USER_LOGIN, ({ tbid }) => {
      TableController.USET_LOGIN_TB(socket.id, tbid)
      setTimeout(() => {
        socket.emit(cmd.RES_USER_LOGIN, '成功登入')
      }, 500)
    })

    socket.on(cmd.REQ_USER_INFO, () => {
      UserController.GET_USER_INFO(socket.id).then(data => {
        socket.emit(cmd.RES_USER_INFO, data)
      })
    })

    socket.on(cmd.REQ_USER_BET_INFO, () => {
      BetController.GET_USER_BETINFO(socket.id).then(data => {
        socket.emit(cmd.RES_USER_BET_INFO, data)
      }).catch(err => {
        socket.emit(cmd.RES_USER_BET_INFO, err)
      })
    })

    socket.on(cmd.REQ_TB_INFO, ({ tbid }) => {
      TableController.GET_TB_INFO(tbid).then(data => {
        socket.emit(cmd.RES_TB_INFO, data)
      }).catch(err => {
        socket.emit(cmd.RES_TB_INFO, err)
      })
    })

    socket.on(cmd.REQ_USER_BETOUT, ({ bet }) => {
      BetController.GET_USER_BETINFO('2').then((r) => {
        console.log('exist')
      }, () => {
        BetController.CREATE_USER_BETINFO('2', bet)
      })
      // BetController.UPDATE_USER_BETINFO(socket.id, bet)
      // setTimeout(() => {
      //   socket.emit(cmd.RES_USER_LOGIN, 'success')
      // }, 500)
    })


    socket.on('disconnect', (socket) => {
      console.log('disconnect')
      usersSocket[socket.id] = null
      delete usersSocket[socket.id]
      console.log('user disconnect')
    })
  })
}
module.exports = new wsController()

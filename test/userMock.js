const mockSocket = require('../gameServer/mock/mockSocket')
const mockio = require('../gameServer/mock/mockio')
const cmd = require('../cmd')

var userMock = function(id) {
  this.id = id
  this.socket = new mockSocket(this.id)
  var _req_wait = cmd => {
    return new Promise((resolve, reject) => {
      const handlers = {}
      handlers[cmd] = data => {
        unlisten()
        if (data && data.err) {
          reject(data.err)
          return
        }
        resolve(data)
      }
      const unlisten = () => {
        for (let name in handlers) {
          this.socket.off(name, handlers[name])
        }
      }
      for (let name in handlers) {
        this.socket.on(name, handlers[name])
      }
    })
  }

  this.bet = {
    banker: 0,
    player: 0,
    bankerking: 0,
    playerking: 0,
    tie: 0,
    tiepair: 0,
    bpair: 0,
    ppair: 0
  }

  this.socket.on('SYS', res => {
    console.log('SYS: ' + res)
  })

  this.connect = function() {
    mockio.emit('connection', this.socket)
  }

  this.disconnect = function() {
    mockio.emit('disconnect')
  }

  this.login = function() {
    this.socket.emit(cmd.REQ_USER_LOGIN, this.socket)
    _req_wait(cmd.RES_USER_LOGIN).then(res => {
      console.log('hay: ' + res)
    })
  }

  this.getBetInfo = function() {
    this.socket.emit(cmd.REQ_USER_BET_INFO, this.id)
    _req_wait(cmd.RES_USER_BET_INFO).then(res => {
      console.log('BET_INFO: ' + JSON.stringify(res))
    })
  }

  this.getUserInfo = function() {
    this.socket.emit(cmd.REQ_USER_INFO, this.id)
    _req_wait(cmd.RES_USER_INFO).then(res => {
      console.log('USER_INFO: ' + JSON.stringify(res))
    })
  }

  this.getTBInfo = function() {
    this.socket.emit(cmd.REQ_TB_INFO, '1')
    _req_wait(cmd.RES_TB_INFO).then(res => {
      console.log('TB_INFO: ' + JSON.stringify(res))
    })
  }

  this.logout = function() {
    this.socket.emit('disconnect')
  }
}
module.exports = userMock

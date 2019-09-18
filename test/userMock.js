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

  this.socket.on(cmd.MSG_TB_FANPI, res => {
    console.log(res)
  })

  this.socket.on(cmd.MSG_BT_PAYOUT, res => {
    console.log(res)
  })

  this.socket.on(cmd.MSG_BT_PAYOUT, res => {
    console.log(res)
  })

  this.socket.on(cmd.MSG_TB_NTF, res => {
    console.log('MSG_TB_NTF: ' + JSON.stringify(res))
  })

  this.socket.on(cmd.MSG_USER_INFO, res => {
    console.log('U MSG_USER_INFO')
    console.log(res)
  })
  this.socket.on(cmd.MSG_TB_COUNTTIME, time => {
    console.log('U 剩下= ' + time)
  })

  this.socket.on(cmd.MSG_TB_KICKOUT, res => {
    console.log('U 三局沒下注，被踢出了')
  })

  this.socket.on(cmd.MSG_ERROR_NTF, err => {
    console.log(`U 收到ERROR ${JSON.stringify(err)}`)
  })

  this.connect = function() {
    mockio.emit('connection', this.socket)
  }

  this.disconnect = function() {
    this.socket.emit('disconnect', this.socket)
  }
  this.socket.on('NTF', data => {
    console.log('U NTF' + JSON.stringify(data))
  })

  this.login = function() {
    this.socket.emit(cmd.REQ_USER_LOGIN, { tbid: '1' })
    _req_wait(cmd.RES_USER_LOGIN).then(res => {
      console.log('U hay: ' + res)
    })
  }

  this.getBetInfo = function() {
    this.socket.emit(cmd.REQ_USER_BET_INFO)
    _req_wait(cmd.RES_USER_BET_INFO).then(res => {
      console.log('U BET_INFO: ' + JSON.stringify(res))
    })
  }

  this.getUserInfo = function() {
    this.socket.emit(cmd.REQ_USER_INFO)
    _req_wait(cmd.RES_USER_INFO).then(res => {
      console.log('U USER_INFO: ' + JSON.stringify(res))
    })
  }

  this.getTBInfo = function() {
    this.socket.emit(cmd.REQ_TB_INFO, { tbid: '1' })
    _req_wait(cmd.RES_TB_INFO).then(res => {
      console.log('U TB_INFO: ' + JSON.stringify(res))
    })
  }

  this.tbsit = function() {
    this.socket.emit(cmd.REQ_USER_TB_SITDOWN, { tbid: '1' })
    _req_wait(cmd.RES_USER_TB_SITDOWN).then(res => {
      console.log('U TB_SIT_INFO: ' + JSON.stringify(res))
    })
  }

  this.betout = function() {
    this.socket.emit(cmd.REQ_USER_BETOUT, {
      bet: {
        banker: 0,
        player: 30000,
        bankerking: 0,
        playerking: 0,
        tie: 0,
        tiepair: 0,
        bpair: 0,
        ppair: 0
      }
    })
    _req_wait(cmd.RES_USER_BETOUT).then(res => {
      console.log('U BETOUT: ' + JSON.stringify(res))
    })
  }

  this.logout = function() {
    this.socket.emit('disconnect')
  }
}
module.exports = userMock

const { Game } = require('../core')
const cmd = require('../../cmd')
const GameController = require('./GameController')
const { $R, $G, $N } = require('../lib')
const { delay } = require('../utils')

var MainController = function () {
  this.game = new Game()
  this.poker = null
  this.pokerList = []
  this.games = {}
  this.ws = null
  this.gamestatus = 0 // 0 等待中 1 開始中
  this.initGames = async function (__tbid) {
    try {
      if (this.gamestatus) return
      if (this.games[__tbid]) return
      var anyUserInTb = await $G.ensureUserInTb(__tbid)
      if (anyUserInTb) {
        this.games[__tbid] = GameController
        GameController.buildGame(__tbid)
        GameController.onStatus(__tbid, (status, data) =>
          $G.tbNotify(__tbid, status, data)
        )
        GameController.onComplete(__tbid, async r => {
          try {
            await $G.calcTbPool(__tbid)
            await $G.tbPayout(__tbid, r)
            this.games[__tbid] = null
            this.gamestatus = 0
            setTimeout(() => this.initGames(__tbid), 20000)
          } catch (err) {
            console.log('error initGames')
            throw err
          }
        })
        GameController.gameStart(__tbid)
        this.gamestatus = 1
        delete this.games.__tbid
      }
    } catch (err) {
      console.log(err)
    }
  }

  this.initTb = function (__tbid) {
    $G.onUserJoin(__tbid, () => {
      this.initGames(__tbid)
    })
  }

  this.initWs = function (_ws) {
    this.ws = _ws
    $N.initNTF(this.ws)
  }

  this.onWs = function (reqkey, id, data) {
    return new Promise((resolve, reject) => {
      const _R = p => p.then(resolve).catch(reject)
      switch (reqkey) {
        case cmd.REQ_USER_TB_SITDOWN:
          _R($R.sitDown(data.tbid, id))
          break
        case cmd.REQ_USER_LOGIN:
          _R($R.login(id))
          break
        case cmd.REQ_USER_BETOUT:
          _R($R.betOut(id, data.bet))
          break
        case cmd.REQ_USER_BET_INFO:
          _R($R.betInfo(id))
          break
        case cmd.REQ_TB_INFO:
          _R($R.tbInfo(id))
          break
        case cmd.REQ_USER_INFO:
          _R($R.userInfo(id))
          break
        case cmd.REQ_USER_LOGOUT:
          _R($R.logout(id))
      }
    })
  }
  this.initTb('1')
}
module.exports = new MainController()

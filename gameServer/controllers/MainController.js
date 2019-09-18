const { Game } = require('../core')
const cmd = require('../../cmd')
const GameController = require('./GameController')
const { $R, $G, $N } = require('../lib')

var MainController = function() {
  this.game = new Game()
  this.poker = null
  this.pokerList = []
  this.games = {}
  this.ws = null

  this.initGames = async function(__tbid) {
    if (this.games[__tbid]) return
    var anyUserInTb = await $G.ensureUserInTb(__tbid)
    if (anyUserInTb) {
      this.games[__tbid] = GameController
      GameController.buildGame(__tbid)
      GameController.onChange(__tbid, c => console.log(`剩餘: ${c} ms`))
      GameController.onStatus(__tbid, status => $G.tbNotify(__tbid, status))
      GameController.onComplete(__tbid, async r => {
        await $G.calcTbPool(__tbid)
        await $G.tbPayout(__tbid, r)
        this.games[__tbid] = null
        setTimeout(() => this.initGames(__tbid), 2000)
      })
      GameController.gameStart(__tbid)
      delete this.games.__tbid
    }
  }

  this.initTb = function(__tbid) {
    $G.onUserJoin(__tbid, () => {
      this.initGames(__tbid)
    })
  }

  this.initTb('1')

  this.initWs = function(_ws) {
    this.ws = _ws
    $N.initNTF(this.ws)
  }

  this.onWs = function(reqkey, id, data) {
    return new Promise((resolve, reject) => {
      const _R = p => p.then(resolve).catch(reject)

      switch (reqkey) {
        case cmd.REQ_USER_TB_SITDOWN:
          _R($R.sitDown(data.tbid, id))
          break
        case cmd.REQ_USER_LOGIN:
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
      }
    })
  }
}
module.exports = new MainController()

const { Game } = require('../core')
const cmd = require('../../cmd')
const GameController = require('./GameController')
const { $R, $G, $N } = require('../lib')

var MainController = function() {
  this.game = new Game()
  this.poker = null
  this.pokerList = []
  this.ws = null

  GameController.buildGame('1')
  GameController.onChange('1', c => {
    console.log(`c ${c}`)
  })
  GameController.onComplete('1', async r => {
    await $G.calcTbPool('1')
    await $G.tbPayout('1', r)
  })
  GameController.onStatus('1', status => {
    $G.tbNotify('1', status)
  })
  // GameController.gameStart('1')

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
          break
      }
    })
  }
}
module.exports = new MainController()

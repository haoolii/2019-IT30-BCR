const { Game } = require('../core')
const config = require('../config')
const cmd = require('../../cmd')
const { calcBetTotal } = require('../utils')
const BetController = require('./BetController')
const UserController = require('./UserController')
const TableController = require('./TableController')
const GameController = require('./GameController')
const { $R } = require('../lib')

var MainController = function () {
  this.game = new Game()
  this.poker = null
  this.pokerList = []
  this.wsc = null

  GameController.buildGame('1')
  GameController.onChange('1', c => {
    console.log(`c ${c}`)
  })
  GameController.onComplete('1', r => {
    console.log(r)
  })
  GameController.onStatus('1', s => {
    console.log('onstaus' + s)
  })
  GameController.gameStart('1')

  this.initWs = function (_wsc) {
    this.wsc = _wsc
  }

  var notifyPeer = (id, ntf, data) => {
    this.wsc.notifyPeer(id, ntf, data)
  }

  var notifyTB = function (tbid, ntf, data) {
    TableController.GET_TB_INFO(tbid).then(tbinfo => {
      tbinfo.users.map(uid => {
        this.wsc.notifyPeer(uid, ntf, data)
      })
    })
  }
  var kickCheck = uid => {
    return BetController.GET_USER_BETINFO(uid).then(userInfo => {
      if (userInfo.kickcount >= config.bcr.kickCount) {
        notifyPeer(uid, cmd.MSG_TB_KICKOUT)
      }
    })
  }
  // var gamePeerPayout = async (uid, betresult) => {
  //   await kickCheck(uid)
  //   var _userbet = {}
  //   var _userWinTotal = 0
  //   var _balance = (await UserController.GET_USER_INFO(uid)).balance
  //   var _userinfo = await BetController.GET_USER_BETINFO(uid)
  //   if (calcBetTotal(_userinfo.bet) === 0) {
  //     await BetController.INCREASE_USER_KICKCOUNT(uid)
  //   } else {
  //     _userbet = userPayout(
  //       _userinfo.bet,
  //       betresult.calc_result,
  //       config.bcr.odds
  //     )
  //     _userWinTotal = calcBetTotal(_userbet)
  //     _userinfo = await UserController.UPDATE_USER_INFO(uid, {
  //       balance: _balance + _userWinTotal
  //     })
  //     delete _userinfo.password
  //     await BetController.RESET_USER_BETOUT(uid)
  //     notifyPeer(uid, cmd.MSG_BT_PAYOUT, _userbet)
  //     notifyPeer(uid, cmd.MSG_USER_INFO, _userinfo)
  //   }
  //   notifyPeer(uid, cmd.MSG_TB_FANPI, betresult)
  // }

  this.onWs = function (reqkey, id, data) {
    return new Promise((resolve, reject) => {
      switch (reqkey) {
        case cmd.REQ_USER_TB_SITDOWN:
          $R.sitdown(data.tbid, id).then(resolve).catch(reject)
          break
        case cmd.REQ_USER_LOGIN:
          break
        case cmd.REQ_USER_BETOUT:
          $R.betOut(id, data.bet).then(resolve).catch(reject)
          break
        case cmd.REQ_USER_BET_INFO:
          BetController.GET_USER_BETINFO(id)
            .then(resolve)
            .catch(reject)
          break
        case cmd.REQ_TB_INFO:
          break
        case cmd.REQ_USER_INFO:
          break
      }
    })
  }
}
module.exports = new MainController()

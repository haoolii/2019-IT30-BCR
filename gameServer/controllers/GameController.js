const { Game } = require('../core')
const config = require('../config')
const cmd = require('../../cmd')
const { preparePoker, fanPi, timeClock } = require('../lib')
const { calcBetTotal } = require('../utils')
const BetController = require('./BetController')
const UserController = require('./UserController')
const TableController = require('./TableController')

var GameController = function () {
  this.game = new Game()
  this.poker = null
  this.pokerList = []
  this.wsc = null

  this.initWs = function (_wsc) {
    this.wsc = _wsc
  }

  var notifyPeer = function (id, ntf, data) {
    this.wsc.notifyPeer(id, ntf, data)
  }

  var notifyAll = function (ntf, data) {
    this.wsc.notifyAll(ntf, data)
  }

  var notifyTB = function (tbid, ntf, data) {
    TableController.GET_TB_INFO(tbid).then(res => {
      console.log(res)
    })
  }

  var gameComplete = function (res) {
    console.log(res)
  }

  this.beforeCreated = function () {
    try {
      this.poker = config.poker
      this.pokerList = preparePoker(
        this.poker.pokerTemplate,
        this.poker.pokerPointTemplate,
        this.poker.pokerTypeTemplate,
        this.poker.pokerCount
      )
      this.game.initPokerList(this.pokerList)
      this.game.initNotify({})
      this.game.initTimeClock(timeClock)
      this.game.initPlayerSupplyRule(config.bcr.player_rule)
      this.game.initBankererSupplyRule(config.bcr.banker_rule)
      this.game.initFanPi(fanPi)
      this.game.initOdds(config.bcr.odds)
      // this.game.start()

      this.game.onChange((res) => {
        console.log('onChange' + res)
      })
      this.game.onComplete((res) => {
        gameComplete(res)
      })
    } catch (err) {
      console.log(`ERR ${err}`)
    }
  }

  this.onWs = function (reqkey, id, data) {
    return new Promise((resolve, reject) => {
      switch (reqkey) {
        case cmd.REQ_USER_TB_SITDOWN:
          TableController
            .USER_SITDOWN(data.tbid, id)
            .then(res => {
              UserController.UPDATE_USER_INFO(id, { tbid: data.tbid }).then(resolve)
            })
            .catch(reject)
          break
        case cmd.REQ_USER_LOGIN:
          console.log('case cmd.REQ_USER_LOGIN:')
          break
        case cmd.REQ_USER_BETOUT:
          var _balance = 0
          UserController.GET_USER_INFO(id).then(({ balance, tbid }) => {
            if (calcBetTotal(data.bet) > balance) throw ('餘額不足')
            _balance = balance
            return TableController.GET_TB_INFO(tbid)
          }).then(tbinfo => {
            if (tbinfo.status === 1) throw ('開牌中 不能下注')
            return BetController.UPDATE_USER_BETOUT(id, data.bet)
          }).then(betinfo => {
            return UserController.UPDATE_USER_INFO(id, { balance: _balance - calcBetTotal(data.bet) })
          }).then(userinfo => {
            resolve(data.bet)
          })
            .catch(reject)
          break
        case cmd.REQ_USER_BET_INFO:
          BetController.GET_USER_BETINFO(id).then(resolve).catch(reject)
          break
        case cmd.REQ_TB_INFO:
          break
        case cmd.REQ_USER_INFO:
          break
      }
    })
  }
  this.beforeCreated()
}
module.exports = new GameController()

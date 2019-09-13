const { Game } = require('../core')
const config = require('../config')
const { preparePoker, fanPi, timeClock } = require('../lib')
const WsController = require('./WsController')
const UserController = require('./BetController')

var GameController = function () {
  this.game = new Game()
  this.poker = null
  this.pokerList = []

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
      this.game.start()
      this.game.start()
      this.game.start()

      this.game.onChange((res) => {
        console.log('onChange' + res)
      })
      this.game.onComplete((res) => {
        console.log(res)
      })
    } catch (err) {
      console.log(`ERR ${err}`)
    }
  }
  this.beforeCreated()
}
module.exports = new GameController()

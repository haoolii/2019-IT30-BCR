const { Round, Game } = require('../core')
const config = require('../config')
const { preparePoker, fanPi, timeClock } = require('../lib')

var GameController = function(ntf) {
  this.game = new Game()
  this.poker = null
  this.pokerList = []

  this.beforeCreated = function() {
    this.poker = config.poker
    this.pokerList = preparePoker(
      this.poker.pokerTemplate,
      this.poker.pokerPointTemplate,
      this.poker.pokerTypeTemplate,
      this.poker.pokerCount
    )
    this.game.initRound(Round)
    this.game.initPokerList(this.pokerList)
    this.game.initNotify(ntf)
    this.game.initTimeClock(timeClock)
    this.game.initPlayerSupplyRule(config.bcr.player_rule)
    this.game.initBankererSupplyRule(config.bcr.banker_rule)
    this.game.initFanPi(fanPi)
    this.game.startGame()
  }
  this.beforeCreated()
}
module.exports = GameController

const { Round, Game } = require('../core')
const config = require('../config')
const { preparePoker, fanPi, timeClock } = require('../lib')

var GameController = function (wsController) {
  this.wsController = wsController
  this.game = new Game()
  this.poker = null
  this.pokerList = []

  this.beforeCreated = function () {
    this.poker = config.poker
    this.pokerList = preparePoker(
      this.poker.pokerTemplate,
      this.poker.pokerPointTemplate,
      this.poker.pokerTypeTemplate,
      this.poker.pokerCount
    )
    this.game.initRound(Round)
    this.game.initPokerList(this.pokerList)
    this.game.initNotify({})
    this.game.initTimeClock(timeClock)
    this.game.initPlayerSupplyRule(config.bcr.player_rule)
    this.game.initBankererSupplyRule(config.bcr.banker_rule)
    this.game.initFanPi(fanPi)
    this.game.initOdds(config.bcr.odds)
    this.game.startGame()
  }

  this.joinTest = function (user) {
    console.log('join')
    this.game.userJoin(user)
    setTimeout(() => {
      this.game.userBetout({
        id: '1234',
        bet: {
          'banker': 100,
          'player': 100,
          'bankerking': 1000,
          'playerking': 500,
          'tie': 0,
          'tiepair': 0,
          'bpair': 0,
          'ppair': 0,
        },
        loose: 0,
        emit: function (cmd, msg) {
          console.log(`${cmd}: ${msg}`)
        }
      })
    }, 500)
  }
  this.beforeCreated()
}
module.exports = GameController

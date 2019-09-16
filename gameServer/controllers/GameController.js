const { Game } = require('../core')
const config = require('../config')
const cmd = require('../../cmd')
const { preparePoker, fanPi, timeClock } = require('../core')
const TableController = require('./TableController')

var GameController = function () {
  this.gameList = {}

  this.buildGame = function (tbid) {
    var _game_obj = {
      poker: null,
      pokerList: [],
      game: new Game(tbid)
    }
    this.gameList[tbid] = _game_obj
    gameInit(_game_obj)
  }
  var gameInit = function (_game_obj) {
    try {
      _game_obj.poker = config.poker
      _game_obj.pokerList = preparePoker(
        _game_obj.poker.pokerTemplate,
        _game_obj.poker.pokerPointTemplate,
        _game_obj.poker.pokerTypeTemplate,
        _game_obj.poker.pokerCount
      )
      _game_obj.game.initPokerList(_game_obj.pokerList)
      _game_obj.game.initNotify({})
      _game_obj.game.initTimeClock(timeClock)
      _game_obj.game.initgameTime(1000)
      _game_obj.game.initPlayerSupplyRule(config.bcr.player_rule)
      _game_obj.game.initBankererSupplyRule(config.bcr.banker_rule)
      _game_obj.game.initFanPi(fanPi)
      _game_obj.game.initOdds(config.bcr.odds)
      // _game_obj.game.start()
    } catch (err) {
      console.log(`ERR ${err}`)
    }
  }

  this.onChange = function (tbid, listener) {
    this.gameList[tbid].game.onChange(betchange => listener(betchange))
  }

  this.onComplete = function (tbid, listener) {
    this.gameList[tbid].game.onComplete(betresult => listener(betresult))
  }

  this.onStatus = function (tbid, listener) {
    this.gameList[tbid].game.onStatus(status => listener(status))
  }

  this.gameStart = function (tbid) {
    this.gameList[tbid].game.start()
  }
}
module.exports = new GameController()

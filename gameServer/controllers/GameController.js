const { Game } = require('../core')
const config = require('../config')
const cmd = require('../../cmd')
const cst = require('../../cst')
const { preparePoker, fanPi, timeClock } = require('../core')
const { $G } = require('../lib')

var GameController = function() {
  this.gameList = {}

  this.buildGame = async function(tbid) {
    var _game_obj = {
      tbid: tbid,
      poker: null,
      pokerList: [],
      game: new Game(tbid)
    }

    this.gameBetStatus(tbid, 1) // 不能下注
    _game_obj.game.onComplete(() => this.gameBetStatus(tbid, 1)) // 不能下注
    this.gameList[tbid] = _game_obj
    gameInit(_game_obj)
  }
  var gameInit = function(_game_obj) {
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
      _game_obj.game.initgameTime(config.bcr.time)
      _game_obj.game.initPlayerSupplyRule(config.bcr.player_rule)
      _game_obj.game.initBankererSupplyRule(config.bcr.banker_rule)
      _game_obj.game.initFanPi(fanPi)
      _game_obj.game.initOdds(config.bcr.odds)
      // _game_obj.game.start()
    } catch (err) {
      console.log(`ERR ${err}`)
    }
  }

  this.onComplete = function(tbid, listener) {
    this.gameList[tbid].game.onComplete(betresult =>
      listener(betresult)
    )
  }

  this.onStatus = function(tbid, listener) {
    this.gameList[tbid].game.onStatus(listener)
  }

  this.gameStart = function(tbid) {
    this.gameList[tbid].game.start()
    this.gameBetStatus(tbid, 0)
  }

  this.gameBetStatus = async function(tbid, status) {
    try {
      await $G.setTbStatus(tbid, status)
    } catch (err) {
      throw err
    }
  }
}
module.exports = new GameController()

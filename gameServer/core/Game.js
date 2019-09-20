var { shallowObject } = require('../utils')

/*=================================================
  TABLE CST
=================================================*/
// cst.TB_NTF_COUNTDOWN_START = '0'
// cst.TB_NTF_COUNTDOWN_STOP = '1'
// cst.TB_NTF_COUNTDOWN_TIME = '2'
// cst.TB_NTF_FANPAI = '3'
// cst.TB_NTF_PI_RESULT = '4'
// cst.TB_NTF_STR_JOIN = '5'
// cst.TB_NTF_STR_BETOUT = '6'
// cst.TB_NTF_STR_QUIT = '7'
// cst.TB_NTF_KICKOUT = '8'

var Game = function(tbid) {
  this.tbid = tbid
  this.pokerList = null
  this.timeClock = null
  this.notify = null
  this.playerSupplyRule = null
  this.bankererSupplyRule = null
  this.fanPi = null
  this.odds = null
  this.gameTime = 0
  this.state = 0 // 0 不可投注 1 可投注
  this.data = {}

  var _completeCbs = []
  var _statusCbs = []

  this.initPokerList = function(pokerList) {
    this.pokerList = pokerList
  }
  this.initgameTime = function(time) {
    this.gameTime = time
  }
  this.initTimeClock = function(timeClock) {
    this.timeClock = timeClock()
  }
  this.initNotify = function(notify) {
    this.notify = notify
  }
  this.initPlayerSupplyRule = function(playerSupplyRule) {
    this.playerSupplyRule = playerSupplyRule
  }
  this.initBankererSupplyRule = function(bankererSupplyRule) {
    this.bankererSupplyRule = bankererSupplyRule
  }
  this.initFanPi = function(fanPi) {
    this.fanPi = fanPi
  }
  this.initOdds = function(odds) {
    this.odds = odds
  }

  this.checkInit = function() {
    if (!this.pokerList) throw new Error('pokerList is null')
    if (!this.timeClock) throw new Error('timeClock is null')
    if (!this.initTimeClock) throw new Error('initTimeClock is 0')
    if (!this.notify) throw new Error('notify is null')
    if (!this.playerSupplyRule) throw new Error('playerSupplyRule is null')
    if (!this.bankererSupplyRule) throw new Error('bankererSupplyRule is null')
    if (!this.fanPi) throw new Error('fanPi is null')
    if (!this.odds) throw new Error('odds is null')
  }
  this.onComplete = function(cb) {
    _completeCbs.push(cb)
  }
  this.onStatus = function(cb) {
    _statusCbs.push(cb)
  }

  var emitComplete = function() {
    this.state = 0
    var fan = setTimeout(() => {
      this.fanPiProcess()
    }, 1000)
    var calc = setTimeout(() => {
      this.calcResultProcess()
    }, 1300)
    var ntf = setTimeout(() => {
      _completeCbs.map(e => e(this.data))
    }, 1600)
    var last = setTimeout(() => {
      clearTimeout(fan)
      clearTimeout(calc)
      clearTimeout(ntf)
      clearTimeout(last)
    }, 4000)
  }

  var emitStatus = function(s, d) {
    _statusCbs.map(e => e(s, d))
  }

  this.startCountdown = function() {
    if (this.state) return
    this.state = 1
    this.timeClock.onComplete(() => emitComplete.bind(this)())
    this.timeClock.onChange(c => {
      emitStatus('2', c / 1000)
    })
    this.timeClock.start(this.gameTime)
  }

  this.fanPiProcess = function() {
    // emitStatus('3', tbid)
    let res = this.fanPi(
      this.pokerList,
      this.playerSupplyRule,
      this.bankererSupplyRule
    )
    delete res.pokerList
    this.data['poker_result'] = res
  }

  this.calcResultProcess = function() {
    var player = this.data['poker_result'].player
    var banker = this.data['poker_result'].banker
    var playerpoint = this.data['poker_result'].playerPoint
    var bankerpoint = this.data['poker_result'].bankerPoint
    this.data['calc_result'] = {
      banker: playerpoint < bankerpoint ? 1 : 0,
      player: playerpoint > bankerpoint ? 1 : 0,
      bankerking: bankerpoint >= 8 ? 1 : 0,
      playerking: playerpoint >= 8 ? 1 : 0,
      tie: playerpoint === bankerpoint ? 1 : 0,
      tiepair:
        playerpoint === bankerpoint &&
        player[0].symbol === player[1].symbol &&
        banker[0].symbol === banker[1].symbol
          ? 1
          : 0,
      bpair: banker[0].symbol === banker[1].symbol ? 1 : 0,
      ppair: player[0].symbol === player[1].symbol ? 1 : 0
    }
  }

  this.start = function() {
    this.checkInit()
    this.startCountdown()
  }
}
module.exports = Game

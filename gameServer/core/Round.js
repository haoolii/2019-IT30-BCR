var { shallowObject } = require('../utils')
/**
 * 引入
 */

var Round = function () {
  this.pokerList = null
  this.timeClock = null
  this.notify = null
  this.playerSupplyRule = null
  this.bankererSupplyRule = null
  this.fanPi = null
  this.odds = null
  this.roundTime = 0
  this.roundPool = {}
  this.users = {}
  this.state = 0 // 0 不可投注 1 可投注
  this.data = {}

  var _completeCbs = []
  var _changeCbs = []

  this.initPokerList = function (pokerList) { this.pokerList = pokerList }
  this.initRoundTime = function (time) { this.roundTime = time }
  this.initTimeClock = function (timeClock) { this.timeClock = timeClock() }
  this.initNotify = function (notify) { this.notify = notify }
  this.initPlayerSupplyRule = function (playerSupplyRule) { this.playerSupplyRule = playerSupplyRule }
  this.initBankererSupplyRule = function (bankererSupplyRule) { this.bankererSupplyRule = bankererSupplyRule }
  this.initFanPi = function (fanPi) { this.fanPi = fanPi }
  this.initOdds = function (odds) { this.odds = odds }

  this.checkInit = function () {
    if (!this.pokerList) throw new Error('pokerList is null')
    if (!this.timeClock) throw new Error('timeClock is null')
    if (!this.initTimeClock) throw new Error('initTimeClock is 0')
    if (!this.notify) throw new Error('notify is null')
    if (!this.playerSupplyRule) throw new Error('playerSupplyRule is null')
    if (!this.bankererSupplyRule) throw new Error('bankererSupplyRule is null')
    if (!this.fanPi) throw new Error('fanPi is null')
    if (!this.odds) throw new Error('odds is null')
  }
  this.onComplete = function (cb) { _completeCbs.push(cb) }
  this.onChange = function (cb) { _changeCbs.push(cb) }

  var emitComplete = function () {
    this.state = 0
    setTimeout(() => { this.fanPiProcess() }, 1000)
    setTimeout(() => { this.calcResultProcess() }, 2000)
    setTimeout(() => { _completeCbs.map(e => e(this.data)) }, 3000)
  }

  var emitChange = function (c) { _changeCbs.map(e => e(c)) }

  this.startCountdown = function () {
    this.state = 1
    this.timeClock.onComplete(() => emitComplete.bind(this)())
    this.timeClock.onChange(c => { emitChange.bind(this)(c) })
    this.timeClock.start(this.roundTime)
  }

  this.userJoin = function (user) {
    this.users[user.id] = user
  }

  this.userBetout = function (user) {
    if (!this.users[user.id]) throw 'USER NOT JOIN ROUND'
    if (this.state !== 1) { user.emit('MSG', { type: 'RES_BET_OUT', payload: 'NOT ALLOW BETOUT' }); return }
    this.users[user.id] = user
    shallowObject.plus(this.users[user.id].bet, user.bet)
  }

  this.fanPiProcess = function () {
    console.log('fanPiProcess')
    let res = this.fanPi(this.pokerList, this.playerSupplyRule, this.bankererSupplyRule)
    delete res.pokerList
    console.log(res)
    this.data['poker_result'] = res
  }

  this.calcResultProcess = function () {
    var player = this.data['poker_result'].player
    var banker = this.data['poker_result'].banker
    var playerpoint = this.data['poker_result'].playerPoint
    var bankerpoint = this.data['poker_result'].bankerPoint
    this.data['calc_result'] = {
      'banker': playerpoint < bankerpoint ? 1 : 0,
      'player': playerpoint > bankerpoint ? 1 : 0,
      'bankerking': bankerpoint >= 8 ? 1 : 0,
      'playerking': playerpoint >= 8 ? 1 : 0,
      'tie': playerpoint === bankerpoint ? 1 : 0,
      'tiepair': (playerpoint === bankerpoint && player[0].symbol === player[1].symbol && banker[0].symbol === banker[1].symbol) ? 1 : 0,
      'bpair': banker[0].symbol === banker[1].symbol ? 1 : 0,
      'ppair': player[0].symbol === player[1].symbol ? 1 : 0
    }
    Object.keys(this.users).map(id => {
      Object.keys(this.users[id].bet).map(key => {
        this.users[id].bet[key] = this.users[id].bet[key] * this.data['calc_result'][key] * this.odds[key]
      })
    })
    this.data['users_result'] = this.users
  }

  this.start = function () {
    this.checkInit()
    this.startCountdown()
  }
}
module.exports = Round
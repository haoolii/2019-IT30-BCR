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

  this.roundTime = 0
  this.roundPool = {}
  /**
   * {
   *  id: '1234'
   *  bet: {
   *  'banker': 0
      'player': 0
      'bankerking': 0
      'playerking': 0
      'tie': 0
      'tiepair': 0
      'bpair': 0
      'ppair': 0
   *  },
      loose: 0
   * }
   */
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

  this.checkInit = function () {
    if (!this.pokerList) throw new Error('pokerList is null')
    if (!this.timeClock) throw new Error('timeClock is null')
    if (!this.initTimeClock) throw new Error('initTimeClock is 0')
    if (!this.notify) throw new Error('notify is null')
    if (!this.playerSupplyRule) throw new Error('playerSupplyRule is null')
    if (!this.bankererSupplyRule) throw new Error('bankererSupplyRule is null')
    if (!this.fanPi) throw new Error('fanPi is null')
  }
  this.onComplete = function (cb) { _completeCbs.push(cb) }
  this.onChange = function (cb) { _changeCbs.push(cb) }

  var emitComplete = function () {
    this.state = 0
    setTimeout(() => { this.fanPiProcess() }, 1000)
    setTimeout(() => { this.calcResultProcess() }, 4000)
    setTimeout(() => { _completeCbs.map(e => e(this.data)) }, 5000)
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
    this.data['result'] = res
  }

  this.calcResultProcess = function () {
    console.log('calcResultProcess')
  }

  this.start = function () {
    this.checkInit()
    this.startCountdown()
  }
}
module.exports = Round
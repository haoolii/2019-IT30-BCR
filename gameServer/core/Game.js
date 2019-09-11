var Game = function () {
  // Round
  this.roundTemplate = null
  this.round = null
  this.pokerList = null
  this.notify = null
  this.timeClock = null
  this.playerSupplyRule = null
  this.bankererSupplyRule = null
  this.fanPi = null

  // 牌組
  this.pokerList = null
  this.notify = null

  // 內部game data
  this.pool = {}
  this.state = 0

  this.initRound = function (roundtmp) { this.roundTemplate = roundtmp }

  this.initPokerList = function (pokerList) { this.pokerList = pokerList }

  this.initNotify = function (notify) { this.notify = notify }

  this.initTimeClock = function (timeClock) { this.timeClock = timeClock }

  this.initPlayerSupplyRule = function (playerSupplyRule) { this.playerSupplyRule = playerSupplyRule }

  this.initBankererSupplyRule = function (bankererSupplyRule) { this.bankererSupplyRule = bankererSupplyRule }

  this.initFanPi = function (fanPi) { this.fanPi = fanPi }

  this.checkInit = function () {
    if (!this.bankererSupplyRule) throw new Error('bankererSupplyRule is null')
    if (!this.playerSupplyRule) throw new Error('playerSupplyRule is null')
    if (!this.roundTemplate) throw new Error('roundTemplate is null')
    if (!this.timeClock) throw new Error('timeClock is null')
    if (!this.pokerList) throw new Error('pokerList is null')
    if (!this.notify) throw new Error('notify is null')
    if (!this.fanPi) throw new Error('fanPi is null')
  }

  this.userJoin = function (user) {
    try {
      this.round.userJoin(user)
    } catch (err) {
      user.emit('MSG', { type: 'RES_BET_JOIN', msg: err })
    }
  }

  this.userBetout = function (user) {
    try {
      this.round.userBetout(user)
    } catch (err) {
      user.emit('MSG', { type: 'RES_BET_OUT', msg: err })
    }
  }

  this.startGame = function () {
    this.checkInit()
    this.startNewRound()
  }

  this.startNewRound = function () {
    this.round = null
    this.round = new this.roundTemplate()
    this.round.initPokerList(this.pokerList)
    this.round.initTimeClock(this.timeClock)
    this.round.initNotify(this.notify)
    this.round.initPlayerSupplyRule(this.playerSupplyRule)
    this.round.initBankererSupplyRule(this.bankererSupplyRule)
    this.round.initFanPi(this.fanPi)

    this.round.initRoundTime(3000)
    this.round.onChange((c) => { console.log('剩下' + c) })
    this.round.onComplete((res) => {
      console.log('牌局結束')
      console.log(res)
      setTimeout(() => {
        this.startNewRound()
      }, 1000)
    })
    this.round.start()
  }
}

module.exports = Game
const dbBet = require('./dbBet')
const dbUser = require('./dbUser')
const dbTable = require('./dbTable')
const { calcBetTotal, calcUserPayout } = require('../utils')
const config = require('../config')
const cmd = require('../../cmd')
const $N = require('./$N')

/**
 * 計算某id的派彩結果
 * @param {*} id
 * @param {*} betResult
 */
var peerPayout = async function(id, betResult) {
  return new Promise(async (resolve, reject) => {
    try {
      // 取betinfo
      var _betInfo = await dbBet.GET_USER_BETINFO(id)

      // 通知牌局結果
      $N.notifyPeer(id, cmd.MSG_TB_FANPI, betResult)

      // 檢查是否要踢掉
      if (!(await kickCheck(id))) return

      // 判斷是否有下注
      if (calcBetTotal(_betInfo.bet) === 0) {

        // 空的betout
        await emptyBetout(id)
      } else {

        // 派彩囉
        await payout(id, betResult)
      }

      // resolve
      resolve()
    } catch (err) {
      $N.notifyPeerError(id, err)
      reject(err)
    }
  })
}

/**
 * 沒有下注的人
 * @param {*} id
 */
var emptyBetout = function(id) {
  return new Promise(async (resolve, reject) => {
    await dbBet.INCREASE_USER_KICKCOUNT(id)
    resolve()
  })
}

/**
 * 派彩
 * @param {*} id
 * @param {*} betResult
 */
var payout = function(id, betResult) {
  return new Promise(async (resolve, reject) => {
    try {
      var _userInfo = await dbUser.GET_USER_INFO(id)
      var _betInfo = await dbBet.GET_USER_BETINFO(id)
      var _payout_bet = {}
      var _payout_userInfo = {}
      _payout_bet = calcUserPayout(
        _betInfo.bet,
        betResult.calc_result,
        config.bcr.odds
      )
      _payout_total = calcBetTotal(_payout_bet)
      $N.notifyPeer(id, cmd.MSG_BT_PAYOUT, _payout_bet)
      _payout_userInfo = await dbUser.UPDATE_USER_INFO(id, {
        balance: _userInfo.balance + _payout_total
      })
      await dbBet.RESET_USER_BETOUT(id)
      $N.notifyPeer(id, cmd.MSG_USER_INFO, _payout_userInfo)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 踢出玩家
 * @param {*} id
 */
var kickout = function(tbid, id) {
  return new Promise(async (resolve, reject) => {
    try {
      var _userInfo = await dbUser.UPDATE_USER_INFO(id, { tbid: null })
      $N.notifyPeer(id, cmd.MSG_TB_KICKOUT, { tbid: tbid })
      await dbTable.KICK_OUT_USER(tbid, id)
      await dbBet.RESET_USER_KICKCOUNT(id)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 踢出檢查
 * @param {*} id
 */
var kickCheck = function(id) {
  return new Promise(async (resolve, reject) => {
    try {
      var _betInfo = await dbBet.GET_USER_BETINFO(id)
      var _userInfo = await dbUser.GET_USER_INFO(id)
      if (!_userInfo.tbid) reject('U ALREADY NULL')
      if (_betInfo.kickcount >= config.bcr.kickCount) {
        await kickout(_userInfo.tbid, id)
        resolve(false) // 踢
      }
      resolve(true) // 不踢
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { peerPayout, kickCheck, kickout }

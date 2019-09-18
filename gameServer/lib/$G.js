const dbBet = require('./dbBet')
const dbUser = require('./dbUser')
const dbTable = require('./dbTable')
const {
  calcBetTotal,
  calcUserPayout,
  combineBet,
  minusBet
} = require('../utils')
const config = require('../config')
const cmd = require('../../cmd')
const $N = require('./$N')

const __userjoinCbs = {}

/**
 * 統計桌上下注更新桌的彩池
 * @param {*} tbid
 * @param {*} pool
 */

var calcTbPool = function(tbid) {
  return new Promise(async (resolve, reject) => {
    try {
      var _tbInfo = await dbTable.GET_TB_INFO(tbid)
      var _bet = {
        banker: 0,
        player: 0,
        bankerking: 0,
        playerking: 0,
        tie: 0,
        tiepair: 0,
        bpair: 0,
        ppair: 0
      }
      await _tbInfo.users.map(async id => {
        var _userBetinfo = await dbBet.GET_USER_BETINFO(id)
        _bet = combineBet(_bet, _userBetinfo.bet)
      })
      await plusTbPool(tbid, _bet)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 增加彩池金額
 * @param {*} tbid
 * @param {*} bet
 */

var plusTbPool = function(tbid, bet) {
  return new Promise(async (resolve, reject) => {
    try {
      var _tbInfo = await dbTable.GET_TB_INFO(tbid)
      var _pool_combine = combineBet(_tbInfo.pool, bet)
      await dbTable.UPDATE_TB_INFO(tbid, { pool: _pool_combine })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 減少彩池金額
 * @param {*} tbid
 * @param {*} bet
 */

var minusTbPool = function(tbid, bet) {
  return new Promise(async (resolve, reject) => {
    try {
      var _tbInfo = await dbTable.GET_TB_INFO(tbid)
      var _pool_combine = minusBet(_tbInfo.pool, bet)
      await dbTable.UPDATE_TB_INFO(tbid, { pool: _pool_combine })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 更新桌的狀態
 * @param {*} tbid
 * @param {*} status
 */

var setTbStatus = function(tbid, status) {
  return new Promise((resolve, reject) => {
    dbTable
      .UPDATE_TB_STATUS(tbid, status)
      .then(resolve)
      .catch(reject)
  })
}

/**
 * 通知此桌所有人訊息
 * @param {*} tbid
 * @param {*} ntf
 */
var tbNotify = function(tbid, ntf) {
  return new Promise(async (resolve, reject) => {
    try {
      var _tbInfo = await dbTable.GET_TB_INFO(tbid)
      _tbInfo.users.map(id => $N.notifyPeer(id, cmd.MSG_TB_NTF, ntf))
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 針對一張桌進行派彩
 * @param {*} tbid
 * @param {*} betResult
 */
var tbPayout = function(tbid, betResult) {
  return new Promise(async (resolve, reject) => {
    try {
      var _tbInfo = await dbTable.GET_TB_INFO(tbid)
      await _tbInfo.users.map(async id => await peerPayout(id, betResult))
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 計算某id的派彩結果
 * @param {*} id
 * @param {*} betResult
 */
var peerPayout = function(id, betResult) {
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
      await minusTbPool(_userInfo.tbid, _payout_bet)

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

/**
 * 確保有人在桌
 * @param {*} tbid
 */

var ensureUserInTb = function(tbid) {
  return new Promise(async (resolve, reject) => {
    try {
      var tbInfo = await dbTable.GET_TB_INFO(tbid)
      if (tbInfo.users.length > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 掛載偵聽使用者加入
 * @param {*} tbid
 * @param {*} listener
 */

var onUserJoin = function(tbid, listener) {
  if (!__userjoinCbs[tbid]) __userjoinCbs[tbid] = []
  __userjoinCbs[tbid].push(listener)
}

/**
 * 觸發偵聽使用者加入
 * @param {*} tbid
 */

var emitUserJoin = function(tbid) {
  var args = [].slice.call(arguments, 1)
  __userjoinCbs[tbid].map(cb => cb(...args))
}

module.exports = {
  peerPayout,
  kickCheck,
  kickout,
  setTbStatus,
  tbPayout,
  tbNotify,
  calcTbPool,
  plusTbPool,
  minusTbPool,
  ensureUserInTb,
  onUserJoin,
  emitUserJoin
}

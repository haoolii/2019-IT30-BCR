const BetController = require('./BetController')
const UserController = require('./UserController')
const TableController = require('./TableController')
const { calcBetTotal, calcUserPayout } = require('../utils')
const config = require('../config')

/**
 * 計算某id的派彩結果
 * @param {*} id
 * @param {*} betResult
 */
var peerPayout = function(id, betResult) {
  return new Promise(async (resolve, reject) => {
    try {
      var _userBetInfo = await BetController.GET_USER_BETINFO(id)
      var _userInfo = await UserController.GET_USER_INFO(id)
      var _balance = _userInfo.balance
      var _userBetInfo_updated = calcUserPayout(
        _userInfo.bet,
        betresult.calc_result,
        config.bcr.odds
      )
      var _balance_win = calcBetTotal(_userBetInfo_updated)
      resolve()
    } catch (err) {
      reject()
    }
  })
}

// var _userbet = {}
//     var _userWinTotal = 0
//     var _balance = (await UserController.GET_USER_INFO(uid)).balance
//     var _userinfo = await BetController.GET_USER_BETINFO(uid)
//     if (calcBetTotal(_userinfo.bet) === 0) {
//       await BetController.INCREASE_USER_KICKCOUNT(uid)
//     } else {
//       _userbet = userPayout(
//         _userinfo.bet,
//         betresult.calc_result,
//         config.bcr.odds
//       )
//       _userWinTotal = calcBetTotal(_userbet)
//       _userinfo = await UserController.UPDATE_USER_INFO(uid, {
//         balance: _balance + _userWinTotal
//       })
//       delete _userinfo.password
//       await BetController.RESET_USER_BETOUT(uid)
//       notifyPeer(uid, cmd.MSG_BT_PAYOUT, _userbet)
//       notifyPeer(uid, cmd.MSG_USER_INFO, _userinfo)
//     }
//     notifyPeer(uid, cmd.MSG_TB_FANPI, betresult)
/**
 * 坐下
 * @param {*} tbid
 * @param {*} id
 */
var sitdown = function(tbid, id) {
  return new Promise(async (resolve, reject) => {
    try {
      await TableController.USER_SITDOWN(tbid, id)
      await UserController.UPDATE_USER_INFO(id, { tbid: tbid })
      resolve({ tbid: tbid })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { peerPayout }

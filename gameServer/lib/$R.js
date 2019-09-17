const dbBet = require('./dbBet')
const dbUser = require('./dbUser')
const dbTable = require('./dbTable')
const { calcBetTotal } = require('../utils')

/**
 * 檢查是否可以下注
 * @param {*} id
 * @param {*} bet
 */
var betOut = function(id, bet) {
  return new Promise(async (resolve, reject) => {
    try {
      var _userInfo = await dbUser.GET_USER_INFO(id)
      var _tableInfo = await dbTable.GET_TB_INFO(_userInfo.tbid)
      if (calcBetTotal(bet) > _userInfo.balance) throw '餘額不足'
      if (_tableInfo.status === 1) throw '開牌中 不能下注'
      await dbBet.UPDATE_USER_BETOUT(id, bet)
      await dbUser.UPDATE_USER_INFO(id, _userInfo.balance - calcBetTotal(bet))
      await dbBet.RESET_USER_KICKCOUNT(id)
      resolve(bet)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 坐下
 * @param {*} tbid
 * @param {*} id
 */
var sitDown = function(tbid, id) {
  return new Promise(async (resolve, reject) => {
    try {
      await dbTable.USER_SITDOWN(tbid, id)
      console.log(`tbid: ${tbid}  id: ${id}}`)
      await dbUser.UPDATE_USER_INFO(id, { tbid: tbid })
      resolve({ tbid: tbid })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 取得bet資料
 * @param {*} id
 */
var betInfo = function(id) {
  return new Promise((resolve, reject) => {
    dbBet
      .GET_USER_BETINFO(id)
      .then(resolve)
      .catch(reject)
  })
}

/**
 * 取得使用者所在桌的資料
 * @param {*} id
 */
var tbInfo = function(id) {
  return new Promise((resolve, reject) => {
    dbUser.GET_USER_INFO(id).then(userInfo => {
      dbTable
        .GET_TB_INFO(userInfo.tbid)
        .then(resolve)
        .catch(reject)
    })
  })
}
module.exports = { betOut, sitDown, betInfo, tbInfo }

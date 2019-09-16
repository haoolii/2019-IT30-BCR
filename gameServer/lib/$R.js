const BetController = require('../controllers/BetController')
const UserController = require('../controllers/UserController')
const TableController = require('../controllers/TableController')
const { calcBetTotal } = require('../utils')

/**
 * 檢查是否可以下注
 * @param {*} id
 * @param {*} bet
 */
var betOut = function (id, bet) {
  return new Promise(async (resolve, reject) => {
    try {
      var _userInfo = await UserController.GET_USER_INFO(id)
      var _tableInfo = await TableController.GET_TB_INFO(_userInfo.tbid)
      if (calcBetTotal(bet) > _userInfo.balance) throw '餘額不足'
      if (_tableInfo.status === 1) throw '開牌中 不能下注'
      await BetController.UPDATE_USER_BETOUT(id, bet)
      await UserController.UPDATE_USER_INFO(
        id,
        _userInfo.balance - calcBetTotal(bet)
      )
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
var sitdown = function (tbid, id) {
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

module.exports = { betOut, sitdown }

const dbBet = require('./dbBet')
const dbUser = require('./dbUser')
const dbTable = require('./dbTable')
const { calcBetTotal, ensureNumber } = require('../utils')
const $G = require('./$G')
const $N = require('./$N')

/**
 * 檢查是否可以下注
 * @param {*} id
 * @param {*} bet
 */
var betOut = function (id, bet) {
  return new Promise(async (resolve, reject) => {
    try {
      var _userInfo = await dbUser.GET_USER_INFO(id)
      var _tableInfo = await dbTable.GET_TB_INFO(_userInfo.tbid)
      if (_tableInfo.status === 1) throw '不能下注'
      if (calcBetTotal(bet) > _userInfo.balance) throw '餘額不足'
      await dbBet.UPDATE_USER_BETOUT(id, ensureNumber(bet))
      let _updatedUserInfo = await dbUser.UPDATE_USER_BALANCE(
        id,
        _userInfo.balance - calcBetTotal(bet)
      )
      await dbBet.RESET_USER_KICKCOUNT(id)
      $N.notifyPeer(id, '00000110', '1', { bet: bet })
      $N.notifyPeer(id, '00000110', '2', { balance: _updatedUserInfo.balance })
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
var sitDown = function (tbid, id) {
  console.log(`sitDown: tbid ${tbid} id ${id}`)
  return new Promise(async (resolve, reject) => {
    try {
      await dbTable.USER_SITDOWN(tbid, id)
      await dbUser.UPDATE_USER_INFO(id, { tbid: tbid })
      await $G.emitUserJoin(tbid)
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
var betInfo = function (id) {
  return new Promise((resolve, reject) => {
    dbBet
      .GET_USER_BETINFO(id)
      .then(resolve)
      .catch(err => { reject(err) })
  })
}

/**
 * 取得user資料
 * @param {*} id
 */
var userInfo = function (id) {
  console.log(`userInfo ${id}`)
  return new Promise((resolve, reject) => {
    dbUser
      .GET_USER_INFO(id)
      .then(userInfo => {
        let _uinfo = Object.assign({}, userInfo)
        delete _uinfo.password
        resolve(_uinfo)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 取得使用者所在桌的資料
 * @param {*} id
 */
var tbInfo = function (id) {
  return new Promise((resolve, reject) => {
    dbUser.GET_USER_INFO(id).then(userInfo => {
      dbTable
        .GET_TB_INFO(userInfo.tbid)
        .then(resolve)
        .catch(reject)
    })
  })
}
/**
 * 會員登入 (其實只有顯示online or offline)
 * @param {*} id
 */
var login = function (id) {
  console.log('login: ', id)
  return new Promise((resolve, reject) => {
    dbUser.GET_USER_INFO(id)
      .then(res => {
        dbUser.LIST_USERS_INFO().then(res => {
          console.log('==========LIST_USERS_INFO')
          console.log(res)
          console.log('==========LIST_USERS_INFO')
          dbUser
            .UPDATE_USER_INFO(id, { online: true })
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            })
        })
      })
  })
}

/**
 * 會員登出 (其實只有顯示online or offline)
 * @param {*} id
 */
var logout = function (id) {
  return new Promise((resolve, reject) => {
    dbUser
      .UPDATE_USER_INFO(id, { online: false })
      .then(resolve)
      .catch(reject)
  })
}
module.exports = { betOut, sitDown, betInfo, tbInfo, userInfo, login, logout }

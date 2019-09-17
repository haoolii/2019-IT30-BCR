const dbBet = require('./dbBet')
const dbUser = require('./dbUser')
const dbTable = require('./dbTable')
var _ws = null

/**
 * 初始化ws
 * @param {*} ws 
 */
var initNTF = function (ws) {
  _ws = ws
}

/**
 * 通知指定對ID錯誤訊息
 * @param {*} id
 * @param {*} err
 */
var notifyPeerError = function (id, err) {
  if (!_ws) throw 'WS NTF ERROR!'
  _ws.notifyPeerError(id, err)
}

/**
 * 通知指定對ID訊息
 * @param {*} id
 * @param {*} ntf
 * @param {*} data
 */
var notifyPeer = function (id, ntf, data) {
  if (!_ws) throw 'WS NTF ERROR!'
  _ws.notifyPeer(id, ntf, data)
}

module.exports = { initNTF ,notifyPeer, notifyPeerError}

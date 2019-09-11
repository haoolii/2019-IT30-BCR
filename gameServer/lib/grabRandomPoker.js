'use strict'

var utils = require('../utils')
/**
 * 隨機重牌組中取出一張牌，並返回抽到的牌以及剩下牌組
 * @param {*} pokerList 牌組
 */
var grabRandomPoker = function (pokerList) {
  var _pokerList = pokerList.slice(0)
  var _pokerListLength = _pokerList.length
  var _randomPokerIndex = utils.getRandom(0, _pokerListLength - 1)
  var _randomPoker = _pokerList[_randomPokerIndex]
  _pokerList.splice(_randomPokerIndex, 1)

  return {
    poker: _randomPoker,
    pokerList: _pokerList
  }
}

module.exports = grabRandomPoker
'use strict'

var grabRandomPoker = require('./grabRandomPoker')
var calcPokerPoint = require('./calcPokerPoint')
var shouldPlayerSupplyPoker = require('./shouldPlayerSupplyPoker')
var shouldBankerSupplyPoker = require('./shouldBankerSupplyPoker')

/**
 * 傳入牌組規則，產出開牌結果，會返回剩下牌組
 * @param {*} pokerList 牌組
 * @param {*} player_rule config/bcr.json/player_rule
 * @param {*} banker_rule config/bcr.json/banker_rule
 */
var fanPi = function (pokerList, player_rule, banker_rule) {
  var _pokerList = pokerList.slice(0)
  var _basePokerCount = 2
  var _player = []
  var _banker = []
  var _playerPoint = 0
  var _bankerPoint = 0
  var _player_shouldSupply = false
  var _banker_shouldSupply = false
  var _player_rule = player_rule
  var _banker_rule = banker_rule

  var random = (_arr, count) => {
    for (var i = 0; i < count; i++) {
      var _grabObject = grabRandomPoker(_pokerList)
      _pokerList = _grabObject.pokerList
      _arr.push(_grabObject.poker)
    }
  }

  // 拿到基礎牌
  random(_player, _basePokerCount)
  random(_banker, _basePokerCount)

  // 計算點數
  _playerPoint = calcPokerPoint(_player)
  _bankerPoint = calcPokerPoint(_banker)

  // // 要不要補牌判斷
  _player_shouldSupply = shouldPlayerSupplyPoker(_player_rule, _playerPoint)

  if (_player_shouldSupply) {
    random(_player, 1)
    _playerPoint = calcPokerPoint(_player)
  }

  _banker_shouldSupply = shouldBankerSupplyPoker(_banker_rule, _player[2] ? _player[2].point : '10', _bankerPoint)

  if (_banker_shouldSupply) {
    random(_banker, 1)
    _bankerPoint = calcPokerPoint(_banker)
  }

  return {
    player: _player,
    playerPoint: _playerPoint,
    banker: _banker,
    bankerPoint: _bankerPoint,
    pokerList: _pokerList
  }
}

module.exports = fanPi
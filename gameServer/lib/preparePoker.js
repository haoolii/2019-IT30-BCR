'use strict'

/**
 * 準備牌組，會返回一個洗好牌的牌組
 * @param {*} pokerTemp config/poker.json/pokerTemplate
 * @param {*} pokerPointTemp config/poker.json/pokerPointTemplate
 * @param {*} pokerTypeTemp config/poker.json/pokerTypeTemplate
 * @param {*} count config/poker.json/pokerCount
 */
var preparePoker = function (pokerTemp, pokerPointTemp, pokerTypeTemp, count) {
  var _pokerTmp = pokerTemp.slice(0)
  var _pokerPointTmp = Object.assign({}, pokerPointTemp)
  var _pokerTypeTmp = pokerTypeTemp.slice(0)

  var _pokerlist = []
  for (var i = 0; i < count; i++) {                   // 重複幾組
    for (var j = 0; j < _pokerTmp.length; j++) {      // 把A-K拿出來
      for (var k = 0; k < _pokerTypeTmp.length; k++) { // 每個都塞入四種type
        _pokerlist.push({
          type: _pokerTypeTmp[k],
          symbol: _pokerTmp[j],
          point: _pokerPointTmp[_pokerTmp[j]]         // 對應的point取出
        })
      }
    }
  }
  _pokerlist.sort(function () {                       // 洗牌
    return 0.5 - Math.random()
  })
  return _pokerlist
}

module.exports = preparePoker
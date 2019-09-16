'use strict'

/**
 * 計算牌組點數
 * @param {*} pokerList 
 */
var calcPokerPoint = function (pokerList) {
  let res = pokerList.reduce(
    (a, b) => {
      return a + b.point
    }, 0)
  return res % 10
}

module.exports = calcPokerPoint
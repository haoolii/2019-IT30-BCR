'use strict'
/**
 * 計算player需要補牌嗎
 * @param {*} pokerRuleList config/bcr.json/player_rule
 * @param {*} playerPoint player點數
 */
var shouldPlayerSupplyPoker = function (pokerRuleList, playerPoint) {
  switch (pokerRuleList[playerPoint]) {
    case 'H':
      return true
    case 'S':
      return false
  }
}

module.exports = shouldPlayerSupplyPoker
/**
 * Banker需要補牌嗎？
 * @param {*} pokerRuleList config/bcr/banker_rule
 * @param {*} playerSupplyPoint player第三張點數
 * @param {*} bankerPoint banker點數
 */
var shouldBankerSupplyPoker = function (pokerRuleList, playerSupplyPoint, bankerPoint) {
  let _pokerRuleList = pokerRuleList
  let _playerSupplyPoint = playerSupplyPoint
  let _bankerPoint = bankerPoint
  let res = _pokerRuleList[_bankerPoint][_playerSupplyPoint]

  switch (res) {
    case 'H':
      return true
    case 'S':
      return false
  }
}

module.exports = shouldBankerSupplyPoker
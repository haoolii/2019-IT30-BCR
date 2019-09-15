/**
 * 計算投注總額
 * @param {*} bet 投注object
 */
var calcBetTotal = function (bet) {
  var total = 0
  total += bet["banker"]
  total += bet["player"]
  total += bet["bankerking"]
  total += bet["playerking"]
  total += bet["tie"]
  total += bet["tiepair"]
  total += bet["bpair"]
  total += bet["ppair"]
  return total
}

module.exports = calcBetTotal
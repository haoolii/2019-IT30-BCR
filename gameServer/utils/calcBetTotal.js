/**
 * 計算投注總額
 * @param {*} bet 投注object
 */
var calcBetTotal = function (bet) {
  var total = 0
  total += parseInt(bet["banker"])
  total += parseInt(bet["player"])
  total += parseInt(bet["bankerking"])
  total += parseInt(bet["playerking"])
  total += parseInt(bet["tie"])
  total += parseInt(bet["tiepair"])
  total += parseInt(bet["bpair"])
  total += parseInt(bet["ppair"])
  return total
}

module.exports = calcBetTotal
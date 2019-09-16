'use strict'
/**
 * 計算結果
 * @param {*} userBet 玩家投注
 * @param {*} payoutBet 結果
 * @param {*} oddsBet 賠率
 */
const calcUserPayout = function(userBet, payoutBet, oddsBet) {
  var _userBet = Object.assign({}, userBet)
  var _payoutBet = Object.assign({}, payoutBet)
  var _oddsBet = Object.assign({}, oddsBet)
  _userBet["banker"] = _userBet["banker"] * _oddsBet["banker"] * _payoutBet["banker"]
  _userBet["player"] = _userBet["player"] * _oddsBet["player"] * _payoutBet["player"]
  _userBet["bankerking"] = _userBet["bankerking"] * _oddsBet["bankerking"] * _payoutBet["bankerking"]
  _userBet["playerking"] = _userBet["playerking"] * _oddsBet["playerking"] * _payoutBet["playerking"]
  _userBet["tie"] = _userBet["tie"] * _oddsBet["tie"] * _payoutBet["tie"]
  _userBet["tiepair"] = _userBet["tiepair"] * _oddsBet["tiepair"] * _payoutBet["tiepair"]
  _userBet["bpair"] = _userBet["bpair"] * _oddsBet["bpair"] * _payoutBet["bpair"]
  _userBet["ppair"] = _userBet["ppair"] * _oddsBet["ppair"] * _payoutBet["ppair"]
  return _userBet
}
module.exports = calcUserPayout
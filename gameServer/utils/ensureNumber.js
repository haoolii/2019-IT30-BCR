/**
 * 確保下注金額都是數字
 * @param {*} bet 投注object
 */
var ensureNumber = function(bet) {
  var __bet = {
    banker: 0,
    player: 0,
    bankerking: 0,
    playerking: 0,
    tie: 0,
    tiepair: 0,
    bpair: 0,
    ppair: 0
  }
  __bet['banker'] = parseInt(bet['banker']) ? parseInt(bet['banker']) : 0
  __bet['player'] = parseInt(bet['player']) ? parseInt(bet['player']) : 0
  __bet['bankerking'] = parseInt(bet['bankerking']) ? parseInt(bet['bankerking']) : 0
  __bet['playerking'] = parseInt(bet['playerking']) ? parseInt(bet['playerking']) : 0
  __bet['tie'] = parseInt(bet['tie']) ? parseInt(bet['tie']) : 0
  __bet['tiepair'] = parseInt(bet['tiepair']) ? parseInt(bet['tiepair']) : 0
  __bet['bpair'] = parseInt(bet['bpair']) ? parseInt(bet['bpair']) : 0
  __bet['ppair'] = parseInt(bet['ppair']) ? parseInt(bet['ppair']) : 0
  return __bet
}

module.exports = ensureNumber

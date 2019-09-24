/**
 * 相減兩個bet
 * @param {*} bet 投注object
 */
var minusBet = function(a, b) {
  var _bet = {
    banker: 0,
    player: 0,
    bankerking: 0,
    playerking: 0,
    tie: 0,
    tiepair: 0,
    bpair: 0,
    ppair: 0
  }
  _bet['banker'] = a['banker'] - b['banker']
  _bet['player'] = a['player'] - b['player']
  _bet['bankerking'] = a['bankerking'] - b['bankerking']
  _bet['playerking'] = a['playerking'] - b['playerking']
  _bet['tie'] = a['tie'] - b['tie']
  _bet['tiepair'] = a['tiepair'] - b['tiepair']
  _bet['bpair'] = a['bpair'] - b['bpair']
  _bet['ppair'] = a['ppair'] - b['ppair']
  return _bet
}

module.exports = minusBet

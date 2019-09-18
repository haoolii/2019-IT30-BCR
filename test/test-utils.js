const { combineBet } = require('../gameServer/utils')

var _template = {
  banker: 0,
  player: 0,
  bankerking: 0,
  playerking: 0,
  tie: 0,
  tiepair: 0,
  bpair: 0,
  ppair: 0
}
var _templateA = {
  banker: 0,
  player: 0,
  bankerking: 100,
  playerking: 0,
  tie: 0,
  tiepair: 0,
  bpair: 0,
  ppair: 0
}
var _templateB = {
  banker: 0,
  player: 0,
  bankerking: 0,
  playerking: 0,
  tie: 0,
  tiepair: 100,
  bpair: 0,
  ppair: 0
}
var r = combineBet(_templateA, _templateB)
console.log(r)
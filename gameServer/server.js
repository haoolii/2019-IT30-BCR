const game = require('./game')

exports.init = function (http) {
  new game(http)
}
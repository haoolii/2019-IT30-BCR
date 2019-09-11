const WsController = require('./controllers/WsController')
const GameController = require('./controllers/GameController')
var game = function (http) {
  new GameController(new WsController(http))
}

module.exports = game
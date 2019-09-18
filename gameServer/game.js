var Main = require('./controllers/MainController')
var WsController = require('./controllers/WsController')
var GameController = require('./controllers/GameController')
var game = function(http) {
  WsController.initSocket(http)
  // GameController.initGames()
}

module.exports = game

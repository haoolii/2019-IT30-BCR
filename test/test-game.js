const server = require('../gameServer/server')
const GameController = require('../gameServer/controllers/GameController')
var ntf = {
    emit: function(msg) {
        console.log(msg)
    }
}
new GameController(ntf)
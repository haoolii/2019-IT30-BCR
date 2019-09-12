const BetController = require('../gameServer/controllers/BetController')
const WsController = require('../gameServer/controllers/WsController')
const mockSocket = require('../gameServer/mock/mockSocket')
const mockio = require('../gameServer/mock/mockio')
const userMock = require('./userMock')

// WsController.initSocket()

let userm = new userMock('1')

userm.connect()
userm.login()
userm.logout()
userm.disconnect()
// userm.getBetInfo()
// userm.getUserInfo()
// userm.getTBInfo()
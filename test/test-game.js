const Main = require('../gameServer/controllers/MainController')
const Ws = require('../gameServer/controllers/WsController')
const mockSocket = require('../gameServer/mock/mockSocket')
const mockio = require('../gameServer/mock/mockio')
const userMock = require('./userMock')

Ws.initSocket(this.initSocket)
var userFake = function(id) {
  let userm = new userMock(id)
  userm.connect()
  userm.login()
  userm.tbsit()
  // userm.getUserInfo()
  // userm.getTBInfo()
  // userm.getBetInfo()
  // userm.tbsit()
  setTimeout(() => {
  userm.betout()
  }, 1000)
  // userm.logout()
  // setTimeout(() => {
  //   userm.disconnect()
  // }, 5000)

  // setTimeout(() => {
  //   userm.connect()
  //   userm.login()
  //   console.log('LOGIN')
  // }, 12000);
}
userFake('1')
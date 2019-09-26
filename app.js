const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = process.env.PORT || 3000

const webServer = require('./webServer/server')
const gameServer = require('./gameServer/server')

webServer.init(app)
gameServer.init(http)
http.listen(port, function () {
  console.log('listening on *:' + port)
})

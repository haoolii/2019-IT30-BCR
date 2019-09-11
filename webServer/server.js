const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const user_api = require('./api/user_api')
const admin_api = require('./api/admin_api')

require('dotenv').config()

exports.init = function (app) {
  app.use(cors())
  app.use(bodyParser.json())

  app.use('/user', express.static(__dirname + '/public/user'))
  app.use('/game', express.static(__dirname + '/public/game'))

  app.use('/api', user_api)
  app.use('/admin_api', admin_api)

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/user/index.html'))
  })
  app.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/game/index.html'))
  })
  app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/admin/index.html'))
  })

  app.use(function (req, res, next) {
    res.status(404).send(createError(404))
  })
}

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
  app.use('/test', express.static(__dirname + '/public/test'))

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

  app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/test/index.html'))
  })

  // db

  app.get('/db/users', function (req, res) {
    res.sendFile(path.join(__dirname + '/../db/users.json'))
  })

  app.get('/db/users', function (req, res) {
    res.sendFile(path.join(__dirname + '/../db/users.json'))
  })

  app.get('/db/tables', function (req, res) {
    res.sendFile(path.join(__dirname + '/../db/tables.json'))
  })

  app.get('/db/lobby', function (req, res) {
    res.sendFile(path.join(__dirname + '/../db/lobby.json'))
  })

  app.get('/db/bets', function (req, res) {
    res.sendFile(path.join(__dirname + '/../db/bets.json'))
  })

  app.use(function (req, res, next) {
    res.status(404).send(createError(404))
  })
}

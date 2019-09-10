const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const userController = require('./src/userController')
const mailController = require('./src/mailController')
const { validateEmail } = require('./src/utils')
require('dotenv').config()

exports.init = function (app) {
  app.use(cors())
  app.use(bodyParser.json())

  app.use('/', express.static(__dirname + '/public'))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
  })

  app.get('/lobby', verifyToken, (req, res) => {
    const lobbyData = fs.readFileSync('./db/lobby.json')
    const lobbyInfo = JSON.parse(lobbyData)
    res.json({
      lobbyInfo
    })
  })

  app.post('/register', (req, res) => {
    if (!req.body || !req.body.email || !validateEmail(req.body.email)) {
      return res.status(400).json({ error: '哎呀! 好像哪裡出錯了!' })
    }
    userController
      .ADD_USER(req.body.email)
      .then(user => {
        return mailController.SEND_USER_PASSWORD(user.email, user.password)
      })
      .then(r => {
        res.json({ email: r.email, msg: '創建成功！請至信箱取得登入密碼！' })
      })
      .catch(err => {
        res.status(400).json({ error: err })
      })
  })

  app.post('/userInfo', verifyToken, (req, res) => {
    userController
      .FIND_USER_BYEMAIL(req.userInfo.email)
      .then(r => {
        res.json({
          token: req.token,
          email: r.email,
          balance: r.balance
        })
      })
      .catch(err => {
        res.status(400).json({ error: err })
      })
  })

  app.post('/login', (req, res) => {
    userController
      .FIND_USER_BYEMAIL(req.body.email)
      .then(data => {
        const userInfo = data
        if (
          req.body.email === userInfo.email &&
          req.body.password === userInfo.password
        ) {
          const token = jwt.sign({ userInfo }, process.env.SECRET_KEY)
          res.json({
            token,
            email: userInfo.email,
            name: userInfo.name,
            balance: userInfo.balance
          })
        } else {
          res.status(401).json({ error: 'Invalid login. Please try again.' })
        }
      })
      .catch(err => {
        res.status(400).json({ error: err.message })
      })
  })

  function verifyToken (req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      jwt.verify(req.token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.sendStatus(401)
        } else {
          req.userInfo = decoded.userInfo
          next()
        }
      })
    } else {
      res.sendStatus(401)
    }
  }
}

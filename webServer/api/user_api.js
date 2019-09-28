const express = require('express')
const router = express.Router()
const fs = require('fs')
const userController = require('../src/userController')
const betController = require('../src/betController')
const mailController = require('../src/mailController')
const { validateEmail } = require('../src/utils')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken')

router.post('/login', (req, res) => {
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
        res.status(401).json({ error: '帳號或是密碼有誤！' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: '帳號或是密碼有誤！' })
    })
})

router.get('/lobby', verifyToken, (req, res) => {
  const lobbyData = fs.readFileSync('./db/lobby.json')
  const lobbyInfo = JSON.parse(lobbyData)
  res.json({
    lobbyInfo
  })
})

router.post('/register', (req, res) => {
  if (!req.body || !req.body.email || !validateEmail(req.body.email)) {
    return res.status(400).json({ error: '哎呀! 好像哪裡出錯了!' })
  }
  userController
    .ADD_USER(req.body.email)
    .then(user => {
      return betController.CREATE_USER_BETINFO(user.id).then(() => user)
    })
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

router.get('/userInfo', verifyToken, (req, res) => {
  userController
    .FIND_USER_BYEMAIL(req.decoded.userInfo.email)
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

module.exports = router

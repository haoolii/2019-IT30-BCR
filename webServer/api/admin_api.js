const express = require('express')
const router = express.Router()
const fs = require('fs')
const adminController = require('../src/adminController')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken')

router.post('/login', (req, res) => {
  adminController
    .VALID_ADMIN({
      account: req.body.account,
      password: req.body.password
    })
    .then(data => {
      const adminInfo = data
      const token = jwt.sign({ adminInfo }, process.env.SECRET_KEY)
      res.json({
        token,
        account: adminInfo.account
      })
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

module.exports = router

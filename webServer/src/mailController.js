var nodemailer = require('nodemailer')
var errorController = require('./errorController')
require('dotenv').config()

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

function _SEND_EMAIL(_opt) {
  console.log('============================Send')
  console.log(process.env.EMAIL_USER)
  console.log(process.env.EMAIL_PASS)
  console.log('============================Send data')
  console.log(_opt)
  console.log('============================Send data')
  return new Promise((resolve, reject) => {
    transporter.sendMail(_opt, function(error, info) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(info.response)
      }
    })
  })
}

function SEND_USER_PASSWORD(mail, password) {
  console.log('====================')
  console.log({
    from: process.env.EMAIL_USER,
    to: mail,
    subject: '三十天路邊賭場上線了!!',
    text: `Your Password: ${password}`
  })
  return _SEND_EMAIL({
    from: process.env.EMAIL_USER,
    to: mail,
    subject: '三十天路邊賭場上線了!!',
    text: `Your Password: ${password}`
  })
}

module.exports = {
  SEND_USER_PASSWORD: SEND_USER_PASSWORD
}

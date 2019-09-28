const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const OAuth2 = google.auth.OAuth2;
require('dotenv').config()

const oauth2Client = new OAuth2(
  process.env.EMAIL_clientId,
  process.env.EMAIL_clientSecret,
  process.env.EMAIL_redirect_url
)

oauth2Client.setCredentials({
  refresh_token: process.env.EMAIL_refreshToken
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_user,
    clientId: process.env.EMAIL_clientId,
    clientSecret: process.env.EMAIL_clientSecret,
    refreshToken: process.env.EMAIL_refreshToken,
    accessToken: accessToken
  }
})

function _SEND_EMAIL (mailOptions) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      smtpTransport.close()
      error ? reject(error) : resolve(response)
    })
  })
}

function SEND_USER_PASSWORD (mail, password) {
  return _SEND_EMAIL({
    from: process.env.EMAIL_user,
    to: mail,
    subject: '三十天路邊賭場上線了!!',
    text: `Your Password: ${password}`
  })
}

module.exports = { SEND_USER_PASSWORD: SEND_USER_PASSWORD }
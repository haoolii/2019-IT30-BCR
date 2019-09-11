const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    jwt.verify(req.token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.sendStatus(401)
  }
}

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/admin.json')
const db = low(adapter)

db.defaults({ admin: {} }).write()

function _valid(res, err = 'ERROR') {
  return new Promise((resolve, reject) => {
    res ? resolve(res) : reject(err)
  })
}

function _READ() {
  return _valid(db.get('admin').value())
}

function VALID_ADMIN(admin) {
  return _READ().then(_admin => {
    if (
      admin.account === _admin.account &&
      admin.password === _admin.password
    ) {
      return _admin
    } else {
      throw 'Unauthorized'
    }
  })
}

module.exports = {
  VALID_ADMIN
}

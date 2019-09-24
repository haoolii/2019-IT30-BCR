const low = require('lowdb')
const generator = require('generate-password')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/users.json')
const db = low(adapter)

db.defaults({ users: [], total: 0 }).write()

function _getUserLength() {
  return db.get('users').value().length
}

function _getUserTotal() {
  return db.get('total').value()
}

function _total_plus() {
  db.set('total', db.get('total').value() + 1).write()
}

function _generatePassword() {
  return generator.generate({
    length: 6,
    numbers: true,
    uppercase: false
  })
}

function _valid(res, err = 'ERROR') {
  return new Promise((resolve, reject) => {
    res ? resolve(res) : reject(err)
  })
}

function _CREATE(data) {
  return _valid(
    db
      .get('users')
      .push({ id: _getUserTotal() + 1, ...data })
      .write()
  ).then(() => {
    _total_plus()
    return _valid(
      db
        .get('users')
        .find(data)
        .value()
    )
  })
}

function _READ(data) {
  return _valid(
    db
      .get('users')
      .find(data)
      .value()
  )
}

function _UPDATE({ id, data }) {
  return _valid(
    db
      .get('users')
      .find({ id: id })
      .value()
  ).then(r => {
    return _valid(
      db
        .get('users')
        .find(r)
        .assign(data)
        .write()
    )
  })
}

function _DELETE({ id }) {
  return _valid(
    db
      .get('users')
      .remove({ id: id })
      .write()
  )
}

function FIND_USER_BYEMAIL(email) {
  return _READ({ email: email })
}

function IS_UNI_BYEMAIL(email) {
  return new Promise((resolve, reject) => {
    _READ({ email: email }).then(
      () => reject('E-MAIL已經存在，請另尋信箱。'),
      () => resolve(true)
    )
  })
}

function ADD_USER(email) {
  return IS_UNI_BYEMAIL(email).then(
    () =>
      _valid(
        _CREATE({
          email: email,
          online: false,
          tbid: null,
          password: _generatePassword(),
          balance: 0
        }),
        '帳號創建失敗！'
      ),
    () => {
      throw 'E-MAIL已經存在，請另尋信箱。'
    }
  )
}

module.exports = {
  ADD_USER,
  IS_UNI_BYEMAIL,
  FIND_USER_BYEMAIL
}

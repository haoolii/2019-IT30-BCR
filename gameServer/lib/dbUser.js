const db = require('../../db/db').userdb
db.defaults({ users: [], total: 0 }).write()
var dbUser = function () {
  function _valid (res, err = 'USERINFO ERROR') {
    return new Promise((resolve, reject) => {
      res ? resolve(res) : reject(err)
    })
  }

  function _CREATE (data) {
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

  function _READ (data) {
    return _valid(
      db
        .get('users')
        .find(data)
        .value()
    )
  }

  function _UPDATE (id, data) {
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

  function _DELETE ({ id }) {
    return _valid(
      db
        .get('users')
        .remove({ id: id })
        .write()
    )
  }

  this.GET_USER_INFO = function (id) {
    return _READ({ id: id })
  }

  this.UPDATE_USER_BALANCE = function (id, balance) {
    return _UPDATE(id, { balance: balance })
  }

  this.UPDATE_USER_INFO = function (id, data) {
    return _UPDATE(id, data)
  }
}
module.exports = new dbUser()

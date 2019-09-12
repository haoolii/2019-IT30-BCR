const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/users.json')
const db = low(adapter)
db.defaults({ users: [], total: 0 }).write()
var userController = function() {
  function _valid(res, err = 'USERINFO ERROR') {
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

  this.GET_USER_INFO = function(id) {
    return _READ({ id: id })
  }
}
module.exports = new userController()

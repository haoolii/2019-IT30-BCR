const db = require('../../db/db').tablesdb

var dbTable = function () {
  function _valid (res, err = 'TBINFO ERROR') {
    return new Promise((resolve, reject) => {
      res ? resolve(res) : reject(err)
    })
  }

  function _CREATE (data) {
    return _valid(
      db
        .get('tables')
        .push({ tbid: data.tbid, ...data })
        .write()
    ).then(() => {
      _total_plus()
      return _valid(
        db
          .get('tables')
          .find(data)
          .value()
      )
    })
  }

  function _READ ({ tbid }) {
    return _valid(db.get(tbid).value())
  }

  function _UPDATE ({ tbid, data }) {
    return _valid(
      db
        .get(tbid)
        .assign(data)
        .write()
    )
  }

  function _DELETE ({ tbid }) {
    return _valid(
      db
        .get('tables')
        .remove({ tbid: tbid })
        .write()
    )
  }

  this.GET_TB_INFO = function (tbid) {
    return _READ({ tbid: tbid })
  }

  this.ADD_TB_HISTORY = function (tbid, history) {
    return _READ({ tbid: tbid })
      .then(tb => {
        var len = tb.history.length
        tb.history.push({ id: len, ...history })
        return tb.history
      })
      .then(his => {
        return _UPDATE({ tbid: tbid, data: { history: his } })
      })
  }

  this.KICK_OUT_USER = function (tbid, uid) {
    return _READ({ tbid: tbid })
      .then(tb => {
        tb.users.splice(tb.users.indexOf(uid), 1)
        return tb.users
      })
      .then(users => {
        return _UPDATE({ tbid: tbid, data: { users: users } })
      })
  }

  this.UPDATE_TB_STATUS = function (tbid, status) {
    return _UPDATE({ tbid: tbid, data: { status: status } })
  }

  this.UPDATE_TB_INFO = function (tbid, data) {
    return _UPDATE({ tbid: tbid, data: data })
  }

  this.USER_SITDOWN = function (tbid, id) {
    return _READ({ tbid: tbid })
      .then(tb => {
        if (tb.users.indexOf(id) === -1) tb.users.push(id)
        return tb.users
      })
      .then(us => {
        return _UPDATE({ tbid: tbid, data: { users: us } })
      })
  }
}

module.exports = new dbTable()

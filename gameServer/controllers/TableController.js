const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/tables.json')
const db = low(adapter)

var tableController = function () {
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

  this.USET_LOGIN_TB = function (id, tbid) {
    console.log(`id ${id} tbid ${tbid}`)
    _READ({ tbid: tbid }).then(tb => {
      tb.users.push(id)
      return tb.users
    }).then(us => {
      return _UPDATE({ tbid: tbid, data: { 'users': us } })
    })
  }
}

module.exports = new tableController()

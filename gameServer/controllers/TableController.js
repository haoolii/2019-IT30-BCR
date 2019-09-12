const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/tables.json')
const db = low(adapter)
db.defaults({ tables: [] }).write()
var tableController = function() {
  function _valid(res, err = 'TBINFO ERROR') {
    return new Promise((resolve, reject) => {
      res ? resolve(res) : reject(err)
    })
  }

  function _CREATE(data) {
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

  function _READ(data) {
    return _valid(
      db
        .get('tables')
        .find(data)
        .value()
    )
  }

  function _UPDATE({ tbid, data }) {
    return _valid(
      db
        .get('tables')
        .find({ tbid: tbid })
        .value()
    ).then(r => {
      return _valid(
        db
          .get('tables')
          .find(r)
          .assign(data)
          .write()
      )
    })
  }

  function _DELETE({ tbid }) {
    return _valid(
      db
        .get('tables')
        .remove({ tbid: tbid })
        .write()
    )
  }

  this.GET_TB_INFO = function(tbid) {
    return _READ({tbid: tbid})
  }
}

module.exports = new tableController()

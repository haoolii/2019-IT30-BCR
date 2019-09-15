const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/bets.json')
const db = low(adapter)

var betController = function () {
  function _valid (res, err = 'BETINFO ERROR') {
    return new Promise((resolve, reject) => {
      res ? resolve(res) : reject(err)
    })
  }

  function _CREATE (id, data) {
    return _valid(db.set(id, data).write()).then(() => {
      return _valid(db.get(id).value())
    })
  }

  function _READ (id) {
    return _valid(db.get(id).value())
  }

  function _UPDATE (id, data) {
    return _valid(db.get(id).value()).then(r => {
      return _valid(
        db
          .get(id)
          .get('bet')
          .assign(data)
          .write()
      )
    })
  }

  function _DELETE (id) {
    return _valid(db.unset(id).write())
  }

  this.REMOVE_USER_BETINFO = function (id) {
    return _DELETE(id)
  }

  this.UPDATE_USER_BETINFO = function (id, betinfo) {
    return _UPDATE(id, betinfo)
  }

  this.GET_USER_BETINFO = function (id) {
    return _READ(id)
  }

  this.UPDATE_USER_BETOUT = function (id, betinfo) {
    return _READ(id).then(data => {
      data.bet["banker"] += betinfo["banker"]
      data.bet["player"] += betinfo["player"]
      data.bet["bankerking"] += betinfo["bankerking"]
      data.bet["playerking"] += betinfo["playerking"]
      data.bet["tie"] += betinfo["tie"]
      data.bet["tiepair"] += betinfo["tiepair"]
      data.bet["bpair"] += betinfo["bpair"]
      data.bet["ppair"] += betinfo["ppair"]
      return _UPDATE(id, data.bet)
    })
  }

  this.CREATE_USER_BETINFO = function (id, betinfo) {
    return _CREATE(id, {
      "online": false,
      "status": 0,
      "bet": betinfo
    })
  }
}

module.exports = new betController()

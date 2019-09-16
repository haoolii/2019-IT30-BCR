const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/bets.json')
const db = low(adapter)

var betController = function() {
  function _valid(res, err = 'BETINFO ERROR') {
    return new Promise((resolve, reject) => {
      res ? resolve(res) : reject(err)
    })
  }

  function _CREATE(id, data) {
    return _valid(db.set(id, data).write()).then(() => {
      return _valid(db.get(id).value())
    })
  }

  function _READ(id) {
    return _valid(db.get(id).value())
  }

  function _UPDATE(id, data) {
    return _valid(db.get(id).value()).then(r => {
      return _valid(
        db
          .get(id)
          .assign(data)
          .write()
      )
    })
  }

  function _UPDATE_BETINFO(id, data) {
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

  function _DELETE(id) {
    return _valid(db.unset(id).write())
  }

  this.REMOVE_USER_BETINFO = function(id) {
    return _DELETE(id)
  }

  this.UPDATE_USER_BETINFO = function(id, betinfo) {
    return _UPDATE_BETINFO(id, betinfo)
  }

  this.GET_USER_BETINFO = function(id) {
    return _READ(id)
  }

  this.RESET_USER_BETOUT = function(id) {
    return _READ(id).then(data => {
      data.bet['banker'] = 0
      data.bet['player'] = 0
      data.bet['bankerking'] = 0
      data.bet['playerking'] = 0
      data.bet['tie'] = 0
      data.bet['tiepair'] = 0
      data.bet['bpair'] = 0
      data.bet['ppair'] = 0
      return _UPDATE_BETINFO(id, data.bet)
    })
  }

  this.UPDATE_USER_BETOUT = function(id, betinfo) {
    return _READ(id).then(data => {
      data.bet['banker'] += betinfo['banker']
      data.bet['player'] += betinfo['player']
      data.bet['bankerking'] += betinfo['bankerking']
      data.bet['playerking'] += betinfo['playerking']
      data.bet['tie'] += betinfo['tie']
      data.bet['tiepair'] += betinfo['tiepair']
      data.bet['bpair'] += betinfo['bpair']
      data.bet['ppair'] += betinfo['ppair']
      return _UPDATE_BETINFO(id, data.bet)
    })
  }

  this.CREATE_USER_BETINFO = function(id, betinfo) {
    return _CREATE(id, {
      id: id,
      online: false,
      status: 0,
      bet: betinfo
    })
  }

  this.INCREASE_USER_KICKCOUNT = function(id) {
    return _READ(id).then(data => {
      data.kickcount = data.kickcount + 1
      return _UPDATE(id, { kickcount: data.kickcount })
    })
  }
}

module.exports = new betController()

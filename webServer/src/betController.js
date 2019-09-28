const db = require('../../db/db').betsdb

function _valid (res, err = 'BETINFO ERROR') {
  return new Promise((resolve, reject) => {
    res ? resolve(Object.assign({}, res)) : reject(err)
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
        .assign(data)
        .write()
    )
  })
}

function _UPDATE_BETINFO (id, data) {
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

function REMOVE_USER_BETINFO (id) {
  return _DELETE(id)
}

function UPDATE_USER_BETINFO (id, betinfo) {
  return _UPDATE_BETINFO(id, betinfo)
}

function GET_USER_BETINFO (id) {
  return _READ(id)
}

function RESET_USER_BETOUT (id) {
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

function UPDATE_USER_BETOUT (id, betinfo) {
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

function CREATE_USER_BETINFO (id) {
  return _CREATE(id, {
    id: id,
    status: 0,
    kickcount: 0,
    bet: {
      banker: 0,
      player: 0,
      bankerking: 0,
      playerking: 0,
      tie: 0,
      tiepair: 0,
      bpair: 0,
      ppair: 0
    }
  })
}

module.exports = {
  CREATE_USER_BETINFO,
  UPDATE_USER_BETINFO,
  REMOVE_USER_BETINFO,
  UPDATE_USER_BETOUT,
  RESET_USER_BETOUT,
  GET_USER_BETINFO
}

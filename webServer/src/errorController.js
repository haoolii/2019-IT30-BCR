const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

exports.ERROR = function (err) {
  const adapter = new FileSync(`../errors/${new Date()}.json`)
  const db = low(adapter)
  db.set('error', err).write()
}

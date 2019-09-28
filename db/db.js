const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const userdb = low(new FileSync('./db/users.json'))
const tablesdb = low(new FileSync('./db/tables.json'))
const betsdb = low(new FileSync('./db/bets.json'))
const admindb = low(new FileSync('./db/admin.json'))

module.exports = {
  userdb: userdb,
  tablesdb: tablesdb,
  betsdb: betsdb,
  admindb: admindb
}
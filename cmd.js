var cmd = {}

cmd.REQ_USER_LOGIN = '00000001'
cmd.RES_USER_LOGIN = '00000002'

cmd.REQ_USER_BETOUT = '00000003'
cmd.RES_USER_BETOUT = '00000004'

cmd.REQ_USER_BET_INFO = '00000005'
cmd.RES_USER_BET_INFO = '00000006'

cmd.REQ_TB_INFO = '00000007'
cmd.RES_TB_INFO = '00000008'

cmd.REQ_USER_INFO = '00000009'
cmd.RES_USER_INFO = '00000010'

if (typeof module !== 'undefined') {
  module.exports = cmd
}

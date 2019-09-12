var cmd = {}
/*=================================================
  REQ RES
=================================================*/
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

/*=================================================
  NTF 100
=================================================*/
cmd.MSG_TB_STR_JOIN = '00000100'
cmd.MSG_TB_STR_BETOUT = '00000101'
cmd.MSG_TB_STR_QUIT = '00000102'

cmd.MSG_TB_FANPI = '00000110'
cmd.MSG_TB_PAYOUT = '00000111'

if (typeof module !== 'undefined') {
  module.exports = cmd
}

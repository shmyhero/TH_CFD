'use strict'

var SERVER_IP = 'http://cfd-webapi.chinacloudapp.cn'

export var GET_PHONE_CODE_API = SERVER_IP + '/api/sendCode'
export var PHONE_NUM_LOGIN_API = SERVER_IP + '/api/user/signupByPhone'
export var WECHAT_LOGIN_API = SERVER_IP + '/api/user/signupByWeChat'
export var GET_USER_INFO_API = SERVER_IP + '/api/user/me'
export var SET_USER_NICKNAME_API = SERVER_IP + '/api/user/nickname'
export var GET_USER_BOOKMARK_LIST_API = SERVER_IP + '/api/security/bookmark'
export var GET_US_STOCK_TOP_GAIN_API = SERVER_IP + '/api/security/stock/topGainer'
export var GET_US_STOCK_TOP_LOSER_API = SERVER_IP + '/api/security/stock/topLoser'
export var GET_INDEX_LIST_API = SERVER_IP + '/api/security/index'
export var GET_FX_LIST_API = SERVER_IP + '/api/security/fx'
export var GET_FUTURE_LIST_API = SERVER_IP + '/api/security/futures'


export var PARAMETER_PHONE = 'phone'
export var PARAMETER_VERFICATION_CODE = 'verifyCode'
export var PARAMETER_NICKNAME = 'nickname'
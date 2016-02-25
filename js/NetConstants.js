'use strict'

var SERVER_IP = 'http://cfd-webapi.chinacloudapp.cn'

export var GET_PHONE_CODE_API = SERVER_IP + '/api/sendCode'
export var PHONE_NUM_LOGIN_API = SERVER_IP + '/api/user/signupByPhone'
export var WECHAT_LOGIN_API = SERVER_IP + '/api/user/signupByWeChat'
export var GET_USER_INFO_API = SERVER_IP + '/api/user/me'
export var SET_USER_NICKNAME_API = SERVER_IP + '/api/user/nickname'

export var PARAMETER_PHONE = 'phone'
export var PARAMETER_VERFICATION_CODE = 'verifyCode'
export var PARAMETER_NICKNAME = 'nickname'
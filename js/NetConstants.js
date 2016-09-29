'use strict'
var VersionConstants = require('./VersionConstants');

const SERVER_IP = 'https://api.typhoontechnology.hk'
const GZT_SERVER_IP = 'http://124.192.161.110:8080'
const TRADEHERO_SERVER_IP = 'http://cn.tradehero.mobi'

export const GET_OUT_RIGHT_API = SERVER_IP + '/api/security/fx/outright'
export const GET_PHONE_CODE_API = SERVER_IP + '/api/sendCode'
export const PHONE_NUM_LOGIN_API = SERVER_IP + '/api/user/signupByPhone'
export const WECHAT_LOGIN_API = SERVER_IP + '/api/user/signupByWeChat'
export const GET_USER_INFO_API = SERVER_IP + '/api/user/me'
export const SET_USER_NICKNAME_API = SERVER_IP + '/api/user/nickname'
export const GET_USER_BOOKMARK_LIST_API = SERVER_IP + '/api/security/byIds'
export const GET_US_STOCK_TOP_GAIN_API = SERVER_IP + '/api/security/stock/topGainer'
export const GET_US_STOCK_TOP_LOSER_API = SERVER_IP + '/api/security/stock/topLoser'
export const GET_INDEX_LIST_API = SERVER_IP + '/api/security/index'
export const GET_FX_LIST_API = SERVER_IP + '/api/security/fx'
export const GET_FUTURE_LIST_API = SERVER_IP + '/api/security/futures'
export const GET_SEARCH_STOCK_API = SERVER_IP + '/api/security/search'
export const GET_STOCK_DETAIL_API = SERVER_IP + '/api/security/<stockCode>'
export const GET_STOCK_PRICE_TODAY_API = SERVER_IP + '/api/quote/<stockCode>/tick/<chartType>'
export const GET_OPEN_POSITION_API = SERVER_IP + '/api/position/open'
export const GET_CLOSED_POSITION_API = SERVER_IP + '/api/position/closed'
export const GET_HOMEPAGE_BANNER_API = SERVER_IP + '/api/banner2'
export const OWN_STOCK_LIST_API = SERVER_IP + '/api/security/bookmark'
export const POST_CREATE_POSITION_API = SERVER_IP + '/api/position'
export const POST_DELETE_POSITION_API = SERVER_IP + '/api/position/net'
export const STOP_PROFIT_LOSS_API = SERVER_IP + '/api/position/order'
export const ADD_REMOVE_STOP_PROFIT_API = SERVER_IP + '/api/position/order/take'
export const GET_USER_BALANCE_API = SERVER_IP + '/api/user/balance'
export const GET_USER_STATISTICS_API = SERVER_IP + '/api/user/plReport'
export const GET_POPULARITY_API = SERVER_IP + '/api/security/byPopularity'
export const GET_TOP_NEWS_TOP10_API = SERVER_IP + '/api/headline/top10'
export const FEEDBACK_API = SERVER_IP + '/api/feedback_pic'
export const AUTO_CLOSE_ALERT_API = SERVER_IP + '/api/user/alert/<setting>'
export const BIND_MOBILE_API = SERVER_IP + '/api/user/bindphone'
export const BIND_WECHAT_API = SERVER_IP + '/api/user/bindwechat?openid=<wechatOpenId>'
export const UPDATE_HEAD_PHOTO = SERVER_IP + '/api/user/photo'
export const GET_ALL_STOCK_ALERT = SERVER_IP + '/api/user/stockAlert/all'
export const UPDATE_STOCK_ALERT = SERVER_IP + '/api/user/stockAlert'
export const POST_PUSH_TOKEN = SERVER_IP + '/api/user/pushtoken'
export const POST_PUSH_TOKEN_AUTH = SERVER_IP + '/api/user/pushtokenauth'
export const GET_STOCK_KLINE_FIVE_M = SERVER_IP + '/api/quote/<securityId>/kline/5m'
export const GET_STOCK_KLINE_DAY = SERVER_IP + '/api/quote/<securityId>/kline/day'
export const GET_MY_MESSAGES = SERVER_IP + '/api/user/message?pageNum=<pageNum>&pageSize=<pageSize>'
export const SET_MESSAGE_READ = SERVER_IP + '/api/user/message/<id>'
export const GET_UNREAD_MESSAGE = SERVER_IP + '/api/user/message/unread'
export const GET_MOVIE_RANK = SERVER_IP + '/api/competition/1/user/<userId>/rank'

export const GET_USER_DAILY_SIGN_INFO = SERVER_IP + '/api/reward/summary'//获取每日签到页面所需信息（需身份验证）
export const GET_USER_DAILY_SIGN_MONTH = SERVER_IP + '/api/reward/checkIn/month'//获取当前月份的签到情况(需要身份验证)
export const USER_DAILY_SIGN = SERVER_IP + '/api/reward/checkIn'//每日签到 (需要身份验证)
export const GET_TOTAL_UNPAID = SERVER_IP + '/api/reward/unpaid'
export const GET_CHECK_IN_SHARE_DATA = SERVER_IP + '/api/reward/checkIn/share'
export const GET_REGISTER_SHARE_DATA = SERVER_IP + '/api/reward/demoReg/share'

export const GZT_OCR_CHECK_API = GZT_SERVER_IP + '/ocrCheck'

export const WEBVIEW_RECOMMAND_PAGE = TRADEHERO_SERVER_IP + '/TH_CFD_WEB/detailslider.php?id='
export const WEBVIEW_TOP_NEWS_PAGE = TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/FocusSlider.php?id='
export const WEBVIEW_QA_PAGE = TRADEHERO_SERVER_IP + '/TH_CFD_WEB/wenda<version>.html'
export const WEBVIEW_URL_ABOUT_US = TRADEHERO_SERVER_IP + '/TH_CFD_WEB/about.html'
export const SHARE_URL = TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/detailShare.php?id=<id>'
export const SHARE_MOVIE_WIN_TICKET_URL = TRADEHERO_SERVER_IP + '/CDF_BSY/sucess.php?hjcode=0'
export const SHARE_MOVIE_NOT_WIN_TICKET_URL = TRADEHERO_SERVER_IP + '/CDF_BSY/sucess.php?hjcode=1'
export const SHARE_LOGO_URL = TRADEHERO_SERVER_IP + '/TH_CFD_WEB/images/ShareLogo.png'
export const INCOME_URL = TRADEHERO_SERVER_IP + '/TH_CFD_WEB/checkinRule.php'
export const MOVIE_WIN_TICKET_URL = TRADEHERO_SERVER_IP + '/CDF_BSY/index.php?userId=<userId>'
export const PARAMETER_PHONE = 'phone'
export const PARAMETER_VERFICATION_CODE = 'verifyCode'
export const PARAMETER_NICKNAME = 'nickname'
export const PARAMETER_STOCKIDS = 'securityIds'

export const PARAMETER_CHARTTYPE_TEN_MINUTE = '10m'
export const PARAMETER_CHARTTYPE_TWO_HOUR = '2h'
export const PARAMETER_CHARTTYPE_TODAY = 'today'
export const PARAMETER_CHARTTYPE_WEEK = 'week'
export const PARAMETER_CHARTTYPE_MONTH = 'month'
export const PARAMETER_CHARTTYPE_DAY = 'day'
export const PARAMETER_CHARTTYPE_5_MINUTE = '5m'

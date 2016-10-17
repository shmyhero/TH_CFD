'use strict'
var VersionConstants = require('./VersionConstants');

const STAGING_SERVER_IP = 'http://300f8c59436243fe920fce09eb87d765.chinacloudapp.cn'
const PRODUCT_SERVER_IP = 'https://api.typhoontechnology.hk'
const GZT_SERVER_IP = 'http://124.192.161.110:8080'
const TRADEHERO_SERVER_IP = 'http://cn.tradehero.mobi'

export function getAPIServerIP(){
  return VersionConstants.getIsProductServer() ? PRODUCT_SERVER_IP : STAGING_SERVER_IP;
}

export let CFD_API = getCFDAPI();
export let GZT_API = getGZTAPI();
export let TRADEHERO_API = getTradeHeroAPI();

export function reloadCFDAPI(){
  CFD_API = getCFDAPI();
}

export function getUrl(key){
  return CFD_API[key];
}

function getCFDAPI(){
  return {
    GET_OUT_RIGHT_API: getAPIServerIP() + '/api/security/fx/outright',
    GET_PHONE_CODE_API: getAPIServerIP() + '/api/sendCode',

    PHONE_NUM_LOGIN_API: getAPIServerIP() + '/api/user/signupByPhone',
    WECHAT_LOGIN_API: getAPIServerIP() + '/api/user/signupByWeChat',
    GET_USER_INFO_API: getAPIServerIP() + '/api/user/me',
    SET_USER_NICKNAME_API: getAPIServerIP() + '/api/user/nickname',
    GET_USER_BOOKMARK_LIST_API: getAPIServerIP() + '/api/security/byIds',
    GET_US_STOCK_TOP_GAIN_API: getAPIServerIP() + '/api/security/stock/topGainer',
    GET_US_STOCK_TOP_LOSER_API: getAPIServerIP() + '/api/security/stock/topLoser',
    GET_INDEX_LIST_API: getAPIServerIP() + '/api/security/index',
    GET_FX_LIST_API: getAPIServerIP() + '/api/security/fx',
    GET_FUTURE_LIST_API: getAPIServerIP() + '/api/security/futures',
    GET_SEARCH_STOCK_API: getAPIServerIP() + '/api/security/search',
    GET_STOCK_DETAIL_API: getAPIServerIP() + '/api/security/<stockCode>',
    GET_STOCK_PRICE_TODAY_API: getAPIServerIP() + '/api/quote/<stockCode>/tick/<chartType>',
    GET_OPEN_POSITION_API: getAPIServerIP() + '/api/position/open',
    GET_CLOSED_POSITION_API: getAPIServerIP() + '/api/position/closed',
    GET_HOMEPAGE_BANNER_API: getAPIServerIP() + '/api/banner2',
    OWN_STOCK_LIST_API: getAPIServerIP() + '/api/security/bookmark',
    POST_CREATE_POSITION_API: getAPIServerIP() + '/api/position',
    POST_DELETE_POSITION_API: getAPIServerIP() + '/api/position/net',
    STOP_PROFIT_LOSS_API: getAPIServerIP() + '/api/position/order',
    ADD_REMOVE_STOP_PROFIT_API: getAPIServerIP() + '/api/position/order/take',
    GET_USER_BALANCE_API: getAPIServerIP() + '/api/user/balance',
    GET_USER_STATISTICS_API: getAPIServerIP() + '/api/user/plReport',
    GET_POPULARITY_API: getAPIServerIP() + '/api/security/byPopularity',
    GET_TOP_NEWS_TOP10_API: getAPIServerIP() + '/api/headline/top10',
    FEEDBACK_API: getAPIServerIP() + '/api/feedback_pic',
    AUTO_CLOSE_ALERT_API: getAPIServerIP() + '/api/user/alert/<setting>',
    BIND_MOBILE_API: getAPIServerIP() + '/api/user/bindphone',
    BIND_WECHAT_API: getAPIServerIP() + '/api/user/bindwechat?openid=<wechatOpenId>',
    UPDATE_HEAD_PHOTO: getAPIServerIP() + '/api/user/photo',
    GET_ALL_STOCK_ALERT: getAPIServerIP() + '/api/user/stockAlert/all',
    UPDATE_STOCK_ALERT: getAPIServerIP() + '/api/user/stockAlert',
    POST_PUSH_TOKEN: getAPIServerIP() + '/api/user/pushtoken',
    POST_PUSH_TOKEN_AUTH: getAPIServerIP() + '/api/user/pushtokenauth',
    GET_STOCK_KLINE_FIVE_M: getAPIServerIP() + '/api/quote/<securityId>/kline/5m',
    GET_STOCK_KLINE_DAY: getAPIServerIP() + '/api/quote/<securityId>/kline/day',
    GET_MY_MESSAGES: getAPIServerIP() + '/api/user/message?pageNum=<pageNum>&pageSize=<pageSize>',
    SET_MESSAGE_READ: getAPIServerIP() + '/api/user/message/<id>',
    GET_UNREAD_MESSAGE: getAPIServerIP() + '/api/user/message/unread',
    GET_MOVIE_RANK: getAPIServerIP() + '/api/competition/1/user/<userId>/rank',

    GET_USER_DAILY_SIGN_INFO: getAPIServerIP() + '/api/reward/summary',//获取每日签到页面所需信息（需身份验证）
    GET_USER_DAILY_SIGN_MONTH: getAPIServerIP() + '/api/reward/checkIn/month',//获取当前月份的签到情况(需要身份验证)
    USER_DAILY_SIGN: getAPIServerIP() + '/api/reward/checkIn',//每日签到 (需要身份验证)
    GET_TOTAL_UNPAID: getAPIServerIP() + '/api/reward/unpaid',
    GET_CHECK_IN_SHARE_DATA: getAPIServerIP() + '/api/reward/checkIn/share',
    GET_REGISTER_SHARE_DATA: getAPIServerIP() + '/api/reward/demoReg/share',
  }
}

function getGZTAPI(){
  return {
    GZT_OCR_CHECK_API: GZT_SERVER_IP + '/ocrCheck',
  }
}

function getTradeHeroAPI(){
  return {
    WEBVIEW_RECOMMAND_PAGE: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/detailslider.php?id=',
    WEBVIEW_TOP_NEWS_PAGE: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/FocusSlider.php?id=',
    WEBVIEW_QA_PAGE: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/wenda<version>.html',
    WEBVIEW_URL_ABOUT_US: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/about.html',
    SHARE_URL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/detailShare.php?id=<id>',
    SHARE_MOVIE_WIN_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/sucess.php?hjcode=0',
    SHARE_MOVIE_NOT_WIN_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/sucess.php?hjcode=1',
    SHARE_LOGO_URL: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/images/ShareLogo.png',
    INCOME_URL: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/checkinRule.php',
    MOVIE_WIN_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/index.php',
    SHARE_DOWNLOAD_URL: TRADEHERO_SERVER_IP + '/activity/download.php',
  }
}

export let PARAMETER_PHONE = 'phone'
export let PARAMETER_VERFICATION_CODE = 'verifyCode'
export let PARAMETER_NICKNAME = 'nickname'
export let PARAMETER_STOCKIDS = 'securityIds'

export let PARAMETER_CHARTTYPE_TEN_MINUTE = '10m'
export let PARAMETER_CHARTTYPE_TWO_HOUR = '2h'
export let PARAMETER_CHARTTYPE_TODAY = 'today'
export let PARAMETER_CHARTTYPE_WEEK = 'week'
export let PARAMETER_CHARTTYPE_MONTH = 'month'
export let PARAMETER_CHARTTYPE_DAY = 'day'
export let PARAMETER_CHARTTYPE_5_MINUTE = '5m'

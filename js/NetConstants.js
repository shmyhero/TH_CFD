'use strict'
import {
  Platform
} from 'react-native'
var VersionConstants = require('./VersionConstants');

const SERVER_MAPPING = {};
SERVER_MAPPING[VersionConstants.SERVER_TYPE_PRODUCT] = 'https://api.typhoontechnology.hk';
SERVER_MAPPING[VersionConstants.SERVER_TYPE_STAGE] = 'http://300f8c59436243fe920fce09eb87d765.chinacloudapp.cn';
SERVER_MAPPING[VersionConstants.SERVER_TYPE_DEVELOP] = 'http://cfd-webapi-dev.chinacloudapp.cn';

//const GZT_SERVER_IP = 'http://124.192.161.110:8080'
const GZT_SERVER_IP_LIVE = 'http://219.143.253.206:2025'
const TRADEHERO_SERVER_IP = 'https://cn.tradehero.mobi'//http://cn.tradehero.mobi


var CFD_API_SERVER = SERVER_MAPPING[VersionConstants.getCFDServerType()];
export function getAPIServerIP(){
  return CFD_API_SERVER;
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
  CFD_API_SERVER = SERVER_MAPPING[VersionConstants.getCFDServerType()];
  return {
    GET_OUT_RIGHT_API: CFD_API_SERVER + '/api/security/fx/outright',
    GET_OUT_RIGHT_LIVE_API: CFD_API_SERVER + '/api/security/live/fx/outright',//LIVE OK
    GET_PHONE_CODE_API: CFD_API_SERVER + '/api/sendCode',

    PHONE_NUM_LOGIN_API: CFD_API_SERVER + '/api/user/signupByPhone',
    WECHAT_LOGIN_API: CFD_API_SERVER + '/api/user/signupByWeChat',
    GET_USER_INFO_API: CFD_API_SERVER + '/api/user/me',
    SET_USER_NICKNAME_API: CFD_API_SERVER + '/api/user/nickname',
    GET_USER_BOOKMARK_LIST_API: CFD_API_SERVER + '/api/security/byIds',
    GET_USER_BOOKMARK_LIST_LIVE_API: CFD_API_SERVER + '/api/security/live/byIds', //LIVE OK
    GET_US_STOCK_TOP_GAIN_API: CFD_API_SERVER + '/api/security/stock/topGainer',
    GET_US_STOCK_TOP_GAIN_LIVE_API: CFD_API_SERVER + '/api/security/live/stock/topGainer',//LIVE OK
    GET_US_STOCK_HK_API: CFD_API_SERVER + '/api/security/stock/hk',
    GET_US_STOCK_HK_LIVE_API: CFD_API_SERVER + '/api/security/live/stock/hk',//LIVE OK
    GET_US_STOCK_TOP_LOSER_API: CFD_API_SERVER + '/api/security/stock/topLoser',
    GET_INDEX_LIST_API: CFD_API_SERVER + '/api/security/index',
    GET_INDEX_LIST_LIVE_API: CFD_API_SERVER + '/api/security/live/index',//LIVE OK
    GET_FX_LIST_API: CFD_API_SERVER + '/api/security/fx',
    GET_FX_LIST_LIVE_API: CFD_API_SERVER + '/api/security/live/fx',//LIVE OK
    GET_FUTURE_LIST_API: CFD_API_SERVER + '/api/security/futures',
    GET_FUTURE_LIST_LIVE_API: CFD_API_SERVER + '/api/security/live/futures',//LIVE OK
    GET_SEARCH_STOCK_API: CFD_API_SERVER + '/api/security/search',
    GET_SEARCH_STOCK_LIVE_API: CFD_API_SERVER + '/api/security/live/search',//LIVE OK
    GET_STOCK_DETAIL_API: CFD_API_SERVER + '/api/security/<stockCode>',
    GET_STOCK_DETAIL_LIVE_API: CFD_API_SERVER + '/api/security/live/<stockCode>',//LIVE OK
    GET_STOCK_PRICE_TODAY_API: CFD_API_SERVER + '/api/quote/<stockCode>/tick/<chartType>',
    GET_STOCK_PRICE_TODAY_LIVE_API: CFD_API_SERVER + '/api/quote/live/<stockCode>/tick/<chartType>',//LIVE OK
    GET_STOCK_PRICE_KLINE_API: CFD_API_SERVER + '/api/quote/<stockCode>/kline/<chartType>',
    GET_STOCK_PRICE_KLINE_LIVE_API: CFD_API_SERVER + '/api/quote/live/<stockCode>/kline/<chartType>',//LIVE OK
    GET_OPEN_POSITION_API: CFD_API_SERVER + '/api/position/open',
    GET_OPEN_POSITION_LIVE_API: CFD_API_SERVER + '/api/position/live/open',//LIVE ok
    GET_CLOSED_POSITION_API: CFD_API_SERVER + '/api/position/closed',
    GET_CLOSED_POSITION_LIVE_API: CFD_API_SERVER + '/api/position/live/closed',//LIVE ok
    GET_HOMEPAGE_BANNER_API: CFD_API_SERVER + '/api/banner2',//实盘Banner，无实盘开户引导Banner位
    GET_HOMEPAGE_BANNER_ALL_API: CFD_API_SERVER + '/api/banner/all',//模拟盘Banner，可能有实盘开户引导Banner位
    OWN_STOCK_LIST_API: CFD_API_SERVER + '/api/security/bookmark',
    OWN_STOCK_LIST_LIVE_API: CFD_API_SERVER + '/api/security/live/bookmark',//LIVE ok
    POST_CREATE_POSITION_API: CFD_API_SERVER + '/api/position',
    POST_CREATE_POSITION_LIVE_API: CFD_API_SERVER + '/api/position/live',//LIVE ok
    POST_DELETE_POSITION_API: CFD_API_SERVER + '/api/position/net',
    POST_DELETE_POSITION_LIVE_API: CFD_API_SERVER + '/api/position/live/net',
    STOP_PROFIT_LOSS_API: CFD_API_SERVER + '/api/position/order',
    STOP_PROFIT_LOSS_LIVE_API: CFD_API_SERVER + '/api/position/live/order',//LIVE ok
    ADD_REMOVE_STOP_PROFIT_API: CFD_API_SERVER + '/api/position/order/take',
    ADD_REMOVE_STOP_PROFIT_LIVE_API: CFD_API_SERVER + '/api/position/live/order/take',//LIVE ok
    GET_USER_BALANCE_API: CFD_API_SERVER + '/api/user/balance',
    GET_USER_BALANCE_LIVE_API: CFD_API_SERVER + '/api/user/live/balance',//LIVE ok
    GET_USER_STATISTICS_API: CFD_API_SERVER + '/api/user/plReport',
    GET_USER_STATISTICS_LIVE_API: CFD_API_SERVER + '/api/user/live/plReport',//LIVE ok
    GET_POPULARITY_API: CFD_API_SERVER + '/api/security/byPopularity',
    GET_POPULARITY_LIVE_API: CFD_API_SERVER + '/api/security/live/byPopularity',//LIVE ok
    GET_TOP_NEWS_TOP10_API: CFD_API_SERVER + '/api/headline/top10',
    FEEDBACK_API: CFD_API_SERVER + '/api/feedback_pic',
    AUTO_CLOSE_ALERT_API: CFD_API_SERVER + '/api/user/alert/<setting>',
    AUTO_CLOSE_ALERT_LIVE_API: CFD_API_SERVER + '/api/user/live/alert/<setting>',
    BIND_MOBILE_API: CFD_API_SERVER + '/api/user/bindphone',
    BIND_WECHAT_API: CFD_API_SERVER + '/api/user/bindwechat?openid=<wechatOpenId>',
    UPDATE_HEAD_PHOTO: CFD_API_SERVER + '/api/user/photo',
    GET_ALL_STOCK_ALERT: CFD_API_SERVER + '/api/user/stockAlert/all',
    GET_ALL_STOCK_ALERT_LIVE: CFD_API_SERVER + '/api/user/live/stockAlert/all',//LIVE
    UPDATE_STOCK_ALERT: CFD_API_SERVER + '/api/user/stockAlert',
    UPDATE_STOCK_ALERT_LIVE: CFD_API_SERVER + '/api/user/live/stockAlert',//LIVE
    POST_PUSH_TOKEN: CFD_API_SERVER + '/api/user/pushtoken',
    POST_PUSH_TOKEN_AUTH: CFD_API_SERVER + '/api/user/pushtokenauth',

    GET_MY_MESSAGES: CFD_API_SERVER + '/api/user/message?pageNum=<pageNum>&pageSize=<pageSize>',
    GET_MY_MESSAGES_LIVE: CFD_API_SERVER + '/api/user/live/message?pageNum=<pageNum>&pageSize=<pageSize>',//LIVE ok
    SET_MESSAGE_READ: CFD_API_SERVER + '/api/user/message/<id>',
    SET_MESSAGE_READ_LIVE: CFD_API_SERVER + '/api/user/live/message/<id>',//LIVE ok
    GET_UNREAD_MESSAGE: CFD_API_SERVER + '/api/user/message/unread',
    GET_UNREAD_MESSAGE_LIVE: CFD_API_SERVER + '/api/user/live/message/unread',//LIVE ok
    //GET_MOVIE_RANK: CFD_API_SERVER + '/api/competition/1/user/<userId>/rank',


    GET_USER_DAILY_SIGN_INFO: CFD_API_SERVER + '/api/reward/summary',//获取每日签到页面所需信息（需身份验证）
    GET_USER_DAILY_SIGN_MONTH: CFD_API_SERVER + '/api/reward/checkIn/month',//获取当前月份的签到情况(需要身份验证)
    USER_DAILY_SIGN: CFD_API_SERVER + '/api/reward/checkIn',//每日签到 (需要身份验证)
    GET_TOTAL_UNPAID: CFD_API_SERVER + '/api/reward/unpaid',
    GET_TOTAL_REWARD: CFD_API_SERVER + '/api/reward/total',
    GET_CHECK_IN_SHARE_DATA: CFD_API_SERVER + '/api/reward/checkIn/share',
    GET_REGISTER_SHARE_DATA: CFD_API_SERVER + '/api/reward/demoReg/share',
    GET_REGISTER_REWARD: CFD_API_SERVER + '/api/reward/register',
    TRANSFER_REWARD: CFD_API_SERVER + '/api/reward/transfer/<amount>/',

    CHECK_LIVE_USERNAME: CFD_API_SERVER + '/api/user/live/checkUsername?username=<userName>',
    REGISTER_LIVE_ACCOUNT: CFD_API_SERVER + '/api/user/live/signup', //实盘注册
    DETELE_LIVE_ACCOUNT: CFD_API_SERVER + '/api/user/live/delete', //删除实盘账号绑定（测试用！)
    ID_CARD_OCR: CFD_API_SERVER + '/api/user/ocr', //身份证OCR
    ID_CHECK: CFD_API_SERVER + '/api/user/faceCheck', //验证身份证正确性
    USER_ACTUAL_LOGOUT: CFD_API_SERVER + '/api/user/live/logout',

    UPLOAD_ADDRESS_PHOTO: CFD_API_SERVER + '/api/user/live/poa', //身份证OCR

    GET_USER_LIVE_CARDS:CFD_API_SERVER + '/api/card/my',//我的卡片
    GET_HOME_CARDS:CFD_API_SERVER + '/api/card/top',//首页卡片
    SET_CARD_READ: CFD_API_SERVER + '/api/card/<id>',
    SET_CARD_LIKED: CFD_API_SERVER + '/api/card/like/<id>',
    SHARE_CARD_TO_HOME: CFD_API_SERVER + '/api/card/share/<id>',

    RESET_PASSWORD:CFD_API_SERVER + '/api/user/live/resetPwd',//忘记密码/重置密码

    SWITCH_TO_LIVE:CFD_API_SERVER + '/api/user/switchTo/Live',//切换到实盘
    SWITCH_TO_DEMO:CFD_API_SERVER + '/api/user/switchTo/Demo',//切换到模拟盘

    LATEST_APP_VERSION:CFD_API_SERVER + '/api/version/' + (Platform.OS === "ios" ? "ios" : "android"),

    GET_PAY_DEMO_TEST_ID:CFD_API_SERVER + '/api/user/live/deposit/id',

    GET_SUPPORT_WITHDRAW_BANKS: CFD_API_SERVER + "/api/common/banks",
    GET_ALL_PROVINCES_AND_CITIES: CFD_API_SERVER + "/api/common/area/?id=-1",
    GET_PROVINCES: CFD_API_SERVER + "/api/common/area/?id=0",
    GET_CITY: CFD_API_SERVER + "/api/common/area/?id=<id>",
    BIND_BANK_ACCOUNT: CFD_API_SERVER + "/api/user/live/refaccount",
    REQUEST_UNBIND_CARD: CFD_API_SERVER + "/api/user/live/withdraw/unbind",
    GET_USER_INFO: CFD_API_SERVER + "/api/user/live/withdraw/info",
    REFUNDABLE_BALANCE: CFD_API_SERVER + "/api/user/live/balance/refundable",
    REFUND_SETTINGS: CFD_API_SERVER + "/api/common/setting/withdraw",
    REQUEST_WITHDRAW: CFD_API_SERVER + "/api/user/live/withdraw",

    GET_TRANSFERS_LIST: CFD_API_SERVER + "/api/user/live/transfers",
    GET_DEPOSIT_SETTING: CFD_API_SERVER + "/api/common/setting/deposit",
    TIMESTAMP: CFD_API_SERVER + '/api/user/live/timestamp',//LIVE ok

    GET_POSITION_CHART_PLCLOSE_LIVE:CFD_API_SERVER + "/api/user/<id>/live/position/chart/plClosed",
    GET_POSITION_CHART_PLCLOSE_2W_LIVE:CFD_API_SERVER + "/api/user/<id>/live/position/chart/plClosed/2w",
    GET_USER_LIVE_DETAIL:CFD_API_SERVER + "/api/user/<id>/live/detail",
    PUT_USER_FOLLOW:CFD_API_SERVER + "/api/user/follow/<id>",//add follow
    DEL_USER_FOLLOW:CFD_API_SERVER + "/api/user/follow/<id>",//cancel follow
    GET_RANK_LIVE_PLCLOSED_2W:CFD_API_SERVER + "/api/rank/live/user/plClosed/2w",//2 weeks rank
    GET_RANK_LIVE_FOLLOWING_2W:CFD_API_SERVER + "/api/user/following",//follow

    SHOW_USER_DATA_API: CFD_API_SERVER + '/api/user/live/profit',

    PERSONAL_PAGE_POSITION_OPEN: CFD_API_SERVER + '/api/user/<userID>/live/position/open/',
    PERSONAL_PAGE_POSITION_CLOSE: CFD_API_SERVER + '/api/user/<userID>/live/position/closed/',
    GET_OTHER_USER_STATISTICS_API: CFD_API_SERVER + '/api/user/<userID>/live/plreport',

    GET_REWARD_FIRSTDAY_CLICKED: CFD_API_SERVER + '/api/reward/firstday/clicked',//通知Server客户端点击过了只需要显示一次的 ‘入金最高获得20%赠金’
    GET_REWARD_FIRSTDAY_REWARDED: CFD_API_SERVER + '/api/reward/firstday/rewarded',//通知Server首页的提示已经展示过了，只需展示一次。
    POST_UPDATE_FIRST_LOGIN_INFO: CFD_API_SERVER + '/api/user/updateFirstLoginInfo',

    START_UP_ACTIVITY: CFD_API_SERVER + '/api/common/activity',
    GET_SCORE: CFD_API_SERVER + '/api/score',
  }
}

function getGZTAPI(){
  return {
    GZT_OCR_CHECK_API: GZT_SERVER_IP_LIVE + '/ocrCheck',
  }
}

function getTradeHeroAPI(){
  return {
    WEBVIEW_RECOMMAND_PAGE: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/detailslider.php?id=',
    WEBVIEW_RECOMMAND_PAGE_ACTUAL: TRADEHERO_SERVER_IP + '/TH_CFD_SP/detailslider.php?id=',
    WEBVIEW_TOP_NEWS_PAGE: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/FocusSlider.php?id=',
    WEBVIEW_TOP_NEWS_PAGE_ACTUAL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER_ACTUAL + '/FocusSlider.php?id=',
    WEBVIEW_QA_PAGE: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/wenda<version>.html',
    WEBVIEW_QA_PAGE_ACTUAL: TRADEHERO_SERVER_IP + '/TH_CFD_SP/wenda.html',
    WEBVIEW_URL_ABOUT_US: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/about.html',
    WEBVIEW_URL_ABOUT_US_ACTUAL: TRADEHERO_SERVER_IP + '/TH_CFD_SP/about.html',
    WEBVIEW_URL_SCHOOL:TRADEHERO_SERVER_IP + '/TH_CFD_WEB/school.html',
    WEBVIEW_URL_SCHOOL_ACTUAL:TRADEHERO_SERVER_IP + '/TH_CFD_SP/school.html',
    SHARE_URL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/detailShare.php?id=<id>',
    SHARE_MOVIE_WIN_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/sucess.php?hjcode=0',
    SHARE_MOVIE_NOT_WIN_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/sucess.php?hjcode=1',
    SHARE_MOVIE_NOT_ATTENDED_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/indexShare.php',
    SHARE_LOGO_URL: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/images/ShareLogo.png',
    INCOME_URL: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/checkinRule.php',
    //MOVIE_WIN_TICKET_URL: TRADEHERO_SERVER_IP + '/CDF_BSY/index.php',
    COMPETITION_PAGE_URL: TRADEHERO_SERVER_IP + '/CDF_BSY_HF/index.php',
    SHARE_DOWNLOAD_URL: TRADEHERO_SERVER_IP + '/activity/download.php',
    LIVE_REGISTER_TERMS: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER_ACTUAL + '/SignTerms<id>.html',
    SHARE_ACHIEVEMENT_CARD_URL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/CardShare.php?id=<id>',

    HELP_CENTER_URL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/HelpCenter.html',
    HELP_CENTER_URL_ACTUAL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER_ACTUAL + '/HelpCenter.html',
    WITHDRAW_AGREEMENT_URL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER_ACTUAL + '/Agreementchujin.html',
    DEPOSIT_AGREEMENT: TRADEHERO_SERVER_IP + '/TH_CFD_SP/Agreementrujin.html',
    //用户协议
    WEBVIEW_SIGNTERMS_PAGE: TRADEHERO_SERVER_IP + '/TH_CFD_WEB/SignTerms.html',
    WEBVIEW_SIGNTERMS_PAGE_ACTUAL: TRADEHERO_SERVER_IP + '/TH_CFD_SP/SignTerms.html',

    NEW_USER_INVITATION: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER + '/Invitation.html',
    NEW_USER_INVITATION_ACTUAL: TRADEHERO_SERVER_IP + '/' + VersionConstants.WEBPAGE_FOLDER_ACTUAL + '/Invitation.html',
    WEBVIEW_CARD_RULE:TRADEHERO_SERVER_IP + '/TH_CFD_SP/cardRule.html',//卡片详情
    WEBVIEW_TRADE_LEVEL:TRADEHERO_SERVER_IP+'/TH_CFD_SP/level.html',//交易等级

    INCOME_RULE:TRADEHERO_SERVER_IP+'/TH_CFD_WEB/TradgoldRule.html',
    CREDITS_RULE:TRADEHERO_SERVER_IP+'/CFD_Channel/jifenguize.html',
    CREDITS_PLAY:TRADEHERO_SERVER_IP+'/CFD_Channel/jifenchouj.html',
  }
}

export let PARAMETER_PHONE = 'phone'
export let PARAMETER_VERFICATION_CODE = 'verifyCode'
export let PARAMETER_NICKNAME = 'nickname'
export let PARAMETER_STOCKIDS = 'securityIds'

// export let PARAMETER_CHARTTYPE_TEN_MINUTE = '10m'
export let PARAMETER_CHARTTYPE_TODAY = 'today'
export let PARAMETER_CHARTTYPE_TWO_HOUR = '2h'
export let PARAMETER_CHARTTYPE_WEEK = 'week'
export let PARAMETER_CHARTTYPE_MONTH = 'month'
export let PARAMETER_CHARTTYPE_3_MONTH = '3month'
export let PARAMETER_CHARTTYPE_6_MONTH = '6month'

// export let PARAMETER_CHARTTYPE_TODAY_CANDLE = 'todayK'
export let PARAMETER_CHARTTYPE_1_MINUTE = '1m'
export let PARAMETER_CHARTTYPE_5_MINUTE = '5m'
export let PARAMETER_CHARTTYPE_15_MINUTE = '15m'
export let PARAMETER_CHARTTYPE_60_MINUTE = '60m'
export let PARAMETER_CHARTTYPE_DAY = 'day'

export let PARAMETER_CHARTTYPE_2WEEK_YIELD = '2WeekYield'
export let PARAMETER_CHARTTYPE_ALL_YIELD = 'allYield'


export function isCandleChart(type){
  if(type === PARAMETER_CHARTTYPE_1_MINUTE
  || type === PARAMETER_CHARTTYPE_5_MINUTE
  || type === PARAMETER_CHARTTYPE_15_MINUTE
  || type === PARAMETER_CHARTTYPE_60_MINUTE
  || type === PARAMETER_CHARTTYPE_DAY){
    return true;
  }
  return false;
}

export function isPortraitChart(type){
  if(type === PARAMETER_CHARTTYPE_TODAY
  || type === PARAMETER_CHARTTYPE_TWO_HOUR
  || type === PARAMETER_CHARTTYPE_WEEK
  || type === PARAMETER_CHARTTYPE_DAY
  || type === PARAMETER_CHARTTYPE_5_MINUTE){
    return true;
  }
  return false;
}

export let AUTH_ERROR = '需要OAuth授权'

export let ANDROID_MARKET_URL = 'market://details?id=com.tradehero.cfd';
export let CHECK_IP_URL = "http://ipof.in/txt"

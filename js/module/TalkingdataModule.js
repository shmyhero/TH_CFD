'use strict'

import { NativeModules } from 'react-native';

const nativeModule = NativeModules.TalkingDataAPI;

export const LABEL_OPEN_ACCOUNT = "实盘开户"

export const LIVE_LOGIN_EVENT = '实盘登录'
export const LIVE_REGISTER_EVENT = '实盘注册'

export const LIVE_QUIT = '退出实盘'		// todo
export const LIVE_OPEN_ACCOUNT_START = '实盘开户-开始'
export const LIVE_OPEN_ACCOUNT_STEP1 = '实盘开户-准备完成'
export const LIVE_OPEN_ACCOUNT_STEP2 = '实盘开户-上传照片完成'
export const LIVE_OPEN_ACCOUNT_STEP3 = '实盘开户-个人信息完成'
export const LIVE_OPEN_ACCOUNT_STEP4 = '实盘开户-财务信息完成'
export const LIVE_OPEN_ACCOUNT_STEP5 = '实盘开户-提交完成'
export const LIVE_OPEN_ACCOUNT_BACK = '实盘开户-返回'
export const LIVE_OPEN_ACCOUNT_CONTINUE = '实盘开户-继续'		// todo
export const LIVE_OPEN_ACCOUNT_QUIT = '退出实盘开户'
export const LIVE_UPLOAD_ID_IMAGE = '上传身份证照片'
export const LIVE_UPLOAD_ID_IMAGE_CANCEL = '取消上传身份证照片'

export const SIMULATOR_LOGIN_EVENT = '模拟注册登录'
export const TRADE_EVENT = '交易下单'
export const ADD_TO_MY_LIST_EVENT = '添加自选'
export const REMOVE_FROM_MY_LIST_EVENT = '删除自选'
export const SOLD_EVENT = '平仓'
export const SET_STOP_PROFIT_LOSS_EVENT = '止盈止损设置'
export const SEARCH_AND_ADD_TO_MY_LIST_EVENT = '搜索添加自选'
export const SEARCH_AND_LOOK_EVENT = '搜索进入'
export const SEARCH_WITH_NO_RESULT_EVENT = '搜索无结果'

export const STOCK_DETAIL_TAB_TODAY = '选择分时图'
export const STOCK_DETAIL_TAB_TWOH = '选择2小时图'
export const STOCK_DETAIL_TAB_FIVED = '选择5日图'
export const STOCK_DETAIL_TAB_DAY_CANDLE = '选择日K图'
export const STOCK_DETAIL_TAB_FIVEM_CANDLE = '选择5分钟图'

export const MOVIE_ACTIVITY_EVENT = "点击影票来袭入口按钮"
export const CHECK_IN_ACTIVITY_EVENT = "点击每日签到入口按钮"
export const BANNER_EVENT = "访问BANNER"
export const CHECK_IN_BUTTON_EVENT = "点击签到按钮"

export const BANNER_SHARE_EVENT = "BANNER分享"
export const CHECK_IN_SHARE_EVENT = "签到页面分享"
export const MOVIE_SHARE_EVENT = "影票来袭分享"
export const HEADER_SHARE_EVENT = "每日头条分享"
export const REGISTER_INCOME_SHARE_EVENT = "炫耀一下"

export const KEY_TYPE = "类型"
export const VALUE_FRONT = "正面"
export const VALUE_REAR = "反面"

export const KEY_BANNER_PAGE = "Banner页面"

export const KEY_STOCK_ID = "ID";

export const KEY_SECURITY_ID = "ID";
export const KEY_SECURITY_NAME = "名字";
export const KEY_INVEST = "本金";
export const KEY_LEVERAGE = "杠杆";
export const KEY_IS_LONG = "是否买涨";
export const KEY_TIME = "下单时间";
export const KEY_STOP_PROFIT_SWITCH_ON = "止盈开关";
export const KEY_STOP_LOSS_SWITCH_OFF = "止损开关";
export const KEY_STOP_PROFIT = "止盈比例";
export const KEY_STOP_LOSS = "止损比例";
export const KEY_OPEN_PRICE = "开仓价格";
export const KEY_OPEN_TIME = "开仓时间";
export const KEY_CLOSE_PRICE = "平仓价格";
export const KEY_CLOSE_TIME = "平仓时间";
export const KEY_PROFIT = "盈利";

export const KEY_SEARCH_TEXT = "搜索字段";
export const KEY_SEARCH_TEXT_FAILED = "搜索字段失败";

export function trackPageBegin(page_name) {
  nativeModule.trackPageBegin(page_name);
}

export function trackPageEnd(page_name) {
  nativeModule.trackPageEnd(page_name);
}

export function trackEvent(event_name, event_label, parameters) {
  nativeModule.trackEvent(event_name, event_label, parameters);
}

export function setLocation(latitude, longitude) {
  nativeModule.setLocation(latitude, longitude);
}

export function getDeviceID() {
  return new Promise(resolve=>{
    nativeModule.getDeviceID(resolve);
  })
}

export async function applyAuthCode(countryCode, mobile, requestId) {
  return await nativeModule.applyAuthCode(countryCode, mobile, requestId);
}

export async function verifyAuthCode(countryCode, mobile, authCode) {
  return await nativeModule.verifyAuthCode(countryCode, mobile, authCode);
}

var currentTrackingEventName;
var currentTrackingEventLabel;
var currentTrackingEventParameters;
export async function setCurrentTrackingEvent(event_name, event_label, parameters) {
  currentTrackingEventName = event_name;
  currentTrackingEventLabel = event_label;
  currentTrackingEventParameters = parameters;
}
export async function clearCurrentTrackingEvent(){
  currentTrackingEventName = null;
  currentTrackingEventLabel = null;
  currentTrackingEventParameters = null;
}
export async function trackCurrentEvent(){
  if(currentTrackingEventName){
    trackEvent(currentTrackingEventName, currentTrackingEventLabel, currentTrackingEventParameters);
  }
}

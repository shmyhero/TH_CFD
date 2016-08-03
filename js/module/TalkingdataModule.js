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
export const SEARCH_EVENT = '搜索'


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

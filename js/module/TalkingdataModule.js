'use strict'

import { NativeModules } from 'react-native';

const nativeModule = NativeModules.TalkingDataAPI;

export const LIVE_LOGIN_EVENT = '实盘登录'
export const LIVE_REGISTER_EVENT = '实盘注册'
export const SIMULATOR_LOGIN_EVENT = '模拟注册登录'
export const TRADE_EVENT = '交易下单'
export const ADD_TO_MY_LIST_EVENT = '添加自选'
export const REMOVE_FROM_MY_LIST_EVENT = '删除自选'


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

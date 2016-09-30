'use strict'

import { NativeModules } from 'react-native';

const nativeModule = NativeModules.TongDaoAPI;

export const TD_OPEN_POSITION = "开仓"
export const TD_CLOSE_POSITION = "平仓"
export const TD_JOIN_COMPETITION = "参与比赛"
export const TD_TOP_NEWS = "点击头条"
export const TD_ADD_OWN_STOCK = "添加自选产品"
export const TD_REMOVE_OWN_STOCK = "删除自选产品"
export const TD_SEARCH_STOCK = "搜索金融产品"
export const TD_CHECK_IN = "签到事件"
// export const TD_REGISTER_MOVIE_EVENT = "比收益事件"

export function setUserId(userid) {
	nativeModule.setUserId(""+userid)
}

export function setUserName(name) {
	nativeModule.setUserName(name)
}

export function setPhoneNumber(number) {
	nativeModule.setPhoneNumber(number)
}

export function setAvatarlUrl(url) {
	nativeModule.setAvatarlUrl(url)
}

export function updateUserData(userData) {
	console.log("tong dao:", userData)
	setUserName(userData.nickname)
	setPhoneNumber(userData.phone)
	setAvatarlUrl(userData.picUrl)
}


export function trackUserProfile(profile) {
	nativeModule.trackUserProfile(profile);
}

export function trackEvent(event_name, values) {
	nativeModule.trackEvent(event_name, values);
}

export function trackRegistration() {
	nativeModule.trackRegistration();
}

export function trackOpenPositionEvent(data, money) {
	var values = {}
	values["升／跌"] = data.isLong ? "升":"跌"
	values["品类"] = data.security.name
	values["资金"] = ""+money
	values["杠杆"] = ""+data.leverage
	trackEvent(TD_OPEN_POSITION, values)
}

export function trackClosePositionEvent(data) {
	var values = {}
	console.log("tongdao:", data)
	values["升／跌"] = data.isLong ? "升":"跌"
	values["品类"] = data.security.name
	values["获利"] = ""+money
	values["杠杆"] = ""+data.pl
	trackEvent(TD_CLOSE_POSITION, values)
}

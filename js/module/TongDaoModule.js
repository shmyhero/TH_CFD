'use strict'

// import { NativeModules } from 'react-native';
//
// const nativeModule = NativeModules.TongDaoAPI;
//
// export const TD_OPEN_POSITION = "kai cang"
// export const TD_CLOSE_POSITION = "ping cang"
// // export const TD_JOIN_COMPETITION = "参与比赛"
// // export const TD_TOP_NEWS = "点击头条"
// export const TD_TOP_BANNER = "dian ji tou tu"
// export const TD_ADD_OWN_STOCK = "tian jia zi xuan"
// export const TD_REMOVE_OWN_STOCK = "shan chu zi xuan"
// export const TD_SEARCH_STOCK = "sou suo"
// export const TD_CHECK_IN = "qian dao"
// // export const TD_REGISTER_MOVIE_EVENT = "比收益事件"
//
// export function setUserId(userid) {
// 	if(userid){
// 		nativeModule.setUserId(""+userid)
// 	}else{
// 		nativeModule.setUserId(null)
// 	}
// }
//
// export function setUserName(name) {
// 	nativeModule.setUserName(name)
// }
//
// export function setPhoneNumber(number) {
// 	nativeModule.setPhoneNumber(number)
// }
//
// export function setAvatarlUrl(url) {
// 	nativeModule.setAvatarlUrl(url)
// }
//
// export function updateUserData(userData) {
// 	console.log("tong dao:", userData)
// 	setUserName(userData.nickname)
// 	setPhoneNumber(userData.phone)
// 	setAvatarlUrl(userData.picUrl)
// }
//
//
// export function trackUserProfile(profile) {
// 	nativeModule.trackUserProfile(profile);
// }
//
// export function trackEvent(event_name, values) {
// 	nativeModule.trackEvent(event_name, values);
// }
//
// export function trackRegistration() {
// 	nativeModule.trackRegistration();
// }
//
// export function trackOpenPositionEvent(data, money) {
// 	var values = {}
// 	values["zhang/die"] = data.isLong ? "zhang":"die"
// 	values["tou zi pin zhong"] = data.security.name
// 	values["zi jin"] = ""+money
// 	values["gang gan"] = ""+data.leverage
// 	trackEvent(TD_OPEN_POSITION, values)
// }
//
// export function trackClosePositionEvent(data) {
// 	var values = {}
// 	console.log("tongdao:", data)
// 	values["zhang/die"] = data.isLong ? "zhang":"die"
// 	values["tou zi pin zhong"] = data.security.name
// 	values["zi jin"] = ""+data.invest
// 	values["gang gan"] = ""+data.leverage
// 	trackEvent(TD_CLOSE_POSITION, values)
// }
//
// export function trackAddRemoveOwnStockEvent(stockid, isAdd) {
// 	var values = {"tou zi pin zhong" : stockid}
// 	var type = isAdd ? TD_ADD_OWN_STOCK : TD_REMOVE_OWN_STOCK
// 	trackEvent(type, values)
// }
//
// export function trackSearchStockEvent(text, hasResult) {
// 	var result = hasResult ? "you" : "wu"
// 	var values = {"sou suo ci" : text, "you jie guo/wu jie guo" : result}
// 	trackEvent(TD_SEARCH_STOCK, values)
// }
//
// export function trackDaySignEvent(signed) {
// 	var result = signed ? "can yu" : "wei can yu"
// 	var values = {"can yu/wei can yu" : result}
// 	trackEvent(TD_CHECK_IN, values)
// }
//
// export function trackTopBannerEvent() {
// 	trackEvent(TD_TOP_BANNER, null)
// }

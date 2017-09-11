'use strict'

import React from 'react';
import {
  AsyncStorage,
} from 'react-native';

var USER_DATA_STORAGE_KEY = '@TH_CFD:userData';
var ME_DATA_STORAGE_KEY = '@TH_CFD:meData';
var OWN_STOCKS_DATA_STORAGE_KEY = '@TH_CFD:ownStocksData';
var OWN_STOCKS_DATA_STORAGE_LIVE_KEY = '@TH_CFD:ownStocksDataLive';
var SEARCH_HISTORY_KEY = '@TH_CFD:searchHistory';
var LIVE_SEARCH_HISTORY_KEY = '@TH_CFD:searchHistoryLive';
var BANNER_STORAGE_KEY = '@TH_CFD:bannerData';
var GUIDE_STORAGE_KEY = '@TH_CFD:guideData';
var GUIDE_RANKING_KEY = '@TH_CFD:guideRankingData';
var TUTORIAL_KEY = '@TH_CFD:tutorialData';
var LAST_SUPER_PRIORITY_HINT_DATE = '@TH_CFD:lastSuperPriorityDateData'
var ACCOUNT_STATE = '@TH_CFD:accountState'
var CFD_SERVER_TYPE = '@TH_CFD:CFDServerType'
var OPEN_ACCOUNT_DATA = '@TH_CFD:openAccountDataStep<step>'
var OPEN_ACCOUNT_LAST_STEP = '@TH_CFD:lastOpenAccountStep'
var LAST_ONLINE_VERSION_INFO = '@TH_CFD:lastOnlineVersionInfo'
var UNPAID_REWARD = '@TH_CFD:unpaidReward'
var REGISTER_REWARD = '@TH_CFD:registerReward'
var FIRSTDAYWITHDRAW = '@TH_CFD:firstDayWithDraw'
var DEBUG_SETTINGS = '@TH_CFD:debugSettings'
var LAST_ACTIVITY_DATA = '@TH_CFD:lastActivityData'
var MIFID_TEST_VERIFIED = '@TH_CFD:MIFIDTestVerified'

export async function loadUserData() {
	try {
		var value = await AsyncStorage.getItem(USER_DATA_STORAGE_KEY);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setUserData(selectedValue) {
	try {
		await AsyncStorage.setItem(USER_DATA_STORAGE_KEY, selectedValue);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function removeUserData() {
	try {
		await AsyncStorage.removeItem(USER_DATA_STORAGE_KEY);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setAccountState(accountState) {
	try {
		await AsyncStorage.setItem(ACCOUNT_STATE, JSON.stringify(accountState));
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadAccountState() {
	try {
		var value = await AsyncStorage.getItem(ACCOUNT_STATE);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadMeData() {
	try {
		var value = await AsyncStorage.getItem(ME_DATA_STORAGE_KEY);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setMeData(selectedValue) {
	try {
		await AsyncStorage.setItem(ME_DATA_STORAGE_KEY, selectedValue);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function removeMeData() {
	try {
		await AsyncStorage.removeItem(ME_DATA_STORAGE_KEY);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadOwnStocksData(isLive) {
	try {
		var value = await AsyncStorage.getItem(isLive ? OWN_STOCKS_DATA_STORAGE_LIVE_KEY : OWN_STOCKS_DATA_STORAGE_KEY);
		console.log('load stocks:'+value)
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setOwnStocksData(selectedValue, isLive) {
	try {
		await AsyncStorage.setItem(isLive ? OWN_STOCKS_DATA_STORAGE_LIVE_KEY : OWN_STOCKS_DATA_STORAGE_KEY, selectedValue);
		console.log('save stocks:'+selectedValue)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

//Remove all stocks data
export async function removeOwnStocksData() {
	try {
    await AsyncStorage.removeItem(OWN_STOCKS_DATA_STORAGE_LIVE_KEY);
		await AsyncStorage.removeItem(OWN_STOCKS_DATA_STORAGE_KEY);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadSearchHistory() {
	try {
		var value = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
		console.log('search history:'+value)
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setSearchHistory(history) {
	try {
		await AsyncStorage.setItem(SEARCH_HISTORY_KEY, history);
		console.log('save search history:'+history)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function removeSearchHistory() {
	try {
		await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}


export async function loadLiveSearchHistory() {
	try {
		var value = await AsyncStorage.getItem(LIVE_SEARCH_HISTORY_KEY);
		console.log('search history:'+value)
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setLiveSearchHistory(history) {
	try {
		await AsyncStorage.setItem(LIVE_SEARCH_HISTORY_KEY, history);
		console.log('save search history:'+history)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function removeLiveSearchHistory() {
	try {
		await AsyncStorage.removeItem(LIVE_SEARCH_HISTORY_KEY);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setBanners(banners) {
	try {
		await AsyncStorage.setItem(BANNER_STORAGE_KEY, banners)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadBanners() {
	try {
		var value = await AsyncStorage.getItem(BANNER_STORAGE_KEY);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setGuide(guideData) {
	try {
		await AsyncStorage.setItem(GUIDE_STORAGE_KEY, guideData)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadGuide() {
	try {
		var value = await AsyncStorage.getItem(GUIDE_STORAGE_KEY);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setGuideRanking(guideData) {
	try {
		await AsyncStorage.setItem(GUIDE_RANKING_KEY, guideData)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadGuideRanking() {
	try {
		var value = await AsyncStorage.getItem(GUIDE_RANKING_KEY);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setTutorial(tutorialData) {
	try {
		await AsyncStorage.setItem(TUTORIAL_KEY, tutorialData)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadTutorial() {
	// the value is a dictionary, like:
	// {trade: true, openclose: false}
	try {
		var value = await AsyncStorage.getItem(TUTORIAL_KEY);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setLastSuperPriorityHintData(data){
  try {
		await AsyncStorage.setItem(LAST_SUPER_PRIORITY_HINT_DATE, data)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadLastSuperPriorityHintData(){
  try {
		var value = await AsyncStorage.getItem(LAST_SUPER_PRIORITY_HINT_DATE);
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setCFDServerType(data){
  try {
		await AsyncStorage.setItem(CFD_SERVER_TYPE, data)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadCFDServerType(){
  try {
    var value = await AsyncStorage.getItem(CFD_SERVER_TYPE);
    return value;
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
}

export async function setOpenAccountData(step, data){
  try {
    var key = OPEN_ACCOUNT_DATA.replace("<step>", step);
  	await AsyncStorage.setItem(key, data)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadOpenAccountData(step){
  try {
    var key = OPEN_ACCOUNT_DATA.replace("<step>", step);
    var value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
}

export async function removeOpenAccountData(step) {
	try {
    var key = OPEN_ACCOUNT_DATA.replace("<step>", step);
		await AsyncStorage.removeItem(key);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

//Only use this if you want the user to move into a route with is before the last
//data he has entered.
export async function setLastOpenAccountRoute(step){
  try {
  	await AsyncStorage.setItem(OPEN_ACCOUNT_LAST_STEP, step)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadLastOpenAccountRoute(){
  try {
    var value = await AsyncStorage.getItem(OPEN_ACCOUNT_LAST_STEP);
    return value;
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
}

export async function removeLastOpenAccountRoute() {
	try {
		await AsyncStorage.removeItem(OPEN_ACCOUNT_LAST_STEP);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setLastOnlineVerionInfo(info){
  try {
		await AsyncStorage.setItem(LAST_ONLINE_VERSION_INFO, info);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadLastOnlineVerionInfo(){
  try {
		  var value = await AsyncStorage.getItem(LAST_ONLINE_VERSION_INFO);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setUnpaidReward(value){
  try {
		await AsyncStorage.setItem(UNPAID_REWARD, value);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadUnpaidReward(){
  try {
		  var value = await AsyncStorage.getItem(UNPAID_REWARD);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}


export async function setRegisterReward(value){
  try {
		await AsyncStorage.setItem(REGISTER_REWARD, value);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadRegisterReward(){
  try {
		  var value = await AsyncStorage.getItem(REGISTER_REWARD);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setFirstDayWithDraw(value){
  try {
		await AsyncStorage.setItem(FIRSTDAYWITHDRAW, value);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadFirstDayWithDraw(){
  try {
		  var value = await AsyncStorage.getItem(FIRSTDAYWITHDRAW);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setDebugSettings(value){
  try {
		await AsyncStorage.setItem(DEBUG_SETTINGS, value);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadDebugSettings(){
  try {
		  var value = await AsyncStorage.getItem(DEBUG_SETTINGS);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setLastActivityData(value){
  try {
		await AsyncStorage.setItem(LAST_ACTIVITY_DATA, value);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadLastActivityData(){
  try {
		  var value = await AsyncStorage.getItem(LAST_ACTIVITY_DATA);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setMIFIDTestVerified(value){
  try {
		await AsyncStorage.setItem(MIFID_TEST_VERIFIED, value);
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function loadMIFIDTestVerified(){
  try {
		  var value = await AsyncStorage.getItem(MIFID_TEST_VERIFIED);
      return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

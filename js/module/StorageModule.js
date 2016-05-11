'use strict'

var React = require('react-native');
var {
  AsyncStorage,
} = React;

var USER_DATA_STORAGE_KEY = '@TH_CFD:userData';
var OWN_STOCKS_DATA_STORAGE_KEY = '@TH_CFD:ownStocksData';
var SEARCH_HISTORY_KEY = '@TH_CFD:searchHistory';
var BANNER_STORAGE_KEY = '@TH_CFD:bannerData';

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

export async function loadOwnStocksData() {
	try {
		var value = await AsyncStorage.getItem(OWN_STOCKS_DATA_STORAGE_KEY);
		console.log('load stocks:'+value)
		return value;
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function setOwnStocksData(selectedValue) {
	try {
		await AsyncStorage.setItem(OWN_STOCKS_DATA_STORAGE_KEY, selectedValue);
		console.log('save stocks:'+selectedValue)
	} catch (error) {
		console.log('AsyncStorage error: ' + error.message);
	}
}

export async function removeOwnStocksData() {
	try {
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

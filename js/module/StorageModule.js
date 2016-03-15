'use strict'

var React = require('react-native');
var {
  AsyncStorage,
} = React;

var USER_DATA_STORAGE_KEY = '@TH_CFD:userData';
var OWN_STOCKS_DATA_STORAGE_KEY = '@TH_CFD:ownStocksData';

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
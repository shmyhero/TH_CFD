'use strict'

var React = require('react-native');
var {
  AsyncStorage,
} = React;

var USER_DATA_STORAGE_KEY = '@TH_CFD:userData';

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
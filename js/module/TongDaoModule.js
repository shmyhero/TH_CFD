'use strict'

import { NativeModules } from 'react-native';

const nativeModule = NativeModules.TongDaoAPI;


export function setUserId(userid) {
	nativeModule.setUserId(userid)
}

export function setUserName(name) {
	nativeModule.setUserName(name)
}

export function setpPhoneNumber(number) {
	nativeModule.setpPhoneNumber(number)
}

export function setAvatarlUrl(url) {
	nativeModule.setAvatarlUrl(url)
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
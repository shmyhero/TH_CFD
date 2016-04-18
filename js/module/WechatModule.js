'use strict'

var React = require('react-native')
var {
	StyleSheet,
	Platform,
	View,
	TextInput,
	Text,
	TouchableHighlight,
	Alert,
	Dimensions,
	Image,
} = React;

import * as WechatAPI from 'react-native-wx';
var LogicData = require('../LogicData')

var mSuccessCallback = null
var mErrorCallback = null

export function isWechatInstalled() {
	return WechatAPI.isWXAppInstalled()

}

export function wechatLogin(successCallback, errorCallback) {
	mSuccessCallback = successCallback
	mErrorCallback = errorCallback

	WechatAPI.isWXAppInstalled()
	.then((installed) => {
		if (installed) {
			WechatAPI.login()
			.then((response) => {
				wechatLoginCodeHandler(response)
			})
			.catch((e) => {
				console.log('wechat login error catches: ' + e)
				errorCallback(e.message);
			})
			.done();
		}
	})
	.catch((e) => {
		mErrorCallback(e.message);
	})
}

function wechatLoginCodeHandler(response) {
	console.log(response)

	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + "wxe102be8f66949cd1" +
		"&secret=" + "54d2804023e3e3db6ee956738b41aaf0" + 
		"&code=" + response.code + "&grant_type=authorization_code";
	fetch(url, {
		method: 'GET'
	})
	.then((response) => response.json())
	.then((responsejson) => {
		console.log(responsejson)
		LogicData.setWechatAuthData(responsejson)
		wechatGetUserInfo()
	})
	.catch((e) => {
		console.log('fetchTHUrl catches: ' + e)
		mErrorCallback(e.message);
	})
	.done();
}

function wechatGetUserInfo() {
	var wechatAuthData = LogicData.getWechatAuthData()
	var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + 
		wechatAuthData.access_token + "&openid=" + wechatAuthData.openid;
	fetch(url, {
		method: 'GET'
	})
	.then((response) => response.json())
	.then((responsejson) => {
		console.log(responsejson)
		LogicData.setWechatUserData(responsejson)

		if (mSuccessCallback) {
			mSuccessCallback()

			mSuccessCallback = null
			mErrorCallback = null
		}
	})
	.catch((e) => {
		console.log('fetchTHUrl catches: ' + e)
		mErrorCallback(e.message);
	})
	.done();
}
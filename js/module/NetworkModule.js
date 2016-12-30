'use strict'

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var MainPage = require('../view/MainPage')
var CacheModule = require('./CacheModule')
var {EventCenter, EventConst} = require('../EventCenter')

import React from 'react';
import {
	Alert
} from 'react-native';

var loginOutsideAlertShown = false

export const API_ERROR = 'apiError';
export const NETWORK_CONNECTION_ERROR = 'networkConnectionError';

export function resetLoginOutsideAlert(){
	loginOutsideAlertShown = false;
}

export function fetchTHUrl(url, params, successCallback, errorCallback, notShowResponseLog) {
	var requestSuccess = true;

	console.log('fetching: ' + url + ' with params: ')
	console.log(params)

	var result = {
		error: null,
		errorMessage: null,
		loadedOfflineCache: false,
	}

	if (params.showLoading === true) {
		MainPage.showProgress && MainPage.showProgress()
	}

	if(params.cache === "offline"){
		CacheModule.loadCacheForUrl(url)
		.then((value)=>{
			if(value){
				console.log("read offline cache: " + value)
				var respJson = JSON.parse(value);
				result.loadedOfflineCache = true;
				successCallback(respJson, true);
			}
		});
	}

	fetch(url, params)
		.then((response) => {
			if (response.status === 200) {
				requestSuccess = true;
			} else if (response.status === 401){
				throw new Error('身份验证失败')
			} else{
				requestSuccess = false;
			}

			if (response.length == 0) {
				response = '{}'
			}
			return response.json()
		})
		.then((responseJson) => {
			if (requestSuccess) {
				if (responseJson != null && responseJson.success === false) {
					console.log('fetchTHUrl handled error with message: ' + JSON.stringify(responseJson))
					result.error = API_ERROR;
					result.errorMessage = responseJson.ExceptionMessage || responseJson.Message || responseJson.message;
					errorCallback && errorCallback(result);
				} else {
					if(!notShowResponseLog){
						console.log('fetchTHUrl success with response: ')
						console.log(responseJson)
					}

					if(params.cache === "offline"){
						var userRelated = false;
						if(params.headers && params.headers.Authorization){
							userRelated = true;
						}
						CacheModule.storeCacheForUrl(url, JSON.stringify(responseJson), userRelated)
						.then(()=>{
							console.log('stored offline cache ')
							successCallback && successCallback(responseJson, false);
						})
					}else{
						successCallback && successCallback(responseJson, false);
					}
				}
			} else {
				console.log('fetchTHUrl unhandled error with message: ' + JSON.stringify(responseJson))
				result.error = NETWORK_CONNECTION_ERROR;
				result.errorMessage = responseJson.ExceptionMessage || responseJson.Message || responseJson.message;
				errorCallback && errorCallback(result);
			}
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e + ", " + url);

			if(e.message=='身份验证失败'){
				console.log('多点登录 = ' + e);
				if (!loginOutsideAlertShown) {
					loginOutsideAlertShown = true
 					Alert.alert('风险提示！', '盈交易账号已登录其他设备', [{text: '我知道了', onPress: () => {
 						EventCenter.emitAccountLoginOutSideEvent();
					}}],{cancelable:false})
				};
			}
			var message = e.message

			// if(params.cache === "offline"){
			// 	CacheModule.loadCacheForUrl(url)
			// 	.then((value)=>{
			// 		if(value){
			// 			var respJson = JSON.parse(value);
			// 			successCallback(respJson);
			// 		}else{
			// 			if(message.toLowerCase() === "network request failed"){
			// 				message = "网络连接已断开，请检查设置"
			// 			}
			// 			if(internetErrorCallback){
			// 				internetErrorCallback(message);
			// 			}
			// 			else if (!alertShow) {
			// 				alertShow = true
			// 				Alert.alert('', message, [{text: 'OK', onPress: () => alertShow=false}])
			// 			};
			// 		}
			// 	});
			// }

			if(message.toLowerCase() === "network request failed"){
				message = "网络连接已断开，请检查设置"
			}
			console.log(message);
			if(errorCallback){
				result.error = API_ERROR;
				result.errorMessage = message;
				errorCallback && errorCallback(result);
			}
		})
		.done(() => {
			MainPage.hideProgress && MainPage.hideProgress()
		});
}



export function syncOwnStocks(userData) {
  return new Promise((resolve, reject)=>{
		var stockData = LogicData.getOwnStocksData()
		var isLive = LogicData.getAccountState();
		console.log("syncOwnStocks, isLive: " + isLive);
		var url = isLive ? NetConstants.CFD_API.OWN_STOCK_LIST_LIVE_API : NetConstants.CFD_API.OWN_STOCK_LIST_API;
		fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson) => {
				if (responseJson.length===0 && !isLive) {
					console.log('no own stocks online')
					if (stockData.length > 0) {
						addToOwnStocks(stockData)
						.then((res)=>{
							//LogicData.setOwnStocksData(res);
							resolve(res);
						})
						.catch((error)=>reject(error));
					};
				}
				else {
					//If live, the user must be logined. So just sync the response to local data.
					console.log('get own stocks')
					LogicData.setOwnStocksData(responseJson)
				}
				console.log(responseJson)
				resolve();
			},
			(result) => {
				//Alert.alert('获取股票列表失败', result.errorMessage);
				reject(result.errorMessage);
			}
		)
	});
}

export function addToOwnStocks(stockData) {
	return new Promise((resolve, reject)=>{
		var userData = LogicData.getUserData()
		if (Object.keys(userData).length === 0) {
			resolve();
			return;
		}

		var idList = stockData.map((stock, index, list)=>{
			return stock.id
		})

		var isLive = LogicData.getAccountState();
		var url = (isLive ? NetConstants.CFD_API.OWN_STOCK_LIST_LIVE_API : NetConstants.CFD_API.OWN_STOCK_LIST_API)+'?'+NetConstants.PARAMETER_STOCKIDS+'='+idList;
		fetchTHUrl(
			url,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				}
			},
			(responseJson) => {
				console.log('add to own stocks success')
				resolve();
			},
			(result) => {
				Alert.alert('添加股票失败', result.errorMessage);
				reject(result.errorMessage);
			}
		)
	});
}

export function removeFromOwnStocks(stockData) {
	return new Promise((resolve, reject)=>{
		var userData = LogicData.getUserData()
		if (Object.keys(userData).length === 0) {
			resolve();
			return;
		}

		var idList = stockData.map((stock, index, list)=>{
			return stock.id
		})

		var urlPrefix = LogicData.getAccountState() ? NetConstants.CFD_API.OWN_STOCK_LIST_LIVE_API : NetConstants.CFD_API.OWN_STOCK_LIST_API;
		fetchTHUrl(
			urlPrefix + '?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
			{
				method: 'DELETE',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				}
			},
			(responseJson) => {
				console.log('delete from own stocks success')
				resolve();
			},
			(result) => {
				Alert.alert('删除股票失败', result.errorMessage);
				reject(result.errorMessage);
			}
		)
	});
}

export function updateOwnStocks(stockData) {
	var userData = LogicData.getUserData()
	if (Object.keys(userData).length === 0) {
		return
	}

	var idList = stockData.map((stock, index, list)=>{
		return stock.id
	})

	var isLive = LogicData.getAccountState();
	var urlPrefix = isLive ? NetConstants.CFD_API.OWN_STOCK_LIST_LIVE_API : NetConstants.CFD_API.OWN_STOCK_LIST_API;

	fetchTHUrl(
		urlPrefix + '?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
		{
			method: 'PUT',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			},
		},
		(responseJson) => {
			console.log('update own stocks success')
		},
		(result) => {
			Alert.alert('更新股票失败', result.errorMessage);
		}
	)
}

export function loadUserBalance(force, successCallback) {
	if (force || LogicData.getBalanceData() === null) {
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if (notLogin) {
			return
		}
		var url = NetConstants.CFD_API.GET_USER_BALANCE_API
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_USER_BALANCE_LIVE_API
			console.log('live', url );
		}
		this.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				cache: 'offline',
			},
			(responseJson, isCache) => {
				LogicData.setBalanceData(responseJson)
				successCallback && successCallback(responseJson, isCache)
			},
			(result) => {
				// Alert.alert('', errorMessage);
			}
		)
	}
}

'use strict'

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var MainPage = require('../view/MainPage')
import React from 'react';
import {
	Alert
} from 'react-native';

var alertShow = false

export function fetchTHUrl(url, params, successCallback, errorCallback) {
	fetchTHUrlWithNoInternetCallback(url, params, successCallback, errorCallback, null)
}

export function fetchTHUrlWithNoInternetCallback(url, params, successCallback, errorCallback, internetErrorCallback) {
	var requestSuccess = true;

	console.log('fetching: ' + url + ' with params: ')
	console.log(params)

	if (params.showLoading === true) {
		MainPage.showProgress && MainPage.showProgress()
	}

	fetch(url, params)
		.then((response) => {
			console.log(response)
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
				if (responseJson.success === false) {
					console.log('fetchTHUrl handled error with message: ' + JSON.stringify(responseJson))
					errorCallback(responseJson.ExceptionMessage || responseJson.Message || responseJson.message);
				} else {
					console.log('fetchTHUrl success with response: ')
					console.log(responseJson)
					successCallback(responseJson);
				}
			} else {
				console.log('fetchTHUrl unhandled error with message: ' + JSON.stringify(responseJson))
				errorCallback(responseJson.ExceptionMessage || responseJson.Message|| responseJson.message);
			}
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e);
			var message = e.message
			if(message.toLowerCase() === "network request failed"){
				message = "网络连接已断开，请检查设置"
			}
			if(internetErrorCallback){
				internetErrorCallback(message);
			}
			if (!alertShow) {
				alertShow = true
				Alert.alert('', message, [{text: 'OK', onPress: () => alertShow=false}])
			};
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
				}
			},
			(responseJson) => {
				if (responseJson.length===0 && !isLive) {
					console.log('no own stocks online')
					if (stockData.length > 0) {
						addToOwnStocks(stockData)
						.then((res)=>resolve(res))
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
			(errorMessage) => {
				Alert.alert('获取股票列表失败', errorMessage);
				reject(errorMessage);
			}
		)
	});
}

export function addToOwnStocks(stockData) {
	return new Promise((resolve, reject)=>{
		var userData = LogicData.getUserData()
		if (Object.keys(userData).length === 0) {
			resolve();
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
			(errorMessage) => {
				Alert.alert('添加股票失败', errorMessage);
				reject(errorMessage);
			}
		)
	});
}

export function removeFromOwnStocks(stockData) {
	var userData = LogicData.getUserData()
	if (Object.keys(userData).length === 0) {
		return
	}

	var idList = stockData.map((stock, index, list)=>{
		return stock.id
	})

	fetchTHUrl(
		NetConstants.CFD_API.OWN_STOCK_LIST_API+'?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
		{
			method: 'DELETE',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			}
		},
		(responseJson) => {
			console.log('delete from own stocks success')
		},
		(errorMessage) => {
			Alert.alert('删除股票失败', errorMessage);
		}
	)
}

export function updateOwnStocks(stockData) {
	var userData = LogicData.getUserData()
	if (Object.keys(userData).length === 0) {
		return
	}

	var idList = stockData.map((stock, index, list)=>{
		return stock.id
	})

	fetchTHUrl(
		NetConstants.CFD_API.OWN_STOCK_LIST_API+'?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
		{
			method: 'PUT',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			}
		},
		(responseJson) => {
			console.log('update own stocks success')
		},
		(errorMessage) => {
			Alert.alert('更新股票失败', errorMessage);
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
			},
			(responseJson) => {
				LogicData.setBalanceData(responseJson)
				successCallback && successCallback(responseJson)
			},
			(errorMessage) => {
				// Alert.alert('', errorMessage);
			}
		)
	}
}

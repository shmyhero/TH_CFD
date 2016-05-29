'use strict'

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
import React from 'react';
var AppNavigator = require('../../AppNavigator')
var {
	Alert
} = React

var alertShow = false

export function fetchTHUrl(url, params, successCallback, errorCallback) {
	var requestSuccess = true;

	console.log('fetching: ' + url + ' with params: ')
	console.log(params)
	
	if (params.showLoading === true) {
		AppNavigator.showProgress && AppNavigator.showProgress()
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
			console.log('fetchTHUrl catches: ' + e)
			var message = e.message
			if(message.toLowerCase() === "network request failed"){
				message = "连接网络失败"
			}
			// errorCallback(message);
			if (!alertShow) {
				alertShow = true
				Alert.alert('', message, [{text: 'OK', onPress: () => alertShow=false}])
			};
		})
		.done(() => {
			AppNavigator.hideProgress && AppNavigator.hideProgress()
		});
}

export function syncOwnStocks(userData) {
	var stockData = LogicData.getOwnStocksData()
	fetchTHUrl(
		NetConstants.OWN_STOCK_LIST_API,
		{
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			}
		},
		(responseJson) => {
			if (responseJson.length===0) {
				console.log('no own stocks online')
				if (stockData.length > 0) {
					addToOwnStocks(stockData)
				};
			}
			else {
				console.log('get own stocks')
				LogicData.setOwnStocksData(responseJson)
			}
			console.log(responseJson)
		},
		(errorMessage) => {
			Alert.alert('获取股票列表失败', errorMessage);
		}
	)
}

export function addToOwnStocks(stockData) {
	var userData = LogicData.getUserData()
	if (Object.keys(userData).length === 0) {
		return
	}

	var idList = stockData.map((stock, index, list)=>{
		return stock.id
	})

	fetchTHUrl(
		NetConstants.OWN_STOCK_LIST_API+'?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
		{
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			}
		},
		(responseJson) => {
			console.log('add to own stocks success')
		},
		(errorMessage) => {
			Alert.alert('添加股票失败', errorMessage);
		}
	)
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
		NetConstants.OWN_STOCK_LIST_API+'?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
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
		NetConstants.OWN_STOCK_LIST_API+'?'+NetConstants.PARAMETER_STOCKIDS+'='+idList,
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

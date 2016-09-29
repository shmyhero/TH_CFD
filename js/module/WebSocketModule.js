'use strict'

require('../utils/jquery-1.6.4')
require('../utils/jquery.signalR-2.2.0')

import React from 'react';
import {
	Alert,
} from 'react-native';

var AppStateModule = require('./AppStateModule');
var LogicData = require('../LogicData')
var StorageModule = require('./StorageModule')

var serverURL = 'http://cfd-webapi.chinacloudapp.cn'
var stockPriceServerName = 'Q'
var alertServerName = 'A'
var serverListenerName = 'p'
var previousInterestedStocks = null
var webSocketConnection = null
var stockPriceWebSocketProxy = null
var alertWebSocketProxy = null
var wsStockInfoCallback = null
var wsAlertCallback = null

var wsErrorCallback = (errorMessage) =>
{
	if (AppStateModule.getAppState() === AppStateModule.STATE_ACTIVE && webSocketConnection && webSocketConnection.state == 4) {
		start()
	}
}
AppStateModule.registerTurnToActiveListener(() => {
	console.log('Check Web sockets connection.')
	if (webSocketConnection && webSocketConnection.state == 4) { // disconnected state
		start()
	}
})

export function start() {
	stop();

	webSocketConnection = $.hubConnection(serverURL);
	webSocketConnection.logging = false;

	stockPriceWebSocketProxy = webSocketConnection.createHubProxy(stockPriceServerName);

	//receives broadcast messages from a hub function, called "broadcastMessage"
	// StockInfo data structure: {"Symbol":"MSFT","Price":31.97,"DayOpen":30.31,"Change":1.66,"PercentChange":0.0519}
	stockPriceWebSocketProxy.on(serverListenerName, (stockInfo) => {
		// console.log("socketUpdate! " + JSON.stringify(stockInfo))
		if (wsStockInfoCallback !== null) {
			// console.log("socketUpdate! wsStockInfoCallback != null")
			wsStockInfoCallback(stockInfo)
		}
	});

	alertWebSocketProxy = webSocketConnection.createHubProxy(alertServerName);
	alertWebSocketProxy.on(serverListenerName, (alertInfoArr) => {
		console.log('alert comes.')
		for (var i = 0; i < alertInfoArr.length; i++) {
			Alert.alert('', alertInfoArr[i])
		}

		if (wsAlertCallback) {
			wsAlertCallback(alertInfoArr)
		}
	});

		// atempt connection, and handle errors
	webSocketConnection.start()
		.done(() => {
			console.log('Now connected, connection ID=' + webSocketConnection.id);
			registerInterestedStocks(previousInterestedStocks)

			var userData = LogicData.getUserData()
			if (userData != null) {
				alertServiceLogin(userData.userId + '_' + userData.token)
			}
		})
		.fail((error) => {
			wsErrorCallback(error.message)
	});

	//connection-handling
	webSocketConnection.connectionSlow(function () {
		wsErrorCallback('网络不稳定。')
	});

	webSocketConnection.error(function (error) {
		wsErrorCallback('网络已断开。')
	});

}

export function stop() {
	if (webSocketConnection !== null) {
		webSocketConnection.stop()
		webSocketConnection = null
	}
}

export function registerCallbacks(stockInfoCallback, alertCallback) {
	// console.log("register call backs")
	wsStockInfoCallback = stockInfoCallback
	wsAlertCallback = alertCallback
}

export function registerInterestedStocks(stockList) {
	// console.log("register interested backs")
	if (webSocketConnection.state == 1 && stockPriceWebSocketProxy !== null && stockList !== null && stockList.length > 0) {
		console.log('Send stockList to websocket server: ' + stockList)
		previousInterestedStocks = stockList
	    var messagePromise = stockPriceWebSocketProxy.invoke('S', stockList);

	    messagePromise
	    	.done(() => {
		    	console.log ('Send Message to server succeeded');
			})
			.fail(function (error) {
		    	if (wsErrorCallback) {
		    		wsErrorCallback(error.message)
		    	}
			});
	}else{
		console.log('Send stockList to websocket server later: ' + stockList)
		previousInterestedStocks = stockList;
	}
}

export function cleanRegisteredCallbacks() {
	// console.log("clean registerCallbacks")
	wsStockInfoCallback = null
	wsAlertCallback = null
}

export function alertServiceLogin(token) {
	if (webSocketConnection.state == 1 && alertWebSocketProxy !== null && token !== null) {
		var messagePromise = alertWebSocketProxy.invoke('L', token);

	    messagePromise
	    	.done((result) => {
		    	console.log ('Send Login to Alert server succeed: ' + result);
			})
			.fail(function (error) {
		    	if (wsErrorCallback) {
		    		wsErrorCallback(error.message)
		    	}
			});
	}
}

export function getPreviousInterestedStocks() {
	return previousInterestedStocks
}

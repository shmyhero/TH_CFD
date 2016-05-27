'use strict'

require('../utils/jquery-1.6.4')
require('../utils/jquery.signalR-2.2.0')

var React = require('react-native');
var AppStateModule = require('./AppStateModule');

var {
	Alert,
} = React;

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
		if (wsStockInfoCallback !== null) {
			wsStockInfoCallback(stockInfo)
		}
	});

	alertWebSocketProxy = webSocketConnection.createHubProxy(alertServerName);
	alertWebSocketProxy.on(serverListenerName, (alertInfo) => {
		Alert.alert('', alertInfo)
		if (wsAlertCallback !== null) {
			wsAlertCallback(alertInfo)
		}
	});

		// atempt connection, and handle errors
	webSocketConnection.start()
		.done(() => {
			console.log('Now connected, connection ID=' + webSocketConnection.id);
			registerInterestedStocks(previousInterestedStocks)

			var userData = LogicData.getUserData()
			if (userData != null) {
				alertServiceLogin(userData.token)
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
	wsStockInfoCallback = stockInfoCallback
	wsAlertCallback = alertCallback
}

export function registerInterestedStocks(stockList) {
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
	}
}

export function alertServiceLogin(token) {
	if (webSocketConnection.state == 1 && alertWebSocketProxy !== null && token !== null) {
		var messagePromise = alertWebSocketProxy.invoke('L', token);

	    messagePromise
	    	.done(() => {
		    	console.log ('Send Login to Alert server succeed');
			})
			.fail(function (error) {
		    	if (wsErrorCallback) {
		    		wsErrorCallback(error.message)
		    	}
			});
	}
}

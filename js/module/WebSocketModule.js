'use strict'

require('../utils/jquery-1.6.4')
require('../utils/jquery.signalR-2.2.0')

var React = require('react-native');

var {
	Alert,
} = React;

var serverURL = 'http://cfd-webapi.chinacloudapp.cn'
var serverName = 'Q'
var serverListenerName = 'p'
var previousInterestedStocks = null
var webSocketConnection = null
var webSocketProxy = null
var wsMessageCallback = null
var wsErrorCallback = (errorMessage) => { 
	Alert.alert('提示',errorMessage, [
              {text: '尝试连接', onPress: () => start()},
            ]);
}

export function start() {
	stop();

	webSocketConnection = $.hubConnection(serverURL);
	webSocketConnection.logging = true;

	webSocketProxy = webSocketConnection.createHubProxy(serverName);
	
	//receives broadcast messages from a hub function, called "broadcastMessage"
	// StockInfo data structure: {"Symbol":"MSFT","Price":31.97,"DayOpen":30.31,"Change":1.66,"PercentChange":0.0519}
	webSocketProxy.on(serverListenerName, (stockInfo) => {
		if (wsMessageCallback !== null) {
			wsMessageCallback(stockInfo)
		}
	});

		// atempt connection, and handle errors
	webSocketConnection.start()
		.done(() => { 
			console.log('Now connected, connection ID=' + webSocketConnection.id);
			registerInterestedStocks(previousInterestedStocks)
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

export function registerCallbacks(messageCallback) {
	wsMessageCallback = messageCallback
}

export function registerInterestedStocks(stockList) {
	if (webSocketConnection.state == 1 && webSocketProxy !== null && stockList !== null && stockList.length > 0) {
		console.log('Send stockList to websocket server: ' + stockList)
		previousInterestedStocks = stockList
	    var messagePromise = webSocketProxy.invoke('S', stockList);

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
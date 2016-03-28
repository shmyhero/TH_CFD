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
var webSocketConnection = null
var webSocketProxy = null
var wsMessageCallback = null
var wsErrorCallback = (errorMessage) => { Alert.alert('websocket提示',errorMessage); }

export function start() {
	this.stop();

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
		})
		.fail((error) => {
			wsErrorCallback(error.message)
	});

	//connection-handling
	webSocketConnection.connectionSlow(function () {
		wsErrorCallback('We are currently experiencing difficulties with the connection.')
	});

	webSocketConnection.error(function (error) {
		wsErrorCallback('SignalR error: ' + error)
	});

}

export function stop() {
	if (webSocketConnection !== null) {
		webSocketConnection.stop()
		webSocketConnection = null
	}
}

export function registerCallbacks(messageCallback) {
	console.log('registerCallbacks(messageCallback)')

	wsMessageCallback = messageCallback
}

export function registerInterestedStocks(stockList) {
	if (webSocketConnection.state == 1 && webSocketProxy !== null) {
		console.log('Send stockList to websocket server: ' + stockList)
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
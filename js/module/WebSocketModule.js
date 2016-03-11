'use strict'

var signalr = require('react-native-signalr');

var serverURL = 'http://cfd-webapi2.chinacloudapp.cn'
var serverName = 'Q'
var serverListenerName = 'p'
var webSocketConnection = null
var webSocketProxy = null
var wsErrorCallback = null

export function start(messageCallback, errorCallback) {
	this.stop();
	wsErrorCallback = errorCallback

	webSocketConnection = signalr.hubConnection(serverURL);
	webSocketConnection.logging = false;

	webSocketProxy = webSocketConnection.createHubProxy(serverName);

	//receives broadcast messages from a hub function, called "broadcastMessage"
	// StockInfo data structure: {"Symbol":"MSFT","Price":31.97,"DayOpen":30.31,"Change":1.66,"PercentChange":0.0519}
	webSocketProxy.on(serverListenerName, (stockInfo) => {
		messageCallback(stockInfo)
	});

	// atempt connection, and handle errors
	webSocketConnection.start()
		.done(() => { 
			console.log('Now connected, connection ID=' + webSocketConnection.id); 
		})
		.fail((error) => {
			errorCallback(error.message)
		});

	//connection-handling
	webSocketConnection.connectionSlow(function () {
		console.log('We are currently experiencing difficulties with the connection.')
	});

	webSocketConnection.error(function (error) {
		console.log('SignalR error: ' + error)
	});

}

export function stop() {
	if (webSocketConnection !== null) {
		webSocketConnection.stop()
		webSocketConnection = null
	}
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
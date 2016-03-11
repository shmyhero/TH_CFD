'use strict'

var signalr = require('react-native-signalr');

var serverURL = 'http://cfd-webapi.chinacloudapp.cn'
var serverName = 'Q'
var serverListenerName = 'p'
var webSocketConnection = null

export function start(callback) {
	this.stop();

	webSocketConnection = signalr.hubConnection(serverURL);
	webSocketConnection.logging = false;

	var proxy = webSocketConnection.createHubProxy(serverName);

	//receives broadcast messages from a hub function, called "broadcastMessage"
	// StockInfo data structure: {"Symbol":"MSFT","Price":31.97,"DayOpen":30.31,"Change":1.66,"PercentChange":0.0519}
	proxy.on(serverListenerName, (stockInfo) => {
		callback(stockInfo)
	});

	// atempt connection, and handle errors
	webSocketConnection.start()
		.done(() => { 
			console.log('Now connected, connection ID=' + webSocketConnection.id); 
		})
		.fail(() => {
			console.log('Web socket start failed'); 
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
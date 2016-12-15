'use strict'

require('../utils/jquery-1.6.4')
require('../utils/jquery.signalR-2.2.0')

import React from 'react';
import {
	Alert,
	NetInfo,
	Platform,
} from 'react-native';

var AppStateModule = require('./AppStateModule');
var LogicData = require('../LogicData')
var StorageModule = require('./StorageModule')
var CacheModule = require('./CacheModule')
var {EventCenter, EventConst} = require('../EventCenter');

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

var socketConnected = false;
var networkConnectionStatus = DISCONNECTED;

const CONNECTED = "connected";
const DISCONNECTED = "disconnected";

var wsErrorCallback = (errorMessage) =>
{
	console.log('web socket error: ' + errorMessage);
	if (AppStateModule.getAppState() === AppStateModule.STATE_ACTIVE && webSocketConnection && webSocketConnection.state == 4) {
		socketConnected = false;
		EventCenter.emitNetworkConnectionChangedEvent();
		if(networkConnectionStatus === CONNECTED){
			console.log('web socket ready to restart');
			setTimeout(()=>{
				if (webSocketConnection && webSocketConnection.state == 4){
					start();
				}
			}, 5000);
		}else{
			console.log('web socket no network connection.');
			//Do nothing until the device is online.
		}
	}
}

AppStateModule.registerTurnToActiveListener(() => {
	console.log('Check Web sockets connection.')
	if (webSocketConnection && webSocketConnection.state == 4) { // disconnected state
		start()
	}
})

export function isConnected(){
	return socketConnected;
}

export function start() {
	stop();

	console.log('start web socket');

	NetInfo.addEventListener(
	  'change',
	  handleConnectivityChange
	);

	webSocketConnection = $.hubConnection(serverURL);
	/*webSocketConnection.reconnecting(function() {
    //tryingToReconnect = true;
		//alert("tryingToReconnect")
	});

	webSocketConnection.reconnected(function() {
    //tryingToReconnect = false;
		//alert("reconnected")
	});*/

	webSocketConnection.disconnected(function() {
		wsErrorCallback('网络已断开。')
	});

	webSocketConnection.logging = false;

	stockPriceWebSocketProxy = webSocketConnection.createHubProxy(stockPriceServerName);

	//receives broadcast messages from a hub function, called "broadcastMessage"
	// StockInfo data structure: {"Symbol":"MSFT","Price":31.97,"DayOpen":30.31,"Change":1.66,"PercentChange":0.0519}
	stockPriceWebSocketProxy.on(serverListenerName, (stockInfo) => {
		 console.log("socketUpdate! " + JSON.stringify(stockInfo))

		//Stock Price is changed.
		stockInfo.forEach((data)=>{
			var updateData = {
				"id":data.id,
				"last": data.last,
				"lastBid": data.bid,
				"lastAsk": data.ask,
			}
			CacheModule.updateStockData(updateData);
		});

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
	startWebSocket(webSocketConnection);

	//connection-handling
	webSocketConnection.connectionSlow(function () {
		wsErrorCallback('网络不稳定。webSocketConnection.state: ' + webSocketConnection.state)
	});

	webSocketConnection.error(function (error) {
		wsErrorCallback('网络错误。' + error)
	});

}

function handleConnectivityChange(reach){
	var origionNetworkConnectionStatus = networkConnectionStatus;
  if(Platform.OS === 'ios'){
    switch(reach){
      case 'none':
      case 'unknown':
        networkConnectionStatus = DISCONNECTED;
				break;
      case 'wifi':
      case 'cell':
        networkConnectionStatus = CONNECTED;
        break;
    }
  }else{
    switch(reach){
      case 'NONE':
      case 'DUMMY':
      case 'UNKNOWN':
        networkConnectionStatus = DISCONNECTED;
				break;
      case 'MOBILE':
      case 'WIFI':
        networkConnectionStatus = CONNECTED;
        break;
    }
  }

	if(origionNetworkConnectionStatus !== networkConnectionStatus){

		if (networkConnectionStatus === CONNECTED && webSocketConnection && webSocketConnection.state == 4){
			start();
		}else if(networkConnectionStatus === DISCONNECTED){
			if(webSocketConnection){
				webSocketConnection.stop();
			}
			wsErrorCallback('网络已断开。');
		}
	}
}

function startWebSocket(webSocketConnection){
	webSocketConnection.start()
		.done(() => {
			socketConnected = true;
			networkConnectionStatus = CONNECTED;

			EventCenter.emitNetworkConnectionChangedEvent();

			console.log('WebSocket now connected, connection ID=' + webSocketConnection.id);
			registerInterestedStocks(previousInterestedStocks)

			var userData = LogicData.getUserData()
			if (userData != null) {
				alertServiceLogin(userData.userId + '_' + userData.token)
			}
		})
		.fail((error) => {
			wsErrorCallback(error.message)
	});
}

export function stop() {
	console.log("stop websocket")
	if (webSocketConnection !== null) {
		webSocketConnection.stop()
		webSocketConnection = null
	}

	NetInfo.removeEventListener(
		'change',
		handleConnectivityChange
	);
}

export function registerCallbacks(stockInfoCallback, alertCallback) {
	// console.log("register call backs")
	wsStockInfoCallback = stockInfoCallback
	wsAlertCallback = alertCallback
}

export function registerInterestedStocks(stockList) {
	// console.log("register interested backs")
	if (webSocketConnection && webSocketConnection.state == 1 && stockPriceWebSocketProxy !== null && stockList !== null && stockList.length > 0) {
		console.log('Send stockList to websocket server: ' + stockList)
		previousInterestedStocks = stockList
		var invokeS = LogicData.getAccountState()?'SL':'S';
	  var messagePromise = stockPriceWebSocketProxy.invoke(invokeS, stockList);

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

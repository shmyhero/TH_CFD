'use strict'

import React from 'react';
import {
  AsyncStorage,
} from 'react-native';

var LogicData = require('../LogicData')
var StorageModule = require('../module/StorageModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var TongDaoModule = require('../module/TongDaoModule')

export function updateMeData(userData, onSuccess){
	NetworkModule.fetchTHUrl(
		NetConstants.GET_USER_INFO_API,
		{
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			},
		},
		function(responseJson) {
			StorageModule.setMeData(JSON.stringify(responseJson))
			LogicData.setMeData(responseJson);
			TongDaoModule.updateUserData(responseJson)

			if(onSuccess){
				onSuccess()
			}
		}.bind(this),
		function(errorMessage) {
			Alert.alert('提示',errorMessage);
		}
	)
}

export function removeUserData(){
  StorageModule.removeUserData();
  LogicData.removeUserData();
  StorageModule.removeMeData();
  LogicData.removeMeData();
  StorageModule.removeOwnStocksData();
  LogicData.removeOwnStocksData();

  var date = new Date().getDateString();
  var data = {
    "lastDate": date,
    "isCheckInDialogShown": false
  };
  StorageModule.setLastSuperPriorityHintData(JSON.stringify(data));

  //Restart the web socket.
  //WebSocketModule.stop();
  WebSocketModule.start();
}

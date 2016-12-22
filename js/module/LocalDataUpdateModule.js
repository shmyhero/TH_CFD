'use strict'

import React from 'react';
import {
  AsyncStorage,
} from 'react-native';

var LogicData = require('../LogicData')
var StorageModule = require('./StorageModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('./NetworkModule')
var WebSocketModule = require('./WebSocketModule')
//var TongDaoModule = require('./TongDaoModule');
var OpenAccountRoutes = require('../view/openAccount/OpenAccountRoutes');
var CacheModule = require('./CacheModule');
var {EventCenter, EventConst} = require('../EventCenter');

export function updateMeData(userData, onSuccess){
	NetworkModule.fetchTHUrl(
		NetConstants.CFD_API.GET_USER_INFO_API,
		{
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
			},
		},
		function(responseJson) {
			StorageModule.setMeData(JSON.stringify(responseJson))
			LogicData.setMeData(responseJson);
			//TongDaoModule.updateUserData(responseJson)

			if(onSuccess){
				onSuccess()
			}
		}.bind(this),
		function(result) {
			Alert.alert('提示', result.errorMessage);
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
  LogicData.removeBalanceData();

  LogicData.setAccountState(false);

  OpenAccountRoutes.clearAllInputData();
  CacheModule.clearUserRelatedCache();

  var date = new Date().getDateString();
  var data = {
    "lastDate": date,
    "isCheckInDialogShown": false
  };
  StorageModule.setLastSuperPriorityHintData(JSON.stringify(data));

  EventCenter.emitAccountLogoutEvent();
  //TongDaoModule.setUserId("");

  //Restart the web socket.
  //WebSocketModule.stop();
  WebSocketModule.start();

}

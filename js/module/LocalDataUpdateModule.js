'use strict'

import React from 'react';
import {
  AsyncStorage,
	Alert,
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
      NetworkModule.resetLoginOutsideAlert();
			StorageModule.setMeData(JSON.stringify(responseJson))
			LogicData.setMeData(responseJson);

      EventCenter.emitAccountLoginEvent();

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
  return new Promise((resolve)=>{
    StorageModule.removeUserData()
    .then(()=>{
      LogicData.removeUserData();
      StorageModule.removeMeData();
      LogicData.removeMeData();

      LogicData.removeOwnStocksData();
      return StorageModule.removeOwnStocksData();
    })
    .then(()=>{
      LogicData.setAccountState(false);
      LogicData.setActualLogin(false);

      LogicData.removeBalanceData();

      LogicData.removeLiveUserInfo();
      LogicData.removeUnpaidReward()

      OpenAccountRoutes.clearAllInputData();
      return CacheModule.clearUserRelatedCache();
    })
    .then(()=>{
      var date = new Date().getDateString();
      var data = {
        "lastDate": date,
        "isCheckInDialogShown": false
      };
      return StorageModule.setLastSuperPriorityHintData(JSON.stringify(data));
    })
    .then(()=>{
      EventCenter.emitAccountLogoutEvent();
      //TongDaoModule.setUserId("");

      //Restart the web socket.
      //WebSocketModule.stop();
      WebSocketModule.start();

      resolve();
    });
  });
}

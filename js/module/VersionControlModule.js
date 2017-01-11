'use strict'

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NativeDataModule = require('./NativeDataModule')
var NetworkModule = require('./NetworkModule')
var StorageModule = require('./StorageModule')
import React from 'react';
import {
	Alert,
	Linking,
	Platform,
  NetInfo,
} from 'react-native';

var isAlertShown = false;
export function getLatestVersion(){
  console.log("getLatestVersion")
	return new Promise((resolve, reject)=>{
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.LATEST_APP_VERSION,
				{
					method: 'GET',
				},
				(responseJson) => {
					if(responseJson){
            StorageModule.setLastOnlineVerionInfo(JSON.stringify(responseJson))
            .then(()=>{
  						var currentVersionCode = LogicData.getCurrentVersionCode();

  						var onlineVersionCode = Platform.OS === 'ios' ? responseJson.iOSLatestInt : responseJson.androidLatestInt;
  						var onlineVersionName = Platform.OS === 'ios' ? responseJson.iOSLatestStr : responseJson.androidLatestStr;
  						var onlineMinimumVersionCode = Platform.OS === 'ios' ? responseJson.iOSMinInt : responseJson.androidMinInt;
  						var onlinePkgSize = Platform.OS === 'ios' ? responseJson.iOSPkgSize : responseJson.androidPkgSize;

  						var pkgSize = (onlinePkgSize / 1024 / 1024).toFixed(2) + "MB"
  						console.log("onlineMinimumVersionCode " + onlineMinimumVersionCode)
  						if(onlineMinimumVersionCode > currentVersionCode && !isAlertShown){
                showForceAlertDialog(onlineVersionName, pkgSize)
  						}

  						LogicData.setOnlineVersionCode(onlineVersionCode);
  						LogicData.setOnlineVersionName(onlineVersionName);
            });
					}
				},
				(result) => {
					console.log(result.errorMessage)
				}
			);
	});
}

export function showForceAlertDialog(onlineVersionName, pkgSize){
  isAlertShown = true;
  Alert.alert("升级提示",
    "发现新版本" + onlineVersionName + "/" + pkgSize + "， 本次更新为强制更新，请您立即升级版本，否则软件将无法正常运行！",
    [{text: '立即更新', onPress: () => {
      gotoDownloadPage()
      .then(()=>{
        showForceAlertDialog(onlineVersionName, pkgSize);
      })
    }}],
    {cancelable:false});
}

export function gotoDownloadPage(){
  return new Promise((resolve)=>{
    var url = NetConstants.MARKET_URL;
    Linking.openURL(url)
    .done(()=>{
      if(resolve){
        resolve();
      }
    })
  })
}

export function start(){
  StorageModule.loadLastOnlineVerionInfo()
  .then((value)=>{
    if(value){
      var versionInfo = JSON.parse(value);
      var currentVersionCode = LogicData.getCurrentVersionCode();

      var onlineMinimumVersionCode = Platform.OS === 'ios' ? versionInfo.iOSMinInt : versionInfo.androidMinInt;

      console.log("currentVersionCode " + currentVersionCode)
      console.log("onlineMinimumVersionCode " + onlineMinimumVersionCode)
      if(onlineMinimumVersionCode > currentVersionCode){
        var onlineVersionName = Platform.OS === 'ios' ? versionInfo.iOSLatestStr : versionInfo.androidLatestStr;
        var onlinePkgSize = Platform.OS === 'ios' ? versionInfo.iOSPkgSize : versionInfo.androidPkgSize;
        var pkgSize = (onlinePkgSize / 1024 / 1024).toFixed(2) + "MB";
        if(onlineMinimumVersionCode > currentVersionCode && !isAlertShown){
          showForceAlertDialog(onlineVersionName, pkgSize);
          return;
        }
      }
    }
    getLatestVersion();
    NetInfo.addEventListener(
      'change',
      handleConnectivityChange
    );
  })

}

function handleConnectivityChange(reach){
  if(Platform.OS === 'ios'){
    switch(reach){
      case 'wifi':
      case 'cell':
        getLatestVersion();
        break;
    }
  }else{
    switch(reach){
      case 'MOBILE':
      case 'WIFI':
        getLatestVersion();
        break;
    }
  }
}

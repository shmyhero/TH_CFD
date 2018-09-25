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
var localVersionDataFetched = false;
var lastOnlineVerionInfo = null;
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
						//responseJson.androidMinInt = 17;
						lastOnlineVerionInfo = responseJson;
						localVersionDataFetched = true;
                        StorageModule.setLastOnlineVerionInfo(JSON.stringify(responseJson))
                        .then(()=>{
							isCurrentVersionMinimum();
                            var onlineVersionCode = Platform.OS === 'ios' ? responseJson.iOSLatestInt : responseJson.androidLatestInt;
                            var onlineVersionName = Platform.OS === 'ios' ? responseJson.iOSLatestStr : responseJson.androidLatestStr;
                            LogicData.setOnlineVersionCode(onlineVersionCode);
                            LogicData.setOnlineVersionName(onlineVersionName);
                        });
					}
				},
				(result) => {
					console.log(result.errorMessage)

					if(!localVersionDataFetched){
						StorageModule.loadLastOnlineVerionInfo()
                          .then((value)=>{
                            if(value){
                                localVersionDataFetched = true;
                                lastOnlineVerionInfo = JSON.parse(value);
                                isCurrentVersionMinimum();
                                }
                            });
					}
				}
			);
	});
}

function isCurrentVersionMinimum(){
	var currentVersionCode = LogicData.getCurrentVersionCode();

	var onlineMinimumVersionCode = Platform.OS === 'ios' ? lastOnlineVerionInfo.iOSMinInt : lastOnlineVerionInfo.androidMinInt;

	console.log("currentVersionCode " + currentVersionCode)
	console.log("onlineMinimumVersionCode " + onlineMinimumVersionCode)
	if(onlineMinimumVersionCode > currentVersionCode){
		var onlineVersionName = Platform.OS === 'ios' ? lastOnlineVerionInfo.iOSLatestStr : lastOnlineVerionInfo.androidLatestStr;
		var onlinePkgSize = Platform.OS === 'ios' ? lastOnlineVerionInfo.iOSPkgSize : lastOnlineVerionInfo.androidPkgSize;
		console.log("onlineMinimumVersionCode " + onlineMinimumVersionCode + " versionInfo.androidPkgSize" + lastOnlineVerionInfo.androidPkgSize)
		var pkgSize = (onlinePkgSize / 1024 / 1024).toFixed(2) + "MB";
		if(onlineMinimumVersionCode > currentVersionCode && !isAlertShown){
			showForceAlertDialog(onlineVersionName, pkgSize);
			return false;
		}
	}
	return true;
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
		if(lastOnlineVerionInfo || Platform.OS !== 'ios'){
			var url = Platform.OS === 'ios' ? lastOnlineVerionInfo.iOSAppUrl : NetConstants.ANDROID_MARKET_URL;
	        Linking.openURL(url).done(()=>{
              if(resolve){
                resolve();
              }
            })
		}else{
			StorageModule.loadLastOnlineVerionInfo()
			.then((value)=>{
				if(value){
					lastOnlineVerionInfo = JSON.stringify(value);
					var url = Platform.OS === 'ios' ? lastOnlineVerionInfo.iOSAppUrl : NetConstants.ANDROID_MARKET_URL;
					Linking.openURL(url).done(()=>{
						if(resolve){
							resolve();
						}
					})
				}
			})
		}
  })
}

export function start(){
  getLatestVersion();
  NetInfo.addEventListener(
    'connectionChange',
    handleConnectivityChange
  );
}

function handleConnectivityChange(reach){
  if(Platform.OS === 'ios'){
    switch(reach){
      case 'none':
	   break;
	  default:
        getLatestVersion();
       break;
    }
  }else{
    switch(reach){
      case 'NONE':
	  case 'BLUETOOTH':
		break;
	  default:
		getLatestVersion();
        break;
    }
  }
}

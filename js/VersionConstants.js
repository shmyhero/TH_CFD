'use strict'

import {
	Platform
} from 'react-native';

var StorageModule = require('./module/StorageModule')
var NetConstants = require('./NetConstants')

export const WEBVIEW_QA_VERSION = '1.4' //Only update this version when QA Page version is updated!
export const WEBPAGE_VERSION = '1.5'    //Only update this version when Web Page version is updated!

//BUG Fix: Some web page in web1.5 cannot be displayed. Use web for now.
export const WEBPAGE_FOLDER = 'TH_CFD_WEB' //+ WEBPAGE_VERSION
export const WEBPAGE_FOLDER_ACTUAL = 'TH_CFD_SP'

//NEVER CHANGE THE PRODUCT SERVER IN PRODUCT APP!!!
//DEFAULT settings are product settings.
export const SERVER_TYPE_PRODUCT = "product";
export const SERVER_TYPE_STAGE = "stage";
export const SERVER_TYPE_DEVELOP = "develop";

// var CFDServerType = SERVER_TYPE_STAGE;
var CFDServerType = SERVER_TYPE_PRODUCT;

// //Not used any more
// var isProductApp = true;
//
// export function setIsProductApp(value){
//   console.log("setIsProductApp " + value);
//   isProductApp = value
// }
//
// export function getIsProductApp(){
//   return isProductApp;
// }

export function loadServerSettings(){
	console.log("loadServerSettings ");
  return new Promise((resolve, reject)=>{
    StorageModule.loadCFDServerType().then((value) => {
      if (value != null) {
				console.log("loadIsProductServer result: " + value);
        CFDServerType = value;
        NetConstants.reloadCFDAPI();
        resolve();
      }else{
				console.log("loadIsProductServer result is null ");
        resolve();
      }
    })
  })
}

export function getCFDServerType(){
  console.log("getCFDServerType " + CFDServerType);
  return CFDServerType;
	// return false;
}

export function setCFDServerType(value){
	//We do not care about the develop/product app any more.
  //if(!isProductApp || Platform.OS === 'ios'){
    console.log("setCFDServerType " + value);
    if(CFDServerType != value){
      CFDServerType = value;
      StorageModule.setCFDServerType(value);
      NetConstants.reloadCFDAPI();
    }
  //}
}

//TODO: There will be product and development environment  in later version..
//export const IS_DEVELOPMENT_ENVIRONMENT = true
//export const WEBPAGE_PRODUCT_VERSION = 'TH_CFD_WEB'
//export const WEBPAGE_DEVELOP_VERSION = 'TH_CFD_WEBTEST'
//
//export const WEBPAGE_FOLDER = IS_DEVELOPMENT_ENVIRONMENT ? WEBPAGE_DEVELOP_VERSION : WEBPAGE_PRODUCT_VERSION
////UPDATE the folder to TH_CFD_WEB in release version!

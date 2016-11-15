'use strict'

import React from 'react';
import {
  AsyncStorage,
  View,
} from 'react-native';

/*
var LogicData = require('../../LogicData')
var StorageModule = require('../../module/StorageModule')
var NetworkModule = require('../../module/NetworkModule')
var WebSocketModule = require('../../module/WebSocketModule')
var TongDaoModule = require('../../module/TongDaoModule')
*/
var TalkingdataModule = require('../../module/TalkingdataModule')
var StorageModule = require('../../module/StorageModule')
var NetConstants = require('../../NetConstants')
var ColorConstants = require('../../ColorConstants')
var NavBar = require('../NavBar')
var MainPage = require('../MainPage')

var OpenAccountInfos = [
	{"title": "开户准备", "page": require('./OAStartPage')},
	{"title": "设置账户信息(1/5)", "page": require('./OAAccountBasicSettingsPage')},
	{"title": "上传身份证照片(2/5)", "page": require('./OAIdPhotoPage')},
  {"title": "完善个人信息(3/5)", "page": require('./OAPersonalInfoPage')},
  {"title": "完善财务信息(4/5)", "page": require('./OAFinanceInfoPage')},
  {"title": "提交申请(5/5)", "page": require('./OADocumentInfoPage')},
  {"title": "审核状态", "page": require('./OAReviewStatusPage'), "removeStoredData": true},
]

var errorRoutes = [];

var lastStoredData = null;
var lastInputIndex = null;

export function setCurrentRouteStateAsLatest(navigator, data){
  var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;
    storeCurrentInputData(currentStep, data);
    StorageModule.setLastOpenAccountRoute(currentStep.toString());
  	console.log("storeCurrentInputData: " + currentStep.toString());
    lastInputIndex = currentStep;
  }
}

export function backToPreviousRoute(navigator, data, onPop, onPageDismiss){
  console.log("backToPreviousRoute");
  if(onPageDismiss){
    onPageDismiss();
  }

  var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;

    var nextStep = currentStep - 1;
    if(lastRoute.backToPage){
      nextStep = lastRoute.backToPage;
    }
    //Update: Do NOT store data if the next button is not clicked.
    //storeCurrentInputData(currentStep, data);

    if(currentStep > 0){
      navigator.replace({
        name: MainPage.OPEN_ACCOUNT_ROUTE,
        step: nextStep,
        onPop: onPop,
        isBack: true,
      })
    }else{
      popToLastPage(navigator, onPop);
    }
  }
}

export function getLatestInputStep(){
  console.log("getLatestInputStep");
  return new Promise(resolve=>{
    loadLastInputData()
    .then(()=>{
      StorageModule.loadLastOpenAccountRoute()
        .then((lastIndex)=>{
        if(lastStoredData == null){
          resolve(0);
          return;
        }

        console.log("lastIndex: " + lastIndex);
        if(lastIndex !== undefined && lastIndex !== null){
          lastInputIndex = parseInt(lastIndex);
          resolve(lastInputIndex);


          console.log("lastInputIndex: " + lastInputIndex);
          return;
        }

        for(var i = 0; i < OpenAccountInfos.length; i++){
          if(!lastStoredData[i]){
            if(i > 0){
              resolve(i-1);
            }else{
              resolve(i);
            }
            return;
          }
        }
      });
    })
  });
}

export function showOARoute(navigator, step, onPop, data, nextStep){
  console.log("showOARoute " + step);
  var info = OpenAccountInfos[step];
  var Page = info.page;
  var title = info.title;
  var showBackButton = (step !== OpenAccountInfos.length-1);
  var data = data ? data : (lastStoredData ? lastStoredData[step] : null);
  var page;
  return (
    <View style={{flex: 1}}>
      <NavBar title={title}
        showBackButton={showBackButton}
        leftButtonOnClick={()=>backToPreviousRoute(navigator, page.getData(), onPop, page.onDismiss)}
        backButtonOnClick={()=>TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_BACK, TalkingdataModule.LABEL_OPEN_ACCOUNT)}
        backgroundColor={ColorConstants.TITLE_DARK_BLUE}
        textOnRight={showBackButton?'取消':''}
        rightTextOnClick={()=>cancelOARoute(navigator, page.getData(), onPop, page.onDismiss)}
        navigator={navigator}/>
      <Page navigator={navigator}
        ref={(ref) => page = ref}
        data={data}
        onPop={onPop}
        />
    </View>
  )
}

export function showErrorRoute(navigator, onPop, nextRouteData){
  var errorStep = errorRoutes[0];
  console.log("showErrorRoute " + errorStep);
  var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;
    //We do not need to remove data if there's error occurs.
    /*
    if(OpenAccountInfos[errorStep].removeStoredData){
      clearAllInputData();
    }
    */
    var nextStep = currentStep;
    if(errorRoutes.length - 1 > errorStep){
      nextStep = errorStep + 1;
    }
    console.log("goToNextRoute OPEN_ACCOUNT_ROUTE: " + errorStep);
    navigator.replace({
      name: MainPage.OPEN_ACCOUNT_ROUTE,
      step: errorStep,
      onPop: onPop,
      data: nextRouteData,
      backToPage: currentStep,
      nextStep: nextStep,
      isError: true,
    });
  }
}

export function goToNextRoute(navigator, data, onPop, nextRouteData){
  var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;

    storeCurrentInputData(currentStep, data);

    if(lastInputIndex !== null){
      StorageModule.removeLastOpenAccountRoute();
      lastInputIndex = null;
    }

    var nextStep = currentStep + 1;
    if(lastRoute.nextStep){
      nextStep = lastRoute.nextStep;
    }

    if(nextStep >= OpenAccountInfos.length){
      clearAllInputData();
      popToLastPage(navigator, onPop);
    }else{
      if(OpenAccountInfos[nextStep].removeStoredData){
        clearAllInputData();
      }
      console.log("goToNextRoute OPEN_ACCOUNT_ROUTE: " + nextStep);
      navigator.replace({
        name: MainPage.OPEN_ACCOUNT_ROUTE,
        step: nextStep,
        onPop: onPop,
        data: nextRouteData,
        isNext: true,
      });
    }
  }
}

export function getOpenAccountData(){
  var userData = {};
  if(lastStoredData){
    for(var i = 0; i < OpenAccountInfos.length; i++){
      if(lastStoredData[i]){
        var dataArray = lastStoredData[i];
        //console.log("dataArray.length " + dataArray.length);
        for( var j = 0; j < dataArray.length; j++){
          //console.log("dataArray[j]: j" + j + ", "+ JSON.stringify(dataArray[j]));
          if(dataArray[j] && !dataArray[j].ignoreInRegistery){
            //console.log("getOpenAccountData: " + dataArray[j].key);
            var key = dataArray[j].key;
            if(key){
              var value = dataArray[j].value;
              userData[key] = value;
            }
          }
        }
      }
    }
  }
  //console.log("getUserInputData " + JSON.stringify(userData));
  return userData;
}

export function showError(errorList, navigator, onPop){
  errorRoutes = [];
  for(var i = 0; i < errorList.length; i++){
    var errorKey = errorList[i].key;
    var errorMessage = errorList[i].error;
    for(var errorPageIndex = 0; errorPageIndex < OpenAccountInfos.length; errorPageIndex++){
      var pageData = lastStoredData[errorPageIndex];
      if(pageData){
        for(var k = 0; k < pageData.length; k++){
          if(pageData[k].key === errorKey){
            pageData[k].error = errorMessage;
            errorRoutes.push(errorPageIndex);
            console.log("route " + errorPageIndex + " has error: " + errorMessage);//+ ", page:" + JSON.stringify(pageData))
          }
        }
      }
    }
  }

  if(errorRoutes.length > 0){
    showErrorRoute(navigator, onPop, pageData);
    return true;
  }else{
    return false;
  }
}

function loadStoredInputData(data, step, resolve){
  //console.log(step + " loadStoredInputData: " + JSON.stringify(data));
  return new Promise((r)=>{
    StorageModule.loadOpenAccountData(step).
    then((value)=>{
      var handler = resolve ? resolve : r;
      //console.log(step + " loadOpenAccountData: " + JSON.stringify(value));
      if(value){
        data[step] = JSON.parse(value);
        if(step < OpenAccountInfos.length){
          step ++;
          loadStoredInputData(data, step, handler);
        }else{
          handler(data);
        }
      }else{
        handler(data);
      }
    }, ()=>{
      console.log("error?");
    });
  })
}

function loadLastInputData(){
  //lastStoredData is null, which means it is the first time the app loads the data.
  return new Promise(resolve => {
    if(!lastStoredData){
      loadStoredInputData({}, 0)
      .then((data)=>{
        lastStoredData = data;
        //console.log("loadLastInputData: " + JSON.stringify(lastStoredData))
        resolve();
      });
    }else{
      resolve();
    }
  })
}

function clearAllInputData(currentIndex){
  console.log("clearAllInputData")
  var index = 0;
  if(currentIndex){
    index = currentIndex;
  }
  StorageModule.removeOpenAccountData(index)
  .then(()=>{
    index++;
    if(index < OpenAccountInfos.length){
      clearAllInputData(index);
    }else{
      lastStoredData = null;
      if(lastInputIndex !== null){
        StorageModule.removeLastOpenAccountRoute();
        lastInputIndex = null;
      }
    }
  },()=>{
    console.log("removeOpenAccountData " + index + " error")
  })
}

function storeCurrentInputData(step, data){
  //console.log("storeCurrentInputData lastStoredData: " + JSON.stringify(data));

  StorageModule.setOpenAccountData(step, JSON.stringify(data));
  if(lastStoredData==null){
    lastStoredData = {};
  }
  lastStoredData[step] = data;
  //console.log("storeCurrentInputData lastStoredData: " + JSON.stringify(lastStoredData));
}

function cancelOARoute(navigator, data, onPop, onPageDismiss){
  console.log("cancelOARoute")

  if(onPageDismiss){
    onPageDismiss();
  }
  //Update: Do NOT store data if the next button is not clicked.
  /*var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;
    storeCurrentInputData(currentStep, data);
  }
  */
  TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_QUIT, TalkingdataModule.LABEL_OPEN_ACCOUNT);
  popToLastPage(navigator, onPop);
}

function popToLastPage(navigator, onPop){
  if(onPop){
    onPop();
  }
  navigator.pop();
}

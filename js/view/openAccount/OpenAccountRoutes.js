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
var NetConstants = require('../../NetConstants')
var ColorConstants = require('../../ColorConstants')
var NavBar = require('../NavBar')
var MainPage = require('../MainPage')

var OpenAccountInfos = [
	{"title": "开户准备", "page": require('./OAStartPage')},
	{"title": "上传身份证照片(1/4)", "page": require('./OAIdPhotoPage')},
  {"title": "完善个人信息(2/4)", "page": require('./OAPersonalInfoPage')},
  {"title": "完善财务信息(3/4)", "page": require('./OAFinanceInfoPage')},
  {"title": "提交申请(4/4)", "page": require('./OADocumentInfoPage')},
  {"title": "审核状态", "page": require('./OAReviewStatusPage')},
]

export function backToPreviousRoute(navigator){
  var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;
    if(currentStep){
      navigator.replace({
        name: MainPage.OPEN_ACCOUNT_ROUTE,
        step: currentStep - 1,
      })
    }else{
      navigator.pop();
    }
  }
}

function loadLastInputData(){

}

function storeCurrentInputData(data){

}

export function getLatestInputStep(){
  return 0;
}

export function showOARoute(navigator, step){
  var info = OpenAccountInfos[step];
  var Page = info.page;
  var title = info.title;
  var showBackButton = (step !== OpenAccountInfos.length-1)

  return (
    <View style={{flex: 1}}>
      <NavBar title={title}
        titleStyle={{marginLeft:-20, marginRight:-20}}
        showBackButton={showBackButton}
        leftButtonOnClick={()=>backToPreviousRoute(navigator)}
        backButtonOnClick={()=>TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_BACK, TalkingdataModule.LABEL_OPEN_ACCOUNT)}
        backgroundColor={ColorConstants.TITLE_DARK_BLUE}
        textOnRight={showBackButton?'取消':''}
        rightTextOnClick={()=>cancelOARoute(navigator)}
        navigator={navigator}/>
      <Page navigator={navigator}/>
    </View>
  )
}

function cancelOARoute(navigator){
  navigator.popToTop()
  TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_QUIT, TalkingdataModule.LABEL_OPEN_ACCOUNT)
}

export function goToNextRoute(navigator, data){
  storeCurrentInputData(data);

  var routes = navigator.getCurrentRoutes();
  var lastRoute = routes[routes.length-1];
  if(lastRoute){
    var currentStep = lastRoute.step;
    var nextStep =  currentStep + 1;
    console.log("goToNextRoute OPEN_ACCOUNT_ROUTE: " + nextStep);
    navigator.replace({
      name: MainPage.OPEN_ACCOUNT_ROUTE,
      step: nextStep,
      aaa: 12,
    });
  }
}

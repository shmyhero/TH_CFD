'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {
	packageVersion,
} from 'react-native-update';


var {height, width} = Dimensions.get('window')
import Picker from 'react-native-picker';
var MainPage = require('./MainPage');
var NetConstants = require('../NetConstants');
var VersionConstants = require('../VersionConstants');
var UIConstants = require('../UIConstants');
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');
var LogicData = require('../LogicData');
var ColorConstants = require('../ColorConstants');
var StockTransactionInfoModal = require('./StockTransactionInfoModal');
var StockTransactionInfoBar = require('./StockTransactionInfoBar')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var StorageModule = require('../module/StorageModule')

export default class DevelopPage extends Component {

  constructor(props) {
	  super(props);

    var server = NetConstants.getAPIServerIP();
    this.state = {
      server: server,
      debugStatus: LogicData.getDebugStatus(),
      languageSetting: LogicData.getLanguageEn()=='1'?'切换成中文':'切换成英文'
    }
  }

  onPressServerPicker(){
    var selectedText = VersionConstants.getCFDServerType();
    var choices = [
      VersionConstants.SERVER_TYPE_PRODUCT,
      VersionConstants.SERVER_TYPE_STAGE,
      VersionConstants.SERVER_TYPE_DEVELOP,
    ];
    Picker.init({
        pickerData: choices,
        selectedValue: [selectedText],
        pickerTitleText: "",
        onPickerConfirm: data => {
          VersionConstants.setCFDServerType(data[0]);
          this.setState({
            //isDevelopServer: isDevelopServer,
            server: NetConstants.getAPIServerIP(),
          })
        },
    });
    Picker.show();
  }

  deleteLiveAcccount(){
    var userData = LogicData.getUserData()
    var notLogin = Object.keys(userData).length === 0
    if(!notLogin){
      //If previously logged in, fetch me data from server.
      NetworkModule.fetchTHUrl(
        NetConstants.CFD_API.DETELE_LIVE_ACCOUNT,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          },
        },
        function(responseJson) {
          if(responseJson.success){
            alert("已删除");
          }else{
            alert(JSON.stringify(responseJson))
          }
        }.bind(this)
      )
    }else{

    }
  }

  updateColor(liveColor){
    LogicData.setAccountState(!liveColor)
    MainPage.refreshMainPage()
    this.forceUpdate()
  }

  refresh(){
    var server = NetConstants.getAPIServerIP();
    this.state = {
      server: server,
    }
  }

  updateDebugStatus(){
    var value = !this.state.debugStatus;
    console.log("this.state.debugStatus "+this.state.debugStatus)
    console.log("!this.state.debugStatus "+(!this.state.debugStatus))

    StorageModule.setDebugSettings(value.toString()).then(()=>{
      LogicData.setDebugStatus(value);
      this.setState({
        debugStatus : value
      });
    })
  }

  languageChange(){
    LogicData.setLanguageEn(LogicData.getLanguageEn()=='0'?'1':'0');
    this.setState({
      languageSetting: LogicData.getLanguageEn()=='1'?'切换成中文':'切换成英文'
    },console.log('languageEN:'+LogicData.getLanguageEn()))
    this.postLanguageSetting();
  }

  postLanguageSetting(){
    var userData = LogicData.getUserData();
    var notLogin = Object.keys(userData).length === 0;
    if (!notLogin) {
      NetworkModule.fetchTHUrl(
        NetConstants.CFD_API.POST_USER_LANGUAGE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          },
          body: JSON.stringify({
            language: LogicData.getLanguageEn()=="1"?'en':'cn',
          }),
        },
        (responseJson) => {
          if (responseJson.message){

          }else{

          }
        },
        (result) => {

        })
    }
  }

  render() {
    var liveColor = LogicData.getAccountState()


    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>

          {/* <NetworkErrorIndicator onRefresh={()=>this.refresh()}/> */}

          <View style={{flexDirection: 'column',
            padding:15,
            }}>
            <Text>版本号：</Text>
            <Text>{packageVersion}</Text>
          </View>
          <View style={{flexDirection: 'column',
            padding:15,
            }}>
            <Text>当前服务器：</Text>
            <Text>{this.state.server}</Text>
          </View>
          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}}
              onPress={()=>this.onPressServerPicker()}>
              <Text style={{color:'white', fontSize: 16}}>
                {"当前服务器：" + VersionConstants.getCFDServerType() + ", 点击切换"}
              </Text>
            </TouchableOpacity>
  				</View>

          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}}
              onPress={()=>this.showNewTweetPage()}>
              <Text style={{color:'white', fontSize: 16}}>
                新动态
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}} onPress={()=>this.deleteLiveAcccount()}>
              <Text style={{color:'white', fontSize: 16}}>
                删除实盘账号
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}} onPress={()=>this.updateColor(liveColor)}>
              <Text style={{color:'white', fontSize: 16}}>
                {liveColor?"切换到模拟盘颜色":"切换到实盘颜色"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}} onPress={()=>this.updateDebugStatus()}>
              <Text style={{color:'white', fontSize: 16}}>
                {!this.state.debugStatus ? "开启开发中功能,下次启动app时生效": "关闭开发中功能,下次启动app时生效"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}}
              onPress={()=>this.showPage()}>
              <Text style={{color:'white', fontSize: 16}}>
                显示成就卡
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', padding:15,}}>
            <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}}
              onPress={()=>this.languageChange()}>
              <Text style={{color:'white', fontSize: 16}}>
                {this.state.languageSetting}
              </Text>
            </TouchableOpacity>
          </View>


          <StockTransactionInfoModal ref='page'/>
        </ScrollView>
      </View>
    );
  }

  showNewTweetPage(){
    this.props.navigator.push({
			name: MainPage.NEW_TWEET_PAGE_ROUTE,
			onPopToRoute: ()=>{console.log("onPopToRoute");}
		});
  }

  showPage(){
    var card1 = {
        cardId: 1,
        invest: 100,
        isLong: true,
        leverage: 50,
        tradePrice: 1284.8,
        settlePrice: 1302.8,
        imgUrlBig: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_big.png',
        imgUrlMiddle: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_middle.png',
        imgUrlSmall: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_small.png',
        reward: 1,
        tradeTime: '2016-11-08T08:00:16.223',
        ccy: 'USD',
        stockName: '美国科技股1000000',
        themeColor: '#ee9922',
        pl:100,
        plRate:50,
        likes: 39,
    };
    var card2 = {
        cardId: 2,
        invest: 100,
        isLong: true,
        leverage: 50,
        tradePrice: 1284.8,
        settlePrice: 1302.8,
        imgUrlBig: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_big.png',
        imgUrlMiddle: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_middle.png',
        imgUrlSmall: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_small.png',
        reward: 3,
        tradeTime: '2016-11-08T08:00:16.223',
        ccy: 'USD',
        stockName: '白银',
        themeColor: 'red',
        pl:-100,
        plRate:-50,
        likes: 11,
    };

    var array = [card1,card2,card1,card2,card1,card2,card1,card2,card1,card2,card1,card2,];

    var info = { id: '140134428162',
      invest: 0,
      isLong: true,
      leverage: 1,
      openPrice: 1284.6,
      settlePrice: 1308.6,
      quantity: 0,
      pl: 37.36,
      createAt: '2016-11-09T08:02:37.975Z',
      time: new Date('2016-11-08T07:58:29.67'),
      card:
      {
        cardId: 22,
        invest: 100,
        isLong: false,
        leverage: 100,
        tradePrice: 5743,
        settlePrice: 5664.83,
        imgUrlBig: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_big_2_20170905.gif',
        imgUrlMiddle: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/blue_middle.jpg',
        imgUrlSmall: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/blue_small.jpg',
        reward: 1,
        tradeTime: '2017-06-27T22:52:58.35',
        ccy: 'USD',
        stockID: 36004,
        stockName: '美国科技股100',
        themeColor: '#1658d8',
        title: '财富启航',
        cardType: 4,
        pl: 136.11,
        plRate: 136.1135,
        likes: 5,
        liked: true,
        isNew: false,
        userName: '晴天'
      }
    }

    //this.refs['page'].showAchievement(array, 1, ()=>{}, {showShare: true});
    //{/*showShare: true, */showLike: true}
    this.refs['page'].show(info, ()=>{}, {showShare: true, showLike: true});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  rowTitle:{
    color: '#333333',
    flex: 1,
    height: 20,
  },
});

module.exports = DevelopPage;

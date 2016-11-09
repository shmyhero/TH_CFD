'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

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

export default class DevelopPage extends Component {

  constructor(props) {
	  super(props);

    var server = NetConstants.getAPIServerIP();
    this.state = {
      server: server,
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
      NetworkModule.fetchTHUrlWithNoInternetCallback(
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
        }.bind(this),
        function(errorMessage) {

        }.bind(this),
        function(errorMessage) {

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

  render() {
    var liveColor = LogicData.getAccountState()
    return (
      <View style={styles.container}>
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
          <TouchableOpacity style={{backgroundColor:ColorConstants.title_blue(), flex:1, alignItems:'center', padding: 20, borderRadius: 5}}
            onPress={()=>this.showPage()}>
            <Text style={{color:'white', fontSize: 16}}>
              显示成就卡
            </Text>
          </TouchableOpacity>
        </View>
        <StockTransactionInfoModal ref='page'/>
      </View>
    );
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
        stockName: '黄金',
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
       { cardId: 1,
         invest: 2000,
         isLong: true,
         leverage: 1,
         tradePrice: 1284.6,
         settlePrice: 1308.6,
         imgUrlBig: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_big.png',
         imgUrlMiddle: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_middle.png',
         imgUrlSmall: 'https://cfdstorage.blob.core.chinacloudapi.cn/card/brozne_1_1_small.png',
         reward: 1,
         tradeTime: '2016-11-08T07:58:29.67',
         ccy: 'USD',
         stockName: '黄金',
         themeColor: '#ee9922',
         likes: 22,
      }
    }

    //this.refs['page'].showAchievement(array, 1, ()=>{}, {showShare: true});
    //{/*showShare: true, */showLike: true}
    this.refs['page'].show(info, ()=>{}, {/*showShare: true, */showLike: true});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowTitle:{
    color: '#333333',
    flex: 1,
    height: 20,
  },
});

module.exports = DevelopPage;

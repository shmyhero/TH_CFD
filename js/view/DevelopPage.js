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
var StockTransactionInfoPage = require('./StockTransactionInfoPage');

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
        <StockTransactionInfoPage ref='page'/>
      </View>
    );
  }

  showPage(){
    var sampleInfo = { id: '140126161654',
      invest: 99.999997677,
      isLong: true,
      leverage: 50,
      settlePrice: 1289.4,
      quantity: 0,
      pl: -1.16,
      createAt: '2016-11-07T07:09:40.146Z',
      openPrice: 1289.7,
      stockName: '黄金',
      isCreate: false,
      time: new Date('2016-11-06T23:00:00.521Z'),
      totalHeight: 503,
      security:
       { dcmCount: 1,
         bid: 1289.4,
         ask: 1289.9,
         lastOpen: '2016-11-06T23:00:00.521Z',
         lastClose: '2016-11-05T04:00:00.26Z',
         maxLeverage: 50,
         smd: 0.001,
         gsmd: 0.006,
         ccy: 'USD',
         isPriceDown: false,
         id: 34821,
         symbol: 'GOLDS',
         name: '黄金',
         preClose: 1303.3,
         open: 1304.9,
         last: 1289.7,
         isOpen: true
       },

       //Newly added data!
       achievementID: 2,
       achievementUrl: "http://i10.72g.com/201503/14277932144495.jpg",
       achievementThemeColor: '#998822'
     };

    this.refs['page'].show(sampleInfo, ()=>{}, {showShare: true, /*showLike: true*/});
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

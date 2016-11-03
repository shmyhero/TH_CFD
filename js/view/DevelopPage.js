'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
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
      </View>
    );
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

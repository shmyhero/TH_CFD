'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';

var MainPage = require('./MainPage');
var NetConstants = require('../NetConstants');
var VersionConstants = require('../VersionConstants');
var UIConstants = require('../UIConstants');
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');
var LogicData = require('../LogicData');

export default class DevelopPage extends Component {

  constructor(props) {
	  super(props);

    var isProductServer = !VersionConstants.getIsProductServer();
    var server = NetConstants.getAPIServerIP();
    this.state = {
      isDevelopServer: isProductServer,
      server: server,
    }
  }

  onPressSwitch(isDevelopServer){
    console.log("onPressSwitch: " + isDevelopServer)
    var isProductServer = !isDevelopServer;
    VersionConstants.setIsProductServer(isProductServer);
    this.setState({
      isDevelopServer: isProductServer,
      server: NetConstants.getAPIServerIP(),
    })
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
          StorageModule.setMeData(JSON.stringify(responseJson))
          LogicData.setMeData(responseJson);
          this.reloadMeData();
        }.bind(this),
        function(errorMessage) {
          this.reloadMeDataFromStorage();
        }.bind(this),
        function(errorMessage) {
          this.reloadMeDataFromStorage();
        }.bind(this)
      )
    }else{
      this.reloadMeDataFromStorage();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'column',
          padding:15,
          }}>
          <Text>当前服务器：</Text>
          <Text>{this.state.server}</Text>
        </View>
        <View style={{flexDirection: 'row', padding:15,}}>
					<Text style={styles.rowTitle}>打开CFD API测试服务器</Text>
					<Switch
						onValueChange={(value) => this.onPressSwitch(value)}
						style={{height: 20}}
						value={this.state.isDevelopServer} />
				</View>
        <View style={{flexDirection: 'row', padding:15,}}>
          <TouchableOpacity onPress={()=>this.deleteLiveAcccount()}>
            <Text style={{fontSize:25}}>
              删除实盘账号
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
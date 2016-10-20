'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';

var MainPage = require('./MainPage');
var NetConstants = require('../NetConstants');
var VersionConstants = require('../VersionConstants');
var UIConstants = require('../UIConstants');

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
					<Text style={styles.rowTitle}>打开测试服务器</Text>
					<Switch
						onValueChange={(value) => this.onPressSwitch(value)}
						style={{height: 20}}
						value={this.state.isDevelopServer} />
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

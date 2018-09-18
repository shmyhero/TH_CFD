/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  Component,
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';

var AppNavigator = require('./AppNavigator')

class TH_CFD extends React.Component {
  render() {
    var initialPage = this.props.initialPage;
    if (initialPage == null) {
      initialPage = 'stockListViewPager'
    }
    return (
      <AppNavigator initialViewRoute={initialPage}/>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('TH_CFD', () => TH_CFD);

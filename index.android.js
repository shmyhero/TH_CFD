/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Navigator,
  View,
  BackAndroid,
} = React;

var AppNavigator = require('./AppNavigator')

var LandingPage = React.createClass({
  render: function() {
    return (
      <AppNavigator initialViewRoute={'landing'}/>
    );
  }
});

var SettingsPage = React.createClass({
  render: function() {
    return (
      <AppNavigator initialViewRoute={'mySettings'}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('Landing_Page', () => LandingPage);
AppRegistry.registerComponent('Settings_Page', () => SettingsPage);

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

var TH_CFD = React.createClass({
  render: function() {
    var initialPage = this.props.initialPage;
    if (initialPage == null) {
      initialPage = 'landing'
    }
    return (

      <AppNavigator initialViewRoute={initialPage}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('TH_CFD', () => TH_CFD);

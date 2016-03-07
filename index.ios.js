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
} = React;

var AppNavigator = require('./AppNavigator')

var TH_CFD = React.createClass({
  render: function() {
    var initialPage = this.props.initialPage;
    if (initialPage == null) {
      initialPage = 'stockListViewPager'
    }
    return (
      <AppNavigator initialViewRoute={initialPage}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
});

AppRegistry.registerComponent('TH_CFD', () => TH_CFD);

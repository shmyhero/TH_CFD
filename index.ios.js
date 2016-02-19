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

var EatProject = React.createClass({
  render: function() {
    return (
      <AppNavigator initialViewRoute={'landing'}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
});

AppRegistry.registerComponent('EatProject', () => EatProject);

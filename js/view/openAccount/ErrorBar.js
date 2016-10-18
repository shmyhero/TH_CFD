'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375);

export default class ErrorBar extends Component {
  static propTypes = {
    error: PropTypes.string,
  }

  static defaultProps = {
    error: null,
  }

  render() {
    if(this.props.error && this.props.error.length > 0){
      return (
        <View style={styles.container}>
          <Text>{this.props.error}</Text>
        </View>
      );
    }else{
      return (<View/>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: rowPadding,
		paddingTop: rowPadding,
  },
});

module.exports = ErrorBar;

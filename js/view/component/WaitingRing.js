'use strict'

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
} from 'react-native';

export default class WaitingRing extends Component {
  static propTypes = {
    color: PropTypes.string,
    styleAttr: PropTypes.string
  }

  static defaultProps = {
    color: "#7a7987",
    styleAttr: 'small' // or 'large',
  }

  render() {
    return ActivityIndicator ? (
		<ActivityIndicator
            style={{marginRight: 10,}}
            animating={true}
            color={this.props.color}
            size={this.props.styleAttr}/>
    ) : Platform.OS == 'android' ?
        (
      <ProgressBarAndroid
          style={{marginRight: 10,}}
          color={this.props.color}
          styleAttr={this.props.styleAttr}/>

        ) : (
        <ActivityIndicatorIOS
            style={{marginRight: 10,}}
            animating={true}
            color={this.props.color}
            size={this.props.styleAttr}/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = WaitingRing

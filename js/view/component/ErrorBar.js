'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375);
var errorHintImage = require('../../../images/account_error_hint.png')

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
          <View style={{justifyContent: 'center'}}>
            <Image style={styles.image} source={errorHintImage}/>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} ellipsizeMode="tail" numberOfLines={1}>{this.props.error}</Text>
          </View>
        </View>
      );
    }else{
      return (<View/>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: 39,
    backgroundColor: '#ffeebb',
    paddingLeft: 15,
		paddingRight: 15,
    flexDirection:'row',
    justifyContent: 'center',
    //flex:1,
  },
  image:{
    height:18,
    width:18,
  },
  errorContainer:{
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
  },
  errorText:{
    fontSize: 13,
    color: '#666666'
  }
});

module.exports = ErrorBar;

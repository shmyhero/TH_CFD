'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

var ColorConstants = require('../ColorConstants')

export default class NetworkErrorIndicator extends Component {

  static propTypes = {
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
  }

  static defaultProps = {
    onRefresh: null,
    refreshing: false,
  }

  constructor(props) {
    super(props);

    console.log("NetworkErrorIndicator this.props.refreshing " + this.props.refreshing)
    this.state = {
      isLoading: this.props.refreshing ? true : false,
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps){
      this.setState({
        isLoading: nextProps.refreshing,
      })
    }
  }

  doRefresh(){
    this.setState({
      isLoading: true,
    })
    if(this.props.onRefresh){
      this.props.onRefresh();
    }
  }

  stopRefresh(){
    this.setState({
      isLoading: false,
    })
  }

  renderRefreshButton() {
    if(this.props.onRefresh){
      return (
        <TouchableOpacity style={[styles.refreshButton, {borderColor: ColorConstants.TITLE_BLUE,}]} onPress={()=>this.doRefresh()}>
          <View>
            <Text style={[styles.refreshButtonText,{color: ColorConstants.TITLE_BLUE,}]} >
              刷新
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    else{
      return (<View/>)
    }
  }

  render() {
    if(this.state.isLoading){
      return (
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Image style={styles.loadingImage} source={require('../../images/loading.gif')}/>
          </View>
        </View>
      );
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Image style={styles.noNetworkImage} source={require('../../images/network_connection_error_hint.png')}/>
            <Text style={styles.hintText}>
              溜走的不是网络，是真金白银呀！
            </Text>
            {this.renderRefreshButton()}
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  contentWrapper:{
    height: 260,
    flexDirection: 'column',
  },

  hintText:{
    color: '#b4b3b3',
    fontSize: 14,
  },

  refreshButton:{
    borderRadius: 3,
    borderWidth: 1,
    borderColor: ColorConstants.TITLE_BLUE,
    width: 115,
    height: 43,
    marginTop: 31,
    marginBottom: 20,
    alignSelf: 'center',
  },

  refreshButtonText:{
    padding: 10,
    alignItems: 'stretch',
    textAlign: 'center',
    fontSize: 18,
    color: ColorConstants.TITLE_BLUE,
  },

  noNetworkImage:{
    height: 164,
    width: 200,
    alignSelf: 'center',
    resizeMode: "stretch",
  },

  loadingImage:{
    height: 191,
    width: 200,
    alignSelf: 'center',
    resizeMode: "stretch",
  }
});

module.exports = NetworkErrorIndicator;

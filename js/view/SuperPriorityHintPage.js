'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	Animated,
	TouchableOpacity,
  Modal,
} from 'react-native';

var {height, width} = Dimensions.get('window');
var ColorConstants = require("../ColorConstants")
var NetConstants = require("../NetConstants")
var TalkingdataModule = require("../module/TalkingdataModule")
var NetworkModule = require("../module/NetworkModule")
var LogicData = require("../LogicData")
var MainPage = require("./MainPage")
var StorageModule = require("../module/StorageModule")
var LS = require("../LS")

var content_image_1 = require("../../images/super_priority_icon_1.png")
var content_image_2 = require("../../images/super_priority_icon_2.png")
var content_image_3 = require("../../images/super_priority_icon_3.png")
var content_image_4 = require("../../images/super_priority_icon_4.png")
var top_image = require("../../images/super_priority_top.png")
var background_image = require("../../images/super_priority_bg.png")

var DIALOG_WIDTH = width - 50;
var CONTENT_TOP_MARGIN = 30;
var CONTENT_IMAGE_SIZE = DIALOG_WIDTH / 2 - 100;
var NOT_LOGIN_DIALOG_HEIGHT = DIALOG_WIDTH /670 * 760;
var LOGIN_DIALOG_HEIGHT = DIALOG_WIDTH /670 * 514;
var HEADER_IMAGE_WIDTH = DIALOG_WIDTH;
var HEADER_IMAGE_HEIGHT = HEADER_IMAGE_WIDTH / 646 * 323;
var DIALOG_OFFSET = HEADER_IMAGE_HEIGHT - CONTENT_TOP_MARGIN;
var BACKGROUD_LIGHT_HEIGHT = height / 3 * 2;

class SuperPriorityHintPage extends React.Component {
  static propTypes = {
      getNavigator: PropTypes.func,
  };

  static defaultProps = {
      getNavigator: ()=>{},
  };

  state = {
    dialogVisible: false,
    fadeAnim: new Animated.Value(1),
  };

  show = () => {
    this.setState({
      dialogVisible: true,
    })

		Animated.timing(       // Uses easing functions
			this.state.fadeAnim, // The value to drive
			{
				toValue: 1,        // Target
				duration: 200,    // Configuration
			},
		).start();

		this.updateLastShow();
  };

  updateLastShow = () => {
      var userData = LogicData.getUserData();
      var isLogin = Object.keys(userData).length != 0;

      var date = new Date().getDateString();
      var data = {
          "lastDate": date,
          "isCheckInDialogShown": isLogin
      };

      StorageModule.setLastSuperPriorityHintData(JSON.stringify(data))
      .then(()=>{
              if (data !== null) {
                  LogicData.setLastSuperPriorityHintData(JSON.stringify(data))
              }
      })
  };

  hide = () => {
    var callbackId = this.state.fadeAnim.addListener(function(){
      if(this.state.fadeAnim._value == 0){
        this.state.fadeAnim.removeListener(callbackId)
        this.setState({
          dialogVisible: false,
        })
      }
    }.bind(this))
		Animated.timing(       // Uses easing functions
			this.state.fadeAnim, // The value to drive
			{
				toValue: 0,        // Target
				duration: 200,    // Configuration
			},
		).start();
  };

  _goToLoginPage = () => {
		var navigator = this.props.getNavigator();
    navigator.push({
      name: MainPage.LOGIN_ROUTE,
    });
  };

  _goToCheckInPage = () => {
      var navigator = this.props.getNavigator();
      navigator.push({
          name:MainPage.DAY_SIGN_ROUTE,
      });
  };

  renderRigisterLine = (isLogin) => {
    var registerStr = LS.str("SUPER_PRIORITY_MESSAGE_1");
    var registerStr_part1 = registerStr.split("{1}")[0];
    var registerStr_part2 = registerStr.split("{1}")[1];
    if(!isLogin){
      return (
        <View style={styles.bodyRowContainer}>
          <View style={styles.bodyContent}>
            <Image resizeMode="contain" source={content_image_1} style={styles.bodyImage}/>
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bodyText}>
                {registerStr_part1}
              </Text>
              <Text style={styles.bodyTextHighlight}>
                {LS.str("SUPER_PRIORITY_MESSAGE_REWARD_VALUE")}
              </Text>
              <Text style={styles.bodyText}>
                {registerStr_part2}
              </Text>
            </View>
          </View>
          <View style={styles.bodyContent}>
            <Image resizeMode="contain" source={content_image_2} style={styles.bodyImage}/>
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bodyText}>
                {registerStr_part1}
              </Text>
              <Text style={styles.bodyTextHighlight}>
                {LS.str("SUPER_PRIORITY_MESSAGE_REAL_MONEY_VALUE").replace("{1}", LogicData.getRegisterReward())}
              </Text>
            </View>
          </View>
        </View>)
    }
  };

  renderTradingLine = () => {
    return (
      <View style={styles.bodyRowContainer}>
        <View style={styles.bodyContent}>
					<Image resizeMode="contain" source={content_image_3} style={styles.bodyImage}/>
          <View style={styles.bodyTextContainer}>
            <Text style={styles.bodyText}>            
              {LS.str("SUPER_PRIORITY_MESSAGE_2")}
            </Text>
            <Text style={styles.bodyTextHighlight}>
              {LS.str("SUPER_PRIORITY_MESSAGE_CHECK_IN_REWARD")}
            </Text>
          </View>
        </View>
        <View style={styles.bodyContent}>
          <Image resizeMode="contain" source={content_image_4} style={styles.bodyImage}/>
          <View style={styles.bodyTextContainer}>
            <Text style={styles.bodyText}>            
              {LS.str("SUPER_PRIORITY_MESSAGE_3")}
            </Text>
            <Text style={styles.bodyTextHighlight}>
              {LS.str("SUPER_PRIORITY_MESSAGE_DEMO_TRADE_REWARD")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderActionButton = (isLogin) => {
      if(!isLogin){
          return (<TouchableOpacity style={styles.blueButton}
              onPress={() => {
                  this.hide();
                  this._goToLoginPage()
              }}>
              <Text style={styles.buttonText}>
                  
        {LS.str("SUPER_PRIORITY_REGISTER_NOW")}
              </Text>
          </TouchableOpacity>);
      }else{
          return (<TouchableOpacity style={styles.blueButton}
              onPress={() => {
                  this.hide();
                  this._goToCheckInPage()
              }}>
              <Text style={styles.buttonText}>
                  {LS.str("SUPER_PRIORITY_CHECK_IN_NOW")}
              </Text>
          </TouchableOpacity>);
      }
  };

  render() {
  	if(this.state.dialogVisible){
      var userData = LogicData.getUserData();
      var isLogin = Object.keys(userData).length != 0

      var dialogContainerHeight = (isLogin ? LOGIN_DIALOG_HEIGHT : NOT_LOGIN_DIALOG_HEIGHT) + DIALOG_OFFSET;
      var containerHeight = isLogin ? LOGIN_DIALOG_HEIGHT : NOT_LOGIN_DIALOG_HEIGHT;

      return (
        <Animated.View
          style={[styles.outsideContainer, {opacity: this.state.fadeAnim}]}
          >
          <TouchableOpacity style={styles.greyBackground}
            activeOpacity={1}
            onPress={() => {
              this.hide();
            }}>
            <Image source={background_image} style={{position:'absolute', height:300, width: width}}/>
            <TouchableOpacity
  						style={[styles.dialogContainer, {height: dialogContainerHeight}]}
              activeOpacity={1}
              onPress={() => {
              }}>
  						<View style={[styles.container, {height: containerHeight}]}>
                <View style={styles.bodyContainer}>
                  {this.renderRigisterLine(isLogin)}
                  {this.renderTradingLine()}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.greyButton}
                    onPress={() => {
                      this.hide();
                    }}>
                    <Text style={styles.buttonText}>
                      {LS.str("SUPER_PRIORITY_I_KNOW")}
                    </Text>
                  </TouchableOpacity>
                  {this.renderActionButton(isLogin)}
                </View>
  						</View>
  						<Image resizeMode="contain" source={top_image} style={styles.topImage}/>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      );
    }else{
      return(<View/>);
    }
  }
}

const styles = StyleSheet.create({
  outsideContainer:{
    position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
  },
  greyBackground:{
    flex:1,
    width: width,
    height: height,
		backgroundColor: '#0000007f',
		alignItems: 'center',
		justifyContent: 'center'
  },
	dialogContainer:{
		//height: DIALOG_HEIGHT + DIALOG_OFFSET,
	},
  container: {
		top: DIALOG_OFFSET,
    //height: DIALOG_HEIGHT,
		width: DIALOG_WIDTH,
		borderRadius: 10,
    backgroundColor: 'white',
		flexDirection: 'column',
  },
	topImage:{
		position:'absolute',
		top:0,
		alignSelf:'stretch',
		height: HEADER_IMAGE_HEIGHT,
		width: HEADER_IMAGE_WIDTH,
	},
	bodyContainer:{
		flex: 1,
    flexDirection: 'column',
		marginTop: 30,
		marginBottom: 26,
	},
  bodyContent:{
    flex:1,
    alignItems:'center',
		flexDirection: 'column'
  },
  bodyImage:{
		//flex:1
		width: CONTENT_IMAGE_SIZE,
		height: CONTENT_IMAGE_SIZE,
  },
  bodyRowContainer:{
		flex: 1,
    flexDirection: 'row',
    marginTop: 26,
  },
  bodyTextContainer:{
    marginTop:23,
    flexDirection: 'row',
  },
  bodyText: {
    fontSize: 14,
    color: '#999999',
  },
  bodyTextHighlight: {
    fontSize: 14,
    color: '#ff3333'
  },
  buttonContainer:{
    marginLeft: 20,
		marginRight: 20,
		marginBottom: 23,
    height: 43,
    alignItems: 'stretch',
    flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-around',
  },
  greyButton: {
    flex:1,
    backgroundColor: ColorConstants.STOCK_UNCHANGED_GRAY,
    alignItems: 'center',
		borderRadius: 5,
		justifyContent: 'center',
  },
  blueButton: {
    flex:1,
    backgroundColor: ColorConstants.TITLE_BLUE,
    marginLeft:12,
    alignItems: 'center',
  	borderRadius: 5,
		justifyContent: 'center',
  },
	buttonText: {
		color: 'white'
	}
});

module.exports = SuperPriorityHintPage;

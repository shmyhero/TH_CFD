/* @flow */

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

var content_image_1 = require("../../images/super_priority_icon_1.png")
var content_image_2 = require("../../images/super_priority_icon_2.png")
var content_image_3 = require("../../images/super_priority_icon_3.png")
var content_image_4 = require("../../images/super_priority_icon_4.png")
var top_image = require("../../images/super_priority_top.png")
var background_image = require("../../images/super_priority_bg.png")

var DIALOG_WIDTH = width - 30;
var NOT_LOGIN_DIALOG_HEIGHT = DIALOG_WIDTH /670 * 760;
var LOGIN_DIALOG_HEIGHT = DIALOG_WIDTH /670 * 514;
var HEADER_IMAGE_WIDTH = DIALOG_WIDTH;
var HEADER_IMAGE_HEIGHT = HEADER_IMAGE_WIDTH / 646 * 349;
var DIALOG_OFFSET = HEADER_IMAGE_HEIGHT / 2;
var BACKGROUD_LIGHT_HEIGHT = height / 3 * 2;

var SuperPriorityHintPage = React.createClass({
	propTypes: {
		getNavigator: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			getNavigator: ()=>{},
		}
	},

  getInitialState: function() {
    return {
      dialogVisible: false,
      fadeAnim: new Animated.Value(1),
    };
  },

  show: function() {
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
  },

	updateLastShow: function(){
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
	},

  hide: function() {
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
  },

  _goToLoginPage: function(){
		var navigator = this.props.getNavigator();
    navigator.push({
      name: MainPage.LOGIN_ROUTE,
    });
  },

	_goToCheckInPage: function(){
		TalkingdataModule.trackEvent(TalkingdataModule.CHECK_IN_ACTIVITY_EVENT);

		var navigator = this.props.getNavigator();
		navigator.push({
			name:MainPage.DAY_SIGN_ROUTE,
		});
	},

  renderRigisterLine: function(isLogin){
    if(!isLogin){
      return (
        <View style={styles.bodyRowContainer}>
          <View style={styles.bodyContent}>
            <Image resizeMode="contain" source={content_image_1} style={styles.bodyImage}/>
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bodyText}>
              注册送
              </Text>
              <Text style={styles.bodyTextHighlight}>
              10万
              </Text>
              <Text style={styles.bodyText}>
              体验金
              </Text>
            </View>
          </View>
          <View style={styles.bodyContent}>
            <Image resizeMode="contain" source={content_image_2} style={styles.bodyImage}/>
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bodyText}>
              注册送
              </Text>
              <Text style={styles.bodyTextHighlight}>
              20元
              </Text>
              <Text style={styles.bodyText}>
              交易金
              </Text>
            </View>
          </View>
        </View>)
    }
  },

  renderTradingLine: function(){
      //flex:1,
    return (
      <View style={styles.bodyRowContainer}>
        <View style={styles.bodyContent}>
          <Image resizeMode="contain" source={content_image_3} style={styles.bodyImage}/>
          <View style={styles.bodyTextContainer}>
            <Text style={styles.bodyText}>
            签到日送
            </Text>
            <Text style={styles.bodyTextHighlight}>
            0.5元
            </Text>
            <Text style={styles.bodyText}>
            交易金
            </Text>
          </View>
        </View>
        <View style={styles.bodyContent}>
          <Image resizeMode="contain" source={content_image_4} style={styles.bodyImage}/>
          <View style={styles.bodyTextContainer}>
            <Text style={styles.bodyText}>
            模拟交易日送
            </Text>
            <Text style={styles.bodyTextHighlight}>
            0.5元
            </Text>
            <Text style={styles.bodyText}>
            交易金
            </Text>
          </View>
        </View>
      </View>
    );
  },

	renderActionButton: function(isLogin){
		if(!isLogin){
			return (<TouchableOpacity style={styles.blueButton}
				onPress={() => {
					this.hide();
					this._goToLoginPage()
				}}>
				<Text style={styles.buttonText}>
					立即注册
				</Text>
			</TouchableOpacity>);
		}else{
			return (<TouchableOpacity style={styles.blueButton}
				onPress={() => {
					this.hide();
					this._goToCheckInPage()
				}}>
				<Text style={styles.buttonText}>
					签到
				</Text>
			</TouchableOpacity>);
		}
	},

  render: function() {
  	if(this.state.dialogVisible){
      var userData = LogicData.getUserData();
      var isLogin = Object.keys(userData).length != 0
      //notLogin = false
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
            <Image source={background_image} style={{position:'absolute', height:300, width: width }}/>
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
                      知道了
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
  },
});

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
    justifyContent: 'space-between',
		marginTop: HEADER_IMAGE_HEIGHT * 0.35,
    padding: 10,
	},
  bodyImage:{
    flex: 1,
		alignItems: 'center',
  },
  bodyRowContainer:{
    flexDirection: 'row',
    flex:1
  },
  bodyContent:{
    flex:1,
    alignItems:'center',
    paddingTop: 26,
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
	titleText:{
		fontWeight: 'bold',
		fontSize: 20,
		color: ColorConstants.TITLE_BLUE,
	},
	descriptionText:{
		marginTop: 12,
		fontSize: 18,
	},
  buttonContainer:{
    margin: 12,
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
		width: 151,
  },
  blueButton: {
    flex:1,
    backgroundColor: ColorConstants.TITLE_BLUE,
    marginLeft:12,
    alignItems: 'center',
  	borderRadius: 5,
		justifyContent: 'center',
		width: 151,
  },
	buttonText: {
		color: 'white'
	}
});

module.exports = SuperPriorityHintPage;

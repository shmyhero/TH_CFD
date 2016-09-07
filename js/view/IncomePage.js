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

var top_image = require("../../images/about_us.png")

var IncomePage = React.createClass({
  propTypes: {
    shareFunction: React.PropTypes.func,
  },

  getDefaultProps: function(){
    return {
      shareFunction: ()=>{}
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

  shareInfo: function(){
    if(this.props.shareFunction){
      //TODO: use real data.
  		var data = {
  			webpageUrl: NetConstants.SHARE_URL,
  			imageUrl: NetConstants.SHARE_LOGO_URL,
  			title: "模拟注册获得20元交易金",
  			description: "模拟注册可专区20元；每日签到可赚取0.5元；每日模拟交易可赚取0.5元。",
  		}
      this.props.shareFunction(data);
    }
  },

  render: function() {
    if(this.state.dialogVisible){
      //
      //style={{height: height, width: width, backgroundColor: '#fff'}}
      return (
        <Animated.View
          style={[styles.outsideContainer, {opacity: this.state.fadeAnim}]}
          >
          <TouchableOpacity style={styles.greyBackground}
            activeOpacity={1}
            onPress={() => {
              this.hide();
            }}>
            <TouchableOpacity style={styles.container}
              activeOpacity={1}
              onPress={() => {
              }}>
							<Image source={top_image} style={styles.image}/>
							<View style={styles.textContainer}>
	              <Text style={styles.titleText}>
									注册成功
	              </Text>
								<Text style={styles.descriptionText}>
									恭喜您获得了20元交易金
								</Text>
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
                <TouchableOpacity style={styles.blueButton}
                  onPress={() => {
                    this.hide();
                    this.shareInfo()
                  }}>
                  <Text style={styles.buttonText}>
                    炫耀一下
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      );
    }else{
      return (<View/>)
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
    padding:20,
		justifyContent: 'center'
  },
  container: {
    height: 200,
		borderRadius: 10,
    backgroundColor: 'white',

  },
	image:{
		marginTop: -30,
		height:100,
		marginLeft: 12,
		marginRight: 12
	},
	textContainer:{
		flex: 1,
		alignItems: 'center'
	},
	titleText:{
		fontWeight: 'bold',
		color: ColorConstants.TITLE_BLUE,
	},
	descriptionText:{
		marginTop: 24,
	},
  buttonContainer:{
    margin: 12,
    height: 36,
    flexDirection: 'row',
		alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  greyButton: {
    flex:1,
    backgroundColor: ColorConstants.STOCK_UNCHANGED_GRAY,
    alignItems: 'center',
		borderRadius: 5,
		justifyContent: 'center'
  },
  blueButton: {
    flex:1,
    backgroundColor: ColorConstants.TITLE_BLUE,
    marginLeft:12,
    alignItems: 'center',
  	borderRadius: 5,
		justifyContent: 'center'
  },
	buttonText: {
		color: 'white'
	}
});

module.exports = IncomePage;

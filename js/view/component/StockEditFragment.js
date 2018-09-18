'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import createReactClass from 'create-react-class';
import { View, Text, requireNativeComponent, Dimensions, StyleSheet, ViewPropTypes} from 'react-native';

var {height, width} = Dimensions.get('window')
var ColorConstants = require('../../ColorConstants')
// var TimerMixin = require('react-timer-mixin');
import TimerMixin from 'react-timer-mixin';
var flashButtonTimer = null;


var StockEditFragment = createReactClass({
    displayName: 'StockEditFragment',
    // mixins: [TimerMixin],

    propTypes: {
		...ViewPropTypes,
		onTapEditAlert: PropTypes.func,
		isLogin: PropTypes.bool,
		alertData: PropTypes.string,
		isActual: PropTypes.bool,
		isLanguageEn: PropTypes.bool,
	},

    getInitialState: function() {
		return {
			 currentIndex:1,
		};
	},

    getDefaultProps: function() {
		return {
		};
	},

    onTapAlertButton: function(event) {
		if (!this.props.onTapEditAlert) {
			return;
		}
		console.log("onTapAlert: " + event.nativeEvent.data);
		this.props.onTapEditAlert(event.nativeEvent.data);
	},

    onNativeRefresh(){

		this.refresh();
	},

    render() {
	  return (
			<View style = {styles.wrapper}>
				<StockEditFragmentNative style = {styles.wrapper} {...this.props}
					onTapAlertButton={this.onTapAlertButton}
					onNativeRefresh={this.onNativeRefresh}
					/>
				<Text style = {{fontSize:1}}> currentIndex =  {this.state.currentIndex} </Text>
			</View>
		);
	},

    //接受到Native事件后主动刷新UI，是解决Android端一个listView不刷新的bug，貌似跟RN线程有关。
    refresh:function(){
		if(flashButtonTimer !== null) {
			this.clearInterval(flashButtonTimer)
		}

		flashButtonTimer = this.setInterval(
			() => {
				 this.forceUpdate();
				 console.log("refresh for forceUpdate");
				 this.setState({
					 currentIndex : this.state.currentIndex + 1,
				 })

				 if(flashButtonTimer !== null) {
		 			this.clearInterval(flashButtonTimer)
		 		}
			},
			10
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width ,
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
});

var StockEditFragmentNative = requireNativeComponent('StockEditFragment', StockEditFragment)

module.exports = StockEditFragment;

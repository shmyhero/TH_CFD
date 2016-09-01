'use strict';

import React from 'react';
import {View,Text,requireNativeComponent,Dimensions,StyleSheet} from 'react-native';

var {height, width} = Dimensions.get('window')
var ColorConstants = require('../../ColorConstants')
var TimerMixin = require('react-timer-mixin');
var flashButtonTimer = null;


var StockEditFragment = React.createClass ({
	mixins: [TimerMixin],

	propTypes: {
		...View.propTypes,
		onTapEditAlert: React.PropTypes.func,
	},

	getInitialState: function() {
		return {
			 currentIndex:1,
		};
	},


	getDefaultProps(): Object {
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
				<StockEditFragmentNative style = {styles.wrapper} {...this.props} onTapAlertButton={this.onTapAlertButton} onNativeRefresh={this.onNativeRefresh}/>
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
	}



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

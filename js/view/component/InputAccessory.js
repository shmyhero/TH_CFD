'use strict';

import React, {
	View,
	DeviceEventEmitter,
	Dimensions,
	TouchableOpacity,
	LayoutAnimation,
	StyleSheet,
	Text,
	Platform,
}
from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
var INPUT_ACCESSORY_HEIGHT = 40;

var InputAccessory = React.createClass({
	getInitialState: function() {
		return {
			visibleHeight: Dimensions.get('window').height,
			opacity: 0,
			validValue: 0, //0, ok; 1, too less; 2, too much
		};
	},

	propTypes: {
		textValue: React.PropTypes.string,
		maxValue: React.PropTypes.number,
		rightButtonOnClick: React.PropTypes.func,	// use to clear text when error occured.
	},

	//For some reason, this gives warnings?
	componentWillMount() {
		if (Platform.OS === 'ios') {
			DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardDidShow)
			DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardDidHide)
		}
		else {
			DeviceEventEmitter.addListener('keyboardDidShow', this.keyboardDidShow)
			DeviceEventEmitter.addListener('keyboardDidHide', this.keyboardDidHide)
		}
	},

	componentWillUnmount() {
		let newSize = Dimensions.get('window').height
		this.setState({
				visibleHeight: newSize,
				hideKA: true,
				opacity: 0
			})
		// dismissKeyboardHandler();
		if (Platform.OS === 'ios') {
			DeviceEventEmitter.removeAllListeners('keyboardWillShow');
			DeviceEventEmitter.removeAllListeners('keyboardWillHide');
		}
		else {
			DeviceEventEmitter.removeAllListeners('keyboardDidShow');
			DeviceEventEmitter.removeAllListeners('keyboardDidHide');
		}
	},

	keyboardDidShow(e) {
		var newSize = e.endCoordinates.screenY - (INPUT_ACCESSORY_HEIGHT - 1); //-1 so 1px is showing so it doesn't unmount

		if (Platform.OS === 'ios') {
			LayoutAnimation.configureNext({
				duration: 200,
				create: {
					type: LayoutAnimation.Types.linear,
					property: LayoutAnimation.Properties.scaleXY
				},
				update: {
					type: LayoutAnimation.Types.linear,
					property: LayoutAnimation.Properties.scaleXY
				},
			});
		}
		this.setState({
			visibleHeight: newSize,
			hideKA: false,
			opacity: 1,
			validValue: 0,
		})
	},

	rotateDevice: function() {
		return false;
	},

	keyboardDidHide(e) {
		let newSize = Dimensions.get('window').height
		this.setState({
			visibleHeight: Dimensions.get('window').height,
			hideKA: true,
			opacity: 0,
		})
	},

	dismissKeyboardHandler: function() {
		var value = parseInt(this.props.textValue)
		if (value < 10) {
			this.setState({
				validValue: 1
			})
			return
		}
		if (value > this.props.maxValue) {
			this.setState({
				validValue: 2
			})
			this.props.rightButtonOnClick()
			return
		}

		LayoutAnimation.configureNext({
			duration: 100,
			create: {
				type: LayoutAnimation.Types.linear,
				property: LayoutAnimation.Properties.scaleXY,
			},
			update: {
				type: LayoutAnimation.Types.linear,
				property: LayoutAnimation.Properties.scaleXY,
			},
		});

		let newSize = Dimensions.get('window').height
		this.setState({
				visibleHeight: newSize,
				hideKA: true,
				opacity: 0,
			})
		dismissKeyboard();
	},

	resetValidState: function() {
		this.setState({
			validValue: 0
		})
	},

	render: function() {

		var warningText = <View />
		if (this.state.validValue===1) {
			warningText = <Text style = {[s.InputAccessoryNoticeText]}>最低金额10美元！ </Text>
		} else if (this.state.validValue===2) {
			warningText = <Text style = {[s.InputAccessoryNoticeText]}>剩余资金不足! </Text>
		}


		var styleOfPosition = {
			top: this.state.visibleHeight - 1
		}
		if (Platform.OS === 'android') {
			styleOfPosition = {
				bottom: 0
			}
		}

		return ( <View style = {[s.InputAccessory, {opacity: this.state.opacity}, styleOfPosition]}
					onLayout = {(e) => this.rotateDevice(e)} >
					<Text numberOfLines={1} style = {[s.InputAccessoryLabelText]} >
					{this.props.textValue}
					</Text>
					{warningText}
					<TouchableOpacity onPress = {() => this.dismissKeyboardHandler()} >
						<Text style = {[s.InputAccessoryButtonText]} >完成 </Text>
					</TouchableOpacity>
				</View>)
	}
});

var s = StyleSheet.create({
	InputAccessory: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ededed',
		height: INPUT_ACCESSORY_HEIGHT,
		position: 'absolute',
		left: 0,
		right: 0,
	},
	InputAccessoryLabelText: {
		flex: 2,
		fontSize: 26,
		color: 'black',
		marginLeft: 15,
	},
	InputAccessoryNoticeText: {
		flex: 4,
		fontSize: 17,
		color: '#f23719',
	},
	InputAccessoryButtonText: {
		flex: 1,
		fontSize: 21,
		color: '#1b5ecd',
		paddingHorizontal: 9,
		textAlign: 'center',
	},
});

module.exports = InputAccessory

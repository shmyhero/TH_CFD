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
			validValue: true,
		};
	},

	propTypes: {
		textValue: React.PropTypes.string,
	},

	//For some reason, this gives warnings?
	componentWillMount() {
		DeviceEventEmitter.addListener('keyboardDidShow', this.keyboardDidShow)
		DeviceEventEmitter.addListener('keyboardDidHide', this.keyboardDidHide)
	},

	componentWillUnmount() {
		// console.log('componentWillUnmount');
		let newSize = Dimensions.get('window').height
		this.setState({
				visibleHeight: newSize,
				hideKA: true,
				opacity: 0
			})
			// dismissKeyboardHandler();
		DeviceEventEmitter.removeAllListeners('keyboardDidShow');
		DeviceEventEmitter.removeAllListeners('keyboardDidHide');
	},

	keyboardDidShow(e) {
		var newSize = e.endCoordinates.screenY - (INPUT_ACCESSORY_HEIGHT - 1); //-1 so 1px is showing so it doesn't unmount

		this.setState({
			visibleHeight: newSize,
			hideKA: false,
			opacity: 1,
			validValue: true,
		})
	},

	rotateDevice: function() {
		return false;
	},

	keyboardDidHide(e) {
		// console.log('keyboardWillHide');
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
				validValue: false
			})
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
			// console.log('dismissKeyboard',dismissKeyboard());
		dismissKeyboard();
	},

	render: function() {

		var warningText = this.state.validValue ?
			< View / > :
			< Text style = {
				[s.InputAccessoryNoticeText]
			} >
			最低金额10美元！ < /Text> 

		var styleOfPosition = {
			top: this.state.visibleHeight - 1
		}
		if (Platform.OS === 'android') {
			styleOfPosition = {
				bottom: 0
			}
		}

		return ( < View style = {
					[s.InputAccessory, {
						opacity: this.state.opacity
					}, styleOfPosition]
				}
				onLayout = {
					(e) => this.rotateDevice(e)
				} >
				< Text style = {
					[s.InputAccessoryLabelText]
				} > {
					this.props.textValue
				} < /Text> {
				warningText
			} < TouchableOpacity onPress = {
				() => this.dismissKeyboardHandler()
			} >
			< Text style = {
				[s.InputAccessoryButtonText]
			} >
			完成 < /Text> < /TouchableOpacity > < /View >
	)
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
		paddingLeft: 20,
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
		paddingVertical: 9,
		textAlign: 'center',
	},
});

module.exports = InputAccessory
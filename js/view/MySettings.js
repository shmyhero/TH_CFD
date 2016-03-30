'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	Image,
	Switch,
	TouchableHighlight,
} = React;

var WheelCurvedPicker = require('./component/WheelPicker/WheelCurvedPicker')

var MySettings = React.createClass({

	getInitialState: function() {
		return {
			trueSwitchIsOn: true,
		};
	},

	quitOnClick: function() {
		this.props.navigator.replace({
			name: 'login'
		});
	},

	render: function() {
		return (
			<View style={styles.wrapper}>

				<WheelCurvedPicker style={{flex: 1, width: 200,}}/>

			</View>
		);
	}
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,

		alignItems: 'center',
	},

	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		marginLeft: 10,
		borderColor: '#d0d0d0'
	},

	lineSicker: {
		alignSelf: 'stretch',
		height: 15,
		backgroundColor: '#efefef'
	},

	rowContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'space-between',
	},

	rowText: {
		fontSize: 14,
		textAlign: 'center',
	},

	rowImage: {
		width: 15,
		height: 15,
		resizeMode: Image.resizeMode.contain,
	},

	quitContainer: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'center',
	},

	quitText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#ff0000'
	},
});

module.exports = MySettings;
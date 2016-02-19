'use strict';

var React = require('react-native');
var {
	AppRegistry,
	StyleSheet,
	ListView,
	Text,
	Image,
	View,
	TouchableHighlight,
} = React;
var LogicData = require('../LogicData')


var WechatLoginConfirmPage = React.createClass({
	getInitialState: function() {
		return {
			userData: LogicData.getWechatUserData()
		};
	},

	render: function() {
		return (
			<View style={styles.wrapper}>

				<Image
					style={styles.logo}
					source={{uri: this.state.userData.headimgurl}} />

				<Text style={styles.displayName}>
					{this.state.userData.nickname}
				</Text>

			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
	},
	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},
	logo: {
		width: 60,
		height: 60,
		backgroundColor: '#eaeaea',
		marginRight: 10,
	},
	displayName: {
		fontSize: 15,
		textAlign: 'center',
		fontWeight: 'bold',
	},
});

module.exports = WechatLoginConfirmPage;
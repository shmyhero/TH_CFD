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
			wechatData: LogicData.getWechatUserData(),
			userData: LogicData.getUserData(),
		};
	},

	render: function() {
		return (
			<View style={styles.wrapper}>

				<Image
					style={styles.logo}
					source={{uri: this.state.wechatData.headimgurl}} />

				<Text style={styles.displayName}>
					{this.state.wechatData.nickname}
				</Text>

				<Text style={styles.userId}>
					UserId: {this.state.userData.userId}
				</Text>

				<Text style={styles.token}>
					Token: {this.state.userData.token}
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
	userId: {
		fontSize: 15,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	token: {
		fontSize: 15,
		textAlign: 'center',
		fontWeight: 'bold',
	},
});

module.exports = WechatLoginConfirmPage;
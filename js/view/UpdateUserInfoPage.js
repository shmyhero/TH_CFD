'use strict'

import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Dimensions,
	TextInput,
	Alert,
} from 'react-native';

var Button = require('./component/Button')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var NetworkModule = require('../module/NetworkModule')

var rowHeight = 40;
var fontSize = 16;

var originalName = null;

var NOTE_STATE_NORMAL = 0;
var NOTE_STATE_NORMAL_WECHAT = 1;

var UpdateUserInfoPage = React.createClass({
	propTypes: {
		popToRoute: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			popToRoute: null,
		}
	},

	getInitialState: function() {
		return {
			noteState: NOTE_STATE_NORMAL,
			nickName: '',
			saveButtonEnabled: false,
		};
	},

	componentDidMount: function() {
		if (LogicData.getWechatUserData().nickname !== undefined) {
			this.setState({
				noteState: NOTE_STATE_NORMAL_WECHAT,
			})
		}

		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrl(
			NetConstants.GET_USER_INFO_API,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
				originalName = responseJson.nickname
				this.setState({
					nickName: originalName ,
					saveButtonEnabled: true
				});
			}.bind(this),
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
			}
		)
	},

	setUserName: function(name) {
		this.setState({
			nickName: name
		})

		var buttonEnabled = false
		if (name.length > 0) {
			buttonEnabled = true
		}
		this.setState({
			saveButtonEnabled: buttonEnabled
		})
	},

	savePressed: function() {
		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrl(
			NetConstants.SET_USER_NICKNAME_API + '?' + NetConstants.PARAMETER_NICKNAME + '=' + this.state.nickName,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			function(responseJson) {
				if(this.props.popToRoute != null){
					var routes = this.props.navigator.getCurrentRoutes();
					var backRoute = null;

					for (var i=0; i<routes.length; ++i) {
						if(routes[i].name === this.props.popToRoute){
							backRoute = routes[i];
							break;
						}
					}

					if(backRoute!=null){
						this.props.navigator.popToRoute(backRoute)
					}else{
						this.props.navigator.pop()
					}
				}else{
					this.props.navigator.pop()
				}
			}.bind(this),
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
			}
		)
	},

	renderNotes: function() {
		if (this.state.noteState == NOTE_STATE_NORMAL) {
			return (
				<View style={styles.noteView}>
					<Text style={styles.noteText}>
						请设置一个您喜欢的昵称！
					</Text>
				</View>
			);
		} else if(this.state.noteState == NOTE_STATE_NORMAL_WECHAT) {
			return (
				<View style={styles.noteView}>
					<Text style={styles.noteText}>
						微信昵称将作为您的昵称，你也可以修改！
					</Text>
				</View>
			);
		}
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View style={[styles.wrapper, {height: height}]}>

				<View style={styles.upperContainer}>

					<View style={styles.rowWrapperWithBorder}>
						<View style={styles.nickNameTextView}>
							<Text style={styles.nickNameText}>
								昵称
							</Text>
						</View>

						<TextInput style={styles.nickNameInput}
							autoFocus={true}
							onChangeText={(text) => this.setUserName(text)}
							underlineColorAndroid='#ffffff'
							value={this.state.nickName}/>
					</View>

					{this.renderNotes()}

					<View style={styles.rowWrapper}>
						<Button style={styles.saveClickableArea}
							enabled={this.state.saveButtonEnabled}
							onPress={this.savePressed}
							textContainerStyle={styles.saveTextView}
							textStyle={styles.saveText}
							text='保存' />
					</View>

				</View>

				<View style={styles.lowerContainer}>

				</View>

			</View>
		)
	},

});

var styles = StyleSheet.create({

	upperContainer: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'center',
	},
	lowerContainer: {
		flex: 3,
		alignItems: 'stretch',
	},
	rowWrapperWithBorder: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 10,
		marginRight: 10,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: ColorConstants.TITLE_BLUE,
		backgroundColor: '#ffffff',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingTop: 10,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
	},
	nickNameTextView: {
		flex: 1,
		height: rowHeight,
		justifyContent: 'center',
	},
	nickNameText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#c7c7cd',
	},
	nickNameInput: {
		flex: 4,
		height: rowHeight,
		fontSize: fontSize,
		paddingLeft: 10,
	},
	saveClickableArea: {
		flex: 1,
		alignSelf: 'center',
	},
	saveTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	saveText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
	noteView: {
		alignSelf: 'flex-start',
		marginLeft: 10,
		marginTop: 10,
	},
	noteText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#c7c7cd',
	},
});

module.exports = UpdateUserInfoPage

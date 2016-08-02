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

var Button = require('../component/Button')
var ColorConstants = require('../../ColorConstants')
var NetConstants = require('../../NetConstants')
var LogicData = require('../../LogicData')
var MainPage = require('../MainPage')
var NetworkModule = require('../../module/NetworkModule')
var TalkingdataModule = require('../module/TalkingdataModule')

var rowHeight = 40;
var fontSize = 16;

var originalName = null;

var NOTE_STATE_NORMAL = 0;
var NOTE_STATE_NORMAL_WECHAT = 1;

var OALiveUpdateUserInfoPage = React.createClass({

	getInitialState: function() {
		return {
			noteState: NOTE_STATE_NORMAL,
			nickName: '',
			password1: '',
			password2: '',
			saveButtonEnabled: false,
			nicknameBorderColor: ColorConstants.TITLE_DARK_BLUE,
			password1BorderColor: ColorConstants.DISABLED_GREY,
			password2BorderColor: ColorConstants.DISABLED_GREY,
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
					saveButtonEnabled: false,
				});
			}.bind(this),
			function(errorMessage) {
				Alert.alert('提示',errorMessage);
			}
		)
	},

	onNickNameFocus: function() {
		this.setState({
			nicknameBorderColor: ColorConstants.TITLE_DARK_BLUE,
			password1BorderColor: ColorConstants.DISABLED_GREY,
			password2BorderColor: ColorConstants.DISABLED_GREY,
		})
	},

	onPassword1Focus: function() {
		this.setState({
			nicknameBorderColor: ColorConstants.DISABLED_GREY,
			password1BorderColor: ColorConstants.TITLE_DARK_BLUE,
			password2BorderColor: ColorConstants.DISABLED_GREY,
		})
	},

	onPassword2Focus: function() {
		this.setState({
			nicknameBorderColor: ColorConstants.DISABLED_GREY,
			password1BorderColor: ColorConstants.DISABLED_GREY,
			password2BorderColor: ColorConstants.TITLE_DARK_BLUE,
		})
	},

	setUserName: function(name) {
		this.setState({
			nickName: name
		})

		this.checkInfoValid()
	},

	setPassword1: function(password) {
		this.setState({
			password1: password
		})

		this.checkInfoValid()
	},

	setPassword2: function(password) {
		this.setState({
			password2: password
		})

		this.checkInfoValid()
	},

	checkInfoValid: function() {
		var buttonEnabled = true
		if (this.state.nickName.length <= 0 || this.state.password1.length < 8 || this.state.password2.length < 8) {
			buttonEnabled = false
		} else if (this.state.password1 != this.state.password2) {
			buttonEnabled = false
		}

		this.setState({
			saveButtonEnabled: buttonEnabled
		})
	},

	savePressed: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_REGISTER_EVENT)

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
				this.props.navigator.replace({
					name: MainPage.LIVE_REGISTER_STATUS_ROUTE,
				});
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

					<View style={[styles.rowWrapperWithBorder, {borderColor: this.state.nicknameBorderColor}]}>
						<View style={styles.nickNameTextView}>
							<Text style={styles.nickNameText}>
								昵称
							</Text>
						</View>

						<TextInput style={styles.nickNameInput}
							autoFocus={true}
							onFocus={this.onNickNameFocus}
							onChangeText={(text) => this.setUserName(text)}
							underlineColorAndroid='#ffffff'
							value={this.state.nickName}/>
					</View>

					{this.renderNotes()}

					<View style={[styles.rowWrapperWithBorder, {marginTop: 10, borderColor: this.state.password1BorderColor}]}>
						<View style={styles.passwordTextView}>
							<Text style={styles.passwordText}>
								登录密码
							</Text>
						</View>

						<TextInput style={styles.passwordInput}
							onChangeText={(text) => this.setPassword1(text)}
							onFocus={this.onPassword1Focus}
							underlineColorAndroid='#ffffff'
							secureTextEntry={true}
							placeholder='8位以上数字字母组合'
							value={this.state.password1}/>
					</View>

					<View style={[styles.rowWrapperWithBorder, {marginTop: 10, borderColor: this.state.password2BorderColor}]}>
						<View style={styles.passwordTextView}>
							<Text style={styles.passwordText}>
								确认密码
							</Text>
						</View>

						<TextInput style={styles.passwordInput}
							onChangeText={(text) => this.setPassword2(text)}
							onFocus={this.onPassword2Focus}
							underlineColorAndroid='#ffffff'
							secureTextEntry={true}
							placeholder='确认密码'
							value={this.state.password2}/>
					</View>

					<View style={styles.rowWrapper}>
						<Button style={styles.saveClickableArea}
							enabled={this.state.saveButtonEnabled}
							onPress={this.savePressed}
							textContainerStyle={styles.saveTextView}
							textStyle={styles.saveText}
							text='保存' />
					</View>

				</View>
			</View>
		)
	},

});

var styles = StyleSheet.create({

	upperContainer: {
		marginTop: 20,
		alignItems: 'stretch',
		justifyContent: 'center',
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
		borderColor: ColorConstants.TITLE_DARK_BLUE,
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
	passwordTextView: {
		flex: 1,
		height: rowHeight,
		justifyContent: 'center',
	},
	passwordText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: 'black',
	},
	passwordInput: {
		flex: 3,
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
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
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

module.exports = OALiveUpdateUserInfoPage

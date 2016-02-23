'use strict'

var React = require('react-native')
var {
	StyleSheet,
	Platform,
	View,
	TextInput,
	Text,
	TouchableHighlight,
	Alert,
	Dimensions,
	Image,
} = React;
var LogicData = require('../LogicData')
var MyHomePage = require('./MyHomePage')
var LoadingIndicator = require('./LoadingIndicator')
var ColorConstants = require('../ColorConstants')

var requestSuccess = true;
const API = 'https://cn1.api.tradehero.mobi/api/'

var rowHeight = 40;
var fontSize = 16;

var LoginPage = React.createClass({
	getInitialState: function() {
		return {
			phoneNumber: '',
			validationCode: '',
			animating: false,
			phoneNumberBorderColor: ColorConstants.TITLE_BLUE,
			validationCodeBorderColor: ColorConstants.DISABLED_GREY,
		};
	},

	setPhoneNumber: function(text: string) {
		this.setState({
			phoneNumber: text
		})
	},

	setValidationCode: function(text: string) {
		this.setState({
			validationCode: text
		})
	},

	phoneNumberOnFocus: function() {
		this.setState({
			phoneNumberBorderColor: ColorConstants.TITLE_BLUE,
			validationCodeBorderColor: ColorConstants.DISABLED_GREY,
		})
	},

	validationCodeOnFocus: function() {
		this.setState({
			phoneNumberBorderColor: ColorConstants.DISABLED_GREY,
			validationCodeBorderColor: ColorConstants.TITLE_BLUE,
		})
	},

	getValidationCodePressed: function() {

	},

	loginPressed: function() {

		if (this.state.userName === '') {
			this.state.userName = '13816631019';
		}
		if (this.state.password === '') {
			this.state.password = '1111111';
		}

		this.setState({
			animating: true
		});

		LogicData.setUserSecretKey(this.state.userName, this.state.password)
		fetch('https://cn1.api.tradehero.mobi/api/signupAndLogin', {
			method: 'POST',
			headers: {
				'Authorization': LogicData.getUserSecretKey(),
				'TH-Client-Version': '4.2.0.10068',
				'TH-Language-Code': 'zh-CN',
				'TH-Client-Type': 6,
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify({
				device_access_token: '865624026741091',
				clientType: 6,
				clientVersion: '4.2.0.10068',
				deviceToken: ' ',
				channelType: 1,
				isEmailLogin: true
		    })
		})
		.then((response) => {
			console.log(response)
			if (response.status === 200) {
				console.log('success')
				requestSuccess = true;
			} else {
				console.log('failed')
				requestSuccess = false;
			}
			
			this.setState({
				animating: false
			});

			return response.json()
		})
		.then((responseJson) => {
			if (requestSuccess) {
				this.loginSuccess(responseJson);
			} else {
				Alert.alert('提示',responseJson.Message);
			}
		});
	},

	loginSuccess: function(userData) {
		LogicData.setUserData(userData);
		console.log(LogicData.getUserData());

		this.props.navigator.replace({
			name: 'myhome',
		});
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View style={[styles.wrapper, {height: height}]}>

				<View style={styles.phoneLoginContainer}>
					<View style={styles.rowWrapper}>
						<View style={[styles.phoneNumberInputView, {borderColor: this.state.phoneNumberBorderColor}]}>
							<TextInput style={styles.phoneNumberInput}
								autoFocus={true}
								onFocus={() => this.phoneNumberOnFocus()}
								onChangeText={(text) => this.setPhoneNumber(text)}
								placeholder='手机号'
								underlineColorAndroid='#ffffff'/>
						</View>
						
						<TouchableHighlight style={styles.getValidationCodeArea}
							onPress={this.getValidationCodePressed}>
							<View style={styles.getValidationTextView}>
								<Text style={styles.getValidationText}>
									验证
								</Text>
							</View>
							
						</TouchableHighlight>
					</View>

					<View style={styles.rowWrapper}>
						<View style={[styles.validationCodeInputView, {borderColor: this.state.validationCodeBorderColor}]}>
							<TextInput style={styles.validationCodeInput}
								onFocus={() => this.validationCodeOnFocus()}
								onChangeText={(text) => this.setValidationCode(text)}
								placeholder='验证码' 
								underlineColorAndroid='#ffffff'/>
						</View>
						
					</View>

					<View style={styles.rowWrapper}>
						<TouchableHighlight style={styles.loginClickableArea}
							onPress={this.loginPressed}>
							<View style={styles.loginTextView}>
								<Text style={styles.loginText}>
									登录
								</Text>
							</View>
						</TouchableHighlight>
					</View>
				</View>

				<View style={styles.fastLoginContainer}>
					<View style={styles.fastLoginRowWrapper}>
						<View style={styles.line}/>
						<Text style={styles.fastLoginTitle}>
							快速登录
						</Text>
						<View style={styles.line}/>
					</View>

					<TouchableHighlight style={styles.wechatClickableArea}
						onPress={this.wechatPressed}>
						<View>
							<Image 
								style={styles.wechatIcon} 
								source={require('../../images/wechat_icon.png')}/>
							<Text style={styles.wechatTitle}>
								微信
							</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>				
		)
	}
})

var styles = StyleSheet.create({
	wrapper: {
		alignSelf: 'stretch',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	phoneLoginContainer: {
		flex: 2,
		paddingTop: 20,
		alignItems: 'stretch',
	},
	fastLoginContainer: {
		flex: 1,
		alignItems: 'stretch',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'space-around',
	},
	phoneNumberInputView: {
		flex: 3,
		borderWidth: 1,
		borderRadius: 3,
		marginRight: 10,
		backgroundColor: '#ffffff',
	},
	phoneNumberInput: {
		height: rowHeight,
		fontSize: fontSize,
		paddingLeft: 10,
	},
	getValidationCodeArea: {
		flex: 1,
		borderRadius: 3,
		height: rowHeight,
	},
	getValidationTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	getValidationText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
	validationCodeInputView: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 3,
		backgroundColor: '#ffffff',
	},
	validationCodeInput: {
		height: 40,
		fontSize: fontSize,
		paddingLeft: 10,
	},
	loginClickableArea: {
		flex: 1,
		alignSelf: 'center',
	},
	loginTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	loginText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},

	fastLoginRowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'space-around',
	},
	line: {
		flex: 1,
		marginLeft: 5,
		marginRight: 5,
		borderWidth: 0.5,
		borderColor: ColorConstants.DISABLED_GREY,
	},
	fastLoginTitle: {
		fontSize: 14,
		textAlign: 'center',
		color: '#9c9c9c',
	},
	wechatClickableArea: {
		marginTop: 15,
		alignSelf: 'center',
		borderRadius: 3,
	},
	wechatIcon: {
		width: 39,
		height: 39,
	},
	wechatTitle: {
		fontSize: 12,
		height: 15,
		lineHeight: 15,
		textAlign: 'center',
		color: '#9c9c9c',
		alignSelf: 'center',
	},
})


module.exports = LoginPage;
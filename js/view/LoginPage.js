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
} = React;
var LogicData = require('../LogicData')
var MyHomePage = require('./MyHomePage')
var LoadingIndicator = require('./LoadingIndicator')

var requestSuccess = true;
const API = 'https://cn1.api.tradehero.mobi/api/'

var LoginPage = React.createClass({
	getInitialState: function() {
		return {
			userName: '',
			password: '',
			animating: false,
		};
	},

	setUserName: function(text: string) {
		this.setState({
			userName: text
		})
	},

	setPassword: function(text: string) {
		this.setState({
			password: text
		})
	},

	loginPress: function() {

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

	forgetPasswordClicked: function() {

	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		var line = <View style={styles.line}/>;
		if (Platform.OS === 'android') {
			line = <View />;
		}
		return (
			<View>
				<View style={[styles.wrapper, {height: height / 2.5}]}>
					<View>
						<View style={styles.rowWrapper}>
							<Text style={styles.textInputLabel}>
								用户名：
							</Text>
							<TextInput style={styles.textInput} 
								onChangeText={(text) => this.setUserName(text)}
								placeholder='请输入用户名'
							/>
						</View>

						{line}

						<View style={styles.rowWrapper}>
							<Text style={styles.textInputLabel}>
								密码：
							</Text>
							<TextInput style={styles.textInput} 
								onChangeText={(text) => this.setPassword(text)}
								placeholder='请输入密码'
								secureTextEntry={true}
							/>
						</View>

						<TouchableHighlight
							style={styles.forgetPasswordCliableArea}
							onPress={this.forgetPasswordClicked}
							underlayColor='#d0d0d0'>
							<Text style={styles.forgetPasswordLabel}>
								忘记密码？
							</Text>
						</TouchableHighlight>
					</View>

					<TouchableHighlight style={styles.loginClickableArea}
						onPress={this.loginPress}>
						<Text style={styles.loginText}>
							登录
						</Text>
					</TouchableHighlight>

				</View>

				{this.state.animating ? 
					<LoadingIndicator animating={this.state.animating}/> :
					<View/>}
			</View>				
		)
	}
})

var styles = StyleSheet.create({
	wrapper: {
		alignSelf: 'stretch',
		alignItems: 'stretch',
		justifyContent: 'space-around',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		justifyContent: 'space-around',
		backgroundColor: '#ffffff',
	},
	line: {
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},
	textInputLabel: {
		flex: 1,
		fontSize: 12,
		textAlign: 'center',
	},
	textInput: {
		flex: 2,
		height: 30,
		fontSize: 12,
	},
	loginClickableArea: {
		alignSelf: 'center',
	},
	loginText: {
		fontSize: 20,
		width: 200,
		height: 30,
		lineHeight: 25,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: '#1789d5',
	},
	forgetPasswordCliableArea: {
		alignSelf: 'flex-start',
		marginTop: 15,
		marginLeft: 10,
	},
	forgetPasswordLabel: {
		color: "#1789d5",
	},
	progressView: {
		marginTop: 20,
	}
})


module.exports = LoginPage;
'use strict'

import React from 'react';
import {
	StyleSheet,
	Platform,
	View,
	TextInput,
	Text,
	TouchableOpacity,
	Alert,
	Dimensions,
	Image,
	ScrollView,
	TouchableWithoutFeedback,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
var TimerMixin = require('react-timer-mixin');

var LogicData = require('../LogicData')
var MyHomePage = require('./MyHomePage')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')
var LoadingIndicator = require('./LoadingIndicator')
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var NetConstants = require('../NetConstants')
var WechatModule = require('../module/WechatModule')
var WebSocketModule = require('../module/WebSocketModule')
var MainPage = require('./MainPage')
var dismissKeyboard = require('dismissKeyboard');
var TalkingdataModule = require('../module/TalkingdataModule')
//var TongDaoModule = require('../module/TongDaoModule')
var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var AppNavigator = require('../../AppNavigator')

var {height, width} = Dimensions.get('window')
var rowHeight = 40;
var fontSize = 16;
var MAX_ValidationCodeCountdown = 60

const TAB_LIVE = 1
const TAB_SIMULATOR = 2
var last_pressed_login = new Date().getTime();

var LoginPage = React.createClass({
	mixins: [TimerMixin],

	propTypes: {
		showCancelButton: React.PropTypes.bool,
		popToRoute: React.PropTypes.string,
		nextRoute: React.PropTypes.object,
		onPopToRoute: React.PropTypes.func,
		showRegisterSuccessDialog: React.PropTypes.func,
		isTabbarShown: React.PropTypes.func,
		isMobileBinding: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			showCancelButton: false,
			popToRoute: null,
			nextRoute: null,
			onPopToRoute: ()=>{},
			showRegisterSuccessDialog: ()=>{},
			isTabbarShown: ()=>{},
			isMobileBinding: false,
		}
	},

	componentWillMount: function() {
		var isTabbarShown = this.props.isTabbarShown();
		if(!isTabbarShown){
			this.setState({
				quickLoginBottomMargin: 15,
			})
		}
		WechatModule.isWechatInstalled()
		.then((installed) => {
			this.setState({
				wechatInstalled: installed,
			})
		})
	},

	getInitialState: function() {
		return {
			tabSelected: TAB_SIMULATOR,
			wechatInstalled: false,
			phoneNumber: '',
			validationCode: '',
			validationCodeCountdown: -1,
			animating: false,
			getValidationCodeButtonEnabled: false,
			phoneLoginButtonEnabled: false,
			liveLoginRememberUserName: true,
			quickLoginBottomMargin: 70,
			isWorking: false,
		};
	},

	checkButtonsEnable: function(phoneNumber, validationCode) {
		this.setState({
			getValidationCodeButtonEnabled: (phoneNumber.length === 11 && this.state.validationCodeCountdown < 0),
			phoneLoginButtonEnabled: (phoneNumber.length === 11 && validationCode.length === 4),
		})
	},

	setPhoneNumber: function(text: string) {
		this.setState({
			phoneNumber: text
		})

		this.checkButtonsEnable(text, this.state.validationCode)
	},

	setValidationCode: function(text: string) {
		this.setState({
			validationCode: text
		})

		this.checkButtonsEnable(this.state.phoneNumber, text)
	},

	getValidationCodePressed: function() {
		if (! this.state.getValidationCodeButtonEnabled) {
			return
		}

		this.setState({
			getValidationCodeButtonEnabled: false,
		});

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_PHONE_CODE_API + '?' + NetConstants.PARAMETER_PHONE + "=" + this.state.phoneNumber,
			{
				method: 'POST',
			},
			(responseJson) => {
				// Nothing to do.
				this.setState({
					validationCodeCountdown: MAX_ValidationCodeCountdown,
					getValidationCodeButtonEnabled: false
				})

				var timer = this.setInterval(
					() => {
						var currentCountDown = this.state.validationCodeCountdown

						if (currentCountDown > 0) {
							this.setState({
								validationCodeCountdown: this.state.validationCodeCountdown - 1
							})
						} else {

							if (this.state.phoneNumber.length == 11) {
								this.setState({
									getValidationCodeButtonEnabled: true,
									validationCodeCountdown: -1
								})
							}
							this.clearInterval(timer)
						}
					},
					1000
				);
			},
			(result) => {
				this.setState({
					getValidationCodeButtonEnabled: true,
				});

				Alert.alert('提示', result.errorMessage);
			}
		)
	},

	wechatPressed: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.SIMULATOR_WECHAT_LOGIN_EVENT);
		WechatModule.wechatLogin(
			() => {
				this.wechatLogin()
			},
			() => {}
		)
	},

	getCurrentTime:function(){
		return new Date().getTime();
	},

	isBlockedButton:function(){
		if(this.getCurrentTime() - last_pressed_login  > 2000){
			last_pressed_login = this.getCurrentTime();
			console.log('isBolcked = false');
			return false;
		}else{
			console.log('isBolcked = true');
			return true;
		}
	},

	wechatLogin: function() {
		var wechatUserData = LogicData.getWechatUserData()

		if(this.isBlockedButton()){
			return
		}

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.WECHAT_LOGIN_API,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					openid: wechatUserData.openid,
					unionid: wechatUserData.unionid,
					nickname: wechatUserData.nickname,
					headimgurl: wechatUserData.headimgurl,
				}),
				showLoading: true,
			},
			(responseJson) => {
				this.loginSuccess(responseJson);
			},
			(result) => {
				Alert.alert('提示', result.errorMessage);
			}
		)
	},

	loginWithPasswordPressed: function() {
		if(this.isBlockedButton()){
			return
		}

		this.setState({
			phoneLoginButtonEnabled: false
		})
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_LOGIN_EVENT)
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.PHONE_NUM_LOGIN_API,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					phone: this.state.phoneNumber,
					verifyCode: this.state.validationCode,
				}),
				showLoading: true,
			},
			(responseJson) => {
				this.loginSuccess(responseJson);
			},
			(result) => {
				this.setState({
					phoneLoginButtonEnabled: true
				})
				Alert.alert('提示', result.errorMessage);
			}
		)
	},

	loginWithCodePressed: function() {
		if(this.isBlockedButton()){
			return
		}

		if (!this.state.phoneLoginButtonEnabled || this.state.isWorking) {
			return
		}
		TalkingdataModule.trackEvent(TalkingdataModule.SIMULATOR_LOGIN_EVENT)
		this.setState({
			isWorking: true,
		})
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.PHONE_NUM_LOGIN_API,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					phone: this.state.phoneNumber,
					verifyCode: this.state.validationCode,
				}),
				showLoading: true,
			},
			(responseJson) => {
				this.loginSuccess(responseJson);
			},
			(result) => {
				this.setState({
					isWorking: false
				})
				Alert.alert('提示', result.errorMessage);
			}
		)
	},

	bindWithCode: function() {
		if (!this.state.phoneLoginButtonEnabled) {
			return
		}
		var userData = LogicData.getUserData()
		this.setState({
			phoneLoginButtonEnabled: false
		})
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.BIND_MOBILE_API,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					phone: this.state.phoneNumber,
					verifyCode: this.state.validationCode,
				}),
				showLoading: true,
			},
			(responseJson) => {
				this.updateMeData();
			},
			(result) => {
				this.setState({
					phoneLoginButtonEnabled: true
				})
				Alert.alert('提示', result.errorMessage);
			}
		)
	},

	liveRegisterPressed: function() {
		this.props.navigator.push({
			name: MainPage.LIVE_REGISTER_ROUTE,
		});
	},

	loginSuccess: function(userData) {
		StorageModule.setUserData(JSON.stringify(userData))
		LogicData.setUserData(userData);

		console.log(LogicData.getUserData());

		this.initTokenForGeTui();
		this.trackTongDao(userData)

		NetworkModule.syncOwnStocks(userData)
		WebSocketModule.alertServiceLogin(userData.userId + '_' + userData.token)

		this.setState({
			phoneLoginButtonEnabled: true
		});

		this.updateMeData();
	},

	updateMeData: function(){
		var userData = LogicData.getUserData()
		LocalDataUpdateModule.updateMeData(userData, ()=>{
			var meData = LogicData.getMeData();
			if(userData.isNewUser){
				this.props.navigator.push({
					name: MainPage.UPDATE_USER_INFO_ROUTE,
					popToRoute: this.props.popToRoute,
					onPopToRoute: this.props.onPopToRoute,
				});
			}else{
				var routes = this.props.navigator.getCurrentRoutes();
				if(this.props.nextRoute != null){
					var currentRouteIndex = -1;
					for (var i=0; i<routes.length; ++i) {
						if(routes[i].name === MainPage.LOGIN_ROUTE){
							currentRouteIndex = i;
						}
					}
					if(this.props.onPopToRoute){
						this.props.onPopToRoute();
					}
					this.props.navigator.replaceAtIndex(this.props.nextRoute, currentRouteIndex);
				}
				else if(this.props.popToRoute != null){
					var backRoute = null;
					var currentRouteIndex = -1;
					for (var i=0; i<routes.length; ++i) {
						if(routes[i].name === this.props.popToRoute){
							backRoute = routes[i];
							break;
						}
						if(routes[i].name === MainPage.LOGIN_ROUTE){
							currentRouteIndex = i;
						}
					}

					if(backRoute!=null){
						if(this.props.onPopToRoute){
							this.props.onPopToRoute();
						}
						this.props.navigator.popToRoute(backRoute);
					}else if(currentRouteIndex >= 0 ){
						if(this.props.onPopToRoute){
							this.props.onPopToRoute();
						}
						this.props.navigator.replaceAtIndex({name: this.props.popToRoute}, currentRouteIndex);
					}else{
						this.props.navigator.pop();
					}
				}else{
					if(this.props.onPopToRoute){
						this.props.onPopToRoute();
					}

					this.props.navigator.pop();
				}

				if(this.props.showRegisterSuccessDialog){
					this.props.showRegisterSuccessDialog(meData.rewardAmount);
				}
			}
		})
	},

	initTokenForGeTui:function(){
		var userData = LogicData.getUserData()

		var alertData = {
			"deviceToken": LogicData.getGeTuiToken(),
			"deviceType": Platform.OS === 'ios' ? 2 : 1,
		}

		 NetworkModule.fetchTHUrl(
			 NetConstants.CFD_API.POST_PUSH_TOKEN_AUTH,
			 {
				 method: 'POST',
				 headers: {
					 'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					 'Accept': 'application/json',
					 'Content-Type': 'application/json',
				 },
				 body:JSON.stringify(alertData),
			 },
			 (responseJson) => {
				//  Alert.alert('set deviceToken success auth： ' + alertData.deviceToken +" * " +alertData.deviceType);
				 console.log('set deviceToken success auth： ' + alertData.deviceToken +" * " +alertData.deviceType);
			 },
			 (result) => {
				 console.log('errorMessage ' + result.errorMessage);
			 }
		 )
	},

	trackTongDao: function(userData) {
		console.log("tong dao register:", userData)
		//TongDaoModule.setUserId(userData.userId)
		//TongDaoModule.trackRegistration()
	},

	forgetPassword: function() {

	},

	renderFastLogin: function() {
		if (this.state.wechatInstalled && !this.props.isMobileBinding) {
			//console.log("renderFastLogin: " + quickLoginBottomMargin)
			return (
				<View style={[styles.fastLoginContainer, {paddingBottom: this.state.quickLoginBottomMargin}]}>
					<View style={styles.fastLoginRowWrapper}>
						<View style={styles.line}/>
						<Text style={styles.fastLoginTitle}>
							快速登录
						</Text>
						<View style={styles.line}/>
					</View>

					<TouchableOpacity style={styles.wechatClickableArea}
						onPress={this.wechatPressed}>
						<View>
							<Image
								style={styles.wechatIcon}
								source={require('../../images/wechat_icon.png')}/>
						</View>
					</TouchableOpacity>
				</View>
			);
		} else {
			return <View style={{flex: 1}}/>;
		}
	},

	renderGetValidationCodeButton: function() {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(fontSize*width/375.0)
		var text = '获取验证码'
		if (this.state.validationCodeCountdown > 0) {
			text = '(' + this.state.validationCodeCountdown + ')'
		}
		return  (
			<TouchableOpacity style={styles.getValidationCodeArea} onPress={this.getValidationCodePressed}>
				<Text style={[styles.getValidationText, {fontSize: textSize}]}>
					{text}
				</Text>
			</TouchableOpacity>
		);
	},

	renderTab: function() {
		var liveTabAdditionalAttributes = {}
		var liveTextAdditionalAttributes = {}
		var simulatorTabAdditionalAttributes = {}
		var simulatorTextAdditionalAttributes = {}
		if (this.state.tabSelected == TAB_LIVE) {
			liveTextAdditionalAttributes = {
				color: '#415a87'
			}
			simulatorTabAdditionalAttributes = {
				backgroundColor: 'transparent',
				opacity: 0.5,
			}
			simulatorTextAdditionalAttributes = {
				color: 'white'
			}
		} else {
			liveTabAdditionalAttributes = {
				backgroundColor: 'transparent',
				opacity: 0.5,
			}
			liveTextAdditionalAttributes = {
				color: 'white'
			}
			simulatorTextAdditionalAttributes = {
				color: ColorConstants.TITLE_BLUE
			}
		}
		return (
			<View style={styles.tabContainer}>
				<TouchableOpacity onPress={() => this.setState({tabSelected: TAB_LIVE})}>
					<View style={[styles.liveTab, liveTabAdditionalAttributes]}>
						<Text style={[styles.tabText, liveTextAdditionalAttributes]}>
							实盘
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity  onPress={() => this.setState({tabSelected: TAB_SIMULATOR})}>
					<View style={[styles.simulatorTab, simulatorTabAdditionalAttributes]}>
						<Text style={[styles.tabText, simulatorTextAdditionalAttributes]}>
							模拟
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		)
	},

	renderRememberUserCheckbox: function() {
		var checkBox = require('../../images/checkbox_unchecked.png')
		if (this.state.liveLoginRememberUserName) {
			checkBox = require('../../images/checkbox_checked.png')
		}
		return (
			<TouchableOpacity style={{padding: 10}} onPress={() => {this.setState({liveLoginRememberUserName: !this.state.liveLoginRememberUserName})}}>
				<Image source={checkBox} style={{width: 17, height: 17}} />
			</TouchableOpacity>
		)
	},

	renderLiveLoginContent: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
				<View style={{flex: 1, justifyContent: 'space-between'}}>
					<View>
						<Image style={styles.ayondoLogoImage} source={require('../../images/ayondo_logo.png')}/>
						<Text style={{alignSelf: 'center', fontSize: 11, color: '#2a3f43', marginTop: 30}}>您正在登录券商ayondo</Text>

						<View style={styles.phoneLoginContainer}>
							<View style={styles.liveRowWrapper}>
								<View style={[styles.phoneNumberInputView]}>
									<TextInput style={styles.phoneNumberInput}
										onChangeText={(text) => this.setPhoneNumber(text)}
										placeholder='手机号'
										placeholderTextColor='white'
										underlineColorAndroid='transparent'
										maxLength={11}
										keyboardType='numeric'/>
								</View>
							</View>

							<View style={[styles.liveRowWrapper, {marginTop: 2}]}>
								<View style={[styles.validationCodeInputView]}>
									<TextInput style={styles.validationCodeInput}
										onChangeText={(text) => this.setValidationCode(text)}
										placeholder='登录密码'
										placeholderTextColor='white'
										underlineColorAndroid='transparent'
										secureTextEntry={true}
										keyboardType='numeric'/>
								</View>
							</View>

							<View style={[styles.liveRowWrapper, {justifyContent: 'space-between', marginTop: 10, paddingVertical: 0, backgroundColor: 'transparent'}]}>
								<View style={{alignSelf: 'stretch', justifyContent: 'center'}}>
									<Text style={{fontSize: 15, color: 'white'}}>
										记住我
									</Text>
								</View>

								{this.renderRememberUserCheckbox()}
							</View>

							<View style={[styles.liveRowWrapper, {marginTop: 0, backgroundColor: 'transparent'}]}>
								<TouchableOpacity style={styles.loginClickableArea} onPress={this.loginWithPasswordPressed}>
									<View style={[styles.loginTextView, styles.enabledLoginTextView]}>
										<Text style={[styles.loginText, styles.enabledLoginText]}>
											登录
										</Text>
									</View>
								</TouchableOpacity>
							</View>

							<View style={[styles.liveRowWrapper, {marginTop: 10, backgroundColor: 'transparent'}]}>
								<TouchableOpacity style={styles.loginClickableArea} onPress={this.liveRegisterPressed}>
									<View style={styles.registerTextView}>
										<Text style={styles.registerText}>
											注册
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View style={styles.fastLoginContainer}>
						<View style={styles.fastLoginRowWrapper}>
							<View style={styles.forgetPasswordLine}/>
							<TouchableOpacity style={{padding: 5}} onPress={this.forgetPassword}>
								<Text style={styles.forgetPasswordTitle}>
									 忘记密码
								</Text>
							</TouchableOpacity>
							<View style={styles.forgetPasswordLine}/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	},

	renderLoginButton: function(){
		var style = [styles.loginTextView];
		var textStyle = [styles.loginText];
		var activeOpacity = 0.2;

		if(!this.state.phoneLoginButtonEnabled || this.state.isWorking){
			style.push(styles.disabledLoginTextView);
			textStyle.push(styles.disabledLoginText);
			activeOpacity = 1;
		}else{
			style.push(styles.enabledLoginTextView);
			textStyle.push(styles.enabledLoginText);
			activeOpacity = 0.2;
		}
		return (
				<View style={[styles.rowWrapper, {marginTop: 20, backgroundColor: 'transparent', alignSelf: 'stretch'}]}>
					<TouchableOpacity style={style} onPress={this.props.isMobileBinding ? this.bindWithCode : this.loginWithCodePressed}
														activeOpacity={activeOpacity}>
						<View style={styles.loginTextView}>
							<Text style={textStyle}>
								{this.props.isMobileBinding ? "确认" : "登录"}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
		);
	},

	renderSimulatorLoginContent: function() {
		var {height, width} = Dimensions.get('window');
		return (
			<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
				<View style={{flex: 1, justifyContent: 'space-between'}}>
					<View>
						<Image style={styles.ayondoLogoImage} source={require('../../images/ayondo_logo.png')}/>
						<Text style={{alignSelf: 'center', fontSize: 11, color: '#2a3f43', marginTop: 30}}>您正在登录券商ayondo</Text>

						<View style={styles.phoneLoginContainer}>
							<View style={styles.rowWrapper}>
								<View style={[styles.phoneNumberInputView]}>
									<TextInput style={styles.phoneNumberInput}
										onChangeText={(text) => this.setPhoneNumber(text)}
										placeholder='手机号'
										placeholderTextColor='white'
										underlineColorAndroid='transparent'
										maxLength={11}
										keyboardType='numeric'/>
								</View>

								<View style={{borderWidth: 0.5, borderColor: 'white', marginHorizontal: 15, marginVertical: 7}}/>
								{this.renderGetValidationCodeButton()}
							</View>

							<View style={[styles.rowWrapper, {marginTop: 2}]}>
								<View style={[styles.validationCodeInputView]}>
									<TextInput style={styles.validationCodeInput}
										onChangeText={(text) => this.setValidationCode(text)}
										placeholder='验证码'
										placeholderTextColor='white'
										underlineColorAndroid='transparent'
										maxLength={4}
										keyboardType='numeric'/>
								</View>
							</View>

							{this.renderLoginButton()}
						</View>
					</View>

					{this.renderFastLogin()}
				</View>
			</TouchableWithoutFeedback>
		)
	},

	renderLoginContent: function() {
		if (this.state.tabSelected == TAB_LIVE) {
			return this.renderLiveLoginContent()
		} else {
			return this.renderSimulatorLoginContent()
		}
	},

	render: function() {
		var {height, width} = Dimensions.get('window');
		var gradientColors = ['#1c5fd1', '#123b80']
		if (this.state.tabSelected == TAB_LIVE) {
			gradientColors = ['#415a87', '#36496a']
		}

		//ScrollView need to be wrapped with a non-styled view...
		return (
			<View style={{flex:1}}>
				<ScrollView style={{flex:1}}>
					<LinearGradient colors={gradientColors} style={[styles.wrapper, {height: height - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER}]}>
						{/* {this.renderTab()} */}
						<View style={styles.tabContainer}>
							<Text style={{flex: 1, fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
								{this.props.isMobileBinding ? "绑定手机号" : "盈交易"}
							</Text>
							{this.renderCancelButton()}
						</View>
						{this.renderLoginContent()}
					</LinearGradient>
				</ScrollView>
			</View>
		)
	},

	renderCancelButton: function() {
		if (this.props.showCancelButton) {
			return (
				<TouchableOpacity style={styles.cancelContainer}
					onPress={()=>this.props.navigator.pop()}>
						<Text style={styles.cancel}>
							取消
						</Text>
				</TouchableOpacity>
			);
		}
	},

})

var styles = StyleSheet.create({
	cancel: {
		color: 'white',
		margin: 5,
		marginLeft: 15,
		width: 60,
	},

	tabContainer: {
		height: UIConstants.HEADER_HEIGHT,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},

	cancelContainer: {
		top: (Platform.OS === 'ios') ? 25 : 9,
	 	left: 0,
		position: 'absolute',
	},

	liveTab: {
		backgroundColor: 'white',
		borderColor: 'white',
		borderWidth: 1,
		borderRightWidth: 0,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
		paddingLeft: 15,
		paddingRight: 15,
		paddingVertical: 5,
	},
	simulatorTab: {
		backgroundColor: 'white',
		borderColor: 'white',
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5,
		paddingLeft: 15,
		paddingRight: 15,
		paddingVertical: 5,
	},
	tabText: {
		fontSize: 15
	},
	logoImage: {
		marginTop: 10,
		alignSelf: 'center',
		width: 190,
		height: 190,
	},
	ayondoLogoImage: {
		marginTop: 20,
		alignSelf: 'center',
		width: 245,
		height: 106,
	},
	wrapper: {
		flex:1,
		alignItems:'stretch',
	},
	phoneLoginContainer: {
		paddingTop: 10,
		alignItems: 'stretch',
	},
	fastLoginContainer: {
		alignItems: 'stretch',
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingVertical: 5,
		paddingHorizontal: 10,
		justifyContent: 'space-around',
		backgroundColor: '#678cc9',
	},
	liveRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingVertical: 5,
		paddingHorizontal: 10,
		justifyContent: 'space-around',
		backgroundColor: '#7e8da5',
	},
	phoneNumberInputView: {
		flex: 2.5,
	},
	phoneNumberInput: {
		height: rowHeight,
		fontSize: fontSize,
		paddingLeft: 10,
		color: 'white',
	},
	getValidationCodeArea: {
		paddingVertical: 5,
		flex: 1,
		height: rowHeight,
		justifyContent: 'center',
	},
	getValidationText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#ffffff',
	},
	validationCodeInputView: {
		flex: 1,
	},
	validationCodeInput: {
		height: 40,
		fontSize: fontSize,
		paddingLeft: 10,
		color: 'white',
	},
	loginClickableArea: {
		flex: 1,
		alignSelf: 'center',
	},
	loginTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		justifyContent: 'center',
		flex: 1,
	},
	enabledLoginTextView: {
		backgroundColor: '#b8c7db',
	},
	disabledLoginTextView: {
		backgroundColor: 'rgba(184,199,219, 0.2)', //#b8c7db
	},
	loginText: {
		fontSize: fontSize,
		textAlign: 'center',
	},
	enabledLoginText: {
		color: '#2e2e2e',
	},
	disabledLoginText: {
		color: 'rgba(46,46,46,0.5)', //#b8c7db
	},
	registerTextView: {
		padding: 5,
		height: rowHeight,
		borderRadius: 3,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#b8c7db',
		justifyContent: 'center',
	},
	registerText: {
		fontSize: fontSize,
		textAlign: 'center',
		color: '#b8c7db',
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
		borderColor: '#1c5fcf',
	},
	fastLoginTitle: {
		fontSize: 14,
		textAlign: 'center',
		color: '#1c5fcf',
	},
	forgetPasswordLine: {
		flex: 1,
		marginLeft: 5,
		marginRight: 5,
		borderWidth: 0.5,
		borderColor: '#415a87',
	},
	forgetPasswordTitle: {
		fontSize: 14,
		textAlign: 'center',
		color: '#415a87',
	},
	wechatClickableArea: {
		marginTop: 5,
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

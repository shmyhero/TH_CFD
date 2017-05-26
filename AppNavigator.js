'use strict';

import React from 'react';
import {
	StyleSheet,
	Navigator,
	View,
	Text,
	Image,
	StatusBar,
	Platform,
	Dimensions,
	TouchableOpacity,
	Alert,
	Linking,
} from 'react-native';

import {
	isFirstTime,
	isRolledBack,
	packageVersion,
	currentVersion,
	checkUpdate,
	downloadUpdate,
	switchVersion,
	switchVersionLater,
	markSuccess,
} from 'react-native-update';

import _updateConfig from './update.json';
const {appKey} = _updateConfig[Platform.OS];

var buildStyleInterpolator = require('buildStyleInterpolator');
var UIManager = require('UIManager');
var ColorConstants = require('./js/ColorConstants')
var UIConstants = require('./js/UIConstants')
var recevieDataSubscription = null
var didAccountChangeSubscription = null;
var networkConnectionChangedSubscription = null;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var {EventCenter, EventConst} = require('./js/EventCenter');
var Orientation = require('react-native-orientation');

require('./js/utils/dateUtils')
require('./js/utils/numberUtils')
require('./js/utils/stringUtils')

var SCREEN_WIDTH = Dimensions.get('window').width;
var ToTheLeft = {
	opacity: {
		from: 1,
		to: 0.5,
		min: 0,
		max: 1,
		type: 'linear',
		extrapolate: false,
	},
	left: {
		from: 0,
		to: -SCREEN_WIDTH,
		min: 0,
		max: 1,
		type: 'linear',
		extrapolate: true,
	},
};
Navigator.SceneConfigs.PushFromRight.animationInterpolators.out = buildStyleInterpolator(ToTheLeft)

var TimerMixin = require('react-timer-mixin');
var LayoutAnimation = require('LayoutAnimation')
var Swiper = require('react-native-swiper')
var StorageModule = require('./js/module/StorageModule')
var NetworkModule = require('./js/module/NetworkModule')
var NetConstants = require('./js/NetConstants')
var FSModule = require('./js/module/FSModule')
var LogicData = require('./js/LogicData')
var MainPage = require('./js/view/MainPage')
var AskForRestartPage = require('./js/view/AskForRestartPage')
var NativeDataModule = require('./js/module/NativeDataModule')
var VersionConstants = require('./js/VersionConstants')
var VersionControlModule = require('./js/module/VersionControlModule')
//var TongDaoModule = require('./js/module/TongDaoModule')

var GUIDE_SLIDES = [
	require('./images/Guide-page01.png'),
	require('./images/Guide-page02.png'),
	require('./images/Guide-page03.png'),
	require('./images/Guide-page04.png'),
	require('./images/Guide-page05.png'),
];
var GUIDE_VERSION = {version: 2}

var LOADING_PHASE = 'loading'
var GUIDE_PHASE = 'guide'
var MAIN_PAGE_PHASE = 'mainPage'

var AppNavigator = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			startUpPhase: LOADING_PHASE,
			showAskForRestart: false,
			updateDescription: '',
			updateHash: '',
			isPushAction: false,
			pushData: null,
		};
	},

	componentDidMount: function() {
		if (isFirstTime) {
			markSuccess()
		}

		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

		//Load the server setting should always be the first step.
		StorageModule.loadAccountState().then((value) => {
			if (value !== null) {
				LogicData.setAccountState(JSON.parse(value), true)
			}
		})
		.done(()=>{
			VersionConstants.loadServerSettings()
			.then(()=>{
				this.initializeApp();
			},()=>{
				this.initializeApp();
			});
		})

	  Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations
		Orientation.lockToPortrait(); //this will lock the view to Portrait
	},

	initializeApp: function(){
		console.log("initializeApp");
		StorageModule.loadUserData()
			.then((value) => {
				if (value !== null) {
					LogicData.setUserData(JSON.parse(value))

					this.sendDeviceTokenToServer(LogicData.getGeTuiToken());

					var userData = LogicData.getUserData()
					console.log("tong dao", userData)
					//TongDaoModule.setUserId(userData.userId)
				}
				this.checkUpdate();

				StorageModule.loadGuide()
				.then((value) => {
					var guideData = JSON.parse(value)
					var nextPhase = GUIDE_PHASE
					if (guideData && guideData.version == GUIDE_VERSION.version) {
						nextPhase = MAIN_PAGE_PHASE
					}
					this.setTimeout(
						() => {
							LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
							this.setState({
								startUpPhase: nextPhase,
							})
						 },
						200
					);

				})
				.done()
			})
			.done()

		StorageModule.loadOwnStocksData(LogicData.getAccountState()).then((value) => {
				if (value !== null) {
					LogicData.setOwnStocksData(JSON.parse(value))
				}
			})
			.done()

		NetworkModule.fetchTHUrl(
			(LogicData.getAccountState()?NetConstants.CFD_API.GET_OUT_RIGHT_LIVE_API:NetConstants.CFD_API.GET_OUT_RIGHT_API) + '?page=1&perPage=99',
			{
				method: 'GET',
			},
			(responseJson) => {
				LogicData.setFxData(responseJson)
			},
			(result) => {
				console.log(result.errorMessage)
			}
		)

		this.recevieDataSubscription = RCTNativeAppEventEmitter.addListener(
			'nativeSendDataToRN',
			(args) => {
				try{
					if (args[0] == 'deviceToken') {
						this._handleDeviceToken(args[1])
					}else if (args[0] == 'PushShowDialog') {
						this.alertForPush(JSON.parse(args[1]));
					}else if (args[0] == 'PushShowDetail') {
						this.actionForPush(JSON.parse(args[1]));
					}else if (args[0] == 'versionCode'){
						this.setCurrentVersionCode(args[1]);
					}else if (args[0] == 'getAndroidVisibleSize'){
						UIConstants.setVisibleAreaSize(JSON.parse(args[1]));
					}else if(args[0] == 'chart_clicked'){
						EventCenter.emitChartClickedEvent()
					}
					// else if (args[0] == 'isProductServer') {
					// 	this.setIsProduct(args[1]);
					// }
					// else if (args[0] == 'ayondoLoginSuccess'){
					// 	this.ayondoLoginResule(true)
					// }else if( args[0] == 'ayondoLoginError'){
					// 	this.ayondoLoginResule(false)
					// }
				}
				catch (e) {
					console.log(e)
				}
			}
		);

		//NativeDataModule.passDataToNative('isProduct', "");
		NativeDataModule.passDataToNative('getVersionCode', "");
		NativeDataModule.passDataToNative('getui', "");

		didAccountChangeSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>{
			console.log("ACCOUNT_STATE_CHANGE");
			NetworkModule.fetchTHUrl(
				(LogicData.getAccountState()?NetConstants.CFD_API.GET_OUT_RIGHT_LIVE_API:NetConstants.CFD_API.GET_OUT_RIGHT_API) + '?page=1&perPage=999',
				{
					method: 'GET',
				},
				(responseJson) => {
					LogicData.setFxData(responseJson)
				},
				(result) => {
					console.log(result.errorMessage)
				}
			)

			NetworkModule.loadUserBalance(true);
		});

		networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			console.log("NETWORK_STATE_CHANGE");
			NetworkModule.loadUserBalance(true);
		});
		// var alertData = {'title':'盈交易','msg':'打开苹果股票详情','type':'1','stockName':'英国100', 'stockId':34854};
		// this.alertForPush(alertData);
	},

	setCurrentVersionCode: function(value){
		LogicData.setCurrentVersionCode(value);
		VersionControlModule.start();
	},

	componentWillUnmount: function() {
		this.recevieDataSubscription.remove();
	},

	// setIsProduct: function(setIsProductApp){
	// 	var value = (setIsProductApp == "true" ? true : false);
	// 	console.log("setIsProductApp: " + setIsProductApp);
	// 	VersionConstants.setIsProductApp(value);
	// },

	// ayondoLoginResule:function(result){
	// 	this.refs['mainPage'].ayondoLoginResult(result)
	// },


	lastDeviceToken: "",
	_handleDeviceToken: function(event) {
		console.log("deviceToken from native:", event);

		if(this.lastDeviceToken != event){
			this.lastDeviceToken = event;
			this.sendDeviceTokenToServer(event);
		}
	},

	sendDeviceTokenToServer: function(event){
		if(!event || event === ""){
			console.log("devicetoken not set in RN " + event)
			return;
		}
		LogicData.setGeTuiToken(event);
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		var alertData = {
			"deviceToken": event,
			"deviceType": Platform.OS === 'ios' ? 2 : 1,
		}
		if(!notLogin){//if login
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
				 console.log('errorMessage' + result.errorMessage);
			 }
		 )
	 }else{//if not login
		 NetworkModule.fetchTHUrl(
			 NetConstants.CFD_API.POST_PUSH_TOKEN,
			 {
				 method: 'POST',
				 headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json',
				 },
				 body:JSON.stringify(alertData),
			 },
			 (responseJson) => {
				// Alert.alert('set deviceToken success ： ' + alertData.deviceToken +" * " +alertData.deviceType);
				console.log('set deviceToken success ： ' + alertData.deviceToken +" * " +alertData.deviceType);
			 },
			 (result) => {
				console.log('errorMessage');
			 }
		 )
	 }
	},


	enterMainPage: function() {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({
			startUpPhase: MAIN_PAGE_PHASE,
		})
		StorageModule.setGuide(JSON.stringify(GUIDE_VERSION))
	},

	checkUpdate: function() {
		checkUpdate(appKey).then(info => {
			if (info.expired) {
				// TODO redirect to App store to update.
				// Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
				// 	{text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
				// ]);
			} else if (info.upToDate) {
				// Do nothing as the version is up-to-date.
			} else {
				var description = info.description.replace(/\\n/g, '\n')
				this.setState({
					updateDescription: description,
				})
				this.doUpdate(info)
			}
		}).catch(err => {
			// Do nothing.
		});
	},

	doUpdate: function(info) {
		downloadUpdate(info).then(hash => {
			this.setState({
				showAskForRestart: true,
				updateHash: hash,
			})
		}).catch(err => {
			// TODO upload log for update failed.
		});
	},

	closeAskForRestartDialog: function() {
		this.setState({
			showAskForRestart: false,
		})
	},

	renderAskForRestart: function() {
		if (this.state.showAskForRestart) {
			return (
				<AskForRestartPage
					updateDescription={this.state.updateDescription}
					updateHash={this.state.updateHash}
					closeCallback={this.closeAskForRestartDialog}/>
			)
		}
	},

	//收到NativePush后弹出Alert后跳转
	alertForPush: function(data){
		if(data.type === '1' || data.type === '2' || data.type  === '3'){
			//type: 1: 平仓, 2: 股价提醒, 3: deeplink
			if(data.title && data.message){
				Alert.alert(
		  		data.title,
		  		data.message,
				  [
				    {text: '忽略', onPress: () => this.cancelAlert()},
				    {text: '立即查看', onPress: () => this.actionForPush(data)},
				  ]
				);
			}
		 }else {
			 Alert.alert( data );
		 }

	},

	//收到NativePush后直接打开响应界面
	actionForPush: function(data){
		if(data.type === '1' || data.type === '2' || data.type  === '3'){
			//type: 1: 平仓, 2: 股价提醒, 3: deeplink
			console.log('actionForPush '+ data.title);

			// if(data.tongrd_type == 'deeplink' && data.type === '3'){
			// 	//TongDao data. We need to format it with our rules.
			// 	if(!data.deepLink){
			// 		data.deepLink = data.tongrd_value;
			// 	}
			// }

			LogicData.setPushData(data);

			//TODO: mark the message as read. Ignore the response
			if(data.id){
				this.setMessageRead(data.id);
			}

			if (this.state.startUpPhase == MAIN_PAGE_PHASE) {
				this.setState(
					{
						isPushAction:true,
						pushData:data,
					}
				)
			}
		} else {
			Alert.alert( data );
		}
	},

	setMessageRead: function(id) {
		var userData = LogicData.getUserData();
		var url = NetConstants.CFD_API.SET_MESSAGE_READ;
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.SET_MESSAGE_READ_LIVE
			console.log('live', url );
		}
		url = url.replace('<id>', id);
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			}
		)
	},

	cancelAlert:function(){
		console.log("cancelAlert");
	},

	render: function() {
		var {height, width} = Dimensions.get('window')
		var statusBar = <StatusBar barStyle="light-content"/>

		if (this.state.startUpPhase == MAIN_PAGE_PHASE) {
			if(Platform.OS == 'android'){
				StatusBar.setBackgroundColor(ColorConstants.title_blue());
			}
			return (
				<View style={styles.container}>
					{statusBar}
					<MainPage ref="mainPage"
					isPushAction={this.state.isPushAction}
					pushData={this.state.pushData}
					/>
					{this.renderAskForRestart()}
				</View>
			)
		} else if (this.state.startUpPhase == GUIDE_PHASE) {
			var activeDot = <View style={styles.guideActiveDot} />
			var dot = <View style={styles.guideDot} />
			var slides = []
			for (var i = 0; i < GUIDE_SLIDES.length; i++) {
				slides.push(
					<View style={[styles.guideContainer, {height: height}]} key={i}>
						<View style={{flex: 6, justifyContent: 'flex-end'}}>
							<Image
								style={styles.guideImage}
								source={GUIDE_SLIDES[i]}/>
						</View>
						<View style={{flex: 1, justifyContent: 'flex-end'}} >
							{i == GUIDE_SLIDES.length - 1 ?
								<TouchableOpacity onPress={this.enterMainPage}>
									<View style={styles.guideEnterTextView}>
										<Text style={styles.guideEnterText}>
											点击开启
										</Text>
									</View>
								</TouchableOpacity>
								: null}
						</View>
						<View style={{flex: 1}} />
					</View>
				)
			}
			return (
				<View style={{width: width, height: height, backgroundColor: '#0079ff'}}>
					<StatusBar barStyle="light-content" backgroundColor={ColorConstants.TITLE_BLUE_SIMULATE}/>
					<Swiper loop={false} bounces={true} activeDot={activeDot} dot={dot}>
						{slides}
					</Swiper>
					{this.renderAskForRestart()}
				</View>
			)
		} else if (this.state.startUpPhase == LOADING_PHASE){
			var loadingStatusBar = <StatusBar barStyle="light-content" backgroundColor={ColorConstants.TITLE_BLUE_SIMULATE}/>
			if (Platform.OS === 'ios') {
				return (
					<View style={{backgroundColor: '#0665de', alignItems: 'center'}}>
						{statusBar}
						<Image
							style={[styles.image, {width: width, height: height}]}
							source={require('./images/frontPage.jpg')}/>

						{this.renderAskForRestart()}
					</View>
				);
			} else {
				return null;
			}
		}
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
		alignItems: 'stretch',
	},
	image: {
		resizeMode: Image.resizeMode.contain,
	},
	guideContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	guideImage: {
		height: 445 * SCREEN_WIDTH / 375,
		width: SCREEN_WIDTH,
		resizeMode: Image.resizeMode.contain,
	},
	guideActiveDot: {
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 20,
	},
	guideDot: {
		backgroundColor:'rgba(0,0,0,.2)',
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 20,
	},
	guideEnterTextView: {
		paddingHorizontal: 40,
		paddingVertical: 10,
		borderColor: 'white',
		borderWidth: 0.5,
		borderRadius: 5,
		justifyContent: 'center',
	},
	guideEnterText: {
		fontSize: 20,
		textAlign: 'center',
		color: '#ffffff',
	},
});

module.exports = AppNavigator;

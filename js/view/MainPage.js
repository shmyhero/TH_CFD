'use strict';

import React from 'react';
import {
	BackAndroid,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Navigator,
  Linking,
	Platform,
} from 'react-native';

import Tabbar, { Tab, RawContent,  Icon, IconWithBar, glypyMapMaker } from './component/react-native-tabbar';

var {EventCenter, EventConst} = require('../EventCenter')


var CookieManager = require('react-native-cookies')
var ColorConstants = require('../ColorConstants')
var LoadingIndicator = require('./LoadingIndicator')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var HomePage = require('./HomePage')
var LandingPage = require('./LandingPage')
var LoginPage = require('./LoginPage')
var UpdateUserInfoPage = require('./UpdateUserInfoPage')
var MyHomePage = require('./MyHomePage')
var MyNotifications = require('./MyNotifications')
var MySettings = require('./MySettings')
var WechatLoginConfirmPage = require('./WechatLoginConfirmPage')
var StockListPage = require('./StockListPage')
var StockListViewPager = require('./StockListViewPager')
var StockSearchPage = require('./StockSearchPage')
var StockDetailPage = require('./StockDetailPage')
var StockExchangePage = require('./StockExchangePage')
var WebViewPage = require('./WebViewPage');
var QAPage = require('./QAPage')
var AboutUsPage = require('./AboutUsPage');
var AccountInfoPage = require('./AccountInfoPage');
var AccountNameModifyPage = require('./AccountNameModifyPage');
var MePage = require('./MePage')
var MyIncomePage = require('./MyIncomePage')
var MyCard = require('./MyCard')
var MeConfigPage = require('./MeConfigPage')
var ModifyPwdPage = require('./ModifyPwdPage')
var MePushConfigPage = require('./MePushConfigPage')
var MeAccountBindingPage = require('./MeAccountBindingPage')
var MeBindingMobilePage = require('./MeBindingMobilePage')
var LiveRegisterPage = require('./openAccount/OALiveRegisterPage')
var LiveUpdateUserInfoPage = require('./openAccount/OALiveUpdateUserInfoPage')
var LiveRegisterStatusPage = require('./openAccount/OAStatusPage')
var StockPopularityPage = require('./StockPopularityPage')
var FeedbackPage = require('./FeedbackPage')
var EditOwnStocksPage = require('./EditOwnStocksPage')
var EditAlertPage = require('./EditAlertPage')
var SharePage = require('./SharePage')
var LogicData = require('../LogicData')
var DaySignPage = require('./DaySignPage')
var RegisterSuccessPage = require('./RegisterSuccessPage')
var SuperPriorityHintPage = require('./SuperPriorityHintPage')
var MyMessagesPage = require('./MyMessagesPage')
var DevelopPage = require('./DevelopPage')

var TalkingdataModule = require('../module/TalkingdataModule')
var WebSocketModule = require('../module/WebSocketModule');
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var StorageModule = require('../module/StorageModule');
var OpenAccountRoutes = require('./openAccount/OpenAccountRoutes');

var TutorialPage = require('./TutorialPage');

var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')

var _navigator;
var _navigators = [];

export let MAIN_PAGE_ROUTE = 'main'
export let HOME_PAGE_ROUTE = 'homepage'
export let LANDING_ROUTE = 'landing'
export let LOGIN_ROUTE = 'login'
export let UPDATE_USER_INFO_ROUTE = 'updateUserInfo'
export let MY_HOME_ROUTE = 'myhome'
export let MY_NOTIFICATION_ROUTE = 'myNotifications'
export let MY_SETTING_ROUTE = 'mySettings'
export let WECHAT_LOGIN_CONFIRM_ROUTE = 'wechatLoginConfirm'
export let STOCK_LIST_ROUTE = 'stockList'
export let STOCK_LIST_VIEW_PAGER_ROUTE = 'stockListViewPager'
export let STOCK_SEARCH_ROUTE = 'stockSearch'
export let STOCK_DETAIL_ROUTE = 'stockDetail'
export let STOCK_EXCHANGE_ROUTE = 'stockExchange'
export let NAVIGATOR_WEBVIEW_ROUTE = 'webviewpage'
export let QA_ROUTE = 'q&a'
export let ME_ROUTE = 'me'
export let MY_CARD_ROUTE = 'myCard'
export let MY_INCOME_ROUTE = 'myIncome'
export let ABOUT_US_ROUTE = 'aboutUs'
export let ACCOUNT_INFO_ROUTE = 'accountInfo'
export let ACCOUNT_NAME_MODIFY_ROUTE = 'accountNameModify'
export let ME_CONFIG_ROUTE = 'meConfig'
export let ME_CONFIG_MODIFY_PWD_ROUTE = 'meConfigModifyPwd'
export let ME_PUSH_CONFIG_ROUTE = 'mePushConfig'
export let ME_ACCOUNT_BINDING_ROUTE = 'meAccountBinding'
export let ME_BINDING_MOBILE_ROUTE = 'MeBindingMobilePage'
export let OPEN_ACCOUNT_ROUTE = 'openAccount'
export let LIVE_REGISTER_ROUTE = 'liveRegister'
export let LIVE_UPDATE_USER_INFO_ROUTE = 'liveUpdateUserInfo'
export let LIVE_REGISTER_STATUS_ROUTE = 'liveRegisterStatus'
export let STOCK_POPULARITY_ROUTE = 'stockPopularity'
export let FEEDBACK_ROUTE = 'feedback'
export let EDIT_OWN_STOCKS_ROUTE = 'editownstocks'
export let EDIT_ALERT_ROUTE = 'editalert'
export let SHARE_ROUTE = 'share'
export let DAY_SIGN_ROUTE = 'daySign'
export let MY_MESSAGES_ROUTE = 'myMessages'
export let DEVELOP_ROUTE = 'develop'

const glypy = glypyMapMaker({
  Home: 'f04f',
  Camera: 'f04e',
  Stat: 'f050',
  Settings: 'f054',
  Favorite: 'f051'
});

const systemBlue = '#1a61dd'
const iconGrey = '#adb1b7'
const systemBuleActual = '#425a85'

export var initExchangeTab = 0
export var initStockListTab = 1

var hideTabbar
var showTabbar
export var hideProgress
export var showProgress
export var ayondoLoginResult
export var refreshMainPage
export var showSharePage
export var gotoLoginPage

var recevieDataSubscription = null
var didAccountChangeSubscription = null;
var didAccountLoginOutSideSubscription = null;
var SHARE_PAGE = 'SharePage'
var REGISTER_SUCCESS_DIALOG = 'RegisterSuccessDialog'
var SUPER_PRIORITY_HINT = 'SuperPriorityHint'
var isTabbarShown = true
var MainPage = React.createClass({
	getInitialState: function() {
		return {
			showTutorial: false,
			tutorialType: 'trade',
		};
	},

	RouteMapper : function(route, navigationOperations, onComponentRef) {
		console.log("Current Router ===>  " + route.name);

		_navigators[route.__navigatorRouteID] = navigationOperations;


		_navigator = navigationOperations;
		if (route.showTabbar !== undefined) {
			showTabbar = route.showTabbar
		}
		if (route.hideTabbar !== undefined) {
			hideTabbar = route.hideTabbar
		}
		if (route.showProgress !== undefined) {
			showProgress = route.showProgress
		}
		if (route.hideProgress !== undefined) {
			hideProgress = route.hideProgress
		}

		var showBackButton = true;
		if (route.hideBackButton) {
			showBackButton = false;
		}
		if (route.name === MAIN_PAGE_ROUTE) {
			return (
				<MainPage />
			)
		} else if (route.name == HOME_PAGE_ROUTE) {
			showTabbar()
			return (
				<HomePage navigator={navigationOperations}
				showIncomeDialogWhenNecessary={this.showRegisterSuccessDialog}/>
			)
		} else if (route.name === LANDING_ROUTE) {
			showTabbar()
			return (
				<LandingPage navigator={navigationOperations} />
			);
		} else if (route.name === LOGIN_ROUTE) {
			hideTabbar();
			return (
				<LoginPage navigator={navigationOperations} showCancelButton={true}
					popToRoute={route.popToRoute}
					nextRoute={route.nextRoute}
  				onPopToRoute={route.onPopToRoute}
					showRegisterSuccessDialog={this.showRegisterSuccessDialog}
					isTabbarShown={this.getIsTabbarShown}
					isMobileBinding={route.isMobileBinding}/>
			);
		} else if (route.name === UPDATE_USER_INFO_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<UpdateUserInfoPage navigator={navigationOperations}
					popToRoute={route.popToRoute}
  				onPopToRoute={route.onPopToRoute}
					showRegisterSuccessDialog={this.showRegisterSuccessDialog}/>
				</View>
			);
		} else if (route.name === MY_HOME_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="我的" />
					<MyHomePage navigator={navigationOperations}/>
				</View>
			);
		} else if (route.name === MY_NOTIFICATION_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="通知" showBackButton={true} navigator={navigationOperations}/>
					<MyNotifications navigator={navigationOperations} />
				</View>
			);
		} else if (route.name === MY_SETTING_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="设置" showBackButton={true} navigator={navigationOperations}/>
					<MySettings navigator={navigationOperations} />
				</View>
			);
		} else if (route.name === WECHAT_LOGIN_CONFIRM_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="首页" showBackButton={true} navigator={navigationOperations}/>
					<WechatLoginConfirmPage navigator={navigationOperations} />
				</View>
			);
		} else if (route.name === STOCK_LIST_ROUTE) {
			return (
				<StockListPage navigator={navigationOperations} style={{flex: 1}}/>
			);
		} else if (route.name === STOCK_LIST_VIEW_PAGER_ROUTE) {
			showTabbar()
			return (
				<StockListViewPager navigator={navigationOperations} style={{flex: 1}}/>
			);
		} else if (route.name === STOCK_SEARCH_ROUTE) {
			hideTabbar()
			return (
				<StockSearchPage navigator={navigationOperations} style={{flex: 1}}/>
			);
		} else if (route.name === STOCK_DETAIL_ROUTE) {
			hideTabbar()
			return (
				<StockDetailPage style={{flex: 1}}
					navigator={navigationOperations}
					showTutorial={this.showTutorial}
					showTabbar={showTabbar}
					stockName={route.stockRowData.name}
					stockCode={route.stockRowData.id}
					stockSymbol={route.stockRowData.symbol}
					stockPrice={route.stockRowData.last}
					stockPriceAsk={route.stockRowData.lastAsk}
					stockPriceBid={route.stockRowData.lastBid}
					stockTag={route.stockRowData.tag}
					lastClosePrice={route.stockRowData.preClose}
					openPrice={route.stockRowData.open}/>
			);
		} else if (route.name === STOCK_EXCHANGE_ROUTE) {
			showTabbar()
			return (
				<StockExchangePage navigator={navigationOperations}
					showTutorial={this.showTutorial}/>
			)
		} else if (route.name === NAVIGATOR_WEBVIEW_ROUTE) {

			hideTabbar()

			return (
				<WebViewPage url={route.url}
					onNavigationStateChange={route.onNavigationStateChange}
					showTabbar={showTabbar}
					title={route.title} navigator={navigationOperations}
					backFunction={()=>{
						if (route.backFunction) {
							this.showTabbar()
							route.backFunction()
						}
					}}
					showShareButton={route.showShareButton}
					shareID={route.shareID}
					shareUrl={route.shareUrl}
					shareTitle={route.shareTitle}
					shareDescription={route.shareDescription}
					shareFunction={this._doShare}
					shareTrackingEvent={route.shareTrackingEvent}
					themeColor={route.themeColor}/>
			)
		} else if (route.name === QA_ROUTE) {
			hideTabbar();
			return (
				<QAPage navigator={navigationOperations}/>
			)
		} else if (route.name === ABOUT_US_ROUTE) {
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<NavBar title='关于我们' showBackButton={true} navigator={navigationOperations}/>
					<AboutUsPage />
				</View>
			)
		} else if (route.name === DAY_SIGN_ROUTE) {
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<DaySignPage navigator={navigationOperations} shareFunction={this._doShare}/>
				</View>
			)
		} else if (route.name === ACCOUNT_INFO_ROUTE) {
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<AccountInfoPage navigator={navigationOperations} backButtonOnClick={route.backButtonOnClick}/>
				</View>
			)
		} else if (route.name === ACCOUNT_NAME_MODIFY_ROUTE) {
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					{/* <NavBar title='我的昵称' showBackButton={true} navigator={navigationOperations}/> */}
					<AccountNameModifyPage navigator={navigationOperations}
						onReturnToPage={route.onReturnToPage}/>
				</View>
			)
		} else if (route.name === ME_ROUTE) {
			showTabbar();
			return (
				<MePage navigator={navigationOperations}
				/>
			)
		} else if(route.name === MY_INCOME_ROUTE) {
			hideTabbar();
			return (
				<MyIncomePage navigator={navigationOperations} />
			)
		} else if(route.name === MY_CARD_ROUTE) {
			hideTabbar();
			return (
				<View style={{flex: 1}}>
				  <MyCard navigator={navigationOperations} />
			  </View>
			)
		} else if(route.name === ME_CONFIG_ROUTE){
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<NavBar title="设置" showBackButton={true} navigator={navigationOperations}/>
					<MeConfigPage navigator={navigationOperations} onPopBack={route.onPopBack}/>
				</View>
			)
		} else if(route.name === ME_CONFIG_MODIFY_PWD_ROUTE){
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<NavBar title="修改登入密码" showBackButton={true} navigator={navigationOperations}/>
					<ModifyPwdPage navigator={navigationOperations} onPopBack={route.onPopBack}/>
				</View>
			)
		} else if(route.name === ME_PUSH_CONFIG_ROUTE){
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<MePushConfigPage navigator={navigationOperations} routeMapper={this.RouteMapper}/>
				</View>
			)
		} else if(route.name === ME_ACCOUNT_BINDING_ROUTE){
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<NavBar title="账号绑定" showBackButton={true} navigator={navigationOperations}/>
					<MeAccountBindingPage navigator={navigationOperations} onPopBack={route.onPopBack}/>
				</View>
			)
		} else if(route.name === ME_BINDING_MOBILE_ROUTE){
			hideTabbar()
			return (
				<View style={{flex: 1}}>
					<MeBindingMobilePage navigator={navigationOperations}
						showCancelButton={true}
						popToRoute={route.popToRoute}
						onPopBack={route.onPopBack}/>
				</View>
			)
		}else if (route.name === OPEN_ACCOUNT_ROUTE) {
			hideTabbar();

			return OpenAccountRoutes.showOARoute(_navigator, route.step, route.onPop, route.data, route.nextStep);
		} else if (route.name === LIVE_REGISTER_ROUTE) {
			// hideTabbar()
			return (
				<View style={{flex: 1}}>
					<NavBar title='实盘注册' showBackButton={true}
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						navigator={navigationOperations}/>
					<LiveRegisterPage navigator={navigationOperations}/>
				</View>
			)
		} else if (route.name === LIVE_UPDATE_USER_INFO_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<NavBar title='实盘注册' showBackButton={true}
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						navigator={navigationOperations}/>
					<LiveUpdateUserInfoPage navigator={navigationOperations}/>
				</View>
			)
		} else if (route.name === LIVE_REGISTER_STATUS_ROUTE) {
			showTabbar()
			return (
				<View style={{flex: 1}}>
					<NavBar title='实盘交易'
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						navigator={navigationOperations}/>
					<LiveRegisterStatusPage navigator={navigationOperations}/>
				</View>
			)
		} else if (route.name === STOCK_POPULARITY_ROUTE) {
			hideTabbar()
			return (
				<View style={{flex: 1}}>
					<NavBar title='多空博弈' showBackButton={true}
						backButtonOnClick={()=>{
								this.backAndShowTabbar()
								if(route.backFunction) {
									route.backFunction()
								}
							}
						}
						navigator={navigationOperations}/>
					<StockPopularityPage navigator={navigationOperations} initialInfo={route.data}/>
				</View>
			)
		}
		else if (route.name === FEEDBACK_ROUTE) {
			hideTabbar()
			return (
				<FeedbackPage navigator={navigationOperations}
					showTabbar={showTabbar} phone={route.phone}/>
			)
		}
		else if (route.name === EDIT_OWN_STOCKS_ROUTE) {
			hideTabbar()
			return (
				<EditOwnStocksPage navigator={navigationOperations} showTabbar={showTabbar} />
				)
		}
		else if (route.name === EDIT_ALERT_ROUTE) {
			return (
				<EditAlertPage navigator={navigationOperations} showTabbar={showTabbar}
				stockId={route.stockId}
				stockInfo={route.stockInfo}
				stockAlert={route.stockAlert}
				onAlertSetComplete={route.onAlertSetComplete}/>
				)
		}
		else if(route.name === SHARE_ROUTE){
			return (
				<View style={{flex: 1}}>
					<SharePage navigator={navigationOperations} routeMapper={this.RouteMapper}/>
				</View>
			)
		}
		else if(route.name === MY_MESSAGES_ROUTE){
			hideTabbar()
			return(
				<View style={{flex: 1}}>
					<NavBar title='我的消息' showBackButton={true}
						backButtonOnClick={()=>this.backAndShowTabbar()}
						navigator={navigationOperations}/>
					<MyMessagesPage navigator={navigationOperations} routeMapper={this.RouteMapper}
  					onPopToRoute={route.onPopToRoute}/>
				</View>
			)
		}else if (route.name === DEVELOP_ROUTE){
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<NavBar title='测试' showBackButton={true}
						backButtonOnClick={()=>this.backAndShowTabbar()}
						navigator={navigationOperations}/>
					<DevelopPage navigator={navigationOperations} routeMapper={this.RouteMapper}
  					onPopToRoute={route.onPopToRoute}/>
				</View>
			);
		}
	},

	showTutorial: function(type){
		this.setState({tutorialType:type, showTutorial:true})
	},

	hideTutorial: function(){
		this.setState({showTutorial: false})
	},

	backAndShowTabbar: function() {
		this.showTabbar()
		_navigator.pop();
	},

	showTabbar() {
		if(this.refs['myTabbar']){
			isTabbarShown = true;
			console.log("showTabbar")
			this.refs['myTabbar'].getBarRef().show(true);
	 	}
	},

	ayondoLoginResult(result){
		console.log('login:ayondoLoginResult'+result);
	  this.backAndShowTabbar()

		console.log('ayondo login result :' + result);
		if(result){
			LogicData.setAccountState(true)//实盘状态 true
			LogicData.setActualLogin(true)//实盘登陆状态 true
		}

		CookieManager.clearAll((err, res) => {
			console.log('cookies cleared!');
		});

	},

	refreshMainPage(){
		// this.setState({
		// 	barColor:LogicData.getAccountState()?'#00ff00':'#f7f7f7'
		// })
		//alert("refreshMainPage " + ColorConstants.TITLE_BLUE)

		this.refs["homepageBtn"].setActiveColor(ColorConstants.TITLE_BLUE);
		this.refs["tradeBtn"].setActiveColor(ColorConstants.TITLE_BLUE);
		this.refs["trendBtn"].setActiveColor(ColorConstants.TITLE_BLUE);
		this.refs["meBtn"].setActiveColor(ColorConstants.TITLE_BLUE);

		console.log('refresh for Tab Icon Color ... ');


		//监听到模拟或实盘状态切换的时候，调用相应API，SwitchTo/Live or SwitchTo/demo
		console.log('refreshMainPage ' + LogicData.getAccountState());
		this.sendToSwitchAccountStatus()
	},

	sendToSwitchAccountStatus:function(){
		var userData = LogicData.getUserData()
	  var urlToSend = LogicData.getAccountState()?NetConstants.CFD_API.SWITCH_TO_LIVE:NetConstants.CFD_API.SWITCH_TO_DEMO;
		console.log('sendToSwitchAccountStatus url = ' + urlToSend);
		NetworkModule.fetchTHUrl(
			urlToSend,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson) =>{
				 console.log(responseJson)
			},
			(result) => {
				console.log(result.errorMessage)
			}
		)
	},


	hideTabbar() {
		if(this.refs['myTabbar']){
			isTabbarShown = false;
			console.log("hideTabbar")
			this.refs['myTabbar'].getBarRef().show(false);
		}
	},

	getIsTabbarShown() {
		console.log("getIsTabbarShown " + isTabbarShown)
		return isTabbarShown;
	},

	showProgress() {
		this.refs['progressBar'] && this.refs['progressBar'].show()
	},

	hideProgress() {
		this.refs['progressBar'] && this.refs['progressBar'].hide()
	},

	showRegisterSuccessDialog(rewardAmount) {
		if(rewardAmount){
			this.refs[REGISTER_SUCCESS_DIALOG] && this.refs[REGISTER_SUCCESS_DIALOG].show(rewardAmount);
		}
	},

	initTabbarEvent() {
		var homeRef = this.refs['homeContent'].refs['wrap'].getWrappedRef()
		homeRef.tabWillFocus = EventCenter.emitHomeTabPressEvent;

		var stockRef = this.refs['stockContent'].refs['wrap'].getWrappedRef()
		stockRef.tabWillFocus = EventCenter.emitStockTabPressEvent;

		var exchangeRef = this.refs['exchangeContent'].refs['wrap'].getWrappedRef()
		exchangeRef.tabWillFocus = EventCenter.emitExchangeTabPressEvent;

		var meRef = this.refs['meContent'].refs['wrap'].getWrappedRef()
		meRef.tabWillFocus = EventCenter.emitMeTabPressEvent;
	},

	componentDidMount: function() {
		ayondoLoginResult = this.ayondoLoginResult
		refreshMainPage = this.refreshMainPage
		showSharePage = this._doShare
		gotoLoginPage = this.gotoLoginPage
		this.initTabbarEvent()
		didAccountChangeSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>this.refreshMainPage());
		didAccountLoginOutSideSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGIN_OUT_SIDE, ()=>this.gotoLoginPage());
		var currentNavigatorIndex = LogicData.getTabIndex();
		if(_navigators && _navigators.length > currentNavigatorIndex){
			_navigator = _navigators[currentNavigatorIndex];
		}

		var url = Linking.getInitialURL().then((url) => {
			if (url) {
				console.log('Initial url is: ' + url);
				this._handleDeepLink(url)
			}
		}).catch(err => console.error('An deep link error occurred', err));

		if (Platform.OS === 'ios') {
			Linking.addEventListener('url', this._handleOpenURL);
		} else {
			this.recevieDataSubscription = RCTNativeAppEventEmitter.addListener(
				'nativeSendDataToRN',
				(args) => {
					if (args[0] == 'openURL') {
						this._handleDeepLink(args[1])
					}
				}
			)
		}

		this.showNotification()

		/*
		Data format:
		{
			"lastDate": "9/20/2016",
			"isCheckInDialogShown": true
		};
		*/


		StorageModule.loadLastSuperPriorityHintData()
		.then((lastDateInfo) => {
			var needShowDialog = false;
			if(lastDateInfo){
				//lastDateInfo = `{"lastDate":"09/19/2016","isCheckInDialogShown":false}`
				var data = JSON.parse(lastDateInfo);
				var lastDate = data["lastDate"];
				var userData = LogicData.getUserData();
	      var isLogin = Object.keys(userData).length != 0;
				var today = new Date().getDateString();

				//Dialog will only show up once a day.
				//If user login today, the dialog won't show until the next day.
				if(today != lastDate && ((!isLogin) || (isLogin && !data["isCheckInDialogShown"]))){
					needShowDialog = true;
				}
			}else{
				needShowDialog = true;
			}

			if(needShowDialog){
				this.refs[SUPER_PRIORITY_HINT].show();
			}
		})
	},

	backAndroidHandler: function(){
		console.log("hardwareBackPress");
		if (_navigator && _navigator.getCurrentRoutes().length > 1) {
			_navigator.pop();
			WebSocketModule.cleanRegisteredCallbacks()

			console.log("hardwareBackPress return true");
			return true;
		}

		console.log("hardwareBackPress return false");
		return false;
	},

	componentWillMount: function(){
 		BackAndroid.addEventListener('hardwareBackPress', this.backAndroidHandler);
	},

	componentWillUnmount: function() {
		if (Platform.OS === 'ios') {
			Linking.removeEventListener('url', this._handleOpenURL);
		} else {
			this.recevieDataSubscription.remove();
		}

		didAccountChangeSubscription && didAccountChangeSubscription.remove();

		BackAndroid.removeEventListener('hardwareBackPress', this.backAndroidHandler);
	},

	_handleOpenURL: function(event) {
		console.log("url:", event.url);
		this._handleDeepLink(event.url)
	},

	_doShare: function(data){
		this.refs[SHARE_PAGE].showWithData(data);
	},

	_handleDeepLink: function(url) {
		console.log('handleDeeplink: ' + url)

		if(url.startsWith('cfd://page/share')) {
			TalkingdataModule.trackCurrentEvent();

			var json = this.getJsonFromUrl(url)
			this.refs[SHARE_PAGE].showWithData(json);
		}
		else if(url.startsWith('wx')){
			// callback from wx
			// do nothing.
		}
		else{
			_navigator.popToTop()
			if(url==='cfd://page/1') {//首页
				this.refs['myTabbar'].gotoTab("home")
			}
			else if(url==='cfd://page/2') {//行情首页
				this.refs['myTabbar'].gotoTab("trend")
			}
			else if(url==='cfd://page/3') {//行情自选
				initStockListTab = 0
				this.refs['myTabbar'].gotoTab("trend")
			}
			else if(url==='cfd://page/4') {
				this.refs['myTabbar'].gotoTab("trade")
				EventCenter.emitExchangeTabPressEvent()
			}
			else if(url==='cfd://page/5') {
				initExchangeTab = 1
				this.refs['myTabbar'].gotoTab("trade")
				EventCenter.emitExchangeTabPressEvent()
			}
			else if(url==='cfd://page/6') {
				initExchangeTab = 2
				this.refs['myTabbar'].gotoTab("trade")
				EventCenter.emitExchangeTabPressEvent()
			}
			else if(url==='cfd://page/me') {
				this.refs['myTabbar'].gotoTab("me")
			}
			else if(url==='cfd://page/back') {
				this.backAndShowTabbar()
			}
			initExchangeTab = 0
			initStockListTab = 1
		}
	},

	getJsonFromUrl: function(url) {
	  var result = {};

	  url.slice(url.indexOf("?")+1).split("&").forEach(function(part) {
	    var item = part.split("=");
	    result[item[0]] = decodeURIComponent(item[1]);
	  });
	  return result;
	},

	renderShareView: function(){
		return (
			<SharePage ref={SHARE_PAGE}/>
		);
	},

	renderRegisterSuccessPage: function(){
		return (
			<RegisterSuccessPage ref={REGISTER_SUCCESS_DIALOG}
			shareFunction={this._doShare}/>
		);
	},

	getNavigator: function(){
		return _navigator;
	},

	renderSuperPriorityHintPage: function(){
		return (
			<SuperPriorityHintPage ref={SUPER_PRIORITY_HINT}
				getNavigator={this.getNavigator}/>
		);
	},

	gotoStockDetail: function(pushData) {

		var currentNavigatorIndex = LogicData.getTabIndex();
	  console.log("push gotoStockDetail");
		console.log("push " + currentNavigatorIndex);

		var stockRowData = {
			name: pushData.CName,
			id: parseInt(pushData.StockID),
		}


		 if(_navigators[currentNavigatorIndex]){
			 console.log("aaaa");
			 _navigators[currentNavigatorIndex].push({
				name: STOCK_DETAIL_ROUTE,
			  stockRowData: stockRowData,
				});
		 }
	},

	gotoLoginPage: function(){
		LocalDataUpdateModule.removeUserData();
		LogicData.setAccountState(false)
		LogicData.setActualLogin(false)

		var currentNavigatorIndex = LogicData.getTabIndex();

		if(_navigators[currentNavigatorIndex]){
			_navigators[currentNavigatorIndex].push({
			 name: LOGIN_ROUTE,
			 });
		}

	},

	showNotification: function() {
		var pushData = LogicData.getPushData();
		if(pushData != null){
			if(pushData.type == "1" || pushData.type == "2"){
				this.gotoStockDetail(pushData);
			}else if(pushData.type == "3" ){
				if(pushData.deepLink){
					this._handleDeepLink(pushData.deepLink);
				}
				else if(pushData.tongrd_type === "deeplink") {
					this._handleDeepLink(pushData.tongrd_value)
				}
			}
		}
	},

	componentDidUpdate: function(){
		this.showNotification()
	},

	showTabInfo(){
		if(LogicData.getAccountState()){
			return (<Icon label="首页" type={glypy.Home} from={'myhero'} onActiveColor={systemBuleActual} onInactiveColor={iconGrey}/>)
		}else{
			return (<Icon label="首页" type={glypy.Home} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>)
		}
	},

	render: function() {
	    return (
	    	<View style={styles.container}>
					{this.renderShareView()}
		    	<StatusBar barStyle="light-content" backgroundColor='#1962dd'/>
		      	<Tabbar ref="myTabbar" barColor='#f7f7f7' style={{alignItems: 'stretch'}}>
			        <Tab name="home">
									<Icon ref={"homepageBtn"} label="首页"
										type={glypy.Home}
										from={'myhero'}
										onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue}
										onInactiveColor={iconGrey}/>
			          	<RawContent ref="homeContent">
		            		<Navigator
								style={styles.container}
								initialRoute={{name: HOME_PAGE_ROUTE,
												showTabbar: this.showTabbar,
												hideTabbar: this.hideTabbar,
												showProgress: this.showProgress,
												hideProgress: this.hideProgress}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="trend">
			          	<Icon ref={"trendBtn"} label="行情" type={glypy.Camera} from={'myhero'} onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent style={{width: 100}} ref="stockContent">
		            		<Navigator
								style={styles.container}
								initialRoute={{name: STOCK_LIST_VIEW_PAGER_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="trade">
			          	<Icon ref={"tradeBtn"} label="仓位" type={glypy.Stat} from={'myhero'} onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue} onInactiveColor={iconGrey}/>
			        	<RawContent ref="exchangeContent">
			            	<Navigator
								style={styles.container}
								initialRoute={{name: STOCK_EXCHANGE_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="me">
			          	<Icon ref={"meBtn"} label="我的" type={glypy.Settings} from={'myhero'} onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent ref="meContent">
							<Navigator
								style={styles.container}
								initialRoute={{name: ME_ROUTE, showTabbar: this.showTabbar, hideTabbar: this.hideTabbar}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
		        	</Tab>
		      	</Tabbar>
					<LoadingIndicator ref='progressBar'/>
					{this.state.showTutorial ? <TutorialPage type={this.state.tutorialType} hideTutorial={this.hideTutorial}/> : null }
					{this.renderRegisterSuccessPage()}
					{this.renderSuperPriorityHintPage()}
      	</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
		alignItems: 'stretch',
	},
});

module.exports = MainPage;

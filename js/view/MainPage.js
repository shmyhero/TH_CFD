'use strict';

import React from 'react';
import {
    BackAndroid,
    StyleSheet,
    View,
    Text,
    Navigator,
    Linking,
	Platform,
	Image,
} from 'react-native';

import Tabbar, { Tab, RawContent,  Icon, IconWithBar, glypyMapMaker } from './component/react-native-tabbar';

var {EventCenter, EventConst} = require('../EventCenter')

var NativeSceneModule = require('../module/NativeSceneModule')
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
var AccountInfoPage = require('./AccountInfoPage');
var AccountNameModifyPage = require('./AccountNameModifyPage');
var MePage = require('./MePage')
var MyIncomePage = require('./MyIncomePage')
var MyCreditsPage = require('./MyCreditsPage')
var WithdrawIncomePage = require('./income/WithdrawIncomePage');
var WithdrawIncomeSubmittedPage = require('./income/WithdrawIncomeSubmittedPage');
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
var FirstDayWithDrawHint = require('./FirstDayWithDrawHint')
var ActivityModal = require('./ActivityModal')
var MyMessagesPage = require('./MyMessagesPage')
var DevelopPage = require('./DevelopPage')
var PaymentPage = require('./PaymentPage')
var DepositWithdrawPage = require('./DepositWithdrawPage')
var NativeDataModule = require('../module/NativeDataModule')

var BindCardPage = require('./withdraw/BindCardPage')
var BindCardResultPage = require('./withdraw/BindCardResultPage')
var WithdrawPage = require('./withdraw/WithdrawPage')
var WithdrawSubmittedPage = require('./withdraw/WithdrawSubmittedPage')
var PromotionCodePage = require('./PromotionCodePage');

var TalkingdataModule = require('../module/TalkingdataModule')
var WebSocketModule = require('../module/WebSocketModule');
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var StorageModule = require('../module/StorageModule');
var OpenAccountRoutes = require('./openAccount/OpenAccountRoutes');
var DepositWithdrawFlow = require('./DepositWithdrawFlow');
var DepositPage = require('./DepositPage');
var RankingPage = require('./RankingPage');
var UserHomePage = require('./UserHomePage');
var FSModule = require('../module/FSModule');
var CustomKeyboard = require('./CustomKeyboard');
var NewTweetPage = require('./tweet/NewTweetPage');
var DynamicStatusConfig = require('./DynamicStatusConfig');

var TutorialPage = require('./TutorialPage');
var LS = require('../LS');
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
export let MY_CREDITS_ROUTE = 'myCredits'
export let WITHDRAW_INCOME_ROUTE = 'withdrawIncomePage';
export let WITHDRAW_INCOME_SUBMITTED_ROUTE = 'withdrawIncomeSubmittedPage';
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
export let DEPOSIT_WITHDRAW_FLOW = 'deposit_withdraw_flow'
export let DEPOSIT_PAGE = 'deposit_page'
export let EDIT_OWN_STOCKS_ROUTE = 'editownstocks'
export let EDIT_ALERT_ROUTE = 'editalert'
export let SHARE_ROUTE = 'share'
export let DAY_SIGN_ROUTE = 'daySign'
export let MY_MESSAGES_ROUTE = 'myMessages'
export let DEVELOP_ROUTE = 'develop'
export let PAYMENT_PAGE = 'payment'
export let DEPOSIT_WITHDRAW_ROUTE = 'depositWithdrawRoute'
export let WITHDRAW_BIND_CARD_ROUTE = 'withdrawBindCardRoute'
export let WITHDRAW_ROUTE = 'withdrawRoute'
export let WITHDRAW_SUBMITTED_ROUTE = 'withdrawSubmittedRoute'
export let WITHDRAW_RESULT_ROUTE = 'withdrawFailedRoute'
export let RANKING_PAGE_ROUTE = 'rankingPageRoute'
export let USER_HOME_PAGE_ROUTE = 'userHomePageRoute'
export let PROMOTION_CODE_PAGE_ROUTE = 'promotionCodePage'
export let NEW_TWEET_PAGE_ROUTE = 'newTweetPageRoute'
export let DYNAMIC_STATUS_CONFIG = 'DynamicStatusConfigRoute'

const NoBackSwipe ={
  ...Navigator.SceneConfigs.PushFromRight,
    gestures: {
      pop: {},
    },
};

const glypy = glypyMapMaker({
  Home: 'f04f',
  Camera: 'f04e',
  Stat: 'f050',
  Settings: 'f054',
  Ranking: 'f051'
});

const systemBlue = '#1a61dd'
const iconGrey = '#adb1b7'
const systemBuleActual = '#425a85'

export var initExchangeTab = 0
export var initStockListTab = 1

export var hideTabbar
export var showTabbar
export var hideProgress
export var showProgress
export var ayondoLoginResult
export var refreshMainPage
export var showSharePage
export var showKeyboard
export var getIsKeyboardShown;
export var updateKeyboardErrorText
export var gotoLoginPage
export var gotoTrade
export var gotoLiveLogin;
export var gotoStockDetail;

var recevieDataSubscription = null
var didAccountChangeSubscription = null;
var didAccountLoginOutSideSubscription = null;
var didDisableTabbarSubscription = null;
var didLanguageChangeSubscription = null;

var SHARE_PAGE = 'SharePage'
var KEYBOARD_PAGE = 'KeyboardPage'
var REGISTER_SUCCESS_DIALOG = 'RegisterSuccessDialog'
var SUPER_PRIORITY_HINT = 'SuperPriorityHint'
var ACTIVITY_MODAL = 'activityModal'
var FIRST_DAY_WITHDRAW_HINT = 'FirstDayWithDrawHint'
var isTabbarShown = true

export var HOME_PAGE_TAB_INDEX = 0;
export var STOCK_LIST_PAGE_TAB_INDEX = 1;
export var STOCK_EXCHANGE_TAB_INDEX = 2;
export var RANKING_TAB_INDEX = 3;
export var ME_PAGE_TAB_INDEX = 4;

var HIDE_RANKING_TAB = false;			//Hide ranking tab if necessary

var MainPage = React.createClass({
	getInitialState: function() {
		return {
			showTutorial: false,
			tutorialType: 'trade',
		};
	},

	_configureScene(route){
		if (route.name === STOCK_DETAIL_ROUTE) {
			return NoBackSwipe
		}
		else {
			return Navigator.SceneConfigs.PushFromRight
		}
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
					showRegisterSuccessDialog={this.showRegisterSuccessDialog}
					isTabbarShown={this.getIsTabbarShown}
					isMobileBinding={route.isMobileBinding}
					popToStackTop={route.popToStackTop}
					getNextRoute={route.getNextRoute}
					onLoginFinish={route.onLoginFinish}/>
			);
		} else if (route.name === UPDATE_USER_INFO_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<UpdateUserInfoPage navigator={navigationOperations}
					popToRoute={route.popToRoute}
					showRegisterSuccessDialog={this.showRegisterSuccessDialog}
					popToStackTop={route.popToStackTop}
					getNextRoute={route.getNextRoute}
					needShowPromoCode={route.needShowPromoCode}
					onLoginFinish={route.onLoginFinish}/>
				</View>
			);
		} else if (route.name === MY_HOME_ROUTE) {
      var strWD= LS.str('WODE')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strWD} />
					<MyHomePage navigator={navigationOperations}/>
				</View>
			);
		} else if (route.name === MY_NOTIFICATION_ROUTE) {
      var strTZ= LS.str('TZ')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strTZ} showBackButton={true} navigator={navigationOperations}/>
					<MyNotifications navigator={navigationOperations} />
				</View>
			);
		} else if (route.name === MY_SETTING_ROUTE) {
      var strSZ= LS.str('SZ')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strSZ} showBackButton={true} navigator={navigationOperations}/>
					<MySettings navigator={navigationOperations} />
				</View>
			);
		} else if (route.name === WECHAT_LOGIN_CONFIRM_ROUTE) {
      var strSY= LS.str('SHOUYE')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strSY} showBackButton={true} navigator={navigationOperations}/>
					<WechatLoginConfirmPage navigator={navigationOperations} />
				</View>
			);
		} else if (route.name === STOCK_LIST_ROUTE) {
			return (
				<StockListPage navigator={navigationOperations} style={{flex: 1}} pageKey={route.pageKey}/>
			);
		} else if (route.name === STOCK_LIST_VIEW_PAGER_ROUTE) {
			showTabbar()
			return (
				<StockListViewPager navigator={navigationOperations} style={{flex: 1}}/>
			);
		} else if (route.name === STOCK_SEARCH_ROUTE) {
			hideTabbar()
			console.log("route.searchType " + route.searchType)
			return (
				<View style={{flex: 1}}>
					<NavBar onlyShowStatusBar={true}
						backgroundColor={ColorConstants.title_blue()}/>
					<StockSearchPage navigator={navigationOperations}
						style={{flex: 1}}
						searchType={route.searchType}
						onGetItem={route.onGetItem}/>
				</View>
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
					openPrice={route.stockRowData.open}
					onPopUp={route.onPopUp}/>
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
					onWebPageLoaded={route.onWebPageLoaded}
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
					themeColor={route.themeColor}
					isShowNav={route.isShowNav}
					isLoadingColorSameAsTheme={route.isLoadingColorSameAsTheme}
					logTimedelta={route.logTimedelta}/>
			)
		} else if (route.name === QA_ROUTE) {
			hideTabbar();
			return (
				<QAPage />
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
					<AccountInfoPage navigator={navigationOperations}/>
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
				showFirstDayWithDrawHint={this.showFirstDayWithDrawHint}
				/>
			)
		} else if (route.name === RANKING_PAGE_ROUTE){
			showTabbar();
			return (
				<RankingPage navigator={navigationOperations} routeMapper={this.RouteMapper}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		} else if(route.name === MY_CREDITS_ROUTE) {
			hideTabbar();
			return (
				<MyCreditsPage navigator={navigationOperations} />
			)
		} else if(route.name === MY_INCOME_ROUTE) {
			hideTabbar();
			return (
				<MyIncomePage navigator={navigationOperations} />
			)
		} else if(route.name === WITHDRAW_INCOME_ROUTE) {
			hideTabbar();
			return (
				<WithdrawIncomePage navigator={navigationOperations} routeMapper={this.RouteMapper}
					minTransfer={route.minTransfer}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		} else if(route.name === WITHDRAW_INCOME_SUBMITTED_ROUTE) {
			hideTabbar();
			return (
				<WithdrawIncomeSubmittedPage navigator={navigationOperations} routeMapper={this.RouteMapper}
					popToOutsidePage={route.popToOutsidePage}/>
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
      var strGD = LS.str('GD')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strGD} showBackButton={true} navigator={navigationOperations}/>
					<MeConfigPage navigator={navigationOperations} onPopBack={route.onPopBack}/>
				</View>
			)
		} else if(route.name === ME_CONFIG_MODIFY_PWD_ROUTE){
			hideTabbar();
      var strXGDLMM = LS.str('XGDLMM')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strXGDLMM} showBackButton={true} navigator={navigationOperations}/>
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
      var strZHBD = LS.str('ZHBD')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strZHBD} showBackButton={true} navigator={navigationOperations}/>
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
      var strSPZC = LS.str('SPZC')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strSPZC} showBackButton={true}
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						navigator={navigationOperations}/>
					<LiveRegisterPage navigator={navigationOperations}/>
				</View>
			)
		} else if (route.name === LIVE_UPDATE_USER_INFO_ROUTE) {
      var strSPZC = LS.str('SPZC')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strSPZC} showBackButton={true}
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						navigator={navigationOperations}/>
					<LiveUpdateUserInfoPage navigator={navigationOperations}/>
				</View>
			)
		} else if (route.name === LIVE_REGISTER_STATUS_ROUTE) {
			showTabbar()
      var strSPJY = LS.str('SPJY')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strSPJY}
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						navigator={navigationOperations}/>
					<LiveRegisterStatusPage navigator={navigationOperations}/>
				</View>
			)
		} else if (route.name === STOCK_POPULARITY_ROUTE) {
			hideTabbar()
      var strSCQX = LS.str('SCQX')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strSCQX} showBackButton={true}
						backButtonOnClick={()=>{
								this.backAndShowTabbar()
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
					showTabbar={showTabbar} phone={route.phone}
					backToTop={route.backToTop}/>
			)
		}
		else if (route.name === DEPOSIT_WITHDRAW_FLOW) {
			hideTabbar()
			return (
				<DepositWithdrawFlow navigator={navigationOperations} showTabbar={showTabbar}/>
			)
		}
		else if (route.name === DEPOSIT_PAGE) {
			hideTabbar()
			return (
				<DepositPage navigator={navigationOperations} popToOutsidePage={route.popToOutsidePage} showTabbar={showTabbar}/>
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
      var strWDXX = LS.str('WDXX')
			return(
				<View style={{flex: 1}}>
					<NavBar title={strWDXX} showBackButton={true}
						backButtonOnClick={()=>this.backAndShowTabbar()}
						navigator={navigationOperations}/>
					<MyMessagesPage navigator={navigationOperations} routeMapper={this.RouteMapper}
  					onPopToRoute={route.onPopToRoute}/>
				</View>
			)
		}else if (route.name === DEVELOP_ROUTE){
			hideTabbar();
      var strTEST = LS.str('TEST')
			return (
				<View style={{flex: 1}}>
					<NavBar title={strTEST} showBackButton={true}
						backButtonOnClick={()=>this.backAndShowTabbar()}
						navigator={navigationOperations}/>
					<DevelopPage navigator={navigationOperations} routeMapper={this.RouteMapper}
  					onPopToRoute={route.onPopToRoute}/>
				</View>
			);
		}else if (route.name === PAYMENT_PAGE){
			hideTabbar();
			return (
				<View style={{flex: 1}}>
					<PaymentPage navigator={navigationOperations} routeMapper={this.RouteMapper}
						onPopToRoute={route.onPopToRoute}
						url={route.url}
						popToOutsidePage={route.popToOutsidePage}
						onNavigationStateChange={route.onNavigationStateChange}
						showTabbar={showTabbar}
						//title={route.title}
						backFunction={()=>{
							if (route.backFunction) {
								route.backFunction()
							}
						}}/>
				</View>
			);
		}else if (route.name === DEPOSIT_WITHDRAW_ROUTE){
			hideTabbar();
			return (
				<DepositWithdrawPage navigator={navigationOperations} routeMapper={this.RouteMapper}
					onPopToOutsidePage={route.onPopToOutsidePage}/>
			);
		}else if (route.name === WITHDRAW_BIND_CARD_ROUTE){
			hideTabbar();
			return (
				<BindCardPage navigator={navigationOperations}
					routeMapper={this.RouteMapper}
					bankCardStatus={route.bankCardStatus}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		}else if (route.name === WITHDRAW_RESULT_ROUTE){
			hideTabbar();
			return (
				<BindCardResultPage navigator={navigationOperations}
					routeMapper={this.RouteMapper}
					bankCardStatus={route.bankCardStatus}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		}else if (route.name === WITHDRAW_ROUTE){
			hideTabbar();
			return (
				<WithdrawPage navigator={navigationOperations} routeMapper={this.RouteMapper}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		}else if (route.name === WITHDRAW_SUBMITTED_ROUTE){
			hideTabbar();
			return (
				<WithdrawSubmittedPage navigator={navigationOperations} routeMapper={this.RouteMapper}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		}else if (route.name === USER_HOME_PAGE_ROUTE){
			hideTabbar();
			return (
				<UserHomePage navigator={navigationOperations}
					userId={route.userData.userId}
					userName={route.userData.userName}
          isPrivate={route.userData.isPrivate}
					backRefresh={route.backRefresh}
					routeMapper={this.RouteMapper}
					popToOutsidePage={route.popToOutsidePage}/>
			)
		}else if (route.name === PROMOTION_CODE_PAGE_ROUTE){
			hideTabbar();
			return (
				<PromotionCodePage navigator={navigationOperations}
					routeMapper={this.RouteMapper}
					onPop={route.onPop}/>
			)
		}else if(route.name === NEW_TWEET_PAGE_ROUTE){
			return (
				<NewTweetPage navigator={navigationOperations}
					routeMapper={this.RouteMapper}
					onPopOut={route.onPopOut}/>
			)
		}else if(route.name === DYNAMIC_STATUS_CONFIG){
			hideTabbar();
			return(
				<DynamicStatusConfig 
					navigator={navigationOperations}
					routeMapper={this.RouteMapper}
					onPopOut={route.onPopOut}
				/>
			)
		}

	},

	showTutorial: function(type){
		this.setState({tutorialType:type, showTutorial:true})
	},

	hideTutorial: function(){
		this.setState({showTutorial: false})
	},

	backAndShowTabbar: function() {
		if(_navigator){
			var routes = _navigator.getCurrentRoutes();
			if(routes && routes.length == 2){
				this.showTabbar();
			}
			if(routes.length > 0 && routes[routes.length - 1].backFunction){
				routes[routes.length - 1].backFunction()
			}
			_navigator.pop();
		}
	},

	showTabbar() {
		if(this.refs['myTabbar']){
			isTabbarShown = true;
			console.log("showTabbar")
			this.setTabbarEnable(true);
			this.refs['myTabbar'].getBarRef().show(true);
	 	}
	},

	ayondoLoginResult(result, stayInCurrentRoute){
		console.log('login:ayondoLoginResult'+result);
		if(!stayInCurrentRoute){
	  	this.backAndShowTabbar();
		}

		console.log('ayondo login result :' + result);
		if(result){
			LogicData.setAccountState(true)//实盘状态 true
			LogicData.setActualLogin(true)//实盘登陆状态 true
		}else{
			CookieManager.clearAll((err, res) => {
				console.log('cookies cleared!');
			});
		}
	},

	onLanguageChanged(){
		if(!LogicData.getAccountState()){
			this.refs["homepageBtn"].setLabel(LS.str('SHOUYE'));
		}else{
			this.refs["homepageBtn"].setLabel(LS.str('DT'));
		}
		this.refs["trendBtn"].setLabel(LS.str('HANGQING'));
		this.refs["tradeBtn"].setLabel(LS.str('CANGWEI'));
		if(!HIDE_RANKING_TAB){
			this.refs["rankingBtn"] && this.refs["rankingBtn"].setLabel(LS.str('DAREN'));
		}
		this.refs["meBtn"].setLabel(LS.str('WODE'));
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

		if(!LogicData.getAccountState()){
			this.refs['myTabbar'].hideTab("ranking");
			this.refs["homepageBtn"].setLabel(LS.str('SHOUYE'));
		}else{
			this.refs['myTabbar'].showTab("ranking");
			this.refs["homepageBtn"].setLabel(LS.str('DT'));
		}

		console.log('refresh for Tab Icon Color ... ');


		//监听到模拟或实盘状态切换的时候，调用相应API，SwitchTo/Live or SwitchTo/demo
		console.log('refreshMainPage ' + LogicData.getAccountState());
		this.sendToSwitchAccountStatus()
	},

	sendToSwitchAccountStatus:function(){
		var userData = LogicData.getUserData()
		if(userData.token == undefined){return}
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
			this.setTabbarEnable(false);
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

	showFirstDayWithDrawHint(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		StorageModule.loadFirstDayWithDraw().then((value) => {
			if (value !== null) {
				console.log("meData num="+value);
				if(!notLogin && value === '1'){
				 this.refs[FIRST_DAY_WITHDRAW_HINT] && this.refs[FIRST_DAY_WITHDRAW_HINT].show();
				 this.requestForFirstDayRewarded();
			 }
			}
		});
	},

	requestForFirstDayRewarded:function(){
		var userData = LogicData.getUserData();
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_REWARD_FIRSTDAY_REWARDED,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				cache: 'offline',
			},
			function(responseJson) {
			}.bind(this)
		)
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
		this.setTabbarEnable(true);
		ayondoLoginResult = this.ayondoLoginResult
		refreshMainPage = this.refreshMainPage
		showSharePage = this._doShare
    showKeyboard = this.showKeyboard
    getIsKeyboardShown = this.getIsKeyboardShown
    updateKeyboardErrorText = this.updateKeyboardErrorText
		gotoLoginPage = this.gotoLoginPage
		gotoTrade = this.gotoTrade
		gotoLiveLogin = this.gotoLiveLogin
		gotoStockDetail = this.gotoStockDetail
		this.initTabbarEvent()
		didAccountChangeSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>this.refreshMainPage());
		didAccountLoginOutSideSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGIN_OUT_SIDE, ()=>this.gotoLoginPage());
		didDisableTabbarSubscription = EventCenter.getEventEmitter().addListener(EventConst.DISABLE_TABBAR, ()=>this.setTabbarEnable(false));
		didLanguageChangeSubscription = EventCenter.getEventEmitter().addListener(EventConst.LANGUAGE_CHANGED, ()=>this.onLanguageChanged());
		
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

		//Only show the super priority dialog when user isn't under live state.

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

						if(!data["isCheckInDialogShown"] && LogicData.getAccountState()){
							//Time for showing super priority dialog but we don't want it to be shown in live mode.
							needShowDialog = false;
							this.refs[SUPER_PRIORITY_HINT].updateLastShow();
						}
					}
				}else{
					needShowDialog = true;
				}

				if(needShowDialog){
					this.refs[SUPER_PRIORITY_HINT].show();
				}
				else {
					this.canShowActivityModal = true;
				}
			});

			this.showActivityModal();

			if(!LogicData.getAccountState()){
				this.refs['myTabbar'].hideTab("ranking");
			}else{
				this.refs['myTabbar'].showTab("ranking");
			}

			this.showFirstDayWithDrawHint();
	},

	canShowActivityModal : false,

	showActivityModal: function(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			//Load new activity
			var url = NetConstants.CFD_API.START_UP_ACTIVITY;
			url = url.replace("<isLive>", LogicData.getAccountState())

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				(responseJson) => {

					StorageModule.loadLastActivityData()
					.then((LastActivityData) => {

						console.log("currentActivityData " + JSON.stringify(responseJson))
						StorageModule.loadLastActivityData()
						.then((LastActivityData) => {
							//Display last activity modal
							console.log("LastActivityData " + LastActivityData)
							var data = JSON.parse(LastActivityData);

							if (responseJson.id == 0){
								StorageModule.setLastActivityData(JSON.stringify(responseJson))
							}else if (data != null && data.id == responseJson.id){
								//The API returns same activity body. Display last activity modal
								if (this.canShowActivityModal && data != null && data.id != 0 && !data.shown){
									data.shown = true;
									this.refs[ACTIVITY_MODAL].show(data.name,
										data.pageUrl,
										data.picUrl)
									console.log("Show Activity Modal")
									StorageModule.setLastActivityData(JSON.stringify(data))
								}
							}
							else if (data == null || data.id != responseJson.id || !data.shown){
								//Preload the image and display it at next time.
								Image.prefetch(responseJson.picUrl).then(()=>{
									console.log("loadActivityData finished")
									responseJson.isShown = false;
									StorageModule.setLastActivityData(JSON.stringify(responseJson))
								});
							}
						});


					});


				},
				(result) => {

				}
			);


		}
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
//		HIDE_RANKING_TAB = !LogicData.getDebugStatus();
 		BackAndroid.addEventListener('hardwareBackPress', this.backAndroidHandler);
	},

	componentWillUnmount: function() {
		if (Platform.OS === 'ios') {
			Linking.removeEventListener('url', this._handleOpenURL);
		} else {
			this.recevieDataSubscription.remove();
		}

		didAccountChangeSubscription && didAccountChangeSubscription.remove();
		didLanguageChangeSubscription && didLanguageChangeSubscription.remove();
		BackAndroid.removeEventListener('hardwareBackPress', this.backAndroidHandler);
	},

	_handleOpenURL: function(event) {
		console.log("url:", event.url);
		this._handleDeepLink(event.url)
	},

	_doShare: function(data){
		this.refs[SHARE_PAGE].showWithData(data);
	},

  showKeyboard: function(data){
		this.refs[KEYBOARD_PAGE].showWithData(data);
  },

  getIsKeyboardShown: function(){
    return this.refs[KEYBOARD_PAGE].getIsShown()
  },

  updateKeyboardErrorText: function(value){
    this.refs[KEYBOARD_PAGE].updateErrorText(value);
  },

	_handleDeepLink: function(url) {
		console.log('handleDeeplink: ' + url)

		if(url.startsWith('cfd://page/share/session')){
			var json = this.getJsonFromUrl(url)
			this.refs[SHARE_PAGE].shareToSession(json);
		}else if(url.startsWith('cfd://page/share/timeline')){
			var json = this.getJsonFromUrl(url)
			this.refs[SHARE_PAGE].shareToTimeline(json);
		}
		else if(url.startsWith('cfd://page/share')) {
			TalkingdataModule.trackCurrentEvent();

			var json = this.getJsonFromUrl(url)
			this.refs[SHARE_PAGE].showWithData(json);
		}
		else if(url.startsWith('wx')){
			// callback from wx
			// do nothing.
		}
		else if(url==='cfd://page/feedback'){
			NativeSceneModule.launchNativeScene('MeiQia');
		}
		else if(url==='cfd://page/back') {
			this.backAndShowTabbar()
		}
		else if(url==='cfd://page/registerAndDeposit') {
			this.doRegisterAndDeposit(false)
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
			else if(url==='cfd://page/ranking') {
				this.refs['myTabbar'].gotoTab("ranking")
				EventCenter.emitRankingTabPressEvent()
			}
			else if(url==='cfd://page/me') {
				this.refs['myTabbar'].gotoTab("me")
			}
			else if(url==='cfd://page/stock') {
				var textList = url.split("/");
				var id = textList[textList.length-1]
				this.gotoStockDetail({
					CName: "",
					StockID: id,
				});
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

	//***
	//入金活动流程：
	//	未开户用户（未绑定手机号）：-> 登录 -> 绑定手机号 -> 开户
	//	未开户用户（已绑定手机号）：-> 登录 -> 开户
	//	已开户用户、未登录模拟盘：-> 登录 -> 实盘登录 -> 入金
	//	已开户用户、已登录模拟盘、未登录实盘：-> 实盘登录 -> 入金
	//	已开户用户、已登录模拟盘、已登录实盘：-> 入金
	//  *入金及开户的返回会回到我的页面
	//***
	goToDeposit: function(afterLogin){
		if(LogicData.getActualLogin()){
			console.log("doRegisterAndDeposit 实盘已登录")
			var routes = _navigator.getCurrentRoutes();
			var new_routes = []
			new_routes[0] = routes[0]
			new_routes.push({
				name: DEPOSIT_WITHDRAW_ROUTE,
				onPopToOutsidePage: ()=>{
					_navigator.popToTop()
					this.refs['myTabbar'].gotoTab("me")
				},
			});
			new_routes.push({
				name: DEPOSIT_PAGE,
				onPopToOutsidePage:()=>{
					_navigator.popToTop()
					this.refs['myTabbar'].gotoTab("me")
				},
			});
			_navigator.immediatelyResetRouteStack(new_routes)
		}else{
			console.log("doRegisterAndDeposit 准备实盘登录")
			this.gotoLiveLogin(_navigator, true,
				()=>{
					this.goToDeposit(afterLogin);
			},
			afterLogin);
		}
	},

	getOpenLiveAccountRoute: function(){
		return new Promise((resolve)=>{
			var meData = LogicData.getMeData();
			OpenAccountRoutes.getLatestInputStep()
			.then(step=>{
				console.log("getLatestInputStep " + step)
				var lastStep = step

				var OARoute = {
					name: OPEN_ACCOUNT_ROUTE,
					step: lastStep,
					onPop: ()=>{
						_navigator.popToTop()
						this.refs['myTabbar'].gotoTab("me")
					},
				};

				if(!meData.phone){
					OARoute = {
						name: LOGIN_ROUTE,
						nextRoute: OARoute,
						isMobileBinding: true,
					};
				}

				resolve(OARoute)
			});
		});
	},

	goToRouteAfterLogin: function(route){
		console.log("登录后转换页面")
		var routes = _navigator.getCurrentRoutes();
		var currentRouteIndex = -1;
		for (var i=0; i<routes.length; ++i) {
			if(routes[i].name === LOGIN_ROUTE){
				currentRouteIndex = i;
			}
		}
		if (currentRouteIndex >= 0){
			routes = routes.slice(0, currentRouteIndex+1)
			routes[currentRouteIndex] = route
		}else{
			routes.push(route)
		}
		_navigator.immediatelyResetRouteStack(routes);
	},

	gotoOpenLiveAccount:function(afterLogin){
		this.getOpenLiveAccountRoute().then((route)=>{
			//绑定手机号
			var meData = LogicData.getMeData();
			if(!meData.phone){
				console.log("doRegisterAndDeposit 准备开户 未绑定手机号")
				var nextRoute = {
					name: LOGIN_ROUTE,
					nextRoute: route,
					isMobileBinding: true,
				};
				if(afterLogin){
					this.goToRouteAfterLogin(nextRoute)
				}else{
					_navigator.push(nextRoute);
				}
			}else{
				console.log("doRegisterAndDeposit 准备开户 已绑定手机号")
				if(afterLogin){
					this.goToRouteAfterLogin(route)
				}else{
					_navigator.push(route);
				}
			}
		});
	},

	doRegisterAndDeposit: function(afterLogin){
		//this.refs['myTabbar'].gotoTab("me")
		if (LogicData.getAccountState()){
			console.log("doRegisterAndDeposit 实盘状态")
			return this.goToDeposit(afterLogin);
		}else{
			var meData = LogicData.getMeData();
			var userData = LogicData.getUserData()
			var notLogin = Object.keys(userData).length === 0
			if(!notLogin){
				console.log('提示：','liveAccStatus = '+meData.liveAccStatus + ', liveAccRejReason = '+ meData.liveAccRejReason)
			  var accStatus = meData.liveAccStatus;
				if (accStatus == 1){
					console.log("doRegisterAndDeposit 实盘已开户，未登录")
					this.goToDeposit(afterLogin);
				}else if(accStatus == 2){
					console.log("doRegisterAndDeposit 实盘已开户，审核中")
					alert("实盘开户审核中...")
				}
				else{
					console.log("doRegisterAndDeposit 实盘未开户")
					this.gotoOpenLiveAccount(afterLogin);
				}
			}else{
				console.log("doRegisterAndDeposit 未登录")
				_navigator.push({
					name: LOGIN_ROUTE,
					onLoginFinish: ()=> this.doRegisterAndDeposit(true),
				});
			}
		}
	},
	//***
	//入金活动
	//***

	renderShareView: function(){
		return (
			<SharePage ref={SHARE_PAGE}/>
		);
	},

  renderKeyBoard: function(){
    return(
      <CustomKeyboard ref={KEYBOARD_PAGE}/>
    )
  },

	renderRegisterSuccessPage: function(){
		return (
			<RegisterSuccessPage ref={REGISTER_SUCCESS_DIALOG}
			shareFunction={this._doShare}/>
		);
	},

	getNavigator: function(){
		var currentNavigatorIndex = LogicData.getTabIndex()
		console.log("_navigators[currentNavigatorIndex] " + currentNavigatorIndex)
		if(currentNavigatorIndex >= _navigators.length){
			return _navigators[_navigators.length - 1];
		}
		return _navigators[currentNavigatorIndex];
	},

	renderSuperPriorityHintPage: function(){
		return (
			<SuperPriorityHintPage ref={SUPER_PRIORITY_HINT}
				getNavigator={this.getNavigator}/>
		);
	},

	renderActivityModal: function(){
		return (
			<ActivityModal ref={ACTIVITY_MODAL} getNavigator={this.getNavigator}/>
		);
	},

	renderFirstDayWithDrawHintPage:function(){
		return (
			<FirstDayWithDrawHint ref={FIRST_DAY_WITHDRAW_HINT}
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

	gotoTrade:function(){
		_navigator.popToTop()
		this.refs['myTabbar'].gotoTab("trade")
	},

	gotoWithdrawResultPage: function(pushData){
		var currentNavigatorIndex = LogicData.getTabIndex();
	  	console.log("push gotoStockDetail");
		console.log("push " + currentNavigatorIndex);

		var stockRowData = {
			name: pushData.CName,
			id: parseInt(pushData.StockID),
		}

		var liveUserInfo = {}
		liveUserInfo.province = pushData.province;
		liveUserInfo.city = pushData.city;
		liveUserInfo.lastName = pushData.lastName;
		liveUserInfo.firstName = pushData.firstName;
		liveUserInfo.bankName = pushData.bankName;
		liveUserInfo.branch = pushData.branch;
		liveUserInfo.bankCardNumber = pushData.bankCardNumber;
		liveUserInfo.lastWithdraw = pushData.lastWithdraw;
		liveUserInfo.lastWithdrawAt = pushData.lastWithdrawAt;
		liveUserInfo.bankCardStatus = "Rejected";
		liveUserInfo.bankCardRejectReason = pushData.bankCardRejectReason;
		LogicData.setLiveUserInfo(liveUserInfo);

		if(_navigators[currentNavigatorIndex]){
			_navigators[currentNavigatorIndex].push({
				name: WITHDRAW_RESULT_ROUTE,
				bankCardStatus: "Rejected",
			});
		}
	},

	setTabbarEnable: function(value){
		this.refs["homepageBtn"].setEnable(value);
		this.refs["tradeBtn"].setEnable(value);
		this.refs["trendBtn"].setEnable(value);
		this.refs["meBtn"].setEnable(value);
		if(LogicData.getAccountState()){
			this.refs['rankingBtn'] && this.refs['rankingBtn'].setEnable(value);
		}
	},

	gotoLoginPage: function(){
		var userData = LogicData.getUserData();
		if (Object.keys(userData).length !== 0) {
			this.setTabbarEnable(false);
			console.log("gotoLoginPage");
			LocalDataUpdateModule.removeUserData()
			.then(()=>{
				var currentNavigatorIndex = LogicData.getTabIndex();
				console.log("gotoLoginPage " + currentNavigatorIndex);
				if(currentNavigatorIndex != 2){
					if(_navigators[currentNavigatorIndex]){
						_navigators[currentNavigatorIndex].push({
							name: LOGIN_ROUTE,
							popToStackTop: true,
						});
					}
				}else{
					this.setTabbarEnable(true);
					_navigators[currentNavigatorIndex].popToTop();
				}
			});
		}
	},

	gotoLiveLogin: function(navigator, doNotPopWhenFinished, onSuccess, afterLogin){
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}

		console.log("gotoAccountStateExce userId = " + userId);
		console.log("_navigator LogicData.getTabIndex() " + LogicData.getTabIndex())
		//console.log(_navigator)
		var strSPJY = LS.str('SPJY')
	
		var meData = LogicData.getMeData()
		
		console.log("meData.liveUsername ", meData.liveUsername)
		console.log("meData.liveEmail ", meData.liveEmail)
		console.log("meData.liveUsername ", meData.liveUsername)

		CookieManager.set({
			name: 'username',
			value: meData.liveUsername,
			domain: 'cn.tradehero.mobi',
			origin: 'cn.tradehero.mobi',
			path: '/',
			version: '1',
			expiration: '2029-05-30T12:30:00.00-05:00'
		}, (res, err)=>{
			console.log("err username", err)
			console.log("res username ", res)
			CookieManager.set({
				name: 'email',
				value: meData.liveEmail,
				domain: 'cn.tradehero.mobi',
				origin: 'cn.tradehero.mobi',
				path: '/',
				version: '1',
				expiration: '2029-05-30T12:30:00.00-05:00'
			}, (res, err)=>{
				console.log("err email", err)
				console.log("res email ", res)
				CookieManager.set({
					name: 'Lang',
					value: LogicData.getLanguageEn() == '1' ? 'en':'cn',
					domain: 'cn.tradehero.mobi',
					origin: 'cn.tradehero.mobi',
					path: '/',
					version: '1',
					expiration: '2029-05-30T12:30:00.00-05:00'
				}, (res, err)=>{

					CookieManager.set({
						name: 'TH_AUTH',
						value: userData.userId + '_' + userData.token,
						domain: 'cn.tradehero.mobi',
						origin: 'cn.tradehero.mobi',
						path: '/',
						version: '1',
						expiration: '2029-05-30T12:30:00.00-05:00'
					}, (res, err)=>{
					})
					console.log("err Lang", err)
					console.log('CookieManager.set =>', res);


					var url = "?redirect_uri=https://api.typhoontechnology.hk/api/live/oauth&state='+userId"
					var route = {
						name: NAVIGATOR_WEBVIEW_ROUTE,
						title:strSPJY,
						themeColor: ColorConstants.TITLE_BLUE_LIVE,
						onNavigationStateChange: (navState)=>{
							this.onWebViewNavigationStateChange(navState, doNotPopWhenFinished, onSuccess)
						},
						logTimedelta: true,
						url: NetConstants.LOGIN_LIVE,
					};

					if (afterLogin){
						console.log("刚登录过，接着实盘登录")
						this.goToRouteAfterLogin(route)
					}else{
						console.log("直接实盘登录")
						navigator.push(route);
					}
				})
			})
		})
		
		// CookieManager.set({
		// 	name: 'username',
		// 	value: meData.liveUsername,
		// 	domain: 'web.typhoontechnology.hk',
		// 	origin: 'web.typhoontechnology.hk',
		// 	path: '/',
		// 	version: '1',
		// 	expiration: '2029-05-30T12:30:00.00-05:00'
		// }, (res, err)=>{
		// 	CookieManager.set({
		// 		name: 'email',
		// 		value: meData.liveEmail,
		// 		domain: 'web.typhoontechnology.hk',
		// 		origin: 'web.typhoontechnology.hk',
		// 		path: '/',
		// 		version: '1',
		// 		expiration: '2029-05-30T12:30:00.00-05:00'
		// 	}, (res, err)=>{
		// 		CookieManager.set({
		// 			name: 'Lang',
		// 			value: LogicData.getLanguageEn() == '1'?'en':'cn',
		// 			domain: 'web.typhoontechnology.hk',
		// 			origin: 'web.typhoontechnology.hk',
		// 			path: '/',
		// 			version: '1',
		// 			expiration: '2029-05-30T12:30:00.00-05:00'
		// 		}, (res, err)=>{

		// 		})
		// 	})
		// })		
	},

	onWebViewNavigationStateChange: function(navState, doNotPopWhenFinished, onSuccess) {
		// todo
		console.log("my web view state changed: "+navState.url)

		CookieManager.get('http://cn.tradehero.mobi', (err, res) => {
  			console.log('about cookie 2', res);
		})

		if(navState.url.indexOf('live/loginout.html')>0){
			console.log('success login ok');
			ayondoLoginResult(true, doNotPopWhenFinished);

			if(onSuccess){
				onSuccess();
			}
		}else if(navState.url.indexOf('live/oauth/error')>0){
			console.log('success login error');
			ayondoLoginResult(false, doNotPopWhenFinished)
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
				// else if(pushData.tongrd_type === "deeplink") {
				// 	this._handleDeepLink(pushData.tongrd_value)
				// }
			}else if(pushData.type == "4"){
				this.gotoWithdrawResultPage(pushData);
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

	renderRankingTab: function(){
    var strDR = LS.str('DAREN')
		if(HIDE_RANKING_TAB){
			return;
		}else {
			return (
				<Tab name="ranking">
					<Icon ref={"rankingBtn"} label={strDR} type={glypy.Ranking} from={'myhero'} onActiveColor={systemBuleActual} onInactiveColor={iconGrey}/>
					<RawContent ref={component => {
						console.log("component " + component)
						this.rankingContent = component;
						if(component){
							var rankingRef = this.rankingContent.refs['wrap'].getWrappedRef();
							rankingRef.tabWillFocus = EventCenter.emitRankingTabPressEvent;
						}
					}}>
          <Navigator
						style={styles.container}
						initialRoute={{name: RANKING_PAGE_ROUTE, showTabbar: this.showTabbar, hideTabbar: this.hideTabbar}}
						configureScene={() => Navigator.SceneConfigs.PushFromRight}
						renderScene={this.RouteMapper} />
					</RawContent>
				</Tab>
			);
		}
	},

	renderTabbar: function(){
    var strSY = LogicData.getAccountState() ? LS.str('DT') : LS.str('SHOUYE');
    var strHQ = LS.str('HANGQING')
    var strCW = LS.str('CANGWEI')

    var strWD = LS.str('WODE')
		return (
			<Tabbar ref="myTabbar" barColor='#f7f7f7' style={{alignItems: 'stretch'}}>
				<Tab name="home">
						<Icon ref={"homepageBtn"}
							label={strSY}
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
						<Icon ref={"trendBtn"} label={strHQ} type={glypy.Camera} from={'myhero'} onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue} onInactiveColor={iconGrey}/>
						<RawContent style={{width: 100}} ref="stockContent">
							<Navigator
					style={styles.container}
					initialRoute={{name: STOCK_LIST_VIEW_PAGER_ROUTE}}
					configureScene={() => Navigator.SceneConfigs.PushFromRight}
					renderScene={this.RouteMapper} />
						</RawContent>
				</Tab>
				<Tab name="trade">
						<Icon ref={"tradeBtn"} label={strCW} type={glypy.Stat} from={'myhero'} onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue} onInactiveColor={iconGrey}/>
					<RawContent ref="exchangeContent">
							<Navigator
					style={styles.container}
					initialRoute={{name: STOCK_EXCHANGE_ROUTE}}
					configureScene={() => Navigator.SceneConfigs.PushFromRight}
					renderScene={this.RouteMapper} />
						</RawContent>
				</Tab>

				{this.renderRankingTab()}

				<Tab name="me">
						<Icon ref={"meBtn"} label={strWD} type={glypy.Settings} from={'myhero'} onActiveColor={LogicData.getAccountState()?systemBuleActual:systemBlue} onInactiveColor={iconGrey}/>
						<RawContent ref="meContent">
				<Navigator
					style={styles.container}
					initialRoute={{name: ME_ROUTE, showTabbar: this.showTabbar, hideTabbar: this.hideTabbar}}
					configureScene={() => Navigator.SceneConfigs.PushFromRight}
					renderScene={this.RouteMapper} />
						</RawContent>
				</Tab>

			</Tabbar>
		);
	},

	render: function() {
	    return (
	    	<View style={styles.container}>
					{this.renderShareView()}
          {this.renderKeyBoard()}
					{this.renderTabbar()}
					<LoadingIndicator ref='progressBar'/>
					{this.state.showTutorial ? <TutorialPage type={this.state.tutorialType} hideTutorial={this.hideTutorial}/> : null }
					{this.renderRegisterSuccessPage()}
					{this.renderSuperPriorityHintPage()}
					{this.renderFirstDayWithDrawHintPage()}
					{this.renderActivityModal()}
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

'use strict';

import React from 'react';
import {
	BackAndroid,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Navigator,
} from 'react-native';

import Tabbar, { Tab, RawContent, Icon, IconWithBar, glypyMapMaker } from 'react-native-tabbar';
var {EventCenter, EventConst} = require('../EventCenter')

var ColorConstants = require('../ColorConstants')
var LoadingIndicator = require('./LoadingIndicator');
var NavBar = require('./NavBar')
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
var LiveRegisterPage = require('./openAccount/OALiveRegisterPage')
var LiveUpdateUserInfoPage = require('./openAccount/OALiveUpdateUserInfoPage')
var LiveRegisterStatusPage = require('./openAccount/OAStatusPage')

var TutorialPage = require('./TutorialPage');
var OpenAccountPages = [
		require('./openAccount/OAStartPage'),
		require('./openAccount/OAIdPhotoPage'),
		require('./openAccount/OAPersonalInfoPage'),
		require('./openAccount/OAFinanceInfoPage'),
		require('./openAccount/OADocumentInfoPage'),
		require('./openAccount/OAReviewStatusPage'),
	]
var OpenAccountTitles = [
		"开户准备",
		"上传身份证照片(1/4)",
		"完善个人信息(2/4)",
		"完善财务信息(3/4)",
		"提交申请(4/4)",
		"审核状态"]

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
		_navigator.pop();
		return true;
	}
	return false;
});

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
export let HOMEPAGE_RECOMMAND_ROUTE = 'homepageRecommand'
export let QA_ROUTE = 'q&a'
export let OPEN_ACCOUNT_ROUTE = 'openAccount'
export let LIVE_REGISTER_ROUTE = 'liveRegister'
export let LIVE_UPDATE_USER_INFO_ROUTE = 'liveUpdateUserInfo'
export let LIVE_REGISTER_STATUS_ROUTE = 'liveRegisterStatus'

const glypy = glypyMapMaker({
  Home: 'f04f',
  Camera: 'f04e',
  Stat: 'f050',
  Settings: 'f052',
  Favorite: 'f051'
});

const systemBlue = '#1a61dd'
const iconGrey = '#888f9c'

var hideTabbar
var showTabbar
export var hideProgress
export var showProgress

var MainPage = React.createClass({

	getInitialState: function() {
		return {
			showTutorial: false,
			tutorialType: 'trade',
		};
	},

	RouteMapper : function(route, navigationOperations, onComponentRef) {
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
				<HomePage navigator={navigationOperations}/>
			)
		} else if (route.name === LANDING_ROUTE) {
			showTabbar()
			return (
				<LandingPage navigator={navigationOperations} />
			);
		} else if (route.name === LOGIN_ROUTE) {
			hideTabbar()
			return (
				<LoginPage navigator={navigationOperations}/>
			);
		} else if (route.name === UPDATE_USER_INFO_ROUTE) {
			return (
				<View style={{flex: 1}}>
					<NavBar title="设置昵称"/>
					<UpdateUserInfoPage navigator={navigationOperations}/>
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
		} else if (route.name === HOMEPAGE_RECOMMAND_ROUTE) {
			hideTabbar()
			return (
				<View style={{flex: 1}}>
					<NavBar title='推荐' showBackButton={true} navigator={navigationOperations}/>
					<WebViewPage url={route.url}/>
				</View>
			)
		} else if (route.name === QA_ROUTE) {
			return (
				<QAPage />
			)
		} else if (route.name === OPEN_ACCOUNT_ROUTE) {
			hideTabbar()
			var step = route.step
			var Page = OpenAccountPages[step]
			return (
				<View style={{flex: 1}}>
					<NavBar title={OpenAccountTitles[step]}
						titleStyle={{marginLeft:-20, marginRight:-20}}
						showBackButton={true}
						backgroundColor={ColorConstants.TITLE_DARK_BLUE}
						textOnRight={'取消'}
						rightTextOnClick={()=>_navigator.popToTop()}
						navigator={navigationOperations}/>
					<Page navigator={navigationOperations} />
				</View>
			)
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
		}
	},

	showTutorial: function(type){
		this.setState({tutorialType:type, showTutorial:true})
	},

	hideTutorial: function(){
		this.setState({showTutorial: false})
	},

	showTabbar() {
		this.refs['myTabbar'] && this.refs['myTabbar'].getBarRef().show(true);
	},

	hideTabbar() {
		this.refs['myTabbar'] && this.refs['myTabbar'].getBarRef().show(false);
	},

	showProgress() {
		this.refs['progressBar'] && this.refs['progressBar'].show()
	},

	hideProgress() {
		this.refs['progressBar'] && this.refs['progressBar'].hide()
	},

	initTabbarEvent() {
		var stockRef = this.refs['stockContent'].refs['wrap'].getWrappedRef()
		stockRef.tabWillFocus = EventCenter.emitStockTabPressEvent;

		var exchangeRef = this.refs['exchangeContent'].refs['wrap'].getWrappedRef()
		exchangeRef.tabWillFocus = EventCenter.emitExchangeTabPressEvent;

		var qaRef = this.refs['qaContent'].refs['wrap'].getWrappedRef()
		qaRef.tabWillFocus = EventCenter.emitQATabPressEvent;
	},

	componentDidMount: function() {
		this.initTabbarEvent()
	},

	render: function() {

	    return (
	    	<View style={styles.container}>
		    	<StatusBar barStyle="light-content" backgroundColor='#1962dd'/>
		      	<Tabbar ref="myTabbar" barColor={'#f7f7f7'} style={{alignItems: 'stretch'}}>
			        <Tab name="home">
			          	<Icon label="首页" type={glypy.Home} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
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
			        <Tab name="camera">
			          	<Icon label="行情" type={glypy.Camera} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent style={{width: 100}} ref="stockContent">
		            		<Navigator
								style={styles.container}
								initialRoute={{name: STOCK_LIST_VIEW_PAGER_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="stats">
			          	<Icon label="交易" type={glypy.Stat} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			        	<RawContent ref="exchangeContent">
			            	<Navigator
								style={styles.container}
								initialRoute={{name: STOCK_EXCHANGE_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="settings">
			          	<Icon label="问答" type={glypy.Settings} from={'myhero'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent ref="qaContent">
							<Navigator
								style={styles.container}
								initialRoute={{name: QA_ROUTE, showTabbar: this.showTabbar, hideTabbar: this.hideTabbar}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={this.RouteMapper} />
			          	</RawContent>
		        	</Tab>
		      	</Tabbar>
				<LoadingIndicator ref='progressBar'/>
				{this.state.showTutorial ? <TutorialPage type={this.state.tutorialType} hideTutorial={this.hideTutorial}/> : null }
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

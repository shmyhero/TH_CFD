'use strict';

var React = require('react-native');

var {
	StyleSheet,
	Navigator,
	View,
	BackAndroid,
	Component,
	Text,
	ScrollView,
	StatusBar,
	Platform,
	Dimensions,
	PixelRatio,
} = React;

var buildStyleInterpolator = require('buildStyleInterpolator');

require('./js/utils/dateUtils')

var NavBar = require('./js/view/NavBar')
var MainPage = require('./js/view/MainPage')
var LandingPage = require('./js/view/LandingPage')
var LoginPage = require('./js/view/LoginPage')
var UpdateUserInfoPage = require('./js/view/UpdateUserInfoPage')
var MyHomePage = require('./js/view/MyHomePage')
var MyNotifications = require('./js/view/MyNotifications')
var MySettings = require('./js/view/MySettings')
var WechatLoginConfirmPage = require('./js/view/WechatLoginConfirmPage')
var StockListPage = require('./js/view/StockListPage')
var StockListViewPager = require('./js/view/StockListViewPager')
var StockSearchPage = require('./js/view/StockSearchPage')
var StockDetailPage = require('./js/view/StockDetailPage')
var StockExchangePage = require('./js/view/StockExchangePage')
var {EventCenter, EventConst} = require('./js/EventCenter')

var LogicData = require('./js/LogicData')
var StorageModule = require('./js/module/StorageModule')

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
		_navigator.pop();
		return true;
	}
	return false;
});

export let MAIN_PAGE_ROUTE = 'main'
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

var hideTabbar
var showTabbar
export var RouteMapper = function(route, navigationOperations, onComponentRef) {
	_navigator = navigationOperations;
	if (route.showTabbar !== undefined) {
		showTabbar = route.showTabbar
	}
	if (route.hideTabbar !== undefined) {
		hideTabbar = route.hideTabbar
	}
	var showBackButton = true;
	if (route.hideBackButton) {
		showBackButton = false;
	}
	if (route.name === MAIN_PAGE_ROUTE) {
		return (
			<MainPage />
		)
	} else if (route.name === LANDING_ROUTE) {
		showTabbar()
		return (
			<LandingPage navigator={navigationOperations} />
		);
	} else if (route.name === LOGIN_ROUTE) {
		hideTabbar()
		return (
			<View style={{flex: 1}}>
				<NavBar title="手机验证" showBackButton={true} navigator={navigationOperations}/>
				<LoginPage navigator={navigationOperations}/>
			</View>
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
				<MyHomePage navigator={navigationOperations} />
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
			// <View style={{flex: 1}}>
				<StockListPage navigator={navigationOperations} style={{flex: 1}}/>
			// </View>
		);
	} else if (route.name === STOCK_LIST_VIEW_PAGER_ROUTE) {
		showTabbar()
		return (
			// <View style={{flex: 1}}>
				<StockListViewPager navigator={navigationOperations} style={{flex: 1}}/>
			// </View>
		);
	} else if (route.name === STOCK_SEARCH_ROUTE) {
		hideTabbar()
		return (
			// <View style={{flex: 1}}>
				<StockSearchPage navigator={navigationOperations} style={{flex: 1}}/>
			// </View>
		);
	} else if (route.name === STOCK_DETAIL_ROUTE) {
		hideTabbar()
		return (
			// <View style={{flex: 1}}>
				<StockDetailPage style={{flex: 1}}
						navigator={navigationOperations}
						stockName={route.stockRowData.name}
						stockCode={route.stockRowData.id}
						stockSymbol={route.stockRowData.symbol}
						stockPrice={route.stockRowData.last}
						stockTag={route.stockRowData.tag}
						lastClosePrice={route.stockRowData.preClose}
						openPrice={route.stockRowData.open}/>
			// </View>
		);
	} else if (route.name === STOCK_EXCHANGE_ROUTE) {
		showTabbar()
		return (
			<StockExchangePage navigator={navigationOperations} />
		)
	}
};

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

var AppNavigator = React.createClass({
	getInitialState: function() {
		return {
			initialized: false,
		};
	},

	componentDidMount: function() {
		StorageModule.loadUserData()
			.then((value) => {
				if (value !== null) {
					LogicData.setUserData(JSON.parse(value))
				}
				this.setState({
					initialized: true,
				})
			})
			.done()
	},

	render: function() {
		if (this.state.initialized) {
			return (
				<Navigator
					style={styles.container}
					initialRoute={{name: MAIN_PAGE_ROUTE}}
					configureScene={() => Navigator.SceneConfigs.PushFromRight}
					renderScene={RouteMapper} />
			)
		} else {
			return (
		    	<View />
			);
		}
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
		alignItems: 'stretch',
	},
});

module.exports = AppNavigator;

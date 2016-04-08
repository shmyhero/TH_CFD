'use strict';

import Tabbar, { Tab, RawContent, Icon, IconWithBar, glypyMapMaker } from 'react-native-tabbar';

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
} = React;

const glypy = glypyMapMaker({
  Home: 'e900',
  Camera: 'e901',
  Stat: 'e902',
  Settings: 'e903',
  Favorite: 'e904'
});

const systemBlue = '#1a61dd'
const iconGrey = '#888f9c'

var NavBar = require('./js/view/NavBar')
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
var {EventCenter, EventConst} = require('./js/EventCenter')

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
		_navigator.pop();
		return true;
	}
	return false;
});

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

var hideTabbar
var showTabbar
var RouteMapper = function(route, navigationOperations, onComponentRef) {
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

	if (route.name === LANDING_ROUTE) {
		return (
			<LandingPage navigator={navigationOperations} />
		);
	} else if (route.name === LOGIN_ROUTE) {
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
	}
};

var AppNavigator = React.createClass({
	propTypes: {
		initialViewRoute: React.PropTypes.string,
	},

	showTabbar() {
		this.refs['myTabbar'] && this.refs['myTabbar'].getBarRef().show(true);
	},

	hideTabbar() {
		this.refs['myTabbar'] && this.refs['myTabbar'].getBarRef().show(false);
	},

	initTabbarEvent() {
		var ref = this.refs['stockContent'].refs['wrap'].getWrappedRef()
		ref.tabWillFocus = EventCenter.emitStockTabPressEvent;
	},

	componentDidMount: function() {
		this.initTabbarEvent()
	},

	render: function() {
	    return (
	    	<View style={styles.container}>
		    	<StatusBar hidden={Platform.OS !== 'ios'}/>
		      	<Tabbar ref="myTabbar" barColor={'#f7f7f7'} style={{alignItems: 'stretch'}}>
			        <Tab name="home">
			          	<Icon label="首页" type={glypy.Home} from={'icomoon'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
		            		<Navigator
								style={styles.container}
								initialRoute={{name: LANDING_ROUTE, showTabbar: this.showTabbar, hideTabbar: this.hideTabbar}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="camera">
			          	<Icon label="行情" type={glypy.Camera} from={'icomoon'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent style={{width: 100}} ref="stockContent">
		            		<Navigator
								style={styles.container}
								initialRoute={{name: STOCK_LIST_VIEW_PAGER_ROUTE}}
								configureScene={() => Navigator.SceneConfigs.PushFromRight}
								renderScene={RouteMapper} />
			          	</RawContent>
			        </Tab>
			        <Tab name="stats">
			          	<Icon label="交易" type={glypy.Stat} from={'icomoon'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			        	<RawContent>
			            	<View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
			              		<Text onPress={()=>console.log('favorite')}>交易</Text>
			            	</View>
			          	</RawContent>
			        </Tab>
			        <Tab name="favorite">
			          	<Icon label="榜单" type={glypy.Favorite} from={'icomoon'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
			            	<View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
			              		<Text onPress={()=>console.log('favorite')}>榜单</Text>
			            	</View>
			          	</RawContent>
			        </Tab>
			        <Tab name="settings">
			          	<Icon label="问答" type={glypy.Settings} from={'icomoon'} onActiveColor={systemBlue} onInactiveColor={iconGrey}/>
			          	<RawContent>
			            	<View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
			              		<Text onPress={()=>console.log('settings')}>问答</Text>
			            	</View>
			          	</RawContent>
		        	</Tab>
		      	</Tabbar>
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

module.exports = AppNavigator;
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
} = React;

// var Tabbar= require('react-native-tabbar');
// var {
// 	Tab,
// 	RawContent,
// 	Icon,
// 	IconWithBar,
// 	glypyMapMaker,
// } = Tabbar;

const glypy = glypyMapMaker({
  Home: 'e900',
  Camera: 'e901',
  Stat: 'e902',
  Settings: 'e903',
  Favorite: 'e904'
});

const systemBlue = '#1a61dd'

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

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
		_navigator.pop();
		return true;
	}
	return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
	_navigator = navigationOperations;
	var showBackButton = true;
	if (route.hideBackButton) {
		showBackButton = false;
	}

	if (route.name === 'landing') {
		return (
			<LandingPage navigator={navigationOperations} />
		);
	} else if (route.name === 'login') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="手机验证" showBackButton={true} navigator={navigationOperations}/>
				<LoginPage navigator={navigationOperations}/>
			</View>
		);
	} else if (route.name === 'updateUserInfo') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="设置昵称"/>
				<UpdateUserInfoPage navigator={navigationOperations}/>
			</View>
		);
	} else if (route.name === 'myhome') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="我的" />
				<MyHomePage navigator={navigationOperations} />
			</View>
		);
	} else if (route.name === 'myNotifications') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="通知" showBackButton={true} navigator={navigationOperations}/>
				<MyNotifications navigator={navigationOperations} />
			</View>
		);
	} else if (route.name === 'mySettings') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="设置" showBackButton={true} navigator={navigationOperations}/>
				<MySettings navigator={navigationOperations} />
			</View>
		);
	} else if (route.name === 'wechatLoginConfirm') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="首页" showBackButton={true} navigator={navigationOperations}/>
				<WechatLoginConfirmPage navigator={navigationOperations} />
			</View>
		);
	} else if (route.name === 'stockList') {
		return (
			<View style={{flex: 1}}>
				<StockListPage navigator={navigationOperations} />
			</View>
		);
	} else if (route.name === 'stockListViewPager') {
		return (
			<View style={{flex: 1}}>
				<NavBar title="行情"/>
				<StockListViewPager navigator={navigationOperations} />
			</View>
		);
	}
};

var AppNavigator = React.createClass({
	propTypes: {
		initialViewRoute: React.PropTypes.string,
	},

	render: function() {
	    return (
	      <Tabbar ref="myTabbar" barColor={'white'}>
	        <Tab name="home">
	          <Icon label="Home" type={glypy.Home} from={'icomoon'} onActiveColor={systemBlue}/>
	          <RawContent>
            	<Navigator
					style={styles.container}
					initialRoute={{name: 'stockListViewPager'}}
					configureScene={() => Navigator.SceneConfigs.PushFromRight}
					renderScene={RouteMapper} />
	          </RawContent>
	        </Tab>
	        <Tab name="camera">
	          <Icon label="Camera" type={glypy.Camera} from={'icomoon'} onActiveColor={systemBlue}/>
	          <RawContent>
            	<Navigator
					style={styles.container}
					initialRoute={{name: 'landing'}}
					configureScene={() => Navigator.SceneConfigs.PushFromRight}
					renderScene={RouteMapper} />
	          </RawContent>
	        </Tab>
	        <Tab name="stats">
	          <Icon label="Stats" type={glypy.Stat} from={'icomoon'} onActiveColor={systemBlue}/>
	          <RawContent>
	            <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
	              <Text onPress={()=>console.log('stats')}>Stats</Text>
	            </View>
	          </RawContent>
	        </Tab>
	        <Tab name="favorite">
	          <Icon label="Fav" type={glypy.Favorite} from={'icomoon'} onActiveColor={systemBlue}/>
	          <RawContent>
	            <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
	              <Text onPress={()=>console.log('favorite')}>Fav</Text>
	            </View>
	          </RawContent>
	        </Tab>
	        <Tab name="settings">
	          <Icon label="Settings" type={glypy.Settings} from={'icomoon'} onActiveColor={systemBlue}/>
	          <RawContent>
	            <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent:'center' }}>
	              <Text onPress={()=>console.log('settings')}>Settings</Text>
	            </View>
	          </RawContent>
	        </Tab>
	      </Tabbar>
		
		);
	  }
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaeaea',
	},
});

module.exports = AppNavigator;
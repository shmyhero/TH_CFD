'use strict';

var React = require('react-native');
var {
	StyleSheet,
	Navigator,
	View,
	BackAndroid,
} = React;

var NavBar = require('./js/view/NavBar')
var LandingPage = require('./js/view/LandingPage')
var LoginPage = require('./js/view/LoginPage')
var UpdateUserInfoPage = require('./js/view/UpdateUserInfoPage')
var MyHomePage = require('./js/view/MyHomePage')
var MyNotifications = require('./js/view/MyNotifications')
var MySettings = require('./js/view/MySettings')
var WechatLoginConfirmPage = require('./js/view/WechatLoginConfirmPage')

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
		var rightContainerOnClick = function() {
			navigationOperations.replace({
				name: 'wechatLoginConfirm',
			});
		}

		return (
			<View style={{flex: 1}}>
				<NavBar title="设置昵称" showTextOnRight={true} textOnRight='跳过' rightContainerOnClick={rightContainerOnClick}/>
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
	}
};

var AppNavigator = React.createClass({
	propTypes: {
		initialViewRoute: React.PropTypes.string,
	},

	render: function() {
	    return (
		<Navigator
			style={styles.container}
			initialRoute={{name: this.props.initialViewRoute}}
			configureScene={() => Navigator.SceneConfigs.PushFromRight}
			renderScene={RouteMapper} />
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
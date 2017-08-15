'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableHighlight,
	TouchableOpacity,
	WebView,
} from 'react-native';

var {EventCenter, EventConst} = require('../EventCenter')

var CookieManager = require('react-native-cookies')
var LoginPage = require('./LoginPage')
var WebViewPage = require('./WebViewPage')
var ScrollTabView = require('./component/ScrollTabView')
var StockOpenPositionPage = require('./StockOpenPositionPage')
var StockClosedPositionPage = require('./StockClosedPositionPage')
var StockStatisticsPage = require('./StockStatisticsPage')
var ColorConstants = require('../ColorConstants')
var NavBar = require('../view/NavBar')
var LogicData = require('../LogicData')
var MainPage = require('./MainPage')
var OAStatusPage= require('./openAccount/OAStatusPage')

var tabNames = ['持仓', '平仓', '统计']
var didTabSelectSubscription = null
var didAccountChangeSubscription = null
//var didAccountLoginOutSideSubscription = null
var didLoginSubscription = null;
var didLogoutSubscription = null;
var StockExchangePage = React.createClass({

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
			loggined: false,
		}
	},

	componentDidMount: function() {
		didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.EXCHANGE_TAB_PRESS_EVENT, this.onTabChanged);
		didAccountChangeSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>this.clearViews());
		//didAccountLoginOutSideSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGIN_OUT_SIDE, ()=>this.clearViews());
		didLoginSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGIN, ()=>this.clearViews());
		didLogoutSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGOUT, ()=>this.clearViews());
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
		didAccountChangeSubscription && didAccountChangeSubscription.remove();
		//didAccountLoginOutSideSubscription && didAccountLoginOutSideSubscription.remove();
		didLoginSubscription && didLoginSubscription.remove();
		didLogoutSubscription && didLogoutSubscription.remove();
	},

	clearViews:function(){
		if(LogicData.getTabIndex() == MainPage.STOCK_EXCHANGE_TAB_INDEX){
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1] &&
				(routes[routes.length-1].name == MainPage.STOCK_EXCHANGE_ROUTE
			|| routes[routes.length-1].name == MainPage.LOGIN_ROUTE)){
				this.reloadTabData();
				// if(this.refs['page2'])this.refs['page2'].clearViews();
				// if(this.refs['page1'])this.refs['page1'].clearViews();
				// if(this.refs['page0'])this.refs['page0'].clearViews();
			}
		}
	},

	onPageSelected: function(index: number) {
		this.setState({
			currentSelectedTab: index,
		})
		LogicData.setCurrentPageTag(index);

		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined && this.refs['page' + index]) {
			this.refs['page' + index].tabPressed()
		}
	},

	onTabChanged: function(){
	  LogicData.setTabIndex(MainPage.STOCK_EXCHANGE_TAB_INDEX);
		LogicData.setCurrentPageTag(this.state.currentSelectedTab);
		this.reloadTabData();
	},

	reloadTabData: function(){
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0

		if (loggined){
			this.setState({
				loggined: true,
			})
			var currentTab = MainPage.initExchangeTab
			if(this.refs['page0']){
				//If user has goes into this tab before...
				this.refs['tabPages'].tabClicked(currentTab)
				this.setState({
					currentSelectedTab: currentTab
				})
				if(currentTab === 2) {
					this.refs['page2'].tabPressed()
				}
				else if(currentTab === 1) {
					this.refs['page1'].tabPressed()
				}
				else {
					this.refs['page0'].tabPressed()
				}
			}
			else{
				//It is the first time user goes into this tab! Just trigger the render!
				this.setState({
					currentSelectedTab: 0
				})
			}

			// if(!LogicData.getActualLogin()){
			// 	this.gotoAccountStateExce()
			// }

		}else{
			this.setState({
				loggined: false,
			});
		}
	},

	renderLiveLogin:function(){
		return(
			// <View style={{flex:1,backgroundColor:'white',alignItems:'center'}}>
   	  //   <NavBar title="我的仓位" navigator={this.props.navigator}/>
			// 	<TouchableOpacity onPress={()=>this.jumpToLogin()}>
			// 		<Text style={{textAlign:'center',fontSize:20, alignSelf:'center',justifyContent:'center',backgroundColor:'yellow'}}>点击登录实盘账户</Text>
			// 	</TouchableOpacity>
			// </View>
			<View>
				<NavBar title="我的仓位" navigator={this.props.navigator}/>
				<OAStatusPage onLoginClicked={this.jumpToLogin}/>
			</View>

		)
	},

	jumpToLogin:function(){
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}
		console.log("gotoAccountStateExce userId = " + userId);
		this.props.navigator.push({
			name:MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			title:'实盘交易',
			onNavigationStateChange: this.onWebViewNavigationStateChange,
			logTimedelta: true,
			url:'https://tradehub.net/live/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/live/oauth&state='+userId
			// url:'http://cn.tradehero.mobi/tradehub/live/login1.html'
			// url:'http://cn.tradehero.mobi/tradehub/live/login1.html?client_id=62d275a211'
			// url:'http://cn.tradehero.mobi/tradehub/live/loginload.html'
			// url:'https://www.tradehub.net/live/yuefei-beta/login.html',
		});
	},

	onWebViewNavigationStateChange: function(navState) {
		// todo
		console.log("my web view state changed: "+navState.url)
		CookieManager.get('https://tradehub.net/demo/auth', (err, res) => {
  			console.log('Got cookies for url: ', res);
		})

		if(navState.url.indexOf('live/loginload')>0){
			console.log('success login ok');
			MainPage.ayondoLoginResult(true)
			this.setState({
				loggined:true,
			});
		}else if(navState.url.indexOf('live/oauth/error')>0){
			console.log('success login error');
			MainPage.ayondoLoginResult(false)
		}
	},

	// onNavigationStateChange:function (navState) {
	// 	console.log("my web view state changed: "+navState.url)
	// 	CookieManager.get('https://tradehub.net/demo/auth', (err, res) => {
  // 			console.log('Got cookies for url: ', res);
	// 	})
	//
	// 	if(navState.url.indexOf('live/loginload')>0){
	// 		console.log('success login ok');
	// 		// MainPage.ayondoLoginResult(true)
	// 		LogicData.setAccountState(true)
	// 		LogicData.setActualLogin(true)
	// 		this.setState({
	// 			loggined:true,
	// 		})
	// 	}else if(navState.url.indexOf('live/oauth/error')>0){
	// 		console.log('success login error');
	// 		// MainPage.ayondoLoginResult(false)
	// 		LogicData.setAccountState(true)
	// 		LogicData.setActualLogin(false)
	// 		this.setState({
	// 			loggined:true,
	// 		})
	// 	}
	// },

	renderContent: function(){
		//var userData = LogicData.getUserData()
		var loggined = this.state.loggined;//Object.keys(userData).length !== 0

		var {height, width} = Dimensions.get('window');
		var tabPages = [
			<StockOpenPositionPage navigator={this.props.navigator} ref={'page0'}
					showTutorial={(type)=>this.props.showTutorial(type)}/>,
			<StockClosedPositionPage navigator={this.props.navigator} ref={'page1'}/>,
			<StockStatisticsPage navigator={this.props.navigator} ref={'page2'}
				style={{paddingTop:10}}/>
		]

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				{tabPages[i]}
			</View>
		)

		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}


		console.log('loggined = '+loggined + ' accState = ' + LogicData.getAccountState());

		if(loggined && LogicData.getAccountState()){//实盘状态
			if(LogicData.getActualLogin()){
				return (
					<View style={{flex: 1}}>
						<NavBar title="我的仓位" showSearchButton={true} navigator={this.props.navigator}/>
						<ScrollTabView ref={"tabPages"} tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
							onPageSelected={(index) => this.onPageSelected(index)} />
					</View>
				)
			} else{
				// return (
				// 	<View style={{flex: 1}}>
				// 		<NavBar title="我的仓位" navigator={this.props.navigator}/>
				// 		<WebViewPage
				// 			isShowNav= {false}
				// 			onNavigationStateChange={this.onNavigationStateChange}
				// 			// url={'https://tradehub.net/demo/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/demo/oauth&state='+userId}
				// 			// url={'https://www.baidu.com'}
				// 		  // url={'https://www.tradehub.net/live/yuefei-beta/login.html'}
				// 			// url={'https://www.tradehub.net/demo/ff-beta/tradehero-login-debug.html'}
				// 			// url={'http://cn.tradehero.mobi/TH_CFD_SP/detail01.html'}
				// 			url={'http://cn.tradehero.mobi/tradehub/login.html'}
				//
				// 		/>
				// 	</View>
					return(this.renderLiveLogin())
				// )
			}
		}else{//模拟盘状态
			if (loggined) {
				return (
					<View style={{flex: 1}}>
						<NavBar title="我的仓位" showSearchButton={true} navigator={this.props.navigator}/>
						<ScrollTabView ref={"tabPages"} tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
							onPageSelected={(index) => this.onPageSelected(index)} />
					</View>
				)
			}
			else {
				return (
					<LoginPage navigator={this.props.navigator}
										isTabbarShown={()=> { return true;}}/>
				)
			}
		}


		// // if(loggined && LogicData.getAccountState()){//实盘状态
		// // 	if(LogicData.getActualLogin()){
		// // 		return (
		// // 			<View style={{flex: 1}}>
		// // 				<NavBar title="我的仓位" showSearchButton={true} navigator={this.props.navigator}/>
		// // 				<ScrollTabView ref={"tabPages"} tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
		// // 					onPageSelected={(index) => this.onPageSelected(index)} />
		// // 			</View>
		// // 		)
		// // 	} else{
		// 		return (
		// 			<View style={{flex: 1}}>
		// 				<NavBar title="我的仓位" navigator={this.props.navigator}/>
		// 				<WebViewPage
		// 					isShowNav= {false}
		// 					onNavigationStateChange={this.onNavigationStateChange}
		// 					// url={'https://tradehub.net/demo/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/demo/oauth&state='+userId}
		// 					// url={'https://www.baidu.com'}
		// 					// url={'https://www.tradehub.net/live/yuefei-beta/login.html'}
		// 					// url={'https://www.tradehub.net/demo/ff-beta/tradehero-login-debug.html'}
		// 					// url={'http://cn.tradehero.mobi/TH_CFD_SP/detail01.html'}
		// 					url={'http://cn.tradehero.mobi/tradehub/login.html'}
		//
		// 				/>
		// 			</View>
		// 			// return(this.renderLiveLogin())
		// 		)
		// // 	}
		// // }else{//模拟盘状态
		// // 	if (loggined) {
		// // 		return (
		// // 			<View style={{flex: 1}}>
		// // 				<NavBar title="我的仓位" showSearchButton={true} navigator={this.props.navigator}/>
		// // 				<ScrollTabView ref={"tabPages"} tabNames={tabNames} viewPages={viewPages} removeClippedSubviews={true}
		// // 					onPageSelected={(index) => this.onPageSelected(index)} />
		// // 			</View>
		// // 		)
		// // 	}
		// // 	else {
		// // 		return (
		// // 			<LoginPage navigator={this.props.navigator}
		// // 								onPopToRoute={this.onPageSelected}
		// // 								isTabbarShown={()=> { return true;}}/>
		// // 		)
		// // 	}
		// // }
	},

	render: function() {
		return (
			<View style={{flex: 1}}>
				{this.renderContent()}
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	rowWrapper: {
		flex:1,
		alignItems:'center',
		flexDirection:'row',
	},

	headerText: {
		flex: 1,
		fontSize: 17,
		color: 'white',
	},

	text1: {
		flex: 1,
		fontSize: 27,
		color: 'white',
	},
	text2: {
		flex: 1,
		fontSize: 14,
		color: '#92b9fa',
	},

	logoImage: {
		flex: 3,
		width: 190,
		height: 190,
	},

	registerView: {
		alignSelf: 'stretch',
		height: 42,
		backgroundColor: 'transparent',
		paddingVertical: 10,
    	borderRadius:5,
		borderWidth: 1,
		borderColor: 'white',
		margin: 15,
	},

	registerButton: {
		color: 'white',
		fontSize: 17,
		textAlign: 'center',
	},

});


module.exports = StockExchangePage;

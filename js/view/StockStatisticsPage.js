'use strict';

var LayoutAnimation = require('LayoutAnimation');
import React from 'react';

import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Platform,
	Alert,
	ScrollView,
} from 'react-native';

var TimerMixin = require('react-timer-mixin');
var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var WebSocketModule = require('../module/WebSocketModule');
var MainPage = require('./MainPage');
var AppStateModule = require('../module/AppStateModule');
var {EventCenter, EventConst} = require('../EventCenter');
var StatisticBarBlock = require('./personalPage/StatisticBarBlock');
var TradeStyleBlock = require('./personalPage/TradeStyleBlock')
var UserHomePageTab0 =require('./UserHomePageTab0');

var {height, width} = Dimensions.get('window');

var networkConnectionChangedSubscription = null;
var accountStateChangedSubscription = null;
var accountLogoutEventSubscription = null;
var layoutSizeChangedSubscription = null

const STATISTIC_BAR_BLOCK = "statisticBarBlock";
const TRADE_STYLE_BLOCK = "tradeStyleBlock";

var StockStatisticsPage = React.createClass({
	mixins: [TimerMixin],

	getInitialState: function() {
		var balanceData = LogicData.getBalanceData()
		return {
			balanceData: balanceData,
			isClear: false,
			height: UIConstants.getVisibleHeight(),
		}
	},

	clearViews:function(){
		this.setState({
			balanceData: null,
			isClear:true,
		})
	},

	tabPressed: function(index) {
		this.onLayoutSizeChanged()
		var balanceData = LogicData.getBalanceData()
		this.setState({
				balanceData: balanceData,
				isClear:false,
			},
			()=>{
				NetworkModule.loadUserBalance(true, (responseJson)=>{this.setState({balanceData: responseJson,})});
				this.refreshData();
			}
		);
	},

	componentDidMount: function(){
		networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			this.onConnectionStateChanged();
		});

		accountStateChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, () => {
			this.clearViews();
		});

		accountLogoutEventSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGOUT, () => {
			this.clearViews();
		});

		layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.LAYOUT_SIZE_CHANGED, () => {
			this.onLayoutSizeChanged();
		});

		AppStateModule.registerTurnToActiveListener(this.refreshData);
	},

	componentWillUnmount: function(){
		networkConnectionChangedSubscription && networkConnectionChangedSubscription.remove();
		accountStateChangedSubscription && accountStateChangedSubscription.remove();
		accountLogoutEventSubscription && accountLogoutEventSubscription.remove();
		layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove();
		AppStateModule.unregisterTurnToActiveListener(this.refreshData);
	},

	//Only Android has the layout size changed issue because the navigation bar can be hidden.
	onLayoutSizeChanged: function(){
		if(Platform.OS === "android" && this.isCurrentPage()){
			console.log("onLayoutSizeChanged StockStatisticsPage");
			this.setState({
				height: UIConstants.getVisibleHeight(),
			})
		}
	},

	isCurrentPage: function(){
		if(LogicData.getTabIndex() == MainPage.STOCK_EXCHANGE_TAB_INDEX){
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1] && routes[routes.length-1].name == MainPage.STOCK_EXCHANGE_ROUTE){
				var currentPageTag = LogicData.getCurrentPageTag();
				if(currentPageTag == 2){
					return true;
				}
			}
		}
		return false;
	},

	onConnectionStateChanged: function(){
		if(WebSocketModule.isConnected()){
			this.refreshData();
		}
	},

	refreshData: function(){
		console.log("refreshData")
		if(this.isCurrentPage()){
			var userData = LogicData.getUserData();
			var notLogin = Object.keys(userData).length === 0;
			if(!notLogin){
				NetworkModule.loadUserBalance(true, (responseJson)=>{
					this.setState({balanceData: responseJson,});
				})

				this.refs[STATISTIC_BAR_BLOCK].refresh();
				//this.refs[TRADE_STYLE_BLOCK].refresh();
			}
		}
	},

	renderHeader: function() {
		var total = '--'
		var available = '--'
		if (this.state.balanceData) {
			total = this.state.balanceData.total.toFixed(2)
			available = this.state.balanceData.available.toFixed(2)
			if (this.state.balanceData.available < 0) {
				available = '0'
			}
		}

		var additionalStyle = {backgroundColor:ColorConstants.title_blue()};
		if(LogicData.getAccountState()){
			additionalStyle.height = 179;
		}

		return (
			<View style={[styles.header, additionalStyle]}>
				<View style={styles.empty}/>
				<Text style={styles.headerText1}>总资产(美元)</Text>
				<Text style={styles.headerText2}>{total}</Text>
				<View style={styles.empty}/>
				<Text style={styles.headerText3}>剩余资金(美元)</Text>
				<Text style={styles.headerText4}>{available}</Text>
				<View style={styles.empty}/>
			</View>
		)
	},



	renderOrClear:function(){
		if(this.state.isClear){
			return(<View style={{flex:10000}}></View>)
		}
	},

	renderBody: function(){
		var userData = LogicData.getUserData()
		if(LogicData.getAccountState()){
			return (
				<ScrollView style={{flex:1}}>
					{this.renderHeader()}
					<UserHomePageTab0 userId={userData.userId}
						isStatisticPage={true}
						isPrivate={false}
						navigator={this.props.navigator}
						ref={STATISTIC_BAR_BLOCK}/>
				</ScrollView>
			);
		}else{
			return (
				<View style={{flex:1}}>
					{this.renderHeader()}
					<StatisticBarBlock userId={userData.userId}
						isStatisticPage={true}
						ref={STATISTIC_BAR_BLOCK}/>
				</View>

			);
		}
	},

	render: function() {

		return (
			<View style={[styles.wrapper, {width:width,
				height: this.state.height
						- UIConstants.HEADER_HEIGHT
						//- UIConstants.SCROLL_TAB_HEIGHT
						- UIConstants.LIST_HEADER_BAR_HEIGHT
						- UIConstants.TAB_BAR_HEIGHT,}]}>
				{/* {this.renderOrClear()} */}

				{this.renderBody()}
				{/* <TradeStyleBlock userId={userData.userId}
					style={{marginTop: 10}}
					ref={TRADE_STYLE_BLOCK}/> */}
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		alignItems: 'stretch',
	},
	empty: {
		paddingBottom: 0,
		flex: 1,
	},

	header: {
		flex: 2,
		backgroundColor: '#1b65e1',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	headerText1: {
		fontSize: 17,
		color: 'white',
	},
	headerText2: {
		fontSize: 44,
		color: 'white',
	},
	headerText3: {
		fontSize: 17,
		color: ColorConstants.COLOR_STATIC_TEXT1,
	},
	headerText4: {
		fontSize: 19,
		color: 'white',
	},

	center: {
		flex: 1,
		backgroundColor: '#eff5ff',
		flexDirection: 'row',
	},
	centerView: {
		flex: 1,
		paddingLeft: 15,
		justifyContent: 'space-around',
	},
	centerText1: {
		fontSize: 14,
		color: '#8a95a5',
	},
	centerText2: {
		fontSize: 29,
		color: '#1962dd',
	},
});


module.exports = StockStatisticsPage;

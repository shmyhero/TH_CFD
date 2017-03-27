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

var {height, width} = Dimensions.get('window');

var networkConnectionChangedSubscription = null;
var accountStateChangedSubscription = null;
var accountLogoutEventSubscription = null;
var layoutSizeChangedSubscription = null

var StockStatisticsPage = React.createClass({
	mixins: [TimerMixin],

	lastStatisticsInfo: null,

	getInitialState: function() {
		var balanceData = LogicData.getBalanceData()
		return {
			statisticsBarInfo: [],
			statisticsSumInfo: [],
			maxBarSize: 1,
			barAnimPlayed: false,
			balanceData: balanceData,
			isClear: false,
			height: UIConstants.getVisibleHeight(),
		}
	},

	clearViews:function(){
		this.setState({
			statisticsBarInfo: [],
			statisticsSumInfo: [],
			maxBarSize: 1,
			barAnimPlayed: false,
			balanceData: null,
			isClear:true,
		})
	},

	tabPressed: function(index) {
		var balanceData = LogicData.getBalanceData()
		this.setState({balanceData: balanceData,},
			()=>{
				NetworkModule.loadUserBalance(true, (responseJson)=>{this.setState({balanceData: responseJson,})});
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

	onLayoutSizeChanged: function(){
		console.log("onLayoutSizeChanged StockStatisticsPage");
		this.setState({
			height: UIConstants.getVisibleHeight(),
		})
	},

	onConnectionStateChanged: function(){
		if(WebSocketModule.isConnected()){
			this.refreshData();
		}
	},

	refreshData: function(){
		if(LogicData.getTabIndex() == 2){
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1] && routes[routes.length-1].name == MainPage.STOCK_EXCHANGE_ROUTE){
				var currentPageTag = LogicData.getCurrentPageTag();
				if(currentPageTag == 2){
					var userData = LogicData.getUserData();
					var notLogin = Object.keys(userData).length === 0;
					if(!notLogin){
						NetworkModule.loadUserBalance(true, (responseJson)=>{
							this.setState({balanceData: responseJson,});
							this.playStartAnim();
						})
					}
				}
			}
		}
	},

	playStartAnim: function() {
		this.setState({
			statisticsBarInfo: [],
			statisticsSumInfo: [],
			isClear:false,
		})

		this.lastStatisticsInfo = null;

		var userData = LogicData.getUserData()

		var url = NetConstants.CFD_API.GET_USER_STATISTICS_API
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_USER_STATISTICS_LIVE_API
			console.log('live', url );
		}

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				cache: 'offline',
			},
			(responseJson) => {
				this.playStatisticsAnim(responseJson);
			},
			(result) => {
				if(NetConstants.AUTH_ERROR === result.errorMessage){

				}else{
					// Alert.alert('', errorMessage);
				}
			}
		)
	},

	playStatisticsAnim: function(statisticsInfo) {
		var hasDifference = false;
		var initializeAnimation = false;
		if(this.lastStatisticsInfo != null){
			for(var i = 0; i < statisticsInfo.length; i++){
				if(this.lastStatisticsInfo[i].pl != statisticsInfo[i].pl){
					hasDifference = true;
					break;
				}
			}
		}else{
			//Start the anim from 0.
			initializeAnimation = true;
			hasDifference = true;
		}

		if(hasDifference){

			var originalStatisticsInfo = []
			$.extend(true, originalStatisticsInfo, statisticsInfo)	// deep copy

			this.lastStatisticsInfo = originalStatisticsInfo;

			var maxBarSize = 1
			for (var i = 0; i < statisticsInfo.length; i++) {
				var barContent = statisticsInfo[i]
				if (Math.abs(maxBarSize) < Math.abs(barContent.pl)) {
					maxBarSize = Math.abs(barContent.pl)
				}
				barContent.displayPL = barContent.pl;
				barContent.pl = 0;
				//For display...
			}

			if(initializeAnimation){
				this.setState({
					maxBarSize: maxBarSize,
					statisticsBarInfo: statisticsInfo,
					statisticsSumInfo: originalStatisticsInfo,
					barAnimPlayed: true,
				}, ()=>{
						this.runAnimationIfNecessary(originalStatisticsInfo);
					});
				}else{
					this.runAnimationIfNecessary(originalStatisticsInfo);
				}
			}
	},

	runAnimationIfNecessary: function(originalStatisticsInfo){
		this.setTimeout(() => {
				//We need to check if the layout will be changed.
				//If the profit bar won't change, we will not apply the LayoutAnimation.configureNext,
				//because it will affect the tab switch and display a wrong animation.
				if(LogicData.getTabIndex() == 2){
					var hasData = this.state.balanceData!==null;

					var sumInvest = 0
					for (var i = 0; i < this.state.statisticsSumInfo.length; i++) {
						var barContent = this.state.statisticsSumInfo[i]
						sumInvest += barContent.invest
					}
					if (hasData && sumInvest > 0) {
						var needAnimation = false;
						for(var i = 0; i < this.state.statisticsBarInfo.length; i++) {
							if(originalStatisticsInfo[i]
								&& this.state.statisticsBarInfo[i].pl !== originalStatisticsInfo[i].pl){
									var oldInvestBarFlex = Math.floor(this.state.statisticsBarInfo[i].invest / this.state.maxBarSize * 100)
									var oldProfitBarFlex = Math.floor(this.state.statisticsBarInfo[i].pl / this.state.maxBarSize * 100)
									var newInvestBarFlex = Math.floor(originalStatisticsInfo[i].invest / this.state.maxBarSize * 100)
									var newProfitBarFlex = Math.floor(originalStatisticsInfo[i].pl / this.state.maxBarSize * 100)

									if(oldInvestBarFlex != newInvestBarFlex || oldProfitBarFlex != newProfitBarFlex){
										needAnimation = true;
										break;
									}
							}
						}

						if(needAnimation){
							console.log("anim started");
							LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
						}
					}
					this.setState({
						statisticsBarInfo: originalStatisticsInfo,
						barAnimPlayed: true,
					});
				}
			},
			1000
		);
	},

	renderBars: function() {
		var bars = this.state.statisticsBarInfo.map(
			(barContent, i) => {
				//var investBarFlex = Math.floor(barContent.invest / this.state.maxBarSize * 100)
				var profitBarFlex = Math.floor(barContent.pl / this.state.maxBarSize * 100)
				var profitBarStyle = barContent.pl > 0 ? styles.positiveProfitBar : styles.negtiveProfitBar
				if (barContent.pl < 0) {
					profitBarFlex *= -1
					//investBarFlex -= profitBarFlex
				}else if (barContent.pl == 0){
					profitBarStyle = {flex: 1};
				}
				if(profitBarFlex == 0){
					profitBarFlex = 1;
				}
				return (
					<View key={i} style={{flexDirection:'row', flex:1, justifyContent:'center'}}>
						<View style={[{flex: profitBarFlex, height: 16, }, styles.profitBar, profitBarStyle]} />
						<View style={{flex: 100 - profitBarFlex}} />
					</View>
				)
			}
		)
		return (
			<View style={[styles.barContainer, {flexDirection:'column'}]}>
				{bars}
			</View>
		);
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

		return (
			<View style={[styles.header,{backgroundColor:ColorConstants.title_blue()}]}>
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

	renderBody: function() {
		var sumPl = '--'
		var avgPlRate = '--'
		if (this.state.statisticsSumInfo.length > 0) {
			sumPl = 0
			var sumInvest = 0
			for (var i = 0; i < this.state.statisticsSumInfo.length; i++) {
				var barContent = this.state.statisticsSumInfo[i]
				sumPl += barContent.pl
				sumInvest += barContent.invest
			}

			avgPlRate = (sumInvest > 0) ? sumPl / sumInvest * 100: 0
			sumPl = sumPl.toFixed(2)
			avgPlRate = avgPlRate.toFixed(2)
			sumInvest = sumInvest.toFixed(2)
		}
		return (
			<View style={styles.center}>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>近1月收益(美元)</Text>
					<Text style={[styles.centerText2,{color:LogicData.getAccountState()?'#85b1fb':'#1962dd'}]}>{sumPl}</Text>
					<View style={styles.empty}/>
				</View>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>近1月交易本金(美元)</Text>
					<Text style={[styles.centerText2,{color:LogicData.getAccountState()?'#85b1fb':'#1962dd'}]}>{sumInvest}</Text>
					<View style={styles.empty}/>
				</View>
				<View style={styles.centerView}>
					<View style={styles.empty}/>
					<Text style={styles.centerText1}>近1月投资回报率</Text>
					<Text style={[styles.centerText2,{color:LogicData.getAccountState()?'#85b1fb':'#1962dd'}]}>{avgPlRate}%</Text>
					<View style={styles.empty}/>
				</View>
			</View>
		)
	},

	renderChartHeader: function() {
		return (
			<View style={styles.chartHeader}>
				<View style={styles.centerView2}>
					<Text style={styles.chartHeaderText1}>累计收益</Text>
				</View>
				<View style={styles.chartHeaderRightPart}>
					<View style={styles.redSquare}/>
					<Text style={styles.chartHeaderText2}>盈利</Text>
					<View style={styles.greenSquare}/>
					<Text style={styles.chartHeaderText2}>亏损</Text>
				</View>
			</View>
		)
	},

	renderChart: function() {
		var hasData = this.state.balanceData!==null

		var sumInvest = 0
		for (var i = 0; i < this.state.statisticsSumInfo.length; i++) {
			var barContent = this.state.statisticsSumInfo[i]
			sumInvest += barContent.invest
		}
		if (hasData && sumInvest > 0) {
			return (
				<View style={styles.chart}>
					{this.renderChartHeader()}
					<View style={styles.separator}/>
					{this.renderLineChart()}
				</View>
			)
		}
		else {
			return (
				<View style={[styles.header, styles.chart]}>
					<Text style={styles.loadingText}>暂无盈亏分布记录</Text>
				</View>
				)
		}
	},

	renderLineChart: function(){
		var barNameText = this.state.statisticsBarInfo.map(
			(barContent, i) =>
				<View key={i} style={{flex: 1, flexDirection:'column', alignItems:'center', justifyContent: 'center'}}>
					<Text style={styles.barNameText}>
						{barContent.name}
					</Text>
				</View>
		)
		var plText = this.state.statisticsBarInfo.map(
			(barContent, i) =>{
				var valueStyle = null;
				var valueText = "";
				if(barContent.invest > 0){
					var pl = Math.floor(barContent.pl);//.toFixed(2);
					if(barContent.displayPL){
						pl = Math.floor(barContent.displayPL);//.toFixed(2);
					}
					if(pl == 0){
						valueStyle = styles.plValueTextZero;
					}else if(pl > 0){
						valueStyle = styles.plValueTextPositive;
						valueText = "+" + pl;
					}else{
						valueStyle = styles.plValueTextNegative;
						valueText = pl;
					}
				}
				//displayPL
					return (
						<View key={i} style={{flex: 1, flexDirection:'column', alignItems:'flex-end', justifyContent: 'center'}}>
							<Text style={[styles.plValueText, valueStyle]}>
								{valueText}
							</Text>
						</View>
					);
				}
		)
		return (
			<View style={{flexDirection:'row', flex: 1, padding: 20}}>
				<View style={styles.barNamesContainer}>
					{barNameText}
				</View>
				<View style={[styles.verticleSeparator,]}/>
				<View style={[{width: width/7*4}]}>
					{this.renderBars()}
				</View>
				<View style={styles.plValue}>
					{plText}
				</View>
			</View>
		);
	},

	renderOrClear:function(){
		if(this.state.isClear){
			return(<View style={{flex:10000}}></View>)
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
				{this.renderOrClear()}
				{this.renderHeader()}
				{this.renderBody()}
				{this.renderChart()}
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
		justifyContent: 'space-around',
		alignItems:'center'
	},
	centerView2: {
		flex: 1,
		paddingLeft: 15,
		justifyContent: 'space-around',
	},
	centerText1: {
		fontSize: 10,
		color: '#8a95a5',
	},
	centerText2: {
		fontSize: 22,
		color: '#1962dd',
	},

	chart: {
		flex: 3,
		backgroundColor: 'white',
	},

	chartHeader: {
		height: 40,
		flexDirection: 'row',
	},
	chartHeaderRightPart: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginRight: 10,
	},
	chartHeaderText1: {
		fontSize: 14,
		color: '#333333',
	},
	chartHeaderText2: {
		fontSize: 11,
		color: '#adadad',
		marginLeft: 3,
		marginRight: 3,
	},
	redSquare: {
		width: 10,
		height: 6,
		backgroundColor: '#f16b5f',
	},
	greenSquare: {
		width: 10,
		height: 6,
		backgroundColor: '#5fd959',
	},
	blueSquare: {
		width: 10,
		height: 6,
		backgroundColor: ColorConstants.COLOR_CUSTOM_BLUE,
	},

	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	verticleSeparator: {
		marginTop: 15,
		width: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	plValue:{
		alignItems: 'stretch',
		flex: 1,
	},

	plValueText:{
		fontSize: 16,
	},

	plValueTextZero:{
		color: '#979797',
	},

	plValueTextPositive:{
		color: '#f16b5f',
	},

	plValueTextNegative:{
		color: '#5fd959',
	},

	container: {
		alignItems: 'stretch',
		flex: 1,
	},

	barContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'stretch',
	},

	barNamesContainer: {
		paddingRight: 5,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'stretch',
	},
	barNameText: {
		fontSize: 13,
		color: '#adadad',
	},

	investBar: {
		backgroundColor: ColorConstants.COLOR_CUSTOM_BLUE,
		width: 20,
	},

	profitBar:{
		borderTopRightRadius:4,
		borderBottomRightRadius:4,
		height: 16,
		alignSelf: 'center',
	},

	positiveProfitBar: {
		backgroundColor: '#f16b5f',
	},

	negtiveProfitBar: {
		backgroundColor: '#5fd959',
	},

	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},
});


module.exports = StockStatisticsPage;

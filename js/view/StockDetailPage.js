'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Alert,
	Dimensions,
	TextInput,
	Platform,
	ScrollView,
	ProgressBarAndroid,
	BackAndroid,
	ActivityIndicatorIOS,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Picker from 'react-native-wheel-picker';
var PickerItem = Picker.Item;

var Orientation = require('react-native-orientation');
var ActivityIndicator = require('ActivityIndicator');
var LineChart = require('./component/lineChart/LineChart');
var dismissKeyboard = require('dismissKeyboard');
var LogicData = require('../LogicData')
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var TalkingdataModule = require('../module/TalkingdataModule')
var NavBar = require('../view/NavBar')
var InputAccessory = require('./component/InputAccessory')
var MainPage = require('./MainPage')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var {EventCenter, EventConst} = require('../EventCenter')
var TimerMixin = require('react-timer-mixin');

var {height, width} = Dimensions.get('window');
var commonUtil = require('../utils/commonUtil');

var tabData = [
			{"type":NetConstants.PARAMETER_CHARTTYPE_TODAY, "name":'分时'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_TWO_HOUR, "name":'2小时'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_WEEK, "name":'5日'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_DAY, "name":'日K'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_5_MINUTE, "name":'5分钟'},]

var tabDataLandscopeLine = [
			{"type":NetConstants.PARAMETER_CHARTTYPE_TODAY, "name":'分时'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_TWO_HOUR, "name":'2小时'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_WEEK, "name":'5日'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_MONTH, "name":'1月'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_3_MONTH, "name":'3月'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_6_MONTH, "name":'6月'},]

var tabDataLandscopeCandle = [
			{"type":NetConstants.PARAMETER_CHARTTYPE_1_MINUTE, "name":'1分钟'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_5_MINUTE, "name":'5分钟'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_15_MINUTE, "name":'15分钟'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_60_MINUTE, "name":'60分钟'},
			{"type":NetConstants.PARAMETER_CHARTTYPE_DAY, "name":'日K'},]

var didFocusSubscription = null;
var updateStockInfoTimer = null;
var layoutSizeChangedSubscription = null
var chartClickedSubscription = null;
var flashButtonTimer = null;
var wattingLogin = false;
var loadStockInfoSuccess = false;
var ORIENTATION_PORTRAIT = 0;
var ORIENTATION_LANDSPACE = 1;
var CHARTVIEWTYPE_LINE = 0;
var CHARTVIEWTYPE_CANDLE = 1;

var StockDetailPage = React.createClass({
	mixins: [TimerMixin],

	propTypes: {
		stockCode: React.PropTypes.number,
		stockName: React.PropTypes.string,
		stockSymbol: React.PropTypes.string,
		stockPrice: React.PropTypes.number,
		stockPriceAsk: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		stockPriceBid: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		stockTag: React.PropTypes.string,
		lastClosePrice: React.PropTypes.number,
		openPrice: React.PropTypes.number,
		showTabbar: React.PropTypes.func,
		onPopUp: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			stockCode: 14993,
			stockName: 'ABC company',
			stockPrice: 1,
			stockPriceAsk: '--',
			stockPriceBid: '--',
			lastClosePrice: 1,
			onPopUp: ()=>{},
		}
	},

	getInitialState: function() {
		var balanceData = LogicData.getBalanceData()
		var available = balanceData === null ? 0 : (balanceData.available < 0 ? 0 : balanceData.available)
		var money = available > 100 ? 100 : Math.floor(available)
		return {
			stockInfo: {isOpen: true,status:1},
			money: money,
			leverage: 2,
			totalMoney: available,
			tradeDirection: 0,	//0:none, 1:up, 2:down
			inputText: ''+money,
			stockPrice: this.props.stockPrice,
			stockCurrencyPrice: '--',
			stockPreclose:'--',
			stockPriceAsk: this.props.stockPriceAsk,
			stockPriceBid: this.props.stockPriceBid,
			isAddedToMyList: false,
			tradingInProgress: false,
			chartType: NetConstants.PARAMETER_CHARTTYPE_TODAY,
			flashTimes:0,
			minPrice: 0,
			maxPrice: 0,
			maxPercentage: 0,
			minPercentage: 0,
			dataStatus:0,//0正常 1等待刷新 2加载中
			height: UIConstants.getVisibleHeight(),
			widht: width,
			orientation: ORIENTATION_PORTRAIT,
			chartViewType: CHARTVIEWTYPE_LINE,
		};
	},

	componentDidMount: function() {
		this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);

		layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.LAYOUT_SIZE_CHANGED, () => {
			this.onLayoutSizeChanged();
		});

		chartClickedSubscription = EventCenter.getEventEmitter().addListener(EventConst.CHART_CLICKED, () => {
			this.chartClicked();
		});

	  Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations
		Orientation.lockToPortrait(); //this will lock the view to Portrait
    // Orientation.lockToLandscape(); //this will lock the view to Landscape
    //Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations
    Orientation.addOrientationListener(this._orientationDidChange);

		BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);
	},

	componentWillUnmount: function() {
		this.didFocusSubscription.remove();
		layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove();
		chartClickedSubscription && chartClickedSubscription.remove();
		Orientation.getOrientation((err,orientation)=> {
			console.log("componentWillUnmount Current Device Orientation: ", orientation);
			if(orientation === 'PORTRAIT'){
				height = Dimensions.get('window').height
				width = Dimensions.get('window').width
			}else{
				height = Dimensions.get('window').width
				width = Dimensions.get('window').height
			}
		});
		Orientation.lockToPortrait();

		Orientation.removeOrientationListener(this._orientationDidChange);
		BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
	},

	hardwareBackPress:function(){
		if (this.state.orientation == ORIENTATION_PORTRAIT) {
        return false;
    } else {
				this.closeLandspace();
        return true;
    }
	},

	onLayoutSizeChanged: function(){
		if (Platform.OS == 'android') {
			// only huawei phones
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1]
				&& routes[routes.length-1].name == MainPage.STOCK_DETAIL_ROUTE){
				console.log("onLayoutSizeChanged stock detail page");
				this.setState({
					height: UIConstants.getVisibleHeight(),
				})
				return;
			}

			this.state.height = UIConstants.getVisibleHeight();
		}
	},

	onDidFocus: function(event) {
    if (MainPage.STOCK_DETAIL_ROUTE === event.data.route.name) {
      this.loadStockInfo();
			if(this.state.orientation == ORIENTATION_PORTRAIT){
				NetworkModule.loadUserBalance(false, this.updateUserBalance);
			}
  	}
	},

	updateUserBalance: function(responseJson){
		if (this.state.totalMoney === 0 && this.state.money === 0 && responseJson.available > 0){
			// first time get the total money value.
			var money = responseJson.available > 100 ? 100 : Math.floor(responseJson.available)
			this.setState({
				money: money,
				inputText: ''+money,
			})
		}
		this.setState({
			totalMoney: responseJson.available < 0 ? 0 : responseJson.available,
		})
	},

	loadStockInfo: function() {
	  console.log('StockDetailPage loadStockInfo');
		loadStockInfoSuccess = false
		var url = NetConstants.CFD_API.GET_STOCK_DETAIL_API
		if(LogicData.getAccountState()){
		 url = NetConstants.CFD_API.GET_STOCK_DETAIL_LIVE_API
		 console.log('live', url );
	 	}
		url = url.replace(/<stockCode>/, this.props.stockCode)
		this.setState({
			dataStatus :2,
		})
		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				showLoading: true,
			},
			(responseJson) => {
				var currencySymbol = responseJson.ccy
				if (currencySymbol != UIConstants.USD_CURRENCY) {
					// Find the USD/ccy fx data first.
					var fxData = LogicData.getFxDataBySymbol(UIConstants.USD_CURRENCY + currencySymbol)
					if (!fxData) {
						fxData = LogicData.getFxDataBySymbol(currencySymbol + UIConstants.USD_CURRENCY)
					}
					if (fxData) {
						var fxId = fxData.id
						responseJson.fxData = fxData
						var previousInterestedStocks = WebSocketModule.getPreviousInterestedStocks()
						if(previousInterestedStocks){
							previousInterestedStocks += ',' + fxId
						}else{
							previousInterestedStocks = fxId;
						}
						WebSocketModule.registerInterestedStocks(previousInterestedStocks)
					}
				}
				loadStockInfoSuccess = true
				console.log("loadStockInfo: " + JSON.stringify(responseJson))
				this.setState({
					stockInfo: responseJson,
					stockPriceBid: responseJson.bid,
					stockPriceAsk: responseJson.ask,
					stockCurrencyPrice:responseJson.last,
					stockPreclose:responseJson.preClose,
				})

				this.loadStockPriceToday(true, this.state.chartType, responseJson)

				if(updateStockInfoTimer !== null) {
					this.clearInterval(updateStockInfoTimer)
				}
				updateStockInfoTimer = this.setInterval(
					() => {
						this.updateStockInfo()
					},
					60000
				);
				this.props.showTutorial('trade')
			},
			(result) => {
				// Alert.alert('', result.errorMessage);
				this.setState({
					dataStatus :1,
				})
			}
		)

		var myListData = LogicData.getOwnStocksData()
		var index = myListData.findIndex((stock) => {return stock.id === this.props.stockCode})
		if (index !== -1) {
			this.setState({
				isAddedToMyList: true,
			})
		}
	},

	updateStockInfo: function() {

		console.log("updateStockInfo: " + this.state.chartType);
		if (this.state.chartType !== NetConstants.PARAMETER_CHARTTYPE_TODAY)
			return

		this.loadStockPriceToday(false, this.state.chartType, this.state.stockInfo)
	},

	loadStockPriceToday: function(showLoading, chartType, stockInfo) {
		var isLive = LogicData.getAccountState()
		var url = "";

		if(NetConstants.isCandleChart(chartType)){
			url = isLive ? NetConstants.CFD_API.GET_STOCK_PRICE_KLINE_LIVE_API : NetConstants.CFD_API.GET_STOCK_PRICE_KLINE_API
		}
		else {
		 	url = isLive ? NetConstants.CFD_API.GET_STOCK_PRICE_TODAY_LIVE_API : NetConstants.CFD_API.GET_STOCK_PRICE_TODAY_API
		}

		url = url.replace(/<chartType>/, chartType)
		url = url.replace(/<stockCode>/, this.props.stockCode)

		if(isLive){
		  console.log('live', url );
		}

		this.setState({
			dataStatus : 2
		})

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				showLoading: showLoading,
			},
			(responseJson) => {
				var tempStockInfo = stockInfo
				tempStockInfo.priceData = responseJson

				var maxPrice = undefined
				var minPrice = undefined
				var maxPercentage = undefined
				var minPercentage = undefined

				if (tempStockInfo.priceData != undefined && tempStockInfo.priceData.length > 0) {
					var lastClose = tempStockInfo.preClose

					maxPrice = Number.MIN_VALUE
					minPrice = Number.MAX_VALUE

					for (var i = 0; i < tempStockInfo.priceData.length; i ++) {
						var price = 0;
						if(chartType == NetConstants.PARAMETER_CHARTTYPE_5_MINUTE||
							chartType == NetConstants.PARAMETER_CHARTTYPE_DAY){
							price = tempStockInfo.priceData[i].close
						}else{
							price = tempStockInfo.priceData[i].p
						}
						if (price > maxPrice) {
							maxPrice = price
						}
						if (price < minPrice) {
							minPrice = price
						}
					}
					var maxPercentage = (maxPrice - lastClose) / lastClose * 100
					var minPercentage = (minPrice - lastClose) / lastClose * 100
					if(maxPercentage){
						maxPercentage = maxPercentage.toFixed(2)
					}
					if(minPercentage){
						minPercentage = minPercentage.toFixed(2)
					}
				}

				this.setState({
					stockInfo: tempStockInfo,
					maxPrice: maxPrice,
					minPrice: minPrice,
					maxPercentage: maxPercentage,
					minPercentage: minPercentage,
					dataStatus :0,
				})

				var previousInterestedStocks = WebSocketModule.getPreviousInterestedStocks()
				var lastInterestedStocks = previousInterestedStocks;
				if(previousInterestedStocks
					&& previousInterestedStocks.includes //The method may be empty???
					&&tempStockInfo.id){
					if(!previousInterestedStocks.includes(tempStockInfo.id)){
						previousInterestedStocks += ',' + tempStockInfo.id;
					}
				}else{
					previousInterestedStocks = '' + tempStockInfo.id;
				}

				if(previousInterestedStocks != lastInterestedStocks){
					WebSocketModule.registerInterestedStocks(previousInterestedStocks)
				}
				this.connectWebSocket();
			},
			(result) => {
				// Alert.alert('', result.errorMessage);

				this.setState({
					dataStatus :1,
				})
			},
			true
		)
	},

	connectWebSocket: function() {
		WebSocketModule.registerCallbacks(
			(realtimeStockInfo) => {
				for (var i = 0; i < realtimeStockInfo.length; i++) {
					if (this.props.stockCode == realtimeStockInfo[i].id ) {
						if(this.state.stockPrice !== realtimeStockInfo[i].last) {
							this.setState({
								stockPrice: realtimeStockInfo[i].last,
								stockPriceAsk: realtimeStockInfo[i].ask,
								stockPriceBid: realtimeStockInfo[i].bid,
								stockCurrencyPrice:realtimeStockInfo[i].last,
							})
						}
						break;
					}
				};

				if (this.state.stockInfo.fxData) {
					var fxId = this.state.stockInfo.fxData.id
					for (var i = 0; i < realtimeStockInfo.length; i++) {
						if (fxId == realtimeStockInfo[i].id &&
									this.state.stockCurrencyPrice !== realtimeStockInfo[i].last) {
							this.setState({
								stockCurrencyPrice: realtimeStockInfo[i].last,
							})
							break;
						}
					};
				}
			})
	},

	addToMyListClicked: function() {
		var stock = {
			id: this.props.stockCode,
			symbol: this.props.stockSymbol,
			name: this.props.stockName,
			tag: this.props.stockTag,
			open: this.props.openPrice,
			preClose: this.props.lastClosePrice,
			last: this.state.stockPrice
		}
		if (this.state.isAddedToMyList) {

			NetworkModule.removeFromOwnStocks([stock])
			.then(()=>{
				LogicData.removeStockFromOwn(stock);

				this.setState({
					isAddedToMyList: false,
				})
			})
			.catch(()=>{
				//Do nothing?
			});

			var parameters = {};
				parameters[TalkingdataModule.KEY_STOCK_ID] = this.props.stockCode.toString();
			TalkingdataModule.trackEvent(TalkingdataModule.REMOVE_FROM_MY_LIST_EVENT, '', parameters)

			//TongDaoModule.trackAddRemoveOwnStockEvent(this.props.stockCode.toString(), false)
		} else {
			NetworkModule.addToOwnStocks([stock])
			.then(()=>{
				LogicData.addStockToOwn(stock);
							this.setState({
								isAddedToMyList: true,
							})
			})
			.catch(()=>{
				//Do nothing?
			});

			var parameters = {};
			parameters[TalkingdataModule.KEY_STOCK_ID] = this.props.stockCode.toString();
			TalkingdataModule.trackEvent(TalkingdataModule.ADD_TO_MY_LIST_EVENT, '', parameters)

			//TongDaoModule.trackAddRemoveOwnStockEvent(this.props.stockCode.toString(), true)
		}
	},

	pressChartHeaderTab: function(type) {
		console.log('StockDetailPage: pressChartHeaderTab ' + type);
		switch(type){
			case NetConstants.PARAMETER_CHARTTYPE_TODAY:
				TalkingdataModule.trackEvent(TalkingdataModule.STOCK_DETAIL_TAB_TODAY);
				break;
			case NetConstants.PARAMETER_CHARTTYPE_TWO_HOUR:
				TalkingdataModule.trackEvent(TalkingdataModule.STOCK_DETAIL_TAB_TWOH);
				break;
			case NetConstants.PARAMETER_CHARTTYPE_WEEK:
				TalkingdataModule.trackEvent(TalkingdataModule.STOCK_DETAIL_TAB_FIVED);
				break;
			case NetConstants.PARAMETER_CHARTTYPE_DAY:
				TalkingdataModule.trackEvent(TalkingdataModule.STOCK_DETAIL_TAB_DAY_CANDLE);
				break;
			case NetConstants.PARAMETER_CHARTTYPE_5_MINUTE:
				TalkingdataModule.trackEvent(TalkingdataModule.STOCK_DETAIL_TAB_FIVEM_CANDLE);
				break;
		}

		this.setState({
			chartType: type,
		},loadStockInfoSuccess?this.loadStockPriceToday(true, type, this.state.stockInfo):this.loadStockInfo())
		// this.loadStockPriceToday(true, type, this.state.stockInfo)
	},

	renderStockMaxPriceInfo: function(maxPrice, maxPercentage) {
		if (maxPrice && maxPercentage)
		{
			return (
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
						<Text style={styles.priceText}>
							{maxPrice}
						</Text>
					</View>

					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
						<Text style={styles.priceText}>
							{maxPercentage} %
						</Text>
					</View>
				</View>
			);
		}
		else {
			return (
				<View style={{height:16}}/>)
		}
	},

	renderStockMinPriceInfo: function(minPrice, minPercentage) {
		if (minPrice && minPercentage)
		{
			return (
				<View style={{flexDirection: 'row', marginTop: -22}}>
					<View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
						<Text style={styles.priceText}>
							{minPrice}
						</Text>
					</View>

					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
						<Text style={styles.priceText}>
							{minPercentage} %
						</Text>
					</View>
				</View>
			);
		}
	},

	renderChartHeader: function() {
		var tabcolorStyle = {color: ColorConstants.STOCK_TAB_BLUE}
		var tabs = tabData.map(
			(data, i) =>
			<TouchableOpacity style={{width:width/tabData.length}} key={i}
					onPress={() => this.pressChartHeaderTab(data.type)}>
				<Text style={this.state.chartType == data.type? styles.chartTitleTextHighlighted : [styles.chartTitleText, tabcolorStyle]}>
					{data.name}
				</Text>
			</TouchableOpacity>
		)
		return(
			<View>
				<ScrollView horizontal={true} style={{flex: 0, marginTop: 6}}>
					{tabs}
				</ScrollView>
			</View>
			);
	},

	renderChartHeaderLandscape: function() {
		var tabcolorStyle = {color: ColorConstants.STOCK_TAB_BLUE}
		var tabDataCurrent = this.state.chartViewType == CHARTVIEWTYPE_LINE ? tabDataLandscopeLine : tabDataLandscopeCandle;
		var tabs = tabDataCurrent.map(
			(data, i) =>
			<TouchableOpacity style={{width:60, justifyContent:'center',}} key={i}
					onPress={() => this.pressChartHeaderTab(data.type)}>
				<Text style={this.state.chartType == data.type? styles.chartTitleTextHighlighted : [styles.chartTitleText, tabcolorStyle]}>
					{data.name}
				</Text>
			</TouchableOpacity>
		)

		return(
			<View>
				<ScrollView horizontal={true}>
					{tabs}
				</ScrollView>
			</View>
			);
	},

	getGradientColor(){
		if(LogicData.getAccountState()){
			if(this.state.orientation == ORIENTATION_LANDSPACE){
				return ['#3f5680', '#3f5680'];
			}else{
				return [ColorConstants.TITLE_DARK_BLUE,ColorConstants.TITLE_DARK_BLUE];
			}
		}else{
			if(this.state.orientation == ORIENTATION_LANDSPACE){
				return ['#1962dd', '#1962dd'];
			}else{
				return ['#3475e3','#123b80']
			}
		}
	},

	renderMinTradeMondy:function(){
		var tradeValue = this.state.money * this.state.leverage
		var minValue = this.state.tradeDirection === 1 ? this.state.stockInfo.minValueLong : this.state.stockInfo.minValueShort
		if(minValue){
			return (
				<Text style={styles.leftMoneyLabel}> 交易此产品：本金*杠杆需大于{minValue.toFixed(0)}美元</Text>
			);
		}else{
			return (
				null
			);
		}
	},

	renderLeftMoney:function(){
			var leftMoney = this.state.totalMoney;// - this.state.money

			var userData = LogicData.getUserData()
			var loggined = Object.keys(userData).length !== 0
			if(loggined){
				if(!LogicData.getAccountState()||(LogicData.getAccountState() && LogicData.getActualLogin())){
					return (
						<Text style={styles.leftMoneyLabel}> 账户剩余资金：{leftMoney.toFixed(2)}</Text>
					);
				}else{
					return (
						<View></View>
					);
				}
			}else{
				return (
					<View></View>
				);
			}
	},

	renderDataStatus:function(){
		//status 0:正常 1：暂时无法获取数据 2:加载中
		var status = this.state.dataStatus;
		var imageError = LogicData.getAccountState()?require('../../images/icon_network_connection_error_live.png'):require('../../images/icon_network_connection_error.png')
		if(status === 1){
			return (
				<View style={[styles.dataStatus,{width:this.state.width}]}>
					<View style={[styles.dataStatus2,{width:this.state.width}]}>
					<Image style={{width:24,height:24,marginBottom:5}} source={imageError}></Image>
					<Text style={styles.textDataStatus}>暂时无法获取数据</Text>
					<TouchableOpacity onPress={()=> this.dataRefreshClicked()}>
						<View>
							<Text style={styles.textDataStatusRefresh}>刷新</Text>
						</View>
					</TouchableOpacity>
					</View>
				</View>
			)
		}else if(status === 2){
			return (
				<View style={[styles.dataStatus,{width:this.state.width}]}>
					<View style={[styles.dataStatus2,{width:this.state.width}]}>
					{this._renderActivityIndicator()}
					<Text style={styles.textDataStatus}>加载中...</Text>
					</View>
				</View>
			)
		}
	},

	dataRefreshClicked:function(){

		if(!loadStockInfoSuccess){
			this.loadStockInfo();
		}else{
			this.loadStockPriceToday(false, this.state.chartType, this.state.stockInfo)
		}

	},

	_renderActivityIndicator() {
			return ActivityIndicator ? (
					<ActivityIndicator
							style={{marginRight: 10,}}
							animating={true}
							color={'white'}
							size={'small'}/>
			) : Platform.OS == 'android' ?
					(
							<ProgressBarAndroid
									style={{marginRight: 10,}}
									color={'#ff0000'}
									styleAttr={'Small'}/>

					) :  (
					<ActivityIndicatorIOS
							style={{marginRight: 10,}}
							animating={true}
							color={'#ff0000'}
							size={'small'}/>
			)
	},


	renderChart:function(){
		var state = this.state.dataStatus;
		console.log("RAMBO: chartType = " + this.state.chartType)
		var opacity = state == 0? 1.0 : 0.01;
	  // if(state == 0){
			if(Platform.OS === "ios"){
				return(
					<LineChart style={[styles.lineChart,{opacity:opacity}]}
						data={JSON.stringify(this.state.stockInfo)}
						chartType={this.state.chartType}
						// chartIsActual={LogicData.getAccountState()}
						>
					</LineChart>
				)
			}else{
				var rightAxisDrawGridLines = this.state.orientation == ORIENTATION_LANDSPACE && NetConstants.isCandleChart(this.state.chartType);
			 	var textColor, backgroundColor, borderColor, lineChartGradient;

				if(this.state.orientation == ORIENTATION_PORTRAIT){
					textColor = "#70a5ff";
					backgroundColor = "transparent"
					borderColor = "#497bce";

					lineChartGradient = LogicData.getAccountState() ? ['#374d74','#6683b3'] : ['#99bfff', '#1954b9'];
				}else{
					textColor = LogicData.getAccountState() ? "#94a9cf" : "#0740a7"
					backgroundColor = LogicData.getAccountState() ? "#3f5680" : "#1962dd"
					borderColor = LogicData.getAccountState() ? "#91a4c5" : "#0d4ab6";
					lineChartGradient = LogicData.getAccountState() ? ['#5f7baa','#3f5680'] : ['#387ae7', '#1962dd'];
				}

				console.log("renderChart width = " + width);
				//8596b5
				return(
					<LineChart style={[styles.lineChart,{width:width},{opacity:opacity}]}
						chartType={this.state.chartType}
						// chartIsActual={LogicData.getAccountState()}
						data={JSON.stringify(this.state.stockInfo)}
						xAxisPosition="BOTTOM"
						borderColor={borderColor}
						isLandspace={this.state.orientation == ORIENTATION_LANDSPACE}
						// backgroundColor={NetConstants.isCandleChart(this.state.chartType) ? backgroundColor : 'transparent'}
						xAxisTextSize={this.state.orientation == ORIENTATION_LANDSPACE ? 11 : 8}
						rightAxisTextSize={this.state.orientation == ORIENTATION_LANDSPACE ? 14 : 8}
						textColor={textColor}
						rightAxisLabelCount={7}
						rightAxisPosition="OUTSIDE_CHART"
						rightAxisEnabled={this.state.orientation == ORIENTATION_LANDSPACE}
						rightAxisDrawLabel={this.state.orientation == ORIENTATION_LANDSPACE}
						rightAxisDrawGridLines={rightAxisDrawGridLines}
						chartPaddingTop={this.state.orientation == ORIENTATION_LANDSPACE ? 15 : 0}
						chartPaddingBottom={this.state.orientation == ORIENTATION_LANDSPACE ? 15 : 4}	//The limit line needs some space to show, set it to 3...
						chartPaddingLeft={15}
						chartPaddingRight={15}
						lineChartGradient={lineChartGradient}
					>
					</LineChart>
				)
			}
		// }
	},

	renderPortrait:function(){
		// 0.06%, limit to 0.01
		var leftMoney = this.state.totalMoney - this.state.money
		var charge = 0
		var viewMargin = 0;//= Platform.OS === 'ios' ? 0:15
		// console.log("render: " + JSON.stringify(this.state.stockInfo))
		return (
			<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
				<View style={styles.wrapper, {width:width}}>
					<LinearGradient colors={this.getGradientColor()} style={{height: Math.max(height - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER, this.state.height)}}>

						{this.renderHeader()}

						{this.renderChartHeader()}

						<View style={{flex: 3.5,marginTop:5,marginLeft:viewMargin,marginRight:viewMargin}}>
							{this.renderChart()}
							{this.renderDataStatus()}
						</View>
						<View>
							<Text style={styles.tipsLine}>行情可能存在细微偏差</Text>
						</View>
						<View style={{flex: 1.2, justifyContent: 'space-around'}}>
							{this.renderTradeButton()}
						</View>
						<View style={{flex: 2.5, justifyContent: 'space-around'}}>
							{this.renderScrollHeader()}
							{this.renderScroll()}
						</View>
						<View style={{flex: 2, alignItems: 'center', justifyContent: 'space-around', paddingTop: 30, paddingBottom:Platform.OS === 'ios'?10:48}}>
							{this.renderMinTradeMondy()}
							{this.renderLeftMoney()}
							{/* <Text style={styles.smallLabel}> 手续费为{charge}美元</Text> */}
							{this.renderOKButton()}
							{this.renderStockCurrencyWarning()}
						</View>
					</LinearGradient>
						<InputAccessory ref='InputAccessory'
							textValue={this.state.inputText}
							maxValue={parseFloat(this.state.totalMoney.toFixed(2))}
							rightButtonOnClick={this.clearMoney}/>

						<StockTransactionInfoModal ref='confirmPage'/>
				</View>
				</TouchableWithoutFeedback>
		)
	},

	renderTitleLandspace:function(){

		var titleText  = this.props.stockName;
		var currentPriceText = this.state.stockCurrencyPrice;
		var percentChangeText = "--"
		console.log("this.state.stockPreclose:"+this.state.stockPreclose+"	this.state.stockCurrencyPrice="+this.state.stockCurrencyPrice)
		if(this.state.stockPreclose!=='--' && this.state.stockCurrencyPrice!=='--'){
			var percentChange = (this.state.stockCurrencyPrice - this.state.stockPreclose) / this.state.stockPreclose * 100
			if (percentChange > 0) {
				percentChangeText = '+' + percentChange.toFixed(2) + '%'
			} else {
				percentChangeText = percentChange.toFixed(2) + '%'
			}
		}else{
			percentChangeText = '--'
		}

		return(
			<View style={{flexDirection:'row',width:width,alignItems:'center',justifyContent: 'space-between'}}>
				<View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10,justifyContent: 'flex-start'}}>
					<Text style={{fontSize:15,color:'white',marginLeft:15}}>{titleText}</Text>
					<Text style={{fontSize:15,color:'white',marginLeft:10}}>{currentPriceText}</Text>
					<Text style={{fontSize:15,color:'white',marginLeft:10}}>{percentChangeText}</Text>
				</View>
				<TouchableOpacity onPress={()=>this.closeLandspace()} style={{paddingTop:10, paddingBottom:10, paddingLeft:16, paddingRight:16}}>
					<Image  style={{width:20,height:20}} source={require('../../images/icon_close_full_screen.png')}></Image>
				</TouchableOpacity>
   		</View>
		)
	},

	chartClicked:function(){
		this.changeOrientatioin()
	},

	closeLandspace:function(){
		this.changeOrientatioin();
	},

	changeChartViewType:function(type){
		if(type!==this.state.chartViewType){
			this.setState({
				chartViewType:type
			},this.pressChartHeaderTab(type == CHARTVIEWTYPE_LINE ? NetConstants.PARAMETER_CHARTTYPE_TODAY:NetConstants.PARAMETER_CHARTTYPE_1_MINUTE))
			}
	},

	renderBottomViewType:function(){
		var isLive = LogicData.getAccountState();
		var imageType0 = this.state.chartViewType == CHARTVIEWTYPE_LINE ? require('../../images/icon_chart_type_line_selected.png'):(isLive?require('../../images/icon_chart_type_line_unselected_live.png'):require('../../images/icon_chart_type_line_unselected.png'));
		var imageType1 = this.state.chartViewType == CHARTVIEWTYPE_CANDLE ? require('../../images/icon_chart_type_candle_selected.png'):(isLive?require('../../images/icon_chart_type_candle_unselected_live.png'):require('../../images/icon_chart_type_candle_unselected.png'));

		return(
			<View style={{flex:1, justifyContent:'flex-end', alignItems: 'center', marginRight:20,flexDirection:'row',}}>
				<TouchableOpacity onPress={()=>this.changeChartViewType(CHARTVIEWTYPE_LINE)}>
					<Image  style={{width:35,height:26,marginRight:15,alignSelf:'center'}} source={imageType0}></Image>
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>this.changeChartViewType(CHARTVIEWTYPE_CANDLE)}>
					<Image  style={{width:35,height:26,marginRight:10,alignSelf:'center'}} source={imageType1}></Image>
				</TouchableOpacity>
	   	</View>
		)
	},

	renderLandscape:function(){
		// 0.06%, limit to 0.01
		var leftMoney = this.state.totalMoney - this.state.money
		var charge = 0
		var viewMargin = 0;//Platform.OS === 'ios' ? 0:15
		// console.log("render: " + JSON.stringify(this.state.stockInfo))
		var viewHeight = Platform.OS === 'ios' ? height :  Math.max(height - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER, this.state.height)
		var bottomBarBackgroundColor = LogicData.getAccountState() ? "#334a74": "#0741a8";
		var styleAppend = Platform.OS === 'ios'?{width:width}:null;
		return (
			<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
				<View style={[styles.wrapper,styleAppend]}>
					<LinearGradient colors={this.getGradientColor()} style={{height: viewHeight}}>
						{this.renderTitleLandspace()}
						<View style={{flex: 3.5,marginTop:5,marginLeft:viewMargin,marginRight:viewMargin}}>
								{this.renderChart()}
								{this.renderDataStatus()}
						</View>
						<View style={{marginTop:10, height: 47, justifyContent:'center', flexDirection:'row', backgroundColor: bottomBarBackgroundColor}}>
							{this.renderChartHeaderLandscape()}
							{this.renderBottomViewType()}
						</View>

					</LinearGradient>
				</View>
				</TouchableWithoutFeedback>
		)
	},

	render: function() {
		if(this.state.orientation == ORIENTATION_PORTRAIT){
			{return this.renderPortrait()}
		}else{
			{return this.renderLandscape()}
		}
	},

	clearMoney: function() {
		var value = parseInt(this.state.inputText)
		if (value > this.state.totalMoney) {
			this.setState({inputText:'0', money:0})
		}
	},

	renderHeader: function() {
		var percentChange = 0

		if (this.props.lastClosePrice <= 0) {
			percentChange = 0
		} else {
			percentChange = (this.state.stockPrice - this.props.lastClosePrice) / this.props.lastClosePrice * 100
		}

		var subTitleColor = ColorConstants.stock_color(percentChange)
		var subTitleText = this.state.stockPrice + '  '
		if (percentChange > 0) {
			subTitleText += '+' + percentChange.toFixed(2) + '%'
		} else {
			subTitleText += percentChange.toFixed(2) + '%'
		}

		var barHeight = 68
		if (Platform.OS == 'android') {
			barHeight = 50
		}
		return (
			<NavBar showBackButton={true} navigator={this.props.navigator}
				backButtonOnClick={()=>{

					console.log("backButtonOnClick")
					if(this.props.onPopUp){

							console.log("backButtonOnClick on popup is not null")
						this.props.onPopUp();
					}else{

							console.log("backButtonOnClick on popup is null")
					}
					this.props.showTabbar();
				}}
				barStyle={{height: barHeight}}	titleStyle={{fontSize:18}}
				title={this.props.stockName}
				backgroundColor='transparent'
				subTitleStyle={[styles.subTitle, {color: subTitleColor}]}
				rightCustomContent={() => this.renderAddToMyListButton()}/>
		)
	},

	renderAddToMyListButton: function() {
		return (
			<TouchableOpacity
					onPress={this.addToMyListClicked}>
				<View style={[styles.addToMyListContainer,{backgroundColor:ColorConstants.title_blue()}]}>
					<Text style={styles.addToMyListText}>
						{this.state.isAddedToMyList ? '删除自选':'+自选'}
					</Text>
				</View>
			</TouchableOpacity>
		)
	},

	renderTradeButton: function() {
		var upSelected = this.state.tradeDirection === 1
		var upImage = upSelected ? require('../../images/click-up.png') : (LogicData.getAccountState()?require('../../images/up_live.png'):require('../../images/up.png'))
		var downSelected = this.state.tradeDirection === 2
		var downImage = downSelected ? require('../../images/click-down.png') : (LogicData.getAccountState()?require('../../images/down_live.png'):require('../../images/down.png'))

		var upTextColor = 'white'
		var downTextColor = 'white'
		if (!upSelected) upTextColor = LogicData.getAccountState()?'#6781ab':'#568ff1'
		if (!downSelected) downTextColor = LogicData.getAccountState()?'#6781ab':'#568ff1'

		var isLive = LogicData.getAccountState();

		return (
			<View style={[styles.rowView, {alignItems:'stretch'}]}>

				<TouchableHighlight
					underlayColor={upSelected ? (isLive?'#99acce':'#6da2fc'): (isLive?'#415980':'#356dce')}
					onPress={() => this.state.stockInfo.isOpen && this.buyPress()}
					style={[styles.tradeButtonView,{borderColor:ColorConstants.COLOR_BORDER},{backgroundColor:LogicData.getAccountState()?'#476189':'#356dce'},(this.state.flashTimes>0 && this.state.flashTimes%2==0)?styles.flashBorder:null , upSelected&&(LogicData.getAccountState()?styles.tradeButtonViewSelectedLive:styles.tradeButtonViewSelected)]}>
					<View style={styles.tradeButtonContainer}>
						<Text style={[styles.tradeButtonText, {color: upTextColor}]}>
							{this.state.stockPriceAsk}
						</Text>
						<Image style={styles.tradeButtonImage} source={upImage}/>
					</View>
				</TouchableHighlight>

				<TouchableHighlight
					underlayColor={downSelected ? (isLive?'#99acce':'#6da2fc'): (isLive?'#415980':'#356dce')}
					onPress={() => this.state.stockInfo.isOpen && this.sellPress()}
					style={[styles.tradeButtonView,{borderColor:ColorConstants.COLOR_BORDER},{backgroundColor:LogicData.getAccountState()?'#476189':'#356dce'},(this.state.flashTimes>0 && this.state.flashTimes%2==0)?styles.flashBorder:null ,downSelected&&(LogicData.getAccountState()?styles.tradeButtonViewSelectedLive:styles.tradeButtonViewSelected)]}>
					<View style={styles.tradeButtonContainer}>
						<Text style={[styles.tradeButtonText, {color: downTextColor}]}>
							{this.state.stockPriceBid}
						</Text>
						<Image style={styles.tradeButtonImage} source={downImage}/>
					</View>
				</TouchableHighlight>

			</View>
		)
	},

	live_login:function(){
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}
		wattingLogin = true;
		console.log("RAMBO wattingLogin = true ")
		this.resetToLandscape()
		this.props.navigator.push({
			name:MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			title:'实盘交易',
			themeColor: "#3f5781",//ColorConstants.TITLE_DARK_BLUE,
			onNavigationStateChange: this.onWebViewNavigationStateChange,
			url:'https://tradehub.net/live/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/live/oauth&state='+userId
			// url:'http://cn.tradehero.mobi/tradehub/login.html'
		});

	},

	onWebViewNavigationStateChange: function(navState) {
		// todo
		console.log("RAMBO my web view state changed: "+navState.url)

		if(navState.url.indexOf('live/loginload')>0 && wattingLogin){
			console.log('RAMBO success login ok');
			MainPage.ayondoLoginResult(true)
			wattingLogin = false;
		}else if(navState.url.indexOf('live/oauth/error')>0 && wattingLogin){
			console.log('success login error');
			MainPage.ayondoLoginResult(false)
			wattingLogin = false;
		}

	},

	buyPress: function() {

		if(this.state.stockInfo.status == 2) {
			Alert.alert(this.state.stockInfo.name,'暂停交易')
			return
		}else	if(!this.state.stockInfo.isOpen) {
			Alert.alert(this.state.stockInfo.name,'已停牌/休市,暂时不能进行交易')
			return
		}

		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined) {

			if(LogicData.getAccountState()&&!LogicData.getActualLogin()){
				this.live_login();
				return;
			}

			if (this.state.tradeDirection === 1)
				this.setState({tradeDirection:0})
			else
				this.setState({tradeDirection:1})
		} else {
			this.resetToLandscape()
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				popToRoute: MainPage.STOCK_DETAIL_ROUTE,
			});
		}
	},

	sellPress: function() {
		if(this.state.stockInfo.status == 2) {
			Alert.alert(this.state.stockInfo.name,'暂停交易')
			return
		}else if(!this.state.stockInfo.isOpen) {
			Alert.alert(this.state.stockInfo.name,'已停牌/休市,暂时不能进行交易')
			return
		}
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined) {
			if(LogicData.getAccountState()&&!LogicData.getActualLogin()){
				this.live_login();
				return;
			}

			if (this.state.tradeDirection === 2)
				this.setState({tradeDirection:0})
			else
				this.setState({tradeDirection:2})
		} else {
			this.resetToLandscape()
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				popToRoute: MainPage.STOCK_DETAIL_ROUTE,
			});
		}
	},

	changeOrientatioin:function(){
		console.log("changeOrientatioin:", this.state.orientation);
		if(this.state.orientation === ORIENTATION_PORTRAIT){
			height = Dimensions.get('window').width
			width = Dimensions.get('window').height
			this.setState({
				 orientation:ORIENTATION_LANDSPACE,
				 chartViewType:NetConstants.isCandleChart(this.state.chartType)?CHARTVIEWTYPE_CANDLE:CHARTVIEWTYPE_LINE
			},()=>{
					Orientation.lockToLandscape()
				this.pressChartHeaderTab(this.state.chartType)
			})
		}else{
			height = Dimensions.get('window').width
			width = Dimensions.get('window').height
			this.setState({
				orientation:ORIENTATION_PORTRAIT,
			},()=>{
				Orientation.lockToPortrait()
				this.pressChartHeaderTab(NetConstants.isPortraitChart(this.state.chartType)?this.state.chartType:NetConstants.PARAMETER_CHARTTYPE_TODAY)
			})
		}
		console.log("Set Orientation: ", this.state.orientation);
	},

	_orientationDidChange: function(orientation) {
	 	console.log("changeOrientatioin _orientationDidChange : " + orientation);
		if (orientation == 'LANDSCAPE') {
		 //do something with landscape layout
		} else {
		 //do something with portrait layout
		}
 },

	resetToLandscape:function(){
		Orientation.lockToPortrait();
	},

	renderScrollHeader: function() {
		return (
			<TouchableWithoutFeedback>
			<View style={[styles.rowView, {height:20}]}>
				<Text style={styles.smallLabel}>本金（美元）</Text>
				<Text style={styles.smallLabel}>杠杆（倍）</Text>
			</View>
			</TouchableWithoutFeedback>
		)
	},

	renderScroll: function() {
		console.log("Orientation width = " + width)
		var pickerWidth = width/2-60
		var pickerHeight = Platform.OS === 'ios' ? 216 : 100;
		// money list: 100,500,1000,3000,5000,7000,10000,20000,max
		var rawList=[100, 500, 1000, 2000, 3000, 5000, 7000, 10000, 20000]
		var moneyCount = 0
		var moneyArray = []
		if (this.state.totalMoney <= 0) {
			moneyCount = -1
		}
		else if (this.state.totalMoney <= rawList[rawList.length-1]) {
			for (var i = 0; i < rawList.length; i++) {
				if(this.state.totalMoney > rawList[i]) {
					moneyCount += 1
				}
			};
		}
		else {
			moneyCount = rawList.length
		}

		if (moneyCount === -1) {
			moneyArray = ['0']
		}
		else {
			for (var i = 0; i < moneyCount; i++) {
				moneyArray[i]=""+rawList[i]
			};
			moneyArray.push(""+ Math.floor(this.state.totalMoney))
		}



		// insert the user input value
		var exist = false
		var input = parseInt(this.state.inputText)
		if (input > 10) {
			for (var i = moneyArray.length - 1; i >= 0; i--) {
				var value = parseInt(moneyArray[i])
				if (value === input) {
					// already have
					break
				} else if (value < input) {
					if (i === moneyArray.length-1) {
						// should not bigger than all money
						break
					}
					// insert here
					moneyArray.splice(i+1, 0, ""+input);
					break
				}
				else {
					// value > input
					if (i === 0) {
						moneyArray.splice(0, 0, ""+input)
					}
				}
			}
		}

		moneyArray = commonUtil.removeRepeat1(moneyArray)

		// leverage list: 无，2,3,...,20
		var maxLeverage = 20
		if (this.state.stockInfo.maxLeverage !== undefined) {
			maxLeverage = this.state.stockInfo.maxLeverage
		}
		var leverageArray = new Array(maxLeverage)
		for (var i = 0; i < maxLeverage; i++) {
			leverageArray[i]=i+1
		};
		if (this.state.stockInfo.levList !== undefined) {
			leverageArray = this.state.stockInfo.levList
		}

		return(
			<View style={[styles.rowView, styles.scrollView]}>
				<View/>
				<Picker style={{width: pickerWidth, height: pickerHeight}}
					selectedValue={this.state.money}
					itemSpace={30}
					itemStyle={{color:"white", fontSize: Platform.OS === 'ios' ? 26 : 32 }}
					onValueChange={(value) => this.onPikcerSelect(value, 1)}>
					{moneyArray.map((value) => (
					  <PickerItem label={value} value={parseInt(value)} key={"money"+value}/>
					))}
				</Picker>
				<View/>
				<Picker style={{width: pickerWidth, height: pickerHeight}}
					selectedValue={this.state.leverage}
					itemSpace={30}
					itemStyle={{color:"white", fontSize: Platform.OS === 'ios' ? 26 : 32 }}
					onValueChange={(value) => this.onPikcerSelect(value, 2)}>
					{leverageArray.map((value) => (
					  <PickerItem label={this.parseLeverage(value)} value={value} key={"lever"+value}/>
					))}
				</Picker>
				{this.renderInput()}
			</View>
		)
	},


	parseLeverage: function(value) {
		if (value === 1)
			return '无'
		else
			return ""+value
	},

	onPikcerSelect: function(value, tag) {
		if(tag===1){
			this.setState({money: value, inputText:""+value})
		}
		else if(tag===2){
			this.setState({leverage: value})
		}
	},

	renderOKButton: function() {
		var buttonEnable = this.state.tradeDirection !== 0 && !this.state.tradingInProgress
		return (
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={() => buttonEnable ? this.okPress():this.okPressInDisable()}
				style={[styles.okView, !buttonEnable && (LogicData.getAccountState()?styles.okViewDisabledLive:styles.okViewDisabled), !this.state.stockInfo.isOpen && (LogicData.getAccountState()?styles.okViewNotOpenedLive:styles.okViewNotOpened)]}>
				<Text style={[styles.okButton, !buttonEnable && styles.okButtonDisabled, !this.state.stockInfo.isOpen && styles.okButtonNotOpened]}>
					{this.state.stockInfo.isOpen ? '确认' : (this.state.stockInfo.status == 2 ?'暂停交易':'未开市')}
				</Text>
			</TouchableOpacity>
		)
	},

	renderStockCurrencyWarning: function() {
		if (this.state.stockInfo.fxData) {
			var fxData = this.state.stockInfo.fxData
			var fxName = fxData.name
			var fxPrice = this.state.stockCurrencyPrice
			if (fxData.symbol.substring(0, UIConstants.USD_CURRENCY.length) != UIConstants.USD_CURRENCY) {
				var nameParts = fxName.split('/')
				fxName = nameParts[1] + '/' + nameParts[0]
				fxPrice = (1 / this.state.stockCurrencyPrice).toPrecision(6)
				if ($.isNaN(fxPrice)) {
					fxPrice = '--'
				}
			}

			return (
				<Text style={styles.stockCurrencyWarningText}>
					当前以{fxName}{fxPrice}汇率结算，存在汇率变动风险！
				</Text>
			)
		}
	},

	resultConfirmed: function() {
		this.clearMoney()
		this.setState({
			tradingInProgress: false,
			tradeDirection: 0,
		})
	},

	okPressInDisable: function(){
		var isNeedButtonFlash = this.state.tradeDirection === 0 && this.state.tradingInProgress;
		if(flashButtonTimer !== null) {
			this.clearInterval(flashButtonTimer)
		}
		this.setState({
			flashTimes : 2,//设置闪烁2的倍数次
		})
		flashButtonTimer = this.setInterval(
			() => {
				this.doFlash();
			},
			500
		);
	},

	doFlash:function(){
		console.log("doFlash = " + this.state.flashTimes);
		if(this.state.flashTimes>0){
			this.setState({
				flashTimes : this.state.flashTimes - 1,
			})
		}else{
			if(flashButtonTimer !== null) {
				this.clearInterval(flashButtonTimer)
			}
		}
	},

	okPress: function() {

		var tradeValue = this.state.money * this.state.leverage
		var minValue = this.state.tradeDirection === 1 ? this.state.stockInfo.minValueLong : this.state.stockInfo.minValueShort
		var maxValue = this.state.tradeDirection === 1 ? this.state.stockInfo.maxValueLong : this.state.stockInfo.maxValueShort
		if (tradeValue < minValue) {
			Alert.alert('提示', '交易此产品: 本金X杠杆需大于' + minValue.toFixed(0) + '美元\n请增加交易本金或者提升杠杆')
			return
		} else if (tradeValue > maxValue) {
			Alert.alert('提示', '高于最大交易额: ' + maxValue.toFixed(0) + 'USD\n(交易额=交易本金X杠杆)')
			return
		}

		var userData = LogicData.getUserData()
		var url = NetConstants.CFD_API.POST_CREATE_POSITION_API
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.POST_CREATE_POSITION_LIVE_API
			console.log('live', url );
		}
		this.setState({tradingInProgress: true})
		var fetchFunction = LogicData.getAccountState() ? NetworkModule.fetchEncryptedUrl : NetworkModule.fetchTHUrl;

		fetchFunction(
			url,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					securityId: this.props.stockCode,
					isLong: this.state.tradeDirection === 1,
					invest: this.state.money,
					leverage: this.state.leverage,
				}),
				showLoading: true,
			},
			(responseJson) => {
				responseJson.stockName = this.props.stockName
				responseJson.isCreate = true
				responseJson.time = new Date(responseJson.createAt)
				responseJson.totalHeight = Dimensions.get('window').height
				this.refs['confirmPage'].show(responseJson, this.resultConfirmed)
				this.setState({
					tradeDirection: 0,
				})
				// refresh balcance data
				NetworkModule.loadUserBalance(true, this.updateUserBalance)

				var eventParam = {};

				eventParam[TalkingdataModule.KEY_SECURITY_ID] =  responseJson.security.id.toString(),
				eventParam[TalkingdataModule.KEY_SECURITY_NAME] = responseJson.security.name;
				eventParam[TalkingdataModule.KEY_INVEST] = this.state.money.toString();
				eventParam[TalkingdataModule.KEY_LEVERAGE] = responseJson.leverage.toString();
				eventParam[TalkingdataModule.KEY_IS_LONG] = responseJson.isLong ? "是" : "否";
				eventParam[TalkingdataModule.KEY_TIME] = responseJson.createAt;

				TalkingdataModule.trackEvent(TalkingdataModule.TRADE_EVENT, '', eventParam)
				//TongDaoModule.trackOpenPositionEvent(responseJson, this.state.money)
			},
			(result) => {
				Alert.alert('', result.errorMessage,
					[
						{text: 'OK', onPress: () => this.setState({tradingInProgress: false})}
					]
				);
			}
		)
	},

	renderInput: function() {
		return (
			<View>
				<Image style={[styles.inputImage, {marginLeft:30-width,marginTop:10}]} source={require('../../images/key.png')}/>
				<TextInput style={[styles.inputText, {marginLeft:40-width, marginTop:-24}]}
					keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"}
					underlineColorAndroid="transparent"
					keyboardAppearance={'dark'}
					selectionColor={'transparent'}
					value={this.state.inputText}
					onChangeText={this.textInputChange}/>
    		</View>
			)
	},

	textInputChange: function(text) {
		var value = parseInt(text)
		if (text.length == 0) {
			value = 0
		}
		else {
			this.refs['InputAccessory'].resetValidState()
		}
		this.setState({inputText:""+value,
			money: value,
			})
	},

});



var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		// width:width,
		backgroundColor: Platform.OS === 'andriod' ? '#123b80' : 'transparent',
	},
	rowView: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5,
		marginTop:5,
		justifyContent: 'space-around',
	},
	lineChart: {
		flex: 1,
		backgroundColor:'transparent',
		justifyContent:'space-between',
		paddingTop: 6,
		paddingBottom: 16,

	},
	tradeButtonView: {
		flex: 1,
		marginLeft: 12,
		marginRight: 12,
		borderRadius:5,
		borderWidth:1,
		borderColor: ColorConstants.COLOR_BORDER,
		backgroundColor: '#356dce',
		alignItems: 'center',
		justifyContent: 'space-around',
		height: 43,
	},
	flashBorder: {
	  borderColor: '#bfd4f7',
	},
	tradeButtonContainer: {
		alignSelf: 'stretch',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	tradeButtonText: {
		fontSize: 19,
	},
	tradeButtonViewSelected:{
		backgroundColor: '#6da2fc',
	},
	tradeButtonViewSelectedLive:{
		backgroundColor: '#a1b6d8',
	},
	tradeButtonImage: {
		width: 35,
		height: 25,
		marginTop: 5,
		marginBottom: 5,
	},
	inputImage: {
		width: 22,
		height: 17,
	},
	inputText: {
		width: 30,
		height: 30,
		backgroundColor:'transparent',
		color: 'transparent',
	},
	smallLabel: {
		fontSize: 13,
		color: 'white',
		paddingTop: 3,
		paddingBottom: 3,
	},
	scrollView: {
		height: 100,
		marginTop:5,
		overflow: 'hidden',
	},
	leftMoneyLabel: {
		fontSize: 13,
		color: '#7a8cb5',
		paddingTop: 3,
		paddingBottom: 3,
		marginTop: 5,
		marginBottom: 5,
	},
	okView: {
		width: 167,
		height: 43,
		backgroundColor: '#f46b6f',
		paddingVertical: 10,
    	borderRadius:5,
    	borderWidth:1,
    	borderColor: '#153a77',
		marginTop: 5,
		marginBottom: 5,
		justifyContent: 'space-around',
	},
	okViewDisabled: {
		backgroundColor: '#164593'
	},
	okViewDisabledLive:{
		backgroundColor: '#3f577e'
	},
	okViewNotOpened: {
		backgroundColor: '#164593'
	},
	okViewNotOpenedLive: {
		backgroundColor: '#486288'
	},
	okButton: {
		color: '#ffffff',
		textAlign: 'center',
		fontSize: 15,
	},
	okButtonDisabled: {
		color: '#5771a8'
	},

	okButtonNotOpened: {
		color: '#f1585c',
	},

	okButtonNotOpenedLive: {
		color: '#486288'
	},

	stockCurrencyWarningText: {
		margin: 5,
		fontSize: 10,
		textAlign: 'center',
		color: '#4e6ea3',
	},
	priceText: {
		fontSize: 8,
		textAlign: 'center',
		color: '#ffffff',
	},
	subTitle: {
		fontSize: 17,
		textAlign: 'center',
		color: '#a0a6aa',
	},
	addToMyListContainer: {
		marginRight: 10,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: '#2d71e5',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#ffffff',
	},
	addToMyListText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#ffffff',
	},
	tradeStrength: {
		flexDirection: 'row',
		height: 2,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 5,
		marginBottom: 5,
	},
	chartTitleTextHighlighted: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff'
	},
	chartTitleText: {
		fontSize: 15,
		textAlign: 'center',
	},
	dataStatus:{
		position:'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		width:width,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'transparent',

	},
	dataStatus2:{
		alignItems:'center',
		justifyContent:'center',
		width:width - 48,
		height:120,
	},
	textDataStatus:{
		color:'white',
		marginTop:5,
	},
	textDataStatusRefresh:{
		color:'white',
		paddingLeft:15,
		paddingRight:15,
		marginTop:10,
		paddingTop:5,
		paddingBottom:5,
		borderColor:'white',
		borderRadius:4,
		borderWidth:1,
	},
	tipsLine:{
		fontSize:9,
		color:'#adc7f4',
		marginRight:10,
		alignSelf:'flex-end',
	},
	title_landspace:{
		backgroundColor:'red',

	},

});

module.exports = StockDetailPage;

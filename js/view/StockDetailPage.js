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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Picker from 'react-native-wheel-picker';
var PickerItem = Picker.Item;

var LineChart = require('./component/lineChart/LineChart');
var dismissKeyboard = require('dismissKeyboard');
var LogicData = require('../LogicData')
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var NavBar = require('../view/NavBar')
var InputAccessory = require('./component/InputAccessory')
var MainPage = require('./MainPage')
var StockTransactionConfirmPage = require('./StockTransactionConfirmPage')
var TimerMixin = require('react-timer-mixin');

var didFocusSubscription = null;
var updateStockInfoTimer = null;

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
	},

	getDefaultProps() {
		return {
			stockCode: 14993,
			stockName: 'ABC company',
			stockPrice: 10,
			stockPriceAsk: '--',
			stockPriceBid: '--',
			lastClosePrice: 9,
		}
	},

	getInitialState: function() {
		var balanceData = LogicData.getBalanceData()
		var available = balanceData === null ? 0 : (balanceData.available < 0 ? 0 : balanceData.available)
		var money = available > 100 ? 100 : Math.floor(available)
		return {
			stockInfo: {isOpen: true},
			money: money,
			leverage: 2,
			totalMoney: available,
			tradeDirection: 0,	//0:none, 1:up, 2:down
			inputText: ''+money,
			stockPrice: this.props.stockPrice,
			stockCurrencyPrice: '--',
			stockPriceAsk: this.props.stockPriceAsk,
			stockPriceBid: this.props.stockPriceBid,
			isAddedToMyList: false,
			tradingInProgress: false,
			chartType: NetConstants.PARAMETER_CHARTTYPE_TODAY,
		};
	},

	componentDidMount: function() {
		this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);
	},

	componentWillUnmount: function() {
		this.didFocusSubscription.remove();
	},

	onDidFocus: function(event) {
        if (MainPage.STOCK_DETAIL_ROUTE === event.data.route.name) {
            this.loadStockInfo()
			NetworkModule.loadUserBalance(false, this.updateUserBalance)
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
		var url = NetConstants.GET_STOCK_DETAIL_API
		url = url.replace(/<stockCode>/, this.props.stockCode)

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
						previousInterestedStocks += ',' + fxId
						WebSocketModule.registerInterestedStocks(previousInterestedStocks)
					}
				}

				this.setState({
					stockInfo: responseJson,
					stockPriceBid: responseJson.bid,
					stockPriceAsk: responseJson.ask,
				})

				this.loadStockPriceToday(true)

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
			(errorMessage) => {
				Alert.alert('', errorMessage);
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
		if (this.state.chartType !== NetConstants.PARAMETER_CHARTTYPE_TODAY)
			return

		this.loadStockPriceToday(false)
	},

	loadStockPriceToday: function(showLoading) {
		var url = NetConstants.GET_STOCK_PRICE_TODAY_API
		url = url.replace(/<stockCode>/, this.props.stockCode)
		url = url.replace(/<chartType>/, this.state.chartType)

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				showLoading: showLoading,
			},
			(responseJson) => {
				var tempStockInfo = this.state.stockInfo
				tempStockInfo.priceData = responseJson
				this.setState({
					stockInfo: tempStockInfo,
				})

				this.connectWebSocket()
			},
			(errorMessage) => {
				Alert.alert('', errorMessage);
			}
		)
	},

	connectWebSocket: function() {
		WebSocketModule.registerCallbacks(
			(realtimeStockInfo) => {
				for (var i = 0; i < realtimeStockInfo.length; i++) {
					if (this.props.stockCode == realtimeStockInfo[i].id &&
								this.state.stockPrice !== realtimeStockInfo[i].last) {
						this.setState({
							stockPrice: realtimeStockInfo[i].last,
							stockPriceAsk: realtimeStockInfo[i].ask,
							stockPriceBid: realtimeStockInfo[i].bid,
						})
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
			LogicData.removeStockFromOwn(stock)
			NetworkModule.removeFromOwnStocks([stock])
			this.setState({
				isAddedToMyList: false,
			})
		} else {
			LogicData.addStockToOwn(stock)
			NetworkModule.addToOwnStocks([stock])
			this.setState({
				isAddedToMyList: true,
			})
		}
	},

	pressChartHeaderTab: function(type) {
		this.setState({
			chartType: type
		})
		this.loadStockPriceToday(true)
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
		return(
			<View style={{flexDirection: 'row', marginTop: 6}} >
				<TouchableOpacity style={{flex:1}} onPress={()=>this.pressChartHeaderTab(NetConstants.PARAMETER_CHARTTYPE_TODAY)}>
					<Text style={this.state.chartType===NetConstants.PARAMETER_CHARTTYPE_TODAY ? styles.chartTitleTextHighlighted : styles.chartTitleText} >
						分时
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{flex:1}} onPress={()=>this.pressChartHeaderTab(NetConstants.PARAMETER_CHARTTYPE_WEEK)}>
					<Text style={this.state.chartType===NetConstants.PARAMETER_CHARTTYPE_WEEK ? styles.chartTitleTextHighlighted : styles.chartTitleText} >
						5日
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{flex:1}} onPress={()=>this.pressChartHeaderTab(NetConstants.PARAMETER_CHARTTYPE_MONTH)}>
					<Text style={this.state.chartType===NetConstants.PARAMETER_CHARTTYPE_MONTH ? styles.chartTitleTextHighlighted : styles.chartTitleText} >
						1月
					</Text>
				</TouchableOpacity>
			</View>
		);
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		var priceData = this.state.stockInfo.priceData
		var maxPrice = undefined
		var minPrice = undefined
		var maxPercentage = undefined
		var minPercentage = undefined

		if (priceData != undefined && priceData.length > 0) {
			var lastClose = this.state.stockInfo.preClose
			maxPrice = Number.MIN_VALUE
			minPrice = Number.MAX_VALUE

			for (var i = 0; i < priceData.length; i ++) {
				var price = priceData[i].p
				if (price > maxPrice) {
					maxPrice = price
				}
				if (price < minPrice) {
					minPrice = price
				}
			}
			var maxPercentage = (maxPrice - lastClose) / lastClose * 100
			var minPercentage = (minPrice - lastClose) / lastClose * 100
			maxPercentage = maxPercentage.toFixed(2)
			minPercentage = minPercentage.toFixed(2)
		}

		// 0.06%, limit to 0.01
		var leftMoney = this.state.totalMoney - this.state.money
		var charge = 0

		return (
			<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
				<View style={styles.wrapper}>
					<LinearGradient colors={['#3475e3', '#123b80']} style={{height: height}}>

						{this.renderHeader()}

						{/*this.renderTradeStrength()*/}

						{this.renderChartHeader()}

						<View style={{flex: 3.5, marginTop:5}}>
							<LineChart style={styles.lineChart}
								data={JSON.stringify(this.state.stockInfo)}
								chartType={this.state.chartType}>
							{this.renderStockMaxPriceInfo(maxPrice, maxPercentage)}
							{this.renderStockMinPriceInfo(minPrice, minPercentage)}
							</LineChart>

						</View>

						<View style={{flex: 1.2, justifyContent: 'space-around'}}>
							{this.renderTradeButton()}
						</View>
						<View style={{flex: 2.5, justifyContent: 'space-around'}}>
							{this.renderScrollHeader()}
							{this.renderScroll()}
						</View>
						<View style={{flex: 2, alignItems: 'center', justifyContent: 'space-around', paddingTop: 30, paddingBottom:Platform.OS === 'ios'?10:48}}>
							<Text style={styles.leftMoneyLabel}> 账户剩余资金：{leftMoney.toFixed(2)}</Text>
							<Text style={styles.smallLabel}> 手续费为{charge}美元</Text>
							{this.renderOKButton()}
							{this.renderStockCurrencyWarning()}
						</View>
					</LinearGradient>
	    			<InputAccessory ref='InputAccessory'
	    				textValue={this.state.inputText}
	    				maxValue={parseFloat(this.state.totalMoney.toFixed(2))}
	    				rightButtonOnClick={this.clearMoney}/>

	    			<StockTransactionConfirmPage ref='confirmPage'/>
				</View>
    		</TouchableWithoutFeedback>
		)
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
				backButtonOnClick={this.props.showTabbar}
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
				<View style={styles.addToMyListContainer}>
					<Text style={styles.addToMyListText}>
						{this.state.isAddedToMyList ? '删除自选':'+自选'}
					</Text>
				</View>
			</TouchableOpacity>
		)
	},

	renderTradeStrength: function() {
		if (this.state.stockInfo.longPct !== undefined) {
			var upPercentage = (this.state.stockInfo.longPct * 100).toFixed(2)
			var downPercentage = 100 - upPercentage
			return (
				<View>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={styles.tradeStrengthText}>
						{upPercentage}
					</Text>
					<Text style={styles.tradeStrengthTextSmall}>
						% 买涨
					</Text>
					</View>
					<View style={styles.tradeStrength}>
						<View style={{flex: upPercentage * 100, marginRight: 5, backgroundColor: "#c65972"}} />
						<View style={{flex: downPercentage * 100, backgroundColor: "#29af72"}} />
					</View>
				</View>
			)
		} else {
			return (
				<View>
					<Text style={styles.tradeStrengthTextSmall}>
						-- % 买涨
					</Text>
					<View style={styles.tradeStrength}>
						<View style={{flex: 1, marginRight: 5, backgroundColor: "#c65972"}} />
						<View style={{flex: 1, backgroundColor: "#29af72"}} />
					</View>
				</View>
			)
		}

	},

	renderTradeButton: function() {
		var upSelected = this.state.tradeDirection === 1
		var upImage = upSelected ? require('../../images/click-up.png') : require('../../images/up.png')
		var downSelected = this.state.tradeDirection === 2
		var downImage = downSelected ? require('../../images/click-down.png') : require('../../images/down.png')

		var upTextColor = 'white'
		var downTextColor = 'white'
		if (!upSelected) upTextColor = '#568ff1'
		if (!downSelected) downTextColor = '#568ff1'

		return (
			<View style={[styles.rowView, {alignItems:'stretch'}]}>
				<TouchableHighlight
					underlayColor={upSelected ? '#6da2fc': '#356dce'}
					onPress={() => this.state.stockInfo.isOpen && this.buyPress()} style={[styles.tradeButtonView, upSelected&&styles.tradeButtonViewSelected]}>
					<View style={styles.tradeButtonContainer}>
						<Text style={[styles.tradeButtonText, {color: upTextColor}]}>
							{this.state.stockPriceAsk}
						</Text>
						<Image style={styles.tradeButtonImage} source={upImage}/>
					</View>

				</TouchableHighlight>
				<TouchableHighlight
					underlayColor={downSelected ? '#6da2fc': '#356dce'}
					onPress={() => this.state.stockInfo.isOpen && this.sellPress()} style={[styles.tradeButtonView, downSelected&&styles.tradeButtonViewSelected]}>
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

	buyPress: function() {
		if(!this.state.stockInfo.isOpen) {
			Alert.alert(this.state.stockInfo.name,'已停牌/休市,暂时不能进行交易')
			return
		}
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined) {
			if (this.state.tradeDirection === 1)
				this.setState({tradeDirection:0})
			else
				this.setState({tradeDirection:1})
		} else {
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
			});
		}
	},

	sellPress: function() {
		if(!this.state.stockInfo.isOpen) {
			Alert.alert(this.state.stockInfo.name,'已停牌/休市,暂时不能进行交易')
			return
		}
		var userData = LogicData.getUserData()
		var loggined = Object.keys(userData).length !== 0
		if (loggined) {
			if (this.state.tradeDirection === 2)
				this.setState({tradeDirection:0})
			else
				this.setState({tradeDirection:2})
		} else {
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
			});
		}
	},

	renderScrollHeader: function() {
		return (
			<View style={[styles.rowView, {height:20}]}>
				<Text style={styles.smallLabel}>本金（美元）</Text>
				<Text style={styles.smallLabel}>杠杠（倍）</Text>
			</View>
		)
	},

	renderScroll: function() {
		var {height, width} = Dimensions.get('window');
		var pickerWidth = width/2-60
		var pickerHeight = 216
		// money list: 100,500,1000,3000,5000,7000,10000,20000,max
		var rawList=[100, 500, 1000, 3000, 5000, 7000, 10000, 20000]
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
		if (input > 0) {
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
					itemStyle={{color:"white", fontSize:26}}
					onValueChange={(value) => this.onPikcerSelect(value, 1)}>
					{moneyArray.map((value) => (
					  <PickerItem label={value} value={parseInt(value)} key={"money"+value}/>
					))}
				</Picker>
				<View/>
				<Picker style={{width: pickerWidth, height: pickerHeight}}
					selectedValue={this.state.leverage}
					itemStyle={{color:"white", fontSize:26}}
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
				onPress={() => buttonEnable && this.okPress()}
				style={[styles.okView, !buttonEnable && styles.okViewDisabled, !this.state.stockInfo.isOpen && styles.okViewNotOpened]}>
				<Text style={[styles.okButton, !buttonEnable && styles.okButtonDisabled, !this.state.stockInfo.isOpen && styles.okButtonNotOpened]}>
					{this.state.stockInfo.isOpen ? '确认' : '未开市'}
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

	okPress: function() {

		var tradeValue = this.state.money * this.state.leverage
		var minValue = this.state.tradeDirection === 1 ? this.state.stockInfo.minValueLong : this.state.stockInfo.minValueShort
		var maxValue = this.state.tradeDirection === 1 ? this.state.stockInfo.maxValueLong : this.state.stockInfo.maxValueShort
		if (tradeValue < minValue) {
			Alert.alert('提示', '低于最小交易额: ' + minValue.toFixed(0) + 'USD\n(交易额=交易本金X杠杆)')
			return
		} else if (tradeValue > maxValue) {
			Alert.alert('提示', '高于最大交易额: ' + maxValue.toFixed(0) + 'USD\n(交易额=交易本金X杠杆)')
			return
		}

		var userData = LogicData.getUserData()
		var url = NetConstants.POST_CREATE_POSITION_API
		this.setState({tradingInProgress: true})

		NetworkModule.fetchTHUrl(
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
			},
			(errorMessage) => {
				Alert.alert('', errorMessage,
				[
					{text: 'OK', onPress: () => this.setState({tradingInProgress: false})}
				]
			);

			}
		)
	},

	renderInput: function() {
		var {height, width} = Dimensions.get('window');
		return (
			<View>
				<Image style={[styles.inputImage, {marginLeft:50-width,marginTop:10}]} source={require('../../images/key.png')}/>
				<TextInput style={[styles.inputText, {marginLeft:40-width, marginTop:-24}]}
					keyboardType={Platform.OS === 'ios' ? "number-pad" : "numeric"}
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
	}
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
	},
	rowView: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingTop: 5,
		paddingBottom: 5,
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
		margin: 12,
    	paddingTop:8,
    	paddingBottom:9,
    	borderRadius:5,
    	borderWidth:1,
    	borderColor: '#133e86',
		backgroundColor: '#356dce',
		alignItems: 'center',
		justifyContent: 'space-around',
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
	tradeButtonImage: {
		width: 35,
		height: 25,
	},
	inputImage: {
		width: 13,
		height: 11,
	},
	inputText: {
		width: 30,
		height: 30,
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
	okViewNotOpened: {
		backgroundColor: '#164593'
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
		color: '#f1585c'
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
	timeText: {
		fontSize: 8,
		textAlign: 'center',
		color: '#70a5ff',
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
	tradeStrengthText: {
		fontSize: 19,
		textAlign: 'left',
		color: '#70a5ff',
		marginLeft: 10,
	},
	tradeStrengthTextSmall: {
		fontSize: 14,
		textAlign: 'left',
		color: '#70a5ff',
		marginLeft: 1,
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
		flex: 1,
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff'
	},
	chartTitleText: {
		flex: 1,
		fontSize: 15,
		textAlign: 'center',
		color: '#70a5ff'
	},
});

module.exports = StockDetailPage;

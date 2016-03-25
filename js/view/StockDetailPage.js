'use strict';

var React = require('react-native');
var LineChart = require('./component/lineChart/LineChart');
var LinearGradient = require('react-native-linear-gradient');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	Alert,
	Dimensions,
	Picker,
} = React;

var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var NavBar = require('../view/NavBar')
var PickerItem = Picker.Item;

var StockDetailPage = React.createClass({
	propTypes: {
		stockCode: React.PropTypes.number,
		stockName: React.PropTypes.string,
		stockPrice: React.PropTypes.number,
		stockIncPercentage: React.PropTypes.number,
	},

	getDefaultProps() {
		return {
			stockCode: 14993,
			stockName: 'ABC company',
			stockPrice: 10,
			stockIncPercentage: 0.5
		}
	},

	getInitialState: function() {
		return {
			stockInfo: [],
			money: 20,
			leverage: 2,
			leftMoney: 1000,
		};
	},

	componentWillMount: function() {
		this.loadStockInfo()
	},

	loadStockInfo: function() {
		var url = NetConstants.GET_STOCK_DETAIL_API
		url = url.replace(/<stockCode>/, this.props.stockCode)

		NetworkModule.fetchTHUrl(
			url, 
			{
				method: 'GET',
			},
			(responseJson) => {
				this.setState({
					stockInfo: responseJson,
				})

				this.loadStockPriceToday()
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
			}
		)
	},

	loadStockPriceToday: function() {
		var url = NetConstants.GET_STOCK_PRICE_TODAY_API
		url = url.replace(/<stockCode>/, this.props.stockCode)

		NetworkModule.fetchTHUrl(
			url, 
			{
				method: 'GET',
			},
			(responseJson) => {
				var tempStockInfo = this.state.stockInfo
				tempStockInfo.priceData = responseJson
				this.setState({
					stockInfo: tempStockInfo,
				})
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
			}
		)
	},

	addToMyListClicked: function() {

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
	},

	renderStockMinPriceInfo: function(minPrice, minPercentage) {
		if (minPrice && minPercentage)
		{
			return (
				<View style={{flexDirection: 'row', marginTop: -30}}>
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

	renderTime: function(){
		if (this.state.stockInfo.priceData !== undefined) {
			var firstDate = new Date(this.state.stockInfo.priceData[0].time)
			var lastDate = new Date(this.state.stockInfo.priceData[this.state.stockInfo.priceData.length - 1].time)

			return (
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flex: 1, alignItems: 'flex-start'}}>
						<Text style={styles.timeText}>
							{firstDate.getHours()} :00
						</Text>
					</View>
					
					<View style={{flex: 1, alignItems: 'flex-end'}}>
						<Text style={styles.timeText}>
							{lastDate.getHours()} :00
						</Text>
					</View>
				</View>
			);
		}
	},

	renderChartHeader: function() {
		return(
			<View style={{flexDirection: 'row', marginBottom: 10}} >
				<Text style={styles.chartTitleTextHighlighted} >
					分时
				</Text>
				<Text style={styles.chartTitleText} >
					5日
				</Text>
				<Text style={styles.chartTitleText} >
					1月
				</Text>
			</View>
		);
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		var charge = 0.03
		var priceData = this.state.stockInfo.priceData
		var maxPrice = undefined
		var minPrice = undefined
		var maxPercentage = undefined
		var minPercentage = undefined

		if (priceData != undefined) {
			var lastClose = this.state.stockInfo.preClose
			maxPrice = Number.MIN_VALUE
			minPrice = Number.MAX_VALUE
			
			for (var i = 0; i < priceData.length; i ++) {
				var price = priceData[i].p
				if (price > maxPrice) {
					maxPrice = price
				} else if (price < minPrice) {
					minPrice = price
				}
			}
			var maxPercentage = (maxPrice - lastClose) / lastClose * 100
			var minPercentage = (minPrice - lastClose) / lastClose * 100
			maxPercentage = maxPercentage.toFixed(2)
			minPercentage = minPercentage.toFixed(2)
		}

		return (
			<View style={styles.wrapper}>
				<LinearGradient colors={['#1c5fd1', '#123b80']} style={{height: height}}>
					
					{this.renderHeader()}

					{this.renderTradeStrength()}

					{this.renderChartHeader()}

					<View style={{flex: 3}}>
						
						{this.renderStockMaxPriceInfo(maxPrice, maxPercentage)}
						<LineChart style={{flex: 1, backgroundColor:'transparent', marginTop: -30}} data={JSON.stringify(this.state.stockInfo)}/>
						{this.renderStockMinPriceInfo(minPrice, minPercentage)}
						{this.renderTime()}
						
					</View>

					<View style={{flex: 6, alignItems: 'center'}}>
						{this.renderTradeButton()}
						{this.renderScrollHeader()}
						{this.renderScroll()}
						<Text style={styles.smallLabel}> 账户剩余资金：{this.state.leftMoney}</Text>
						<Text style={styles.smallLabel}> 手续费为{charge}美元</Text>
						{this.renderOKButton()}
					</View>
				</LinearGradient>
			</View>
		)
	},

	renderTradeButton: function() {
		return (
			<View style={styles.rowView}>
				<TouchableHighlight
					onPress={this.buyPress}>
					<Text style={styles.tradeButton}>
						涨
					</Text>
				</TouchableHighlight>
				<TouchableHighlight
					onPress={this.sellPress}>
					<Text style={styles.tradeButton}>
						跌
					</Text>
				</TouchableHighlight>
			</View>
		)
	},

	renderHeader: function() {
		var subTitleColor = '#a0a6aa'
		if (this.props.stockIncPercentage > 0) {
			subTitleColor = ColorConstants.STOCK_RISE_RED
		} else if (this.props.stockIncPercentage < 0) {
			subTitleColor = ColorConstants.STOCK_DOWN_GREEN
		}

		var subTitleText = this.props.stockPrice + '  '
		if (this.props.stockIncPercentage > 0) {
			subTitleText += '+' + this.props.stockIncPercentage.toFixed(2) + '%'
		} else {
			subTitleText += this.props.stockIncPercentage.toFixed(2) + '%'
		}
		return (
			<NavBar showBackButton={true} navigator={this.props.navigator}
					title={this.props.stockName}
					subTitle={subTitleText}
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
						+ 自选
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
					<Text style={styles.tradeStrengthText}>
						{upPercentage} % 买涨
					</Text>
					<View style={styles.tradeStrength}>
						<View style={{flex: upPercentage * 100, marginRight: 5, backgroundColor: ColorConstants.STOCK_RISE_RED}} />
						<View style={{flex: downPercentage * 100, backgroundColor: ColorConstants.STOCK_DOWN_GREEN}} />
					</View>
				</View>
			)
		} else {
			return (
				<View>
					<Text style={styles.tradeStrengthText}>
						-- % 买涨
					</Text>
					<View style={styles.tradeStrength}>
						<View style={{flex: 1, marginRight: 5, backgroundColor: ColorConstants.STOCK_RISE_RED}} />
						<View style={{flex: 1, backgroundColor: ColorConstants.STOCK_DOWN_GREEN}} />
					</View>
				</View>
			)
		}
		
	},

	buyPress: function() {
	},
	sellPress: function() {
	},

	renderScrollHeader: function() {
		return (
			<View style={styles.rowView}>
				<Text style={styles.smallLabel}>
					本金（美元）
				</Text>
				<Text style={styles.smallLabel}>
					杠杠（倍）
				</Text>
			</View>	
		)
	},

	renderScroll: function() {
		var {height, width} = Dimensions.get('window');
		var pickerWidth = width/2-40
		var moneyArray = new Array(10)
		for (var i = 0; i < 10; i++) {
			moneyArray[i]=""+(i+1)*10
		};
		var leverageArray = new Array(20)
		for (var i = 0; i < 20; i++) {
			leverageArray[i]=""+(i+1)
		};
		leverageArray[0]='无'
		var leverageCount = 1
		return(
			<View style={[styles.rowView, {height:140}]}>
				<Picker style={{width: pickerWidth}}
					selectedValue={this.state.money}
					mode='dialog'
					itemStyle={{color:"white"}}
					onValueChange={(value) => this.setState({money: value})}>
					{moneyArray.map((value) => (
					  <PickerItem label={value} value={parseInt(value)} key={"money"+value}/>
					))}
				</Picker>
				<Picker style={{width: pickerWidth}}
					selectedValue={this.state.leverage}
					itemStyle={{color:"white"}}
					onValueChange={(value) => this.setState({leverage: value})}>
					{leverageArray.map((value) => (
					  <PickerItem label={value} key={"lever"+leverageCount} value={leverageCount++}/>
					))}
				</Picker>
			</View>
		)
	},

	renderOKButton: function() {
		return (
			<TouchableHighlight
				onPress={this.okPress}>
				<Text style={styles.okButton}>
					确认
				</Text>
			</TouchableHighlight>
		)
	},

	okPress: function() {
	},
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
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'space-around',
	},
	tradeButton: {
		fontSize: 15,
		width: 140,
		height: 40,
		lineHeight: 27,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: '#6da2fc',
	},
	smallLabel: {
		fontSize: 13,
		color: 'white',
		paddingTop: 3,
		paddingBottom: 3,
	},
	okButton: {
		fontSize: 15,
		width: 140,
		height: 40,
		lineHeight: 27,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: '#f46b6f',
	},
	priceText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#ffffff',
	},
	timeText: {
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},
	subTitle: {
		fontSize: 18,
		textAlign: 'center',
		color: '#a0a6aa',
	},
	addToMyListContainer: {
		marginRight: 10,
		padding: 5,
		backgroundColor: '#2d71e5',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#ffffff',
	},
	addToMyListText: {
		fontSize: 16,
		textAlign: 'center',
		color: '#ffffff',
	},
	tradeStrengthText: {
		fontSize: 18,
		textAlign: 'left',
		color: '#70a5ff',
		marginLeft: 10,
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
		fontSize: 18,
		textAlign: 'center',
		color: '#ffffff'
	},
	chartTitleText: {
		flex: 1,
		fontSize: 16,
		textAlign: 'center',
		color: '#a0a6aa'
	},
});

module.exports = StockDetailPage;
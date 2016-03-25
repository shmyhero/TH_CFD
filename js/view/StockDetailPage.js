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
	Alert,
	Dimensions,
	Picker,
} = React;

var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var NavBar = require('../view/NavBar')


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

	componentDidMount: function() {
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

	renderStockPriceInfo: function(maxPrice, maxPercentage, minPrice, minPercentage) {
		if (maxPrice && minPrice && maxPercentage && minPercentage)
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

					<View style={{flex: 3}}>
						
						<LineChart style={{flex: 1, backgroundColor:'rgba(0,0,0,0)'}} data={JSON.stringify(this.state.stockInfo)}/>
						{this.renderStockPriceInfo(maxPrice, maxPercentage, minPrice, minPercentage)}
						
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
			subTitleColor = '#ea5458'
		} else if (this.props.stockIncPercentage < 0) {
			subTitleColor = '#40c19a'
		}

		var subTitleText = this.props.stockPrice + '  '
		if (this.props.stockIncPercentage > 0) {
			subTitleText += '+' + this.props.stockIncPercentage + '%'
		} else {
			subTitleText += this.props.stockIncPercentage + '%'
		}
		return (
			<NavBar showBackButton={true} navigator={this.props.navigator}
					title={this.props.stockName}
					subTitle={subTitleText}
					subTitleStyle={[styles.subTitle, {color: subTitleColor}]}/>
		)
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
		return(
			<View style={[styles.rowView, {height:160}]}>
				<Picker style={{width: pickerWidth}}
				  selectedValue={this.state.money}
				  onValueChange={(value) => this.setState({money: value})}>
				  <Picker.Item label="10" value="10" />
				  <Picker.Item label="20" value="20" />
				  <Picker.Item label="30" value="30" />
				  <Picker.Item label="40" value="40" />
				  <Picker.Item label="50" value="50" />
				</Picker>
				<Picker style={{width: pickerWidth}}
				  selectedValue={this.state.leverage}
				  onValueChange={(value) => this.setState({leverage: value})}>
				  <Picker.Item label="无" value="1" />
				  <Picker.Item label="2" value="2" />
				  <Picker.Item label="3" value="3" />
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
	subTitle: {
		fontSize: 16,
		textAlign: 'center',
		color: '#a0a6aa',
	},
});

module.exports = StockDetailPage;
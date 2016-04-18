'use strict';

var React = require('react-native');
var LineChart = require('./component/lineChart/LineChart');
var LinearGradient = require('react-native-linear-gradient');
var dismissKeyboard = require('dismissKeyboard');

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Alert,
	Dimensions,
	PickerIOS,
	TextInput,
	Platform,
} = React;

var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var NavBar = require('../view/NavBar')
var InputAccessory = require('./component/InputAccessory')
var Picker = require('react-native-wheel-picker')
var PickerItem = Picker.Item;
var AppNavigator = require('../../AppNavigator')
var StockTransactionConfirmPage = require('./StockTransactionConfirmPage')

var didFocusSubscription = null;

var StockDetailPage = React.createClass({
	propTypes: {
		stockCode: React.PropTypes.number,
		stockName: React.PropTypes.string,
		stockSymbol: React.PropTypes.string,
		stockPrice: React.PropTypes.number,
		stockTag: React.PropTypes.string,
		lastClosePrice: React.PropTypes.number,
		openPrice: React.PropTypes.number,
	},

	getDefaultProps() {
		return {
			stockCode: 14993,
			stockName: 'ABC company',
			stockPrice: 10,
			lastClosePrice: 9,
		}
	},

	getInitialState: function() {
		return {
			stockInfo: [],
			money: 20,
			leverage: 2,
			totalMoney: 1000,
			tradeDirection: 0,	//0:none, 1:up, 2:down
			inputText: '0',
			stockPrice: this.props.stockPrice,
			isAddedToMyList: false,
		};
	},

	componentDidMount: function() {
		this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);
	},

	componentWillUnmount: function() {
		this.didFocusSubscription.remove();
	},

	onDidFocus: function(event) {
        if (AppNavigator.STOCK_DETAIL_ROUTE === event.data.route.name) {
            this.loadStockInfo()
        }
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

		var myListData = LogicData.getOwnStocksData()
		var index = myListData.findIndex((stock) => {return stock.id === this.props.stockCode})
		if (index !== -1) {
			this.setState({
				isAddedToMyList: true,
			})
		}
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

				this.connectWebSocket()
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
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
							stockPrice: realtimeStockInfo[i].last
						})
						break;
					}
				};
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

	renderTime: function(){
		if (this.state.stockInfo.priceData !== undefined) {
			var firstDate = new Date(this.state.stockInfo.priceData[0].time)
			var lastDate = new Date(this.state.stockInfo.priceData[this.state.stockInfo.priceData.length - 1].time)

			return (
				<View style={{flexDirection: 'row', marginTop: 5}}>
					<View style={{flex: 1, alignItems: 'flex-start', marginLeft:3}}>
						<Text style={styles.timeText}>
							{firstDate.getHours()}:{firstDate.getMinutes()}
						</Text>
					</View>

					<View style={{flex: 1, alignItems: 'flex-end', marginRight:3}}>
						<Text style={styles.timeText}>
							{lastDate.getHours()}:{firstDate.getMinutes()}
						</Text>
					</View>
				</View>
			);
		}
	},

	renderChartHeader: function() {
		return(
			<View style={{flexDirection: 'row', marginTop: 6}} >
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
		var charge = Math.round(this.state.money*0.06)/100.0

		return (
			<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
				<View style={styles.wrapper}>
					<LinearGradient colors={['#3475e3', '#123b80']} style={{height: height}}>

						{this.renderHeader()}

						{this.renderTradeStrength()}

						{this.renderChartHeader()}

						<View style={{flex: 3, marginTop:10}}>
							{this.renderStockMaxPriceInfo(maxPrice, maxPercentage)}
							<LineChart style={{flex: 1, backgroundColor:'transparent', marginTop: -26}} data={JSON.stringify(this.state.stockInfo)}/>
							{this.renderStockMinPriceInfo(minPrice, minPercentage)}
							{this.renderTime()}

						</View>

						<View style={{flex: 1.2, justifyContent: 'space-around'}}>
							{this.renderTradeButton()}
						</View>
						<View style={{flex: 2.8, justifyContent: 'space-around'}}>
							{this.renderScrollHeader()}
							{this.renderScroll()}
						</View>
						<View style={{flex: 2, alignItems: 'center', justifyContent: 'space-around', paddingBottom:Platform.OS === 'ios'?10:48}}>
							<Text style={styles.leftMoneyLabel}> 账户剩余资金：{leftMoney}</Text>
							<Text style={styles.smallLabel}> 手续费为{charge}美元</Text>
							{this.renderOKButton()}
						</View>
					</LinearGradient>
	    			<InputAccessory textValue={this.state.inputText} maxValue={this.state.totalMoney}
	    				rightButtonOnClick={this.updateMoney}/>

	    			<StockTransactionConfirmPage ref='confirmPage'/>
				</View>
    		</TouchableWithoutFeedback>
		)
	},

	updateMoney: function() {
		var value = parseInt(this.state.inputText)
		if (value > this.state.totalMoney) {
			this.setState({inputText:'0', money:0})
		}
	},

	renderHeader: function() {
		var percentChange = 0

		if (this.props.lastClosePrice == 0) {
			percentChange = '--'
		} else {
			percentChange = (this.state.stockPrice - this.props.lastClosePrice) / this.props.lastClosePrice * 100
		}

		var subTitleColor = '#a0a6aa'
		if (percentChange > 0) {
			subTitleColor = ColorConstants.STOCK_RISE_RED
		} else if (percentChange < 0) {
			subTitleColor = ColorConstants.STOCK_DOWN_GREEN
		}

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
					barStyle={{height: barHeight}}	titleStyle={{fontSize:16}}
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

		return (
			<View style={[styles.rowView, {alignItems:'stretch'}]}>
				<TouchableHighlight
					underlayColor={upSelected ? '#6da2fc': '#356dce'}
					onPress={this.buyPress} style={[styles.tradeButtonView, upSelected&&styles.tradeButtonViewSelected]}>
					<Image style={styles.tradeButtonImage} source={upImage}/>
				</TouchableHighlight>
				<TouchableHighlight
					underlayColor={downSelected ? '#6da2fc': '#356dce'}
					onPress={this.sellPress} style={[styles.tradeButtonView, downSelected&&styles.tradeButtonViewSelected]}>
					<Image style={styles.tradeButtonImage} source={downImage}/>
				</TouchableHighlight>
			</View>
		)
	},

	buyPress: function() {
		if (this.state.tradeDirection === 1)
			this.setState({tradeDirection:0})
		else
			this.setState({tradeDirection:1})
	},
	sellPress: function() {
		if (this.state.tradeDirection === 2)
			this.setState({tradeDirection:0})
		else
			this.setState({tradeDirection:2})
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
		// money list: 10, 20, 30, ...,100,max
		var moneyCount = 11
		var moneyArray = []
		if (this.state.totalMoney <= 0) {
			moneyCount = 0
		}
		else if (this.state.totalMoney <= 100) {
			moneyCount = Math.floor(this.state.totalMoney/10)
			if (this.state.totalMoney % 10 !== 0) {
				moneyCount += 1
			}
		}
		if (moneyCount === 0) {
			moneyArray = ['10']
		}
		else {
			for (var i = 0; i < moneyCount-1; i++) {
				moneyArray[i]=""+(i+1)*10
			};
			moneyArray[moneyCount-1]=""+this.state.totalMoney
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
			}
		}

		// leverage list: 无，2,3,...,20
		var leverageArray = new Array(20)
		for (var i = 0; i < 20; i++) {
			leverageArray[i]=""+(i+1)
		};
		leverageArray[0]='无'
		var leverageCount = 1
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
					  <PickerItem label={value} value={leverageCount++} key={"lever"+leverageCount}/>
					))}
				</Picker>
				{this.renderInput()}
			</View>
		)
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
		var buttonEnable = this.state.tradeDirection !== 0
		return (
			<TouchableHighlight
				underlayColor={buttonEnable ? '#f46b6f': '#164593'}
				onPress={this.okPress} style={[styles.okView, !buttonEnable && styles.okViewDisabled]}>
				<Text style={[styles.okButton, !buttonEnable && styles.okButtonDisabled]}>确认</Text>
			</TouchableHighlight>
		)
	},

	okPress: function() {
		var userData = LogicData.getUserData()
		var url = NetConstants.POST_CREATE_POSITION_API

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
				})
			},
			(responseJson) => {
				responseJson.stockName = this.props.stockName
				responseJson.isCreate = true
				responseJson.time = new Date(responseJson.createAt)
				this.refs['confirmPage'].show(responseJson)
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
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
	tradeButtonView: {
		width: 140,
		height: 45,
    	paddingTop:7,
    	paddingBottom:7,
    	borderRadius:5,
    	borderWidth:1,
    	borderColor: '#133e86',
		backgroundColor: '#356dce',
		alignItems: 'center',
		justifyContent: 'space-around',
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
	okButton: {
		color: '#ffffff',
		textAlign: 'center',
		fontSize: 15,
	},
	okButtonDisabled: {
		color: '#5771a8'
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

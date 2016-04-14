'use strict';

var LineChart = require('./component/lineChart/LineChart');
var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	ListView,
	TouchableHighlight,
	TouchableOpacity,
	Dimensions,
	Image,
	Alert,
} = React;
var {EventCenter, EventConst} = require('../EventCenter')


var LogicData = require('../LogicData')
var AppNavigator = require('../../AppNavigator')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
		return r1.id !== r2.id || r1.profitPercentage!==r2.profitPercentage || r1.hasSelected!==r2.hasSelected
	}});

var extendHeight = 0

var StockOpenPositionPage = React.createClass({
	
	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows([]),
			stockInfoRowData: [],
			selectedRow: -1,
			selectedSubItem: 0,
			stockDetailInfo: []
		};
	},

	componentDidMount: function() {
		this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.EXCHANGE_TAB_PRESS_EVENT, this.loadOpenPositionInfo);
	},

	componentWillUnmount: function() {
		this.didTabSelectSubscription.remove();
	},

	onEndReached: function() {

	},

	loadOpenPositionInfo: function() {
		var userData = LogicData.getUserData()
		var url = NetConstants.GET_OPEN_POSITION_API
		NetworkModule.fetchTHUrl(
			url, 
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
			},
			(responseJson) => {
				this.setState({
					stockInfoRowData: responseJson,
					stockInfo: this.state.stockInfo.cloneWithRows(responseJson),
				})
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
			}
		)
	},

	loadStockDetailInfo: function(stockCode) {
		var url = NetConstants.GET_STOCK_PRICE_TODAY_API
		url = url.replace(/<stockCode>/, stockCode)

		NetworkModule.fetchTHUrl(
			url, 
			{
				method: 'GET',
			},
			(responseJson) => {
				var tempStockInfo = this.state.stockDetailInfo
				tempStockInfo.priceData = responseJson
				this.setState({
					stockDetailInfo: tempStockInfo,
				})
			},
			(errorMessage) => {
				Alert.alert('网络错误提示', errorMessage);
			}
		)
	},

	stockPressed: function(rowData, sectionID, rowID, highlightRow) {
		var newData = []
		$.extend(true, newData, this.state.stockInfoRowData)	// deep copy
		if (this.state.selectedRow == rowID) {
			newData[rowID].hasSelected = false
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				selectedRow: -1,
				selectedSubItem: 0,
				stockInfoRowData: newData,
			})
		} else {
			var height = this.refs['listview'].getMetrics().contentLength
			if (this.state.selectedRow >=0 ) {
				newData[this.state.selectedRow].hasSelected = false
				height -= extendHeight
			}
			newData[rowID].hasSelected = true
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				selectedRow: rowID,
				selectedSubItem: 0,
				stockInfoRowData: newData,
			})
			var y = Math.floor(height/newData.length*rowID)
			this.refs['listview'].scrollTo({x:0, y:y, animated:true})
		}
	},

	subItemPress: function(item, rowData) {
		this.setState({
			selectedSubItem: this.state.selectedSubItem === item ? 0 : item,
		})

		if (item === 2) {
			var stockid = rowData.security.id
			this.setState({
				stockDetailInfo: rowData.security
			})
			this.loadStockDetailInfo(stockid)
		}
	},

	okPress: function() {

	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	},

	renderFooter: function() {

	},

	renderCountyFlag: function(rowData) {
		if (rowData.tag !== undefined) {
			return (
				<View style={styles.stockCountryFlagContainer}>
					<Text style={styles.stockCountryFlagText}>
						{rowData.security.tag}
					</Text>
				</View>
			);
		}
	},

	renderProfit: function(percentChange) {
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<Text style={[styles.stockPercentText, {color: ColorConstants.STOCK_RISE_RED}]}>
					 +{percentChange} %
				</Text>
			);
		} else if (percentChange < 0) {
			return (
				<Text style={[styles.stockPercentText, {color: ColorConstants.STOCK_DOWN_GREEN}]}>
					 {percentChange} %
				</Text>
			);
			
		} else {
			return (
				<Text style={[styles.stockPercentText, {color: '#a0a6aa'}]}>
					 {percentChange} %
				</Text>
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

	renderStockMaxPriceInfo: function(maxPrice, maxPercentage, isTop) {
		if (maxPrice && maxPercentage)
		{
			return (
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
						<Text style={[styles.priceText, isTop && {color:'black'}]}>
							{maxPrice}
						</Text>
					</View>
					
					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
						<Text style={[styles.priceText, isTop && {color:'black'}]}>
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

	renderSubDetail: function(rowData) {
		if (this.state.selectedSubItem === 1) {
			// charge detail
			return (
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓费</Text>
						<Text style={styles.extendTextBottom}>0.12</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>留仓费</Text>
						<Text style={styles.extendTextBottom}>0.02</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>平仓费</Text>
						<Text style={styles.extendTextBottom}>0.6</Text>
					</View>
				</View>
			);
		}
		else {
			var priceData = this.state.stockDetailInfo.priceData
			var maxPrice = undefined
			var minPrice = undefined
			var maxPercentage = undefined
			var minPercentage = undefined

			if (priceData != undefined) {
				//todo
				var lastClose = rowData.preClose
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
			// market detail
			return (
				<View style={{height: 170}}>
					{this.renderChartHeader()}
					{this.renderStockMaxPriceInfo(maxPrice, maxPercentage, true)}
					<LineChart style={{flex: 1, backgroundColor:'transparent', marginTop:-25, marginBottom:-25}}
						data={JSON.stringify(this.state.stockDetailInfo)}
						colorType={1}/>
					{this.renderStockMaxPriceInfo(maxPrice, maxPercentage, false)}
				</View>
			);
		}
	},

	renderDetailInfo: function(rowData) {
		var buttonEnable = true
		var tradeImage = rowData.isLong ? require('../../images/dark_up.png') : require('../../images/dark_down.png')
		var showNetIncome = false
		extendHeight = 222
		if (showNetIncome) {
			extendHeight += 20
		}
		if (this.state.selectedSubItem === 1) {
			extendHeight += 51
		}
		if (this.state.selectedSubItem === 2) {
			extendHeight += 170
		}
		return (
			<View style={[{height: extendHeight}, styles.extendWrapper]} >
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>类型</Text>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>本金</Text>
						<Text style={styles.extendTextBottom}>{rowData.invest}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>杠杆</Text>
						<Text style={styles.extendTextBottom}>{rowData.leverage}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.settlePrice}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>当前价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.security.last}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>价差</Text>
						<Text style={styles.extendTextBottom}>{(rowData.security.last - rowData.settlePrice).toFixed(2)}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />

				<View style={styles.extendRowWrapper}>
					<TouchableOpacity onPress={()=>this.subItemPress(1, rowData)}
						style={[styles.extendLeft, (this.state.selectedSubItem===1)&&styles.rightTopBorder, (this.state.selectedSubItem===2)&&styles.bottomBorder]}>
						<Text style={styles.extendTextTop}>手续费</Text>
						<Image style={styles.extendImageBottom} source={require('../../images/charge.png')}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>this.subItemPress(2, rowData)}
						style={[styles.extendMiddle, (this.state.selectedSubItem===1)&&styles.bottomBorder, (this.state.selectedSubItem===2)&&styles.leftTopRightBorder]}>
						<Text style={styles.extendTextTop}>行情</Text>
						<Image style={styles.extendImageBottom} source={require('../../images/market.png')}/>
					</TouchableOpacity>
					<View style={[styles.extendRight, (this.state.selectedSubItem!==0)&&styles.bottomBorder]}>
					</View>
				</View>

				{this.state.selectedSubItem !== 0 ? this.renderSubDetail(rowData): null}

				<View style={styles.darkSeparator} />
				{showNetIncome ? 
				<Text style={styles.netIncomeText}>净收益:9.26</Text>
				: null}

				<TouchableHighlight 
					underlayColor={	'#164593'}
					onPress={this.okPress} style={[styles.okView, !buttonEnable && styles.okViewDisabled]}>
					<Text style={[styles.okButton, !buttonEnable && styles.okButtonDisabled]}>获利:$10</Text>
				</TouchableHighlight>
			</View>
		);
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		var profitPercentage = 0
		if (rowData.invest !== 0) {
			profitPercentage = (rowData.profit / rowData.invest).toFixed(2)
		}
		var bgcolor = this.state.selectedRow === rowID ? '#dfdfdf' : 'white'
		return (
			<View>
				<TouchableHighlight activeOpacity={1} onPress={() => this.stockPressed(rowData, sectionID, rowID, highlightRow)}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowData.key}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText}>
								{rowData.security.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{this.renderCountyFlag(rowData)}
								<Text style={styles.stockSymbolText}>
									{rowData.security.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(profitPercentage * 100)}
						</View>
					</View>
				</TouchableHighlight>

				{this.state.selectedRow === rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	},

	render: function() {
		return (
			<View style={{width : width, flex : 1}}> 
				<ListView 
					style={styles.list}
					ref="listview"
					initialListSize={11}
					dataSource={this.state.stockInfo}
					renderFooter={this.renderFooter}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					onEndReached={this.onEndReached}/>
			</View>
		)
	},
});

var styles = StyleSheet.create({
	list: {
		alignSelf: 'stretch',
	},

	line: {
		height: 1,
		backgroundColor: 'white',
	},

	separator: {
		marginLeft: 15,
		height: 1,
		backgroundColor: '#ececec',
	},

	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 10,
		paddingTop: 10,
		backgroundColor: '#ffffff',
	},

	stockCountryFlagContainer: {
		backgroundColor: '#00b2fe',
		borderRadius: 2,
		paddingLeft: 3,
		paddingRight: 3,
		marginRight: 6,
	},

	stockCountryFlagText: {
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},

	rowLeftPart: {
		flex: 1,
		alignItems: 'flex-start',
		paddingLeft: 0,
	},

	rowRightPart: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
		borderRadius: 2,
	},

	stockNameText: {
		fontSize: 18,
		textAlign: 'center',
		fontWeight: 'bold',
	},

	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
	},

	stockPercentText: {
		fontSize: 18,
		color: '#ffffff',
		fontWeight: 'bold',
	},

	darkSeparator: {
		marginLeft: 15,
		height: 1,
		backgroundColor: '#c9c9c9',
	},

	extendWrapper: {
		alignItems: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: '#dfdfdf',
	},

	extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		height: 51,
	},

	extendLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendMiddle: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	extendTextTop: {
		fontSize:14,
		color: '#7d7d7d',
	},
	extendTextBottom: {
		fontSize:13,
		color: 'black',
		marginTop: 5,
	},
	extendImageBottom: {
		width: 24,
		height: 24,
	},

	okView: {
		width: 312,
		height: 39,
		backgroundColor: '#1962dd',
		paddingVertical: 10,
    	borderRadius:5,
		marginTop: 15,
		marginBottom: 15,
		justifyContent: 'space-around',
		alignSelf: 'center',
	},
	okViewDisabled: {
		backgroundColor: '#f5f5f5',
    	borderWidth:1,
    	borderColor: '#1962dd',
	},
	okButton: {
		color: 'white',
		textAlign: 'center',
		fontSize: 17,
	},
	okButtonDisabled: {
		color: '#1962dd',
	},

	netIncomeText: {
		fontSize: 14,
		color: '#e60b11',
		alignSelf: 'center',
		marginTop: 10,
	},

	rightTopBorder: {
		borderRightWidth: 1,
		borderRightColor: '#1962dd',
		borderTopWidth: 1,
		borderTopColor: '#1962dd',
	},

	bottomBorder: {
		borderBottomWidth: 1,
		borderBottomColor: '#1962dd',
	},

	leftTopRightBorder: {
		borderLeftWidth: 1,
		borderLeftColor: '#1962dd',
		borderRightWidth: 1,
		borderRightColor: '#1962dd',
		borderTopWidth: 1,
		borderTopColor: '#1962dd',
	},
	priceText: {
		marginTop: 5,
		marginBottom: 5,
		fontSize: 8,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: 'transparent',
	},
	
	chartTitleTextHighlighted: {
		flex: 1,
		fontSize: 15,
		textAlign: 'center',
		color: '#70a5ff'
	},
	chartTitleText: {
		flex: 1,
		fontSize: 15,
		textAlign: 'center',
		color: '#7d7d7d'
	},
});


module.exports = StockOpenPositionPage;

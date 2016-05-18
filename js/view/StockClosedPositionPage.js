'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	ListView,
	TouchableHighlight,
	Dimensions,
	Image,
	Platform,
	Alert,
} = React;
var LayoutAnimation = require('LayoutAnimation')

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var extendHeight = 204

var StockClosedPositionPage = React.createClass({

	getInitialState: function() {
		return {
			stockInfoRowData: [],
			stockInfo: ds.cloneWithRows([]),
			selectedRow: -1,
		};
	},

	componentDidMount: function() {
		this.loadClosedPositionInfo()
	},

	tabPressed: function(index) {
		this.loadClosedPositionInfo()

		WebSocketModule.registerCallbacks(
			() => {
		})
	},

	loadClosedPositionInfo: function() {
		var userData = LogicData.getUserData()
		var url = NetConstants.GET_CLOSED_POSITION_API
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

	onEndReached: function() {

	},

	stockPressed: function(rowData, sectionID, rowID, highlightRow) {

		var newData = []
		$.extend(true, newData, this.state.stockInfoRowData)	// deep copy

		if (this.state.selectedRow == rowID) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			newData[rowID].hasSelected = false
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				stockInfoRowData: newData,
				selectedRow: -1,
			})
		} else {
			var maxY = (height-114)*20/21 - extendHeight
			var listHeight = this.refs['listview'].getMetrics().contentLength
			if (this.state.selectedRow !== -1) {
				listHeight -= extendHeight
			}
			var currentY = listHeight/this.state.stockInfoRowData.length*(parseInt(rowID)+1)
			if (currentY > maxY && parseInt(this.state.selectedRow) < parseInt(rowID)) {
				this.refs['listview'].scrollTo({x:0, y:Math.floor(currentY-maxY), animated:true})
			}

			LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			newData[rowID].hasSelected = true
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				stockInfoRowData: newData,
				selectedRow: rowID,
			})
		}
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
						{rowData.tag}
					</Text>
				</View>
			);
		}
	},

	renderProfit: function(percentChange) {
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<Text style={[styles.stockPercentText, {color: '#f19296'}]}>
					 +{percentChange} %
				</Text>
			);
		} else if (percentChange < 0) {
			return (
				<Text style={[styles.stockPercentText, {color: '#82d2bb'}]}>
					 {percentChange} %
				</Text>
			);

		} else {
			return (
				<Text style={[styles.stockPercentText, {color: '#c5c5c5'}]}>
					 {percentChange} %
				</Text>
			);
		}
	},

	renderDetailInfo: function(rowData) {
		var tradeImage = rowData.isLong ? require('../../images/dark_up.png') : require('../../images/dark_down.png')
		var profitColor = rowData.pl > 0 ? ColorConstants.STOCK_RISE_RED : ColorConstants.STOCK_DOWN_GREEN
		var openDate = new Date(rowData.openAt)
		var closeDate = new Date(rowData.closeAt)
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
						<Text style={styles.extendTextBottom}>{rowData.invest && rowData.invest.toFixed(2)}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>杠杆</Text>
						<Text style={styles.extendTextBottom}>x{rowData.leverage}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.openPrice}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>开仓费</Text>
						<Text style={styles.extendTextBottom}>0</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{openDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{openDate.Format('hh:mm')}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>平仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.closePrice}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>平仓费</Text>
						<Text style={styles.extendTextBottom}>0</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{closeDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{closeDate.Format('hh:mm')}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>留仓费</Text>
						<Text style={styles.extendTextBottom}>0</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>净收益</Text>
						<Text style={[styles.extendTextBottom, {color:profitColor}]}>{rowData.pl.toFixed(2)}</Text>
					</View>
					<View style={styles.extendRight}>
					</View>
				</View>

			</View>
		);
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		var bgcolor = this.state.selectedRow === rowID ? '#e6e5eb' : 'white'
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
							{this.renderProfit(rowData.pl / rowData.invest * 100)}
						</View>
					</View>
				</TouchableHighlight>

				{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	},

	renderLoadingText: function() {
		if(this.state.stockInfoRowData.length === 0) {
			return (
				<View style={styles.loadingTextView}>
					<Text style={styles.loadingText}>暂无平仓记录</Text>
				</View>
				)
		}
	},

	render: function() {
		var viewStyle = Platform.OS === 'android' ?
			{width: width, height: height - UIConstants.TAB_BAR_HEIGHT - UIConstants.HEADER_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER,} :
			{width: width, flex: 1}
		return (
			<View style={viewStyle}>
				{this.renderLoadingText()}
				<ListView
					style={styles.list}
					ref="listview"
					initialListSize={11}
					dataSource={this.state.stockInfo}
					enableEmptySections={true}
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
		backgroundColor: '#dfdfdf',
	},

	extendWrapper: {
		alignItems: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: ColorConstants.LIST_BACKGROUND_GREY,
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
	loadingTextView: {
		alignItems: 'center',
		paddingTop: 180,
		backgroundColor: 'transparent'
	},
	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},
});


module.exports = StockClosedPositionPage;

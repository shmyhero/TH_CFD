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
} = React;
var LayoutAnimation = require('LayoutAnimation')


var ColorConstants = require('../ColorConstants')

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var tempData = [
	{id:13001, symbol:'AAPL UW', name:'新东方', tag: 'US', profitPercentage: 0.1},
	{id:13001, symbol:'AAPL UW2', name:'新东方2', tag: 'US', profitPercentage: 0.05},
	{id:13001, symbol:'AAPL UW3', name:'新东方3', profitPercentage: -0.08},
	{id:13001, symbol:'AAPL UW4', name:'新东方4', profitPercentage: 0},
	{id:13001, symbol:'AAPL UW5', name:'新东方5', tag: 'US', profitPercentage: 0.1},
	{id:13001, symbol:'AAPL UW6', name:'新东方6', tag: 'US', profitPercentage: 0.05},
	{id:13001, symbol:'AAPL UW7', name:'新东方7', profitPercentage: -0.08},
	{id:13001, symbol:'AAPL UW8', name:'新东方8', profitPercentage: 0},
	{id:13001, symbol:'AAPL UW9', name:'新东方9', tag: 'US', profitPercentage: 0.1},
	{id:13001, symbol:'AAPL UW10', name:'新东方10', tag: 'US', profitPercentage: 0.05},
	{id:13001, symbol:'AAPL UW11', name:'新东方11', profitPercentage: -0.08},
	{id:13001, symbol:'AAPL UW12', name:'新东方12', profitPercentage: 0},
]
var extendHeight = 204

var StockClosedPositionPage = React.createClass({

	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows(tempData),
			selectedRow: -1,
		};
	},

	tabPressed: function(index) {

	},

	onEndReached: function() {

	},

	stockPressed: function(rowData, sectionID, rowID, highlightRow) {

		if (this.state.selectedRow == rowID) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			this.setState({
				stockInfo: ds.cloneWithRows(tempData),
				selectedRow: -1,
			})
		} else {
			var maxY = (height-100)*20/21 - extendHeight
			var listHeight = this.refs['listview'].getMetrics().contentLength
			if (this.state.selectedRow !== -1) {
				listHeight -= extendHeight
			}
			var currentY = listHeight/tempData.length*(parseInt(rowID)+1)
			if (currentY > maxY && parseInt(this.state.selectedRow) < parseInt(rowID)) {
				this.refs['listview'].scrollTo({x:0, y:Math.floor(currentY-maxY), animated:true})
			}

			LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			this.setState({
				stockInfo: ds.cloneWithRows(tempData),
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
		var tradeImage = true ? require('../../images/dark_up.png') : require('../../images/dark_down.png')
		var profitColor = ColorConstants.STOCK_RISE_RED
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
						<Text style={styles.extendTextBottom}>100</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>杠杆</Text>
						<Text style={styles.extendTextBottom}>x10</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓价格</Text>
						<Text style={styles.extendTextBottom}>10.24</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>开仓费</Text>
						<Text style={styles.extendTextBottom}>0.24</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>16/03/24</Text>
						<Text style={styles.extendTextBottom}>13:30</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>平仓价格</Text>
						<Text style={styles.extendTextBottom}>10.24</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>平仓费</Text>
						<Text style={styles.extendTextBottom}>1.24</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>16/03/24</Text>
						<Text style={styles.extendTextBottom}>14:30</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>留仓费</Text>
						<Text style={styles.extendTextBottom}>0.24</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>净收益</Text>
						<Text style={[styles.extendTextBottom, {color:profitColor}]}>14.28</Text>
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
								{rowData.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{this.renderCountyFlag(rowData)}
								<Text style={styles.stockSymbolText}>
									{rowData.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(rowData.profitPercentage * 100)}
						</View>
					</View>
				</TouchableHighlight>

				{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	},

	renderLoadingText: function() {
		if(tempData.length === 0) {
			return (
				<View style={styles.loadingTextView}>
					<Text style={styles.loadingText}>暂无平仓记录</Text>
				</View>
				)
		}
	},

	render: function() {
		var viewStyle = Platform.OS === 'android' ?
			{width: width, height: height - 164} :
			{width: width, flex: 1}
		return (
			<View style={viewStyle}>
				{this.renderLoadingText()}
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

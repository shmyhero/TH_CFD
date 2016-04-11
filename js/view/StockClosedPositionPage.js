'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	ListView,
	TouchableHighlight,
	Dimensions,
} = React;


var ColorConstants = require('../ColorConstants')

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var tempData = [
	{id:13001, symbol:'AAPL UW', name:'新东方', tag: 'US', profitPercentage: 0.1},
	{id:13001, symbol:'AAPL UW2', name:'新东方2', tag: 'US', profitPercentage: 0.05},
	{id:13001, symbol:'AAPL UW3', name:'新东方3', profitPercentage: -0.08},
	{id:13001, symbol:'AAPL UW4', name:'新东方4', profitPercentage: 0},
]

var StockClosedPositionPage = React.createClass({
	
	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows(tempData),
		};
	},

	onEndReached: function() {

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

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		return (
			<TouchableHighlight onPress={() => this.stockPressed(rowData)}>
				<View style={styles.rowWrapper} key={rowData.key}>
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
});


module.exports = StockClosedPositionPage;
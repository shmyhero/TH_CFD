'use strict'

var React = require('react-native');

var {
	StyleSheet,
	View,
	Image,
	Text,
	ListView,
	Dimensions,
	TouchableHighlight,
} = React;

var WebSocketModule = require('../module/WebSocketModule')

var startData = [
	{Symbol: 'GOOG', Code: '00001', Price: 3100.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.05, key: 0},
	{Symbol: 'MSFT', Code: '00001', Price: 312.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.119, key: 1},
	{Symbol: 'APPL', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: -0.19, key: 2},
	{Symbol: 'GOOG', Code: '00001', Price: 310.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 3},
	{Symbol: 'GOOG', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: -0.0519, key: 4},
	{Symbol: 'MSFT', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.19, key: 5},
	{Symbol: 'APPL', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0, key: 6},
	{Symbol: 'GOOG', Code: '00001', Price: 321.97, DayOpen: 30.31, Change: 1.66, PercentChange: -0.0519, key: 7},
	{Symbol: 'GOOG', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0, key: 8},
	{Symbol: 'MSFT', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 9},
	{Symbol: 'APPL', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: -0.0519, key: 10},
	{Symbol: 'GOOG', Code: '00001', Price: 231.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 11},
	{Symbol: 'GOOG', Code: '00001', Price: 7731.97, DayOpen: 30.31, Change: 1.66, PercentChange: -0.0519, key: 12},
	{Symbol: 'GOOG', Code: '00001', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 13},
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var StockListPage = React.createClass({

	componentDidMount: function() {
		// WebSocketModule.start((stockInfo) => {
		// 	for (var i = 0; i < startData.length; i++) {
		// 		if (startData[i].Symbol == stockInfo.Symbol) {
		// 			startData[i].Price = stockInfo.Price
		// 			startData[i].DayOpen = stockInfo.DayOpen
		// 			startData[i].Change = stockInfo.Change
		// 			startData[i].PercentChange = stockInfo.PercentChange
		// 		}
		// 	};

		// 	this.setState({
		// 		stockInfo: ds.cloneWithRows(startData),
		// 	});
		// })
		
		
	},

	componentWillUnmount: function() {
		// WebSocketModule.stop()
	},

	getInitialState: function() {
		startData.forEach(function(element, index, array) {
			element.key = index;
		});
		return {
			stockInfo: ds.cloneWithRows(startData),
		};
	},

	onEndReached: function() {

	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}/>
		);
	},

	renderFooter: function() {

	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		return (
			<View style={styles.rowWrapper} key={rowData.key}>

				<View style={styles.rowLeftPart}>
					<Text style={styles.symbolNameText}>
						{rowData.Symbol}
					</Text>

					<Text style={styles.symbolCopeText}>
						{rowData.Code}
					</Text>
				</View>

				<View style={styles.rowCenterPart}>
					<Text style={styles.symbolPriceText}>
						{rowData.Price}
					</Text>
				</View>

				{this.renderRowRight(rowData.PercentChange)}
			</View>
		);
	},

	renderRowRight: function(percentChange) {
		if (percentChange > 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#ea5458'}]}>
					<Text style={styles.symbolPercentageText} fontStyle='bold'>
						 + {percentChange} %
					</Text>
				</View>
			);
		} else if (percentChange == 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#a0a6aa'}]}>
					<Text style={styles.symbolPercentageText} fontStyle='bold'>
						 {percentChange} %
					</Text>
				</View>
			);
		} else {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#40c19a'}]}>
					<Text style={styles.symbolPercentageText} fontStyle='bold'>
						 {percentChange} %
					</Text>
				</View>
			);
		}
		
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<ListView 
				style={[styles.list, {width: width}]}
				ref="listview"
				dataSource={this.state.stockInfo}
				renderFooter={this.renderFooter}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator}
				onEndReached={this.onEndReached}/>
			
		)
	},
});

var styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
	},
	list: {
		alignSelf: 'stretch',
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
	rowLeftPart: {
		flex: 3,
		alignItems: 'flex-start',
		paddingLeft: 5,
	},
	rowCenterPart: {
		flex: 2,
		alignItems: 'flex-end',
		paddingRight: 10,
	},
	rowRightPart: {
		flex: 2,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
		borderRadius: 5,
	},
	logo: {
		width: 60,
		height: 60,
		backgroundColor: '#eaeaea',
		marginRight: 10,
	},
	symbolNameText: {
		fontSize: 18,
		textAlign: 'center',
	},
	symbolCopeText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
	},
	symbolPriceText: {
		fontSize: 18,
	},
	symbolPercentageText: {
		fontSize: 16,
		color: '#ffffff',
	},
	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},
});

module.exports = StockListPage
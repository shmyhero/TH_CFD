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
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 0},
	{Symbol: 'MSFT', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 1},
	{Symbol: 'APPL', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 2},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 3},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 4},
	{Symbol: 'MSFT', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 5},
	{Symbol: 'APPL', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 6},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 7},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 8},
	{Symbol: 'MSFT', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 9},
	{Symbol: 'APPL', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 10},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 11},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 12},
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519, key: 13},
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

	renderSeparator: function() {
		return (
			<View style={styles.line}/>
		);
	},

	renderFooter: function() {

	},

	renderRow: function(rowData: string, sectionID: number, rowID: number) {
		return (
			<View style={styles.rowWrapper} key={rowData.key}>
				<Text style={styles.notificationText}>
					{rowData.Symbol}
				</Text>
				<Text style={styles.notificationText}>
					{rowData.Price}
				</Text>
				<Text style={styles.notificationText}>
					{rowData.DayOpen}
				</Text>
				<Text style={styles.notificationText}>
					{rowData.Change}
				</Text>
				<Text style={styles.notificationText}>
					{rowData.PercentChange}
				</Text>
			</View>
		);
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
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20,
		paddingTop: 20,
		justifyContent: 'flex-start',
		backgroundColor: '#ffffff',
	},
	logo: {
		width: 60,
		height: 60,
		backgroundColor: '#eaeaea',
		marginRight: 10,
	},
	notificationText: {
		flex: 1,
		fontSize: 16,
		textAlign: 'center',
	},
	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},

});

module.exports = StockListPage
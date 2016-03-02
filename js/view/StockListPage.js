'use strict'

var React = require('react-native');
var Swiper = require('react-native-swiper')

var {
	StyleSheet,
	View,
	Image,
	Text,
	ListView,
} = React;

var WebSocketModule = require('../module/WebSocketModule')

var startData = [
	{Symbol: 'GOOG', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519},
	{Symbol: 'MSFT', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519},
	{Symbol: 'APPL', Price: 31.97, DayOpen: 30.31, Change: 1.66, PercentChange: 0.0519},
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var StockListPage = React.createClass({

	componentDidMount: function() {
		WebSocketModule.start(function(stockInfo) {
			
			for (var i = 0; i < startData.length; i++) {
				if (startData[i].Symbol == stockInfo.Symbol) {
					startData[i].Price = stockInfo.Price
					startData[i].DayOpen = stockInfo.DayOpen
					startData[i].Change = stockInfo.Change
					startData[i].PercentChange = stockInfo.PercentChange
				}
			};

			this.setState({
				stockInfo: ds.cloneWithRows(startData),
			})

		}.bind(this))
	},

	componentWillUnmount: function() {
		WebSocketModule.stop()
	},

	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows(startData),
		};
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
			<View style={styles.rowWrapper} >
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
		return (
			<ListView 
				style={styles.list}
				ref="listview"
				renderSeparator={this.renderSeparator}
				dataSource={this.state.stockInfo}
				renderFooter={this.renderFooter}
				renderRow={this.renderRow}
				onEndReached={this.onEndReached}
				automaticallyAdjustContentInsets={false}
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps={true}
				showsVerticalScrollIndicator={false} />
		)
	},
});

var styles = StyleSheet.create({
	list: {
		paddingTop: 20,
	},
	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 10,
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
		fontSize: 12,
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
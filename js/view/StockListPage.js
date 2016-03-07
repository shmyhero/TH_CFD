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


var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var StockListPage = React.createClass({

	propTypes: {
		dataURL: React.PropTypes.string,
	},

	componentDidMount: function() {
		var userData = LogicData.getUserData()

		NetworkModule.fetchTHUrl(
			this.props.dataURL, 
			{
				method: 'GET',
				// headers: {
				// 	'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				// },
			},
			(responseJson) => {
				this.setState({
					stockInfo: ds.cloneWithRows(responseJson)
				})
			},
			(errorMessage) => {
				Alert.alert('提示', errorMessage);
			}
		)
	},

	componentWillUnmount: function() {
		// WebSocketModule.stop()
	},

	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows([]),
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
					<Text style={styles.stockNameText}>
						{rowData.name}
					</Text>

					<Text style={styles.stockSymbolText}>
						{rowData.symbol}
					</Text>
				</View>

				<View style={styles.rowCenterPart}>
					<Text style={styles.stockLastText}>
						{rowData.last.toFixed(2)}
					</Text>
				</View>

				{this.renderRowRight((rowData.last - rowData.open) / rowData.open)}
			</View>
		);
	},

	renderRowRight: function(percentChange) {
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#ea5458'}]}>
					<Text style={styles.stockPercentText} fontStyle='bold'>
						 + {percentChange} %
					</Text>
				</View>
			);
		} else if (percentChange == 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#a0a6aa'}]}>
					<Text style={styles.stockPercentText} fontStyle='bold'>
						 {percentChange} %
					</Text>
				</View>
			);
		} else {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#40c19a'}]}>
					<Text style={styles.stockPercentText} fontStyle='bold'>
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
				initialListSize={11}
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
	stockNameText: {
		fontSize: 18,
		textAlign: 'center',
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
	},
	stockLastText: {
		fontSize: 18,
	},
	stockPercentText: {
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
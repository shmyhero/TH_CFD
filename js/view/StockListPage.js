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
	Alert,
	TouchableOpacity,
} = React;


var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var StockListPage = React.createClass({

	propTypes: {
		dataURL: React.PropTypes.string,
		showHeaderBar: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			dataURL: NetConstants.GET_USER_BOOKMARK_LIST_API,
			showHeaderBar: false,
		}
	},

	handleStockInfo: function(realtimeStockInfo) {
		var hasUpdate = false
		for (var i = 0; i < this.state.rowStockInfoData.length; i++) {
			for (var j = 0; j < realtimeStockInfo.length; j++) {
				if (this.state.rowStockInfoData[i].id == realtimeStockInfo[j].id && 
							this.state.rowStockInfoData[i].last !== realtimeStockInfo[j].last) {
					this.state.rowStockInfoData[i].last = realtimeStockInfo[j].last;
					hasUpdate = true;

					break;
				}
			};
		};

		if (hasUpdate) {
			this.setState({
				stockInfo: ds.cloneWithRows(this.state.rowStockInfoData)
			})
		}
	},

	componentDidMount: function() {
		StorageModule.loadUserData()
			.then((value) => {
				if (value !== null) {
					LogicData.setUserData(JSON.parse(value))
				}
			})
			.then(() => {
				var userData = LogicData.getUserData()

				NetworkModule.fetchTHUrl(
					this.props.dataURL + '?page=1&perPage=30', 
					{
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						},
					},
					(responseJson) => {
						this.setState({
							rowStockInfoData: responseJson,
							stockInfo: ds.cloneWithRows(this.sortRawData(this.state.sortType, responseJson))
						})
					},
					(errorMessage) => {
						Alert.alert('提示', errorMessage);
					}
				)
			})
			.done()
	},

	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows([]),
			sortType: this.props.showHeaderBar ? 0: -1,
			rowStockInfoData: [],
		};
	},

	onEndReached: function() {

	},

	sortRawData: function(newType, data) {
		if (data===undefined) {
			data = this.state.rowStockInfoData
		}
		var result = data;
		if (newType == 1){
			result.sort((a,b)=>{
				if (a.open === 0) {
					return 1
				}
				else if (b.open === 0) {
					return -1
				}
				var pa = (a.last - a.open) / a.open
				var pb = (b.last - b.open) / b.open
				return pa-pb
			});
		}
		else if (newType == 0) {
			result.sort((a,b)=>{
				if (a.open === 0) {
					return 1
				}
				else if (b.open === 0) {
					return -1
				}
				var pa = (a.last - a.open) / a.open
				var pb = (b.last - b.open) / b.open
				return pb-pa
			});
		}
		return result
	},

	handlePress: function() {
		var newType = this.state.sortType === 0?1:0
		var newRowData = this.sortRawData(newType)
		console.log(newType)
    	this.setState({
    		sortType: newType,
    		stockInfo: ds.cloneWithRows(newRowData),
    	});
  	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}/>
		);
	},

	renderSortText: function() {
		if (this.state.sortType ===0) {
			return (
					<View style={styles.headerCell}>
						<Text style={[styles.headerText,{color:'#576b95'}]}>涨幅</Text>
						<Text style={[styles.headerText,{color:'#red'}]}>↓</Text>
					</View>);
		} else {
			return (
					<View style={styles.headerCell}>
						<Text style={[styles.headerText,{color:'#576b95'}]}>跌幅</Text>
						<Text style={[styles.headerText,{color:'#green'}]}>↑</Text>
					</View>);
		}
	},
	
	renderHeaderBar: function() {
		if (this.props.showHeaderBar) { 
			return (
				<View style={styles.headerBar}>
					<View style={styles.headerCell}>
						<Text style={styles.headerText}>涨跌榜</Text>
					</View>
					<View style={{flex:3}}>
					</View>
					<TouchableOpacity onPress={this.handlePress} style={{flex:1}}>
						{ this.renderSortText()}
					</TouchableOpacity>
	            </View>
	            );
		}
	},

	renderFooter: function() {

	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		var percentChange = 0
		if (rowData.open == 0) {
			rowData.open = rowData.last
		}
		if (rowData.open !== 0) {
			percentChange = (rowData.last - rowData.open) / rowData.open * 100
		}

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
						{rowData.last.toFixed(4)}
					</Text>
				</View>

				{this.renderRowRight(percentChange)}
			</View>
		);
	},

	renderRowRight: function(percentChange) {
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#ea5458'}]}>
					<Text style={styles.stockPercentText}>
						 + {percentChange} %
					</Text>
				</View>
			);
		} else if (percentChange < 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#40c19a'}]}>
					<Text style={styles.stockPercentText}>
						 {percentChange} %
					</Text>
				</View>
			);
			
		} else {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: '#a0a6aa'}]}>
					<Text style={styles.stockPercentText}>
						 {percentChange} %
					</Text>
				</View>
			);
		}
		
	},

	render: function() {
		var {height, width} = Dimensions.get('window');

		return (
			<View style={{width : width, flex : 1}}> 
				{this.renderHeaderBar()}
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
	container: {
		alignItems: 'stretch',
	},
	list: {
		alignSelf: 'stretch',
	},
	headerBar: {
		flexDirection: 'row',
		backgroundColor: '#d9e6f3',
		height: 31,
	},
	headerCell: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// borderWidth: 1,
	},
	headerText: {
		fontSize: 14,
		textAlign: 'center'
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
		fontWeight: 'bold',
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
		fontWeight: 'bold',
	},
	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.25,
		borderColor: '#d0d0d0'
	},
});

module.exports = StockListPage
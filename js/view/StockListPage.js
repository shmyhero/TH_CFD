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
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var AppNavigator = require('../../AppNavigator')
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var didFocusSubscription = null;
var recevieDataSubscription = null;

var StockListPage = React.createClass({

	propTypes: {
		dataURL: React.PropTypes.string,
		showHeaderBar: React.PropTypes.bool,
		isOwnStockPage: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			dataURL: NetConstants.GET_USER_BOOKMARK_LIST_API,
			showHeaderBar: false,
			isOwnStockPage: false,
		}
	},

	getShownStocks: function() {
		var result = ''
		for (var i = 0; i < this.state.rowStockInfoData.length; i++) {
			result += ( this.state.rowStockInfoData[i].id + ',')
		};

		result = result.substring(0, result.length - 1);
		return result
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
				if (!this.props.isOwnStockPage) {
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
							Alert.alert('网络错误提示', errorMessage);
						}
					)
				}
			})
			.done()

		if (this.props.isOwnStockPage) {
			StorageModule.loadOwnStocksData().then((value) => {
				if (value !== null) {
					LogicData.setOwnStocksData(JSON.parse(value))
				}
			}).then(() => {
				this.updateOwnData();
			})
		    this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);

		    this.recevieDataSubscription = RCTNativeAppEventEmitter.addListener(
				'nativeSendDataToRN',
				(args) => {
					if (args[0] == 'myList') {
						var stockData = JSON.parse(args[1])
						LogicData.setOwnStocksData(stockData)
						NetworkModule.updateOwnStocks(stockData)
						this.updateOwnData()
					}
					console.log('Get data from Native ' + args[0] + ' : ' + args[1])
				}
			)
		}
	},

	componentWillUnmount: function() {
		if (this.props.isOwnStockPage) {
			this.didFocusSubscription.remove();
			this.recevieDataSubscription.remove();
		}
	},

	onDidFocus: function(event) {
		var currentRoute = this.props.navigator.navigationContext.currentRoute;
		//didfocus emit in componentDidMount
        if (currentRoute === event.data.route) {
            this.updateOwnData()
        }
	},

	updateOwnData: function() {
		var ownData = LogicData.getOwnStocksData()
		this.setState({
			rowStockInfoData: ownData,
			stockInfo: ds.cloneWithRows(ownData)
		})
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
		// newTyep: 0:降序，1:升序
		var result = data;
		if (newType == 1){
			result.sort((a,b)=>{
				if (a.preClose === 0) {
					return 1
				}
				else if (b.preClose === 0) {
					return -1
				}
				var pa = (a.last - a.preClose) / a.preClose
				var pb = (b.last - b.preClose) / b.preClose
				return pa-pb
			});
		}
		else if (newType == 0) {
			result.sort((a,b)=>{
				if (a.preClose === 0) {
					return 1
				}
				else if (b.preClose === 0) {
					return -1
				}
				var pa = (a.last - a.preClose) / a.preClose
				var pb = (b.last - b.preClose) / b.preClose
				return pb-pa
			});
		}
		return result
	},

	handlePress: function() {
		var newType = this.state.sortType === 0?1:0
		var newRowData = this.sortRawData(newType)
    	this.setState({
    		sortType: newType,
    		stockInfo: ds.cloneWithRows(newRowData),
    	});
  	},

  	stockPressed: function(rowData) {
  		this.props.navigator.push({
			name: AppNavigator.STOCK_DETAIL_ROUTE,
			stockRowData: rowData
		});
  	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	},

	renderSortText: function() {
		if (this.state.sortType ===0) {
			return (
					<View style={styles.headerCell}>
						<Text style={styles.headerText}>涨幅</Text>
						<Image style={styles.sortImage} source={require('../../images/upsort.png')}/>
					</View>);
		} else {
			return (
					<View style={styles.headerCell}>
						<Text style={styles.headerText}>跌幅</Text>
						<Image style={styles.sortImage} source={require('../../images/downsort.png')}/>
					</View>);
		}
	},
	
	renderHeaderBar: function() {
		if (this.props.showHeaderBar) { 
			return (
				<View style={styles.headerBar}>
					<View style={styles.headerCell}>
						<Text style={styles.headerTextLeft}>涨跌榜</Text>
					</View>
					<View style={{flex:3}}>
					</View>
					<TouchableOpacity onPress={this.handlePress} style={{flex:2}}>
						{ this.renderSortText()}
					</TouchableOpacity>
	            </View>
	            );
		}
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

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		var percentChange = 0
		if (rowData.preClose == 0) {
			rowData.preClose = rowData.last
		}
		if (rowData.preClose !== 0) {
			percentChange = (rowData.last - rowData.preClose) / rowData.preClose * 100
		}

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

					<View style={styles.rowCenterPart}>
						<Text style={styles.stockLastText}>
							{rowData.last}
						</Text>
					</View>

					{this.renderRowRight(percentChange)}
				</View>
			</TouchableHighlight>
		);
	},

	renderRowRight: function(percentChange) {
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: ColorConstants.STOCK_RISE_RED}]}>
					<Text style={styles.stockPercentText}>
						 + {percentChange} %
					</Text>
				</View>
			);
		} else if (percentChange < 0) {
			return (
				<View style={[styles.rowRightPart, {backgroundColor: ColorConstants.STOCK_DOWN_GREEN}]}>
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
		textAlign: 'center',
		color:'#576b95',
	},
	headerTextLeft: {
		fontSize: 14,
		textAlign: 'left',
		color:'#576b95',
		paddingLeft: 10,
	},
	sortImage: {
		marginLeft: 3,
		width: 9,
		height: 11,
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
		paddingLeft: 0,
	},
	rowCenterPart: {
		flex: 2,
		alignItems: 'flex-end',
		paddingRight: 19,
	},
	rowRightPart: {
		flex: 2,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
		borderRadius: 2,
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
	line: {
		height: 1,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 15,
		height: 1,
		backgroundColor: '#ececec',
	},
});

module.exports = StockListPage
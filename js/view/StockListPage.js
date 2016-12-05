'use strict'

import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	ListView,
	Dimensions,
	TouchableHighlight,
	Alert,
	Platform,
	TouchableOpacity,
} from 'react-native';

var {EventCenter, EventConst} = require('../EventCenter')
var LogicData = require('../LogicData')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var UIConstants = require('../UIConstants');
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')
var MainPage = require('./MainPage')
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var WebSocketModule = require('../module/WebSocketModule');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var didFocusSubscription = null;
var recevieDataSubscription = null;
var didAccountChangeSubscription = null;
var networkConnectionChangedSubscription = null;

var stockNameFontSize = 18;

var ACTIVE_CONTRY_COLOR = '#5483d8';
var SIMULATE_CONTRY_COLOR = '#00b2fe';
const NETWORK_ERROR_INDICATOR = "networkErrorIndicator";

var StockListPage = React.createClass({

	propTypes: {
		dataURL: React.PropTypes.string,
		activeDataURL: React.PropTypes.string,
		showHeaderBar: React.PropTypes.bool,
		isOwnStockPage: React.PropTypes.bool,
	},

	getDefaultProps() {
		return {
			dataURL: NetConstants.CFD_API.GET_USER_BOOKMARK_LIST_API,
			activeDataURL: NetConstants.CFD_API.GET_ACTIVE_USER_BOOKMARK_LIST_API,
			showHeaderBar: false,
			isOwnStockPage: false,
		}
	},

	getInitialState: function() {
		return {
			stockInfo: ds.cloneWithRows([]),
			sortType: this.props.showHeaderBar ? 0: -1,
			rowStockInfoData: [],
			contentLoaded: false,
			isRefreshing: true,
		};
	},

	getShownStocks: function() {
		var result = ''
		for (var i = 0; i < this.state.rowStockInfoData.length; i++) {
			result += ( this.state.rowStockInfoData[i].id + ',')
		};

		result = result.substring(0, result.length - 1);
		return result
	},

	updateListDataWithLastInfo: function(listData, info) {
		var hasUpdate = false
		for (var i = 0; i < listData.length; i++) {
			for (var j = 0; j < info.length; j++) {
				if (listData[i].id == info[j].id &&
							listData[i].last !== info[j].last) {
					listData[i].last = info[j].last;
					listData[i].lastAsk = info[j].ask;
					listData[i].lastBid = info[j].bid;
					hasUpdate = true;

					break;
				}
			};
		};
		return hasUpdate
	},

	handleStockInfo: function(realtimeStockInfo) {
		var hasUpdate = this.updateListDataWithLastInfo(this.state.rowStockInfoData, realtimeStockInfo)

		if (hasUpdate) {
			if(!this.state.isOwnStockPage) {
				var ownData = LogicData.getOwnStocksData()
				var ownUpdate = this.updateListDataWithLastInfo(ownData, realtimeStockInfo)
				if(ownUpdate) {
					LogicData.setOwnStocksData(ownData)
				}
			}
			this.setState({
				stockInfo: ds.cloneWithRows(this.state.rowStockInfoData)
			})
		}
	},

	refreshData: function(forceRefetch) {
		if (this.props.isOwnStockPage) {
			if(forceRefetch){
				this.fetchOwnData();
			}else{
				this.refreshOwnData();
			}
		}
		else {
			this.reFetchStockData(forceRefetch)
		}
	},

	reFetchStockData: function(forceRefetch) {
		if (this.state.rowStockInfoData.length === 0 || forceRefetch) {
			console.log("reFetchStockData")
			this.fetchStockData()
		}
	},

	fetchStockData: function() {
		if(!this.state.contentLoaded){
			this.setState({
				isRefreshing: true,
			});
		}
		StorageModule.loadUserData()
			.then((value) => {
				if (value !== null) {
					LogicData.setUserData(JSON.parse(value))
				}
			})
			.then(() => {
				if (!this.props.isOwnStockPage) {
					var userData = LogicData.getUserData()

					var url = (LogicData.getAccountState() ? this.props.activeDataURL : this.props.dataURL) + '?page=1&perPage=99';

					console.log("LogicData.getAccountState(): " + LogicData.getAccountState());
					console.log("url: " + url);

					NetworkModule.fetchTHUrl(
						url,
						{
							method: 'GET',
							headers: {
								'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
							},
							cache: 'offline',
							//timeout: 1000,
						},
						(responseJson) => {
							this.setState({
								rowStockInfoData: responseJson,
								stockInfo: ds.cloneWithRows(this.sortRawData(this.state.sortType, responseJson)),
								contentLoaded: true,
								isRefreshing: false,
							})
						},
						(result) => {
							if(!result.loadedOfflineCache){
								this.setState({
									contentLoaded: false,
									isRefreshing: false,
								})
								this.refs[NETWORK_ERROR_INDICATOR] && this.refs[NETWORK_ERROR_INDICATOR].stopRefresh();
							}else{
								console.log("Stock list is using old cached data.");
							}
							//Alert.alert('', result.errorMessage);
						}
					)
				}
			})
			.done()
	},

	refreshOwnData: function() {
		var ownData = LogicData.getOwnStocksData()
		this.setState({
			rowStockInfoData: ownData,
			stockInfo: ds.cloneWithRows(ownData)
		})
	},

	fetchOwnData: function() {

		StorageModule.loadOwnStocksData().then((value) => {
			if (value !== null) {
				LogicData.setOwnStocksData(JSON.parse(value))
			}
		}).then(() => {
			var ownData = LogicData.getOwnStocksData()
			if (ownData.length > 0) {
				var param = "/"+ownData[0].id
				for (var i = 1; i < ownData.length; i++) {
					param += ","+ownData[i].id
				};
				var url = (LogicData.getAccountState() ? this.props.activeDataURL : this.props.dataURL) + param;
				NetworkModule.fetchTHUrl(
					url,
					{
						method: 'GET',
						cache: 'offline',
						//timeout: 1000,
					},
					(responseJson) => {
						LogicData.setOwnStocksData(responseJson)
						this.setState({
							rowStockInfoData: responseJson,
							stockInfo: ds.cloneWithRows(this.sortRawData(this.state.sortType, responseJson)),
							contentLoaded: true,
							isRefreshing: false,
						})
					},
					(result) => {
						if(!result.loadedOfflineCache){
							this.setState({
								contentLoaded: false,
								isRefreshing: false,
							})
							this.refs[NETWORK_ERROR_INDICATOR] && this.refs[NETWORK_ERROR_INDICATOR].stopRefresh();
						}
						//Alert.alert('', result.errorMessage);
					}
				)
			}else{
				this.setState({
					contentLoaded: true,
					isRefreshing: false,
				})
			}
		})
	},

	componentDidMount: function() {
		var {height, width} = Dimensions.get('window');
		stockNameFontSize = Math.round(18*width/375)

		this.fetchStockData()

		if (this.props.isOwnStockPage) {
			this.fetchOwnData()

	    this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);
	    this.recevieDataSubscription = RCTNativeAppEventEmitter.addListener(
			'nativeSendDataToRN',
			(args) => {
				if (args[0] == 'myList') {
					var stockData = JSON.parse(args[1])
					LogicData.setOwnStocksData(stockData)
					NetworkModule.updateOwnStocks(stockData)
					this.refreshOwnData()
				}
				console.log('Get data from Native ' + args[0] + ' : ' + args[1])
			})
		}
		didAccountChangeSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, ()=>{
			console.log("ACCOUNT_STATE_CHANGE");
			this.accountStateChange()});

		networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			this.onConnectionStateChanged();
		});
	},

	accountStateChange: function(){
		if(this.props.isOwnStockPage){
			var userData = LogicData.getUserData()
			if(Object.keys(userData).length !== 0){
				NetworkModule.syncOwnStocks(userData)
				.then(()=>this.refreshData(true));
			}
		} else{
			this.refreshData(true);
		}
	},

	onConnectionStateChanged: function(){
		if(LogicData.getTabIndex() == 1 && WebSocketModule.isConnected()){
			this.refreshData(true);
		}
	},

	componentWillUnmount: function() {
		if (this.props.isOwnStockPage) {
			this.didFocusSubscription.remove();
			this.recevieDataSubscription.remove();
		}else{
			didAccountChangeSubscription && didAccountChangeSubscription.remove();
		}
		networkConnectionChangedSubscription && networkConnectionChangedSubscription.remove();
	},

	onDidFocus: function(event) {
		var currentRoute = this.props.navigator.navigationContext.currentRoute;
		//didfocus emit in componentDidMount
        if (currentRoute === event.data.route) {
            this.refreshOwnData()
        }
	},

	onPageSelected: function() {
		this.refreshData()
	},

	tabPressed: function() {
		this.refreshData()
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

  	handleAddStock: function() {
		this.props.navigator.push({
			name: MainPage.STOCK_SEARCH_ROUTE,
		});
  	},

  	stockPressed: function(rowData) {
  		this.props.navigator.push({
			name: MainPage.STOCK_DETAIL_ROUTE,
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
						<Image style={[styles.sortImage, {transform: [{rotate: '0deg'}]}]} source={require('../../images/sort.png')}/>
					</View>);
		} else {
			return (
					<View style={styles.headerCell}>
						<Text style={styles.headerText}>涨幅</Text>
						<Image style={[styles.sortImage, {transform: [{rotate: '180deg'}]}]} source={require('../../images/sort.png')}/>
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

	renderAddStockView: function() {
		if(this.props.isOwnStockPage){
			if(this.state.rowStockInfoData.length===0){
				return (
					<View style={{flex:10, alignItems:'center', justifyContent: 'space-around'}}>
						<TouchableOpacity onPress={this.handleAddStock}>
							<View>
								<Image style={styles.addImage} source={LogicData.getAccountState()?require('../../images/add_live.png'):require('../../images/add.png')}/>
								<Text style={[styles.addText,{color:ColorConstants.TITLE_BLUE}]}>暂无产品 点击添加</Text>
							</View>
						</TouchableOpacity>
					</View>
					);
			}
		}
	},

	renderFooter: function() {

	},

	renderCountyFlag: function(rowData) {
		if (rowData.tag !== undefined) {
			return (
				<View style={[styles.stockCountryFlagContainer,{backgroundColor:LogicData.getAccountState()?ACTIVE_CONTRY_COLOR:SIMULATE_CONTRY_COLOR}]}>
					<Text style={styles.stockCountryFlagText}>
						{rowData.tag}
					</Text>
				</View>
			);
		}
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		if (rowData === undefined) {
			// strange, rowData should not become undefined.
			return (<View />)
		}
		var percentChange = 0
		if (rowData.preClose == 0) {
			rowData.preClose = rowData.last
		}
		if (rowData.preClose > 0) {
			percentChange = (rowData.last - rowData.preClose) / rowData.preClose * 100
		}

		return (
			<TouchableHighlight onPress={() => this.stockPressed(rowData)}>
				<View style={styles.rowWrapper} key={rowData.key}>

					<View style={styles.rowLeftPart}>
						<Text style={[styles.stockNameText, {fontSize: stockNameFontSize}]}>
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
						<Text style={{fontSize: stockNameFontSize}}>
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
		var color = ColorConstants.stock_color(percentChange)
		var startMark = percentChange > 0 ? "+" : null
		return (
			<View style={[styles.rowRightPart, {backgroundColor: color}]}>
				<Text style={styles.stockPercentText}>
					 {startMark} {percentChange} %
				</Text>
			</View>
		);

	},

	renderContent: function(){
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator onRefresh={()=>this.refreshData(true)} ref={NETWORK_ERROR_INDICATOR} refreshing={this.state.isRefreshing}/>
			)
		}else{
			return(
				<View style={{flex:1}}>
					{this.renderHeaderBar()}
					{this.renderAddStockView()}
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
			);
		}
	},

	render: function() {
		var {height, width} = Dimensions.get('window');
		var scrollTabHeight = 48

		var viewStyle = Platform.OS === 'android' ?
			{width: width, height: height
					- UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
					- UIConstants.HEADER_HEIGHT
					- UIConstants.SCROLL_TAB_HEIGHT
					- UIConstants.TAB_BAR_HEIGHT} :
			{width: width, flex: 1}
		return (
			<View style={viewStyle}>
				{this.renderContent()}
			</View>
		)
	},
});

var styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
	},
	list: {
		flex: 1,
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
		textAlign: 'center',
		fontWeight: 'bold',
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
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
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	addImage: {
		width: 104,
		height: 104,
	},
	addText: {
		fontSize: 12,
		color: '#185ed3',
		marginTop: 14,
	},
});

module.exports = StockListPage

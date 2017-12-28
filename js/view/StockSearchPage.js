'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Platform,
	TextInput,
	Dimensions,
	ListView,
	Alert,
	TouchableOpacity,
} from 'react-native';
var LayoutAnimation = require('LayoutAnimation')
var LS = require('../LS')
var LogicData = require('../LogicData')
var MainPage = require('./MainPage')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')
var TalkingdataModule = require('../module/TalkingdataModule')
var TimerMixin = require('react-timer-mixin');
//var TongDaoModule = require('../module/TongDaoModule')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var searchText = ""
var didFocusSubscription = null;

export let SEARCH_TYPE_BOOKMARK = "bookmark";
export let SEARCH_TYPE_GET_ITEM = "getItem";

var StockSearchPage = React.createClass({
	mixins: [TimerMixin],

	propTypes: {
		searchType: React.PropTypes.string,
		onGetItem: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			searchType: SEARCH_TYPE_BOOKMARK,
			onGetItem: (item)=>{}
		}
	},

	getInitialState: function() {
		return {
			searchStockRawInfo: [],
			searchStockInfo: ds.cloneWithRows([]),
			timerCount: 0,
			searchFailedText: null,
			historyRawInfo: [],
			historyInfo: ds.cloneWithRows([]),
		};
	},

	componentDidMount: function() {
		this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);
		searchText = ""
	},

	componentWillUnmount: function() {
		this.didFocusSubscription.remove();
	},

	onDidFocus: function(event) {
		var currentRoute = this.props.navigator.navigationContext.currentRoute;
		//didfocus emit in componentDidMount
        if (currentRoute === event.data.route) {
            this.updateSearchHistory()
        }
	},

	updateSearchHistory: function() {
		// load history
		if(this.props.searchType == SEARCH_TYPE_BOOKMARK){
			LogicData.getSearchStockHistory()
			.then((history)=>{
				this.setState({
					historyRawInfo: history,
					historyInfo: ds.cloneWithRows(history),
				})
			});
		}else if(this.props.searchType == SEARCH_TYPE_GET_ITEM){
			LogicData.getInputSearchStockHistory()
			.then((history)=>{
				console.log("getInputSearchStockHistory")
				this.setState({
					historyRawInfo: history,
					historyInfo: ds.cloneWithRows(history),
				})
			});
		}

	},

	cleanSearchHistory: function() {
		var history = []
		if(this.props.searchType == SEARCH_TYPE_BOOKMARK){
			LogicData.setSearchStockHistory(history)
		}else if(this.props.searchType == SEARCH_TYPE_GET_ITEM){
			LogicData.setInputSearchStockHistory(history)
		}
		this.setState({
			historyRawInfo: history,
			historyInfo: ds.cloneWithRows(history),
		})
	},

	searchStockDelay: function(text) {
		searchText = text
		this.setState({
			timerCount: this.state.timerCount+1,
		})
		this.setTimeout(
			() => {
				this.setState({
					timerCount: this.state.timerCount - 1,
				})

				if (this.state.timerCount === 0) {
					this.searchStock(text)
				}
			 },
			600
		);
	},

	searchStock: function(text) {
		if (text.length > 0) {
			console.log('Start search: ' + text)
			NetworkModule.fetchTHUrl(
				(LogicData.getAccountState()?NetConstants.CFD_API.GET_SEARCH_STOCK_LIVE_API:NetConstants.CFD_API.GET_SEARCH_STOCK_API)
  			+ '?keyword=' + text,
				{
					method: 'GET',
				},
				(responseJson) => {
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
					if (responseJson.length == 0) {
						this.setState({
							searchFailedText: LS.str('SSWJG'),
						})
						var eventParam = {};
						eventParam[TalkingdataModule.KEY_SEARCH_TEXT] = text;
						TalkingdataModule.trackEvent(TalkingdataModule.SEARCH_WITH_NO_RESULT_EVENT, '', eventParam)

						//TongDaoModule.trackSearchStockEvent(text, false)
					} else {
						this.setState({
							searchStockRawInfo: responseJson,
							searchStockInfo: ds.cloneWithRows(responseJson),
							searchFailedText: null,
						})
						//TongDaoModule.trackSearchStockEvent(text, true)
					}
				},
				(result) => {
					this.setState({
						searchFailedText: result.errorMessage,
					})
				}
			)
		}
		else {
			this.forceUpdate()
		}
	},

	addToMyListPressedFromSearchResult: function(rowID) {
		var stockData = this.state.searchStockRawInfo[rowID]
		NetworkModule.addToOwnStocks([stockData])
		.then(()=>{
			LogicData.addStockToOwn(stockData)
		}).then(
			()=>
			// force re-render list
			this.setState({
				searchStockInfo: ds.cloneWithRows(this.state.searchStockRawInfo)
			})
		)

		var eventParam = {};
		eventParam[TalkingdataModule.KEY_STOCK_ID] = stockData.id,
		TalkingdataModule.trackEvent(TalkingdataModule.SEARCH_AND_ADD_TO_MY_LIST_EVENT, '', eventParam)

		//TongDaoModule.trackAddRemoveOwnStockEvent(stockData.id.toString(), true)
	},

	addToMyListPressedFromHistory: function(rowID) {
		var stockData = this.state.historyRawInfo[rowID]
		NetworkModule.addToOwnStocks([stockData])
		.then(()=>{
			LogicData.addStockToOwn(stockData)
		})
		// force re-render list
		this.setState({
			historyInfo: ds.cloneWithRows(this.state.historyRawInfo)
		})
	},

	cancel: function() {
		this.props.navigator.pop();
	},

	renderNavBar: function() {
		return (
			<View style={[styles.navBarContainer,{backgroundColor:ColorConstants.title_blue()}]} >
				<View style={[styles.navBarInputContainer,{borderColor:LogicData.getAccountState()?'#556f99':'#3877df'},{backgroundColor:LogicData.getAccountState()?'#384d71':'#1553bc'}]}>
					<Image
						style={styles.searchButton}
						source={require('../../images/search.png')}/>

					<TextInput style={styles.searchInput}
							onSubmitEditing={(event) => this.searchStock(event.nativeEvent.text)}
							onChangeText={(text) => this.searchStockDelay(text)}
							autoCorrect={false}
							autoCapitalize='none'
							returnKeyType='search'
							placeholder={LS.str('SSJRCP')}
							placeholderTextColor='#bac6e6'
							underlineColorAndroid='transparent' />
				</View>

				<TouchableOpacity style={styles.navBarCancelTextContainer}
						onPress={this.cancel}>
					<Text style={styles.cancelText}>
						{LS.str('QX')}
					</Text>
				</TouchableOpacity>
			</View>
		);
	},

	stockPressed: function(rowData) {
		if(this.props.searchType == SEARCH_TYPE_BOOKMARK){
			LogicData.addStockToSearchHistory(rowData)
			this.props.navigator.push({
				name: MainPage.STOCK_DETAIL_ROUTE,
				stockRowData: rowData
			});

			var eventParam = {};
			eventParam[TalkingdataModule.KEY_STOCK_ID] = rowData.id,
			TalkingdataModule.trackEvent(TalkingdataModule.SEARCH_AND_LOOK_EVENT, '', eventParam)
		}else{
			LogicData.addInputSearchStockHistory(rowData)
			this.props.onGetItem && this.props.onGetItem(rowData)
			this.props.navigator.pop();
		}
	},

	renderRowHistory: function(rowData, sectionID, rowID, highlightRow) {
		return this.renderRow(rowData, sectionID, rowID, highlightRow, this.addToMyListPressedFromHistory)
	},

	renderRowSearchResult: function(rowData, sectionID, rowID, highlightRow) {
		return this.renderRow(rowData, sectionID, rowID, highlightRow, this.addToMyListPressedFromSearchResult)
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow, onPressFunction) {
		var rightPartContent = <Text style={styles.alreadyAddText}>{LS.str('YTJ')}</Text>
		var myListData = LogicData.getOwnStocksData()
		var index = myListData.findIndex((stock) => {return stock.id === rowData.id})

		console.log("renderRow this.props.searchType " + this.props.searchType)
		var viewStyle = Platform.OS === 'android' ?
			{paddingLeft: 7, paddingRight: 7} :
			{paddingLeft: 6, paddingRight: 6, paddingBottom: 3}
		if(this.props.searchType == SEARCH_TYPE_GET_ITEM){
			rightPartContent = <View/>;
		}else{
			if (index === -1) {
				rightPartContent =
						<TouchableOpacity style={styles.addToMyListContainer}
								onPress={() => onPressFunction(rowID)}>
							<View style={[styles.addToMyListView, viewStyle]}>
								<Text style={styles.addToMyListText}>
									+
								</Text>
							</View>

						</TouchableOpacity>
			}
		}

		var topLine = rowData.name;
		var bottomLine = rowData.symbol;
		if(LogicData.getLanguageEn() == '1'){
			topLine = rowData.symbol;
			bottomLine = rowData.name;
		}
		return (
			<TouchableOpacity onPress={() => this.stockPressed(rowData)}>
				<View style={styles.rowWrapper} key={rowData.key}>

					<View style={styles.rowLeftPart}>
						<Text style={styles.stockNameText}>
							{topLine}
						</Text>

						<Text style={styles.stockSymbolText}>
							{bottomLine}
						</Text>
					</View>

					<View style={styles.rowRightPart}>
						{rightPartContent}
					</View>
				</View>
			</TouchableOpacity>
		);
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	},

	renderHistoryFooter: function() {
		return(
			<View style={styles.historyFooterView}>
				<TouchableOpacity style={styles.cleanHistoryButton} onPress={() => this.cleanSearchHistory()}>
					<Image style={styles.cleanHistoryImage} source={require('../../images/delete.png')}/>
					<Text style={styles.cleanHistoryText}>{LS.str("SEARCH_CLEAR_HISTORY")}</Text>
				</TouchableOpacity>
			</View>
		)
	},

	renderHistoryView: function() {
		if(this.state.historyRawInfo.length > 0) {
			return(
				<View style={{flex: 1}}>
					<View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
						<Text style={styles.historyText}>{LS.str("SEARCH_HISTORY")}</Text>
					</View>
					<ListView
						style={styles.list}
						ref="listview"
						initialListSize={11}
						enableEmptySections={true}
						dataSource={this.state.historyInfo}
						renderRow={this.renderRowHistory}
						renderFooter={this.renderHistoryFooter}
						renderSeparator={this.renderSeparator}/>
				</View>
				)
		}
	},

	renderSearchView: function() {
		return (
			<View style={{flex: 1, alignItems: 'center'}}>
				{this.state.searchFailedText !== null ?
				<Text style={styles.searchFailedText}>
					{this.state.searchFailedText}
				</Text> :
				<ListView
					style={styles.list}
					ref="listview"
					initialListSize={11}
					enableEmptySections={true}
					dataSource={this.state.searchStockInfo}
					renderRow={this.renderRowSearchResult}
					renderSeparator={this.renderSeparator}/>
				}
			</View>
			)
	},

	render: function() {
		var {height, width} = Dimensions.get('window');
		var showHistory = searchText.length === 0
		return (
			<View style={{flex: 1, width: width}}>
				{this.renderNavBar()}
				{showHistory ? this.renderHistoryView() :this.renderSearchView()}
			</View>
		);
	},
});

var styles = StyleSheet.create({
	navBarContainer: {
		height: (Platform.OS === 'ios') ? 65 : 50,
		backgroundColor: ColorConstants.TITLE_BLUE,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : 0,
	},

	navBarInputContainer: {
		flex: 5,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1553bc',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#3877df',
		marginTop: 8,
		marginBottom: 5,
		marginLeft: 10,
		marginRight: 0,
	},

	navBarCancelTextContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	searchButton: {
		width: 15,
		height: 15,
		marginLeft: 5,
		resizeMode: Image.resizeMode.contain,
	},

	searchInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
		marginRight: 10,
		paddingLeft: 10,
		color: '#ffffff',
		paddingTop: 0,
		paddingBottom: 0,
	},

	cancelText: {
		fontSize: 14,
		textAlign: 'center',
		color: '#ffffff',
		marginRight: 5,
	},

	list: {
		flex: 12,
		alignSelf: 'stretch',
	},

	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
	},

	rowLeftPart: {
		flex: 1,
		alignItems: 'flex-start',
		paddingLeft: 5,
	},
	rowRightPart: {
		flex: 1,
		alignItems: 'flex-end',
	},

	stockNameText: {
		fontSize: 18,
		textAlign: 'center',
		fontWeight: 'bold',
		paddingBottom: 2,
		marginTop: 10,
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		paddingBottom: 10,
	},

	addToMyListContainer: {
		paddingLeft: 20,
		paddingRight: 10,
		paddingBottom: 10,
		paddingTop: 10,
		alignItems: 'center',
	},
	addToMyListView: {
		borderWidth: 1,
		borderRadius: 2,
		borderColor: ColorConstants.TITLE_BLUE,
	},
	addToMyListText: {
		fontSize: 18,
		color: ColorConstants.TITLE_BLUE,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	alreadyAddText: {
		fontSize: 14,
		color: "#5274ae",
	},
	line: {
		height: 1,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	searchFailedText: {
		alignSelf: 'center',
		marginTop: 20,
		fontSize: 14,
		color: '#9e9e9e',
	},

	historyText: {
		fontSize: 15,
		color: '#4b70ae',
		marginLeft: 10,
	},
	historyFooterView: {
		height: 120,
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: 'white',
	},
	cleanHistoryButton: {
		width: 171,
		height: 36,
		borderColor: '#8b9ba8',
		borderWidth: 1,
    	borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
	cleanHistoryImage: {
		marginLeft: 30,
		width: 15,
		height: 15,
	},
	cleanHistoryText: {
		fontSize: 14,
		color: '#8b9ba8',
		marginRight: 30,
	}
});

module.exports = StockSearchPage;

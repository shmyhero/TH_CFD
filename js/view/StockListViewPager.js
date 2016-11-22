'use strict'

import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Alert,
	Dimensions,
	NetInfo,
} from 'react-native';

var {EventCenter, EventConst} = require('../EventCenter')

var NativeSceneModule = require('../module/NativeSceneModule')
var NativeDataModule = require('../module/NativeDataModule')
var LogicData = require('../LogicData')
var ScrollTabView = require('./component/ScrollTabView')
var StockListPage = require('./StockListPage')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var NavBar = require('../view/NavBar')
var MainPage = require('./MainPage')


var tabNames = ['自选', '美股', '指数', '外汇', '商品']
var urlKeys = [
	'GET_USER_BOOKMARK_LIST_API',
	'GET_US_STOCK_TOP_GAIN_API',
	'GET_INDEX_LIST_API',
	'GET_FX_LIST_API',
	'GET_FUTURE_LIST_API',
]
var urlKeysLive = [
	'GET_USER_BOOKMARK_LIST_LIVE_API',
	'GET_US_STOCK_TOP_GAIN_LIVE_API',
	'GET_INDEX_LIST_LIVE_API',
	'GET_FX_LIST_LIVE_API',
	'GET_FUTURE_LIST_LIVE_API',
]

var didFocusSubscription = null;
var didTabSelectSubscription = null;
var _currentSelectedTab = 0;

var StockListViewPager = React.createClass({

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
			connected : false,
		}
	},

	componentWillMount: function() {
		WebSocketModule.start()

		this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', (event) => this.onDidFocus(event));
		this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.STOCK_TAB_PRESS_EVENT, () => {
  		this.onTabChanged()
		});

		this.networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			this.onConnectionStateChanged();
		});

		this.onConnectionStateChanged();
	},

	onConnectionStateChanged: function(){
		var isConnected = WebSocketModule.isConnected();
		this.setState({
			connected: isConnected
		})
	},
	
	componentDidMount: function() {
		NetInfo.isConnected.addEventListener(
			'change',
			this._handleConnectivityChange
		);
	},

	componentWillUnmount: function() {
		this.didFocusSubscription.remove();
		this.didTabSelectSubscription.remove();
    	NetInfo.isConnected.removeEventListener(
			'change',
			this._handleConnectivityChange
		);
		this.networkConnectionChangedSubscription && this.networkConnectionChangedSubscription.remove();
	},

	onTabChanged: function() {
		this.setState({currentSelectedTab: _currentSelectedTab});
		this.refs['page' + _currentSelectedTab].tabPressed()
		LogicData.setTabIndex(1);
		WebSocketModule.registerCallbacks((stockInfo) => {
			this.refs['page' + _currentSelectedTab] && this.refs['page' + _currentSelectedTab].handleStockInfo(stockInfo)
		})
	},

	_handleConnectivityChange: function(isConnected) {
		if (isConnected) {
			this.refs['page' + _currentSelectedTab].onPageSelected()
		}
	},

	onDidFocus: function(event) {
        if (MainPage.STOCK_LIST_VIEW_PAGER_ROUTE === event.data.route.name) {
            WebSocketModule.registerCallbacks((stockInfo) => {
				this.refs['page' + _currentSelectedTab] && this.refs['page' + _currentSelectedTab].handleStockInfo(stockInfo)
			})
        }
	},

	editButtonClicked: function() {
		NativeDataModule.passDataToNative('myList', LogicData.getOwnStocksData())
		// NativeSceneModule.launchNativeScene('StockEditFragment')
		this.props.navigator.push({
			name: MainPage.EDIT_OWN_STOCKS_ROUTE,
		});
	},

	onPageSelected: function(index) {
		this.setState({
			currentSelectedTab: index,
		})
		_currentSelectedTab = index,
		this.refs['page' + _currentSelectedTab].onPageSelected()

		WebSocketModule.registerInterestedStocks(this.refs['page' + _currentSelectedTab].getShownStocks())
	},

	renderNavBar: function() {
		var hasOwnStocks = LogicData.getOwnStocksData().length !== 0
		return (
			<NavBar title={this.state.connected ? "行情" : "行情（未连接）"}
				textOnLeft={(_currentSelectedTab==0 && hasOwnStocks) ? '编辑' : null}
				leftTextOnClick={this.editButtonClicked}
				showSearchButton={true}
				navigator={this.props.navigator}/>
		)
	},

	render: function() {
		var {height, width} = Dimensions.get('window');
		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				<StockListPage dataURL={NetConstants.getUrl(urlKeys[i])}
											 activeDataURL={NetConstants.getUrl(urlKeysLive[i])}
											 ref={'page' + i} showHeaderBar={i==1} isOwnStockPage={i==0} navigator={this.props.navigator}/>
			</View>
		)
		return (
			<View style={[styles.wrapper, {width: width}]}>
				{this.renderNavBar()}
				<ScrollTabView
						tabNames={tabNames}
						viewPages={viewPages}
						onPageSelected={(index) => this.onPageSelected(index)} />
			</View>
		)
	}
})

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		alignSelf: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
})

module.exports = StockListViewPager;

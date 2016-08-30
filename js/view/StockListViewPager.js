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
var urls = [
	NetConstants.GET_USER_BOOKMARK_LIST_API,
	NetConstants.GET_US_STOCK_TOP_GAIN_API,
	NetConstants.GET_INDEX_LIST_API,
	NetConstants.GET_FX_LIST_API,
	NetConstants.GET_FUTURE_LIST_API
]

var didFocusSubscription = null;
var didTabSelectSubscription = null;

var StockListViewPager = React.createClass({

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
		}
	},

	componentWillMount: function() {
		WebSocketModule.start()

		this.didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', (event) => this.onDidFocus(event));
		this.didTabSelectSubscription = EventCenter.getEventEmitter().addListener(EventConst.STOCK_TAB_PRESS_EVENT, () => {
			this.refs['page' + this.state.currentSelectedTab].tabPressed()
			WebSocketModule.registerCallbacks((stockInfo) => {
				this.refs['page' + this.state.currentSelectedTab] && this.refs['page' + this.state.currentSelectedTab].handleStockInfo(stockInfo)
			})
		});
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
	},

	_handleConnectivityChange: function(isConnected) {
		if (isConnected) {
			this.refs['page' + this.state.currentSelectedTab].onPageSelected()
		}
	},

	onDidFocus: function(event) {
        if (MainPage.STOCK_LIST_VIEW_PAGER_ROUTE === event.data.route.name) {
            WebSocketModule.registerCallbacks((stockInfo) => {
				this.refs['page' + this.state.currentSelectedTab] && this.refs['page' + this.state.currentSelectedTab].handleStockInfo(stockInfo)
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
		this.refs['page' + this.state.currentSelectedTab].onPageSelected()

		WebSocketModule.registerInterestedStocks(this.refs['page' + this.state.currentSelectedTab].getShownStocks())
	},

	renderNavBar: function() {
		var hasOwnStocks = LogicData.getOwnStocksData().length !== 0
		return (
			<NavBar title="行情"
				textOnLeft={(this.state.currentSelectedTab==0 && hasOwnStocks) ? '编辑' : null}
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
				<StockListPage dataURL={urls[i]} ref={'page' + i} showHeaderBar={i==1} isOwnStockPage={i==0} navigator={this.props.navigator}/>
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

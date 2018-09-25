'use strict'

import React from 'react';
import createReactClass from 'create-react-class';
import {
	StyleSheet,
	View,
	Image,
	Text,
	Alert,
	Dimensions,
	NetInfo,
	TouchableOpacity
} from 'react-native';

import TimerMixin from 'react-timer-mixin';
var {EventCenter, EventConst} = require('../EventCenter')
var LS = require('../LS')
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

var tabNames = ['ZX', 'MG','GG','ZS', 'WH', 'SP']
var urlKeys = [
	'GET_USER_BOOKMARK_LIST_API',
	'GET_US_STOCK_TOP_GAIN_API',
	'GET_US_STOCK_HK_API',
	'GET_INDEX_LIST_API',
	'GET_FX_LIST_API',
	'GET_FUTURE_LIST_API',
]
var {height, width} = Dimensions.get('window');
var tabNamesLive = ['ZX', 'MG','GG','ZS', 'WH', 'SP']
var urlKeysLive = [
	'GET_USER_BOOKMARK_LIST_LIVE_API',
	'GET_US_STOCK_TOP_GAIN_LIVE_API',
	'GET_US_STOCK_HK_LIVE_API',
	'GET_INDEX_LIST_LIVE_API',
	'GET_FX_LIST_LIVE_API',
	'GET_FUTURE_LIST_LIVE_API',
]

var didFocusSubscription = null;
var didTabSelectSubscription = null;
var _currentSelectedTab = 0;
var StockListViewPager = createReactClass({
    displayName: 'StockListViewPager',
    mixins: [TimerMixin],
    navBarPressedCount: 0,
    developPageTriggerCount: 10,

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
			'connectionChange',
			this._handleConnectivityChange
		);
	},

    componentWillUnmount: function() {
		this.didFocusSubscription.remove();
		this.didTabSelectSubscription.remove();
    	NetInfo.isConnected.removeEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);
		this.networkConnectionChangedSubscription && this.networkConnectionChangedSubscription.remove();
	},

    onTabChanged: function() {
		LogicData.setTabIndex(MainPage.STOCK_LIST_PAGE_TAB_INDEX);
		LogicData.setCurrentPageTag(_currentSelectedTab);
		this.setState({currentSelectedTab: _currentSelectedTab});
		this.refs['page' + _currentSelectedTab].tabPressed()
		WebSocketModule.registerCallbacks((stockInfo) => {
			this.refs['page' + _currentSelectedTab] && this.refs['page' + _currentSelectedTab].handleStockInfo(stockInfo)
		})

		this.refs['page' + _currentSelectedTab].onPageSelected();
		WebSocketModule.registerInterestedStocks(this.refs['page' + _currentSelectedTab].getShownStocks())
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
		NativeDataModule.passDataToNative('Lang', LogicData.getLanguageEn() == '1'?'en':'cn')
		console.log('Lang = ' + LogicData.getLanguageEn() == '1'?'en':'cn')
		// NativeSceneModule.launchNativeScene('StockEditFragment')
		this.props.navigator.push({
			name: MainPage.EDIT_OWN_STOCKS_ROUTE,
		});
	},

    onPageSelected: function(index) {
		this.setState({
			currentSelectedTab: index,
		})
		_currentSelectedTab = index;
		LogicData.setCurrentPageTag(_currentSelectedTab);
		this.refs['page' + _currentSelectedTab].onPageSelected()

		WebSocketModule.registerInterestedStocks(this.refs['page' + _currentSelectedTab].getShownStocks())
	},

    renderNavBar: function() {
		var strBJ = LS.str('BJ')
		var strHQ = LS.str('HANGQING')
		var strHQWLJ = LS.str('HQWLJ')
		var hasOwnStocks = LogicData.getOwnStocksData().length !== 0
		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={()=>this.pressedNavBar()}
				// style={{position:'absolute', top:0, left: 0, right: width, width:width}}
				>
				<NavBar title={this.state.connected ? strHQ : strHQWLJ} 
					textOnLeft={(_currentSelectedTab==0 && hasOwnStocks) ? strBJ : null}
					leftTextOnClick={this.editButtonClicked}
					showSearchButton={true}
					navigator={this.props.navigator}/>
			</TouchableOpacity>
		)
	},

    pressedNavBar: function(){ 
		if(this.navBarPressedCount >= this.developPageTriggerCount - 1){
			this.navBarPressedCount = 0;
			this.props.navigator.push({
				name: MainPage.DEVELOP_ROUTE,
			});
		}else{
			this.navBarPressedCount++;
			var currentCount = this.navBarPressedCount;
			this.setTimeout(
				()=>{
					if(this.navBarPressedCount == currentCount && this.navBarPressedCount < this.developPageTriggerCount - 1){
						this.navBarPressedCount = 0;
						console.log("count to 10 failed.")
					}
				}, 500
		 	);
		}
	},

    render: function() {
		
		var tabNamesShow = [LS.str(tabNames[0]),LS.str(tabNames[1]),LS.str(tabNames[2]),LS.str(tabNames[3]),LS.str(tabNames[4]),LS.str(tabNames[5])]
		var tabNamesLiveShow = [LS.str(tabNamesLive[0]),LS.str(tabNamesLive[1]),LS.str(tabNamesLive[2]),LS.str(tabNamesLive[3]),LS.str(tabNamesLive[4]),LS.str(tabNamesLive[5])]
		if(LogicData.getAccountState()){
			var viewPages = tabNamesLive.map(
				(tabName, i) =>
				<View style={styles.slide} key={i}>
					<StockListPage dataURL={NetConstants.getUrl(urlKeys[i])}
												 activeDataURL={NetConstants.getUrl(urlKeysLive[i])}
												 ref={'page' + i} showHeaderBar={i==1} isOwnStockPage={i==0} navigator={this.props.navigator}
												 pageKey={i}/>
				</View>
			)
			return (
				<View style={[styles.wrapper, {width: width}]}>
					{this.renderNavBar()}
					<ScrollTabView
							tabNames={tabNamesLiveShow}
							viewPages={viewPages}
							onPageSelected={(index) => this.onPageSelected(index)} />
				</View>
			)
		}else{
			var viewPages = tabNames.map(
				(tabName, i) =>
				<View style={styles.slide} key={i}>
					<StockListPage dataURL={NetConstants.getUrl(urlKeys[i])}
												 activeDataURL={NetConstants.getUrl(urlKeysLive[i])}
												 ref={'page' + i} showHeaderBar={i==1||i==2} isOwnStockPage={i==0} navigator={this.props.navigator}
												 pageKey={i}/>
				</View>
			)
			return (
				<View style={[styles.wrapper, {width: width}]}>
					{this.renderNavBar()}
					<ScrollTabView
							tabNames={tabNamesShow}
							viewPages={viewPages}
							onPageSelected={(index) => this.onPageSelected(index)} />
				</View>
			)
		}

	},
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

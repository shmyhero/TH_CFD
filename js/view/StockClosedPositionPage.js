'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ListView,
	TouchableHighlight,
	Dimensions,
	Image,
	Platform,
	Alert,
	LayoutAnimation,
} from 'react-native';

import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'

var LogicData = require('../LogicData')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var WebSocketModule = require('../module/WebSocketModule')
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var TimerMixin = require('react-timer-mixin');
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var MainPage = require('./MainPage')
var WaitingRing = require('./component/WaitingRing');
var {EventCenter, EventConst} = require('../EventCenter');

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var extendHeight = 204
var rowHeight = 56
var perPageCount = 20;
var stockNameFontSize = Math.round(17*width/375.0)

var networkConnectionChangedSubscription = null;
var accountLogoutEventSubscription = null;
var accountStateChangedSubscription = null;
var layoutSizeChangedSubscription = null

var StockClosedPositionPage = React.createClass({
	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			stockInfoRowData: [],
			stockInfo: ds.cloneWithRows([]),
			selectedRow: -1,
			isClear:false,
			contentLoaded: false,
			isRefreshing: false,
			height: UIConstants.getVisibleHeight(),
		};
	},

	componentDidMount: function() {
		this.loadClosedPositionInfo();

		networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			this.onConnectionStateChanged();
		});

		accountStateChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, () => {
			this.clearViews();
		});

		accountLogoutEventSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGOUT, () => {
			this.clearViews();
		});

		layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.LAYOUT_SIZE_CHANGED, () => {
			this.onLayoutSizeChanged();
		});
	},

	onConnectionStateChanged: function(){
		if(LogicData.getTabIndex() == MainPage.STOCK_EXCHANGE_TAB_INDEX && !this.state.contentLoaded && !this.state.isRefreshing && WebSocketModule.isConnected()){
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1] && routes[routes.length-1].name == MainPage.STOCK_EXCHANGE_ROUTE){
				var userData = LogicData.getUserData();
				var notLogin = Object.keys(userData).length === 0;
				if(!notLogin){
					this.loadClosedPositionInfo();
				}
			}
		}
	},

	componentWillUnmount: function(){
		networkConnectionChangedSubscription && networkConnectionChangedSubscription.remove();
		accountStateChangedSubscription && accountStateChangedSubscription.remove();
		accountLogoutEventSubscription && accountLogoutEventSubscription.remove();
		layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove();
	},

	onLayoutSizeChanged: function(){
		console.log("onLayoutSizeChanged StockClosedPositionPage");
		this.setState({
			height: UIConstants.getVisibleHeight(),
		})
	},

	isLoadedAll: false,

	currentTicks: 0,

	isResetScroll: false,

	scrollViewYOffset: 0,

	tabPressed: function(index) {
		var d = new Date();
		this.currentTicks = d.getTime();
		console.log("tabpressed ")

		this.setState({
			selectedRow: -1,
		})
		if(this._pullToRefreshListView && this._pullToRefreshListView._scrollView){
			try{
				this.endNextPageLoadingState(false);
			}catch(e){
				console.log("Met error when clear closed position page!" + e)
			}
		}

		if(this.scrollViewYOffset != 0){
			//If current scrollview offset isn't 0, scroll to 0.
			if(this._pullToRefreshListView && this._pullToRefreshListView._scrollView){
				console.log("tabPressed - scroll to top")
				this.isResetScroll = true;
				this._pullToRefreshListView._scrollView.scrollTo({x:0, y:0, animated:false})
			}
		}else{
			this.loadClosedPositionInfo();
		}

		WebSocketModule.registerCallbacks(
			() => {
		})
	},

	onScroll: function(event){
		this.scrollViewYOffset = event.nativeEvent.contentOffset.y;
		if(this.isResetScroll && this.scrollViewYOffset == 0){
			this.isResetScroll = false;
			//BUGBUG: We need to move the following code to scroll to callback.
			if(!this.state.contentLoaded){
				this.setState({
					isRefreshing: true,
				});
			}
			this.loadClosedPositionInfo();
		}
	},

	clearViews:function(){
		if(this._pullToRefreshListView && this._pullToRefreshListView._scrollView){
			try{
				this.endNextPageLoadingState(false);
				if(this.scrollViewYOffset != 0){
					this._pullToRefreshListView._scrollView.scrollTo({x:0, y:0, animated:false})
				}
			}catch(e){
				console.log("Met error when clear closed position page!" + e)
			}
		}

		this.setState({
			isClear:true,
			contentLoaded: false,
			isRefreshing: false,
			stockInfoRowData: [],
			stockInfo: ds.cloneWithRows([]),
			selectedRow: -1,
		})
	},

	loadClosedPositionInfo: function() {
		var lastTicks = this.currentTicks;

		if(!this.state.contentLoaded){
			this.setState({
				isRefreshing: true,
			});
		}

		var userData = LogicData.getUserData()
		var url = NetConstants.CFD_API.GET_CLOSED_POSITION_API
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_CLOSED_POSITION_LIVE_API
			console.log('live', url );
		}
		url = url + "?count=" + perPageCount

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
				if(lastTicks !== this.currentTicks){
					console.log("It is the response of the request of previous views. Ignore it.")
					return;
				}
				// responseJson = [responseJson[0], responseJson[1], responseJson[2]]

				this.setState({
					stockInfoRowData: responseJson,
					stockInfo: this.state.stockInfo.cloneWithRows(responseJson),
					isClear:false,
					contentLoaded: true,
					isRefreshing: false,
				})

				this.endNextPageLoadingState(responseJson.length < perPageCount);
			},
			(result) => {
				if(lastTicks !== this.currentTicks){
					console.log("It is the response of the request of previous views. Ignore it.")
					return;
				}

				if(!result.loadedOfflineCache){
					this.setState({
						contentLoaded: false,
						isRefreshing: false,
					})
				}

				// if(NetConstants.AUTH_ERROR === result.errorMessage){
				//
				// }else{
				// 	// Alert.alert('', errorMessage);
				// }
			}
		)
	},

	loadClosedPositionInfoWithLastDateTime: function(dateTime, count) {
		var lastTicks = this.currentTicks;

		console.log("loadClosedPositionInfoWithLastDateTime: " + dateTime + ", " + count);
		var userData = LogicData.getUserData()
		var url = NetConstants.CFD_API.GET_CLOSED_POSITION_API
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_CLOSED_POSITION_LIVE_API
			console.log('live', url );
		}
		url = url + "?closedBefore=" + dateTime + "&count=" + count

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				cache: 'none', //Do not load offline cache here
				//timeout: 1000,
			},
			(responseJson) => {
				if(lastTicks !== this.currentTicks){
					console.log("It is the response of the request of previous views. Ignore it.")
					return;
				}

				//this.setTimeout(()=>{
					var stockInfoRowData = this.state.stockInfoRowData.concat(responseJson);
					this.setState({
						stockInfoRowData: stockInfoRowData,
						stockInfo: ds.cloneWithRows(stockInfoRowData),
					}, ()=>{
						this.endNextPageLoadingState(responseJson.length < count);
					})
				//}, 1000);
			},
			(result) => {
				if(lastTicks !== this.currentTicks){
					console.log("It is the response of the request of previous views. Ignore it.")
					return;
				}

				this.endNextPageLoadingState(false);
				// if(NetConstants.AUTH_ERROR === result.errorMessage){
				//
				// }else{
				// 	// Alert.alert('', errorMessage);
				// }
			}
		)
	},

	endNextPageLoadingState: function(endLoadMore){
		console.log("endLoadMore " + endLoadMore)
		if(this.isLoadedAll != endLoadMore){
			this.isLoadedAll = endLoadMore;
			this._pullToRefreshListView.endLoadMore(endLoadMore);
		}
	},

	onLoadMore: function() {
		if(this.state.stockInfoRowData && this.state.stockInfoRowData.length>0){
			var lastItem = this.state.stockInfoRowData[this.state.stockInfoRowData.length-1];
			var dateTime = lastItem.closeAt;

			this.loadClosedPositionInfoWithLastDateTime(dateTime, perPageCount);
		}
	},

	stockPressed: function(rowData, sectionID, rowID, highlightRow) {
		var contentLength = this._pullToRefreshListView._scrollView.getMetrics().contentLength;
		// if (rowHeight === 0) {
		// 	rowHeight = contentLength/this.state.stockInfoRowData.length
		// }

		var newData = []
		$.extend(true, newData, this.state.stockInfoRowData)	// deep copy

		if (this.state.selectedRow == rowID) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			newData[rowID].hasSelected = false
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				stockInfoRowData: newData,
				selectedRow: -1,
			},()=>{
				if (Platform.OS === 'android') {
					var currentY = contentLength/newData.length*(parseInt(rowID)) + UIConstants.LIST_HEADER_BAR_HEIGHT
					this.setTimeout(
						() => {
							if (currentY > 300 && currentY + 3 * rowHeight > contentLength) {
								this._pullToRefreshListView._scrollView.scrollTo({x:0, y:Math.floor(currentY), animated:true})
							}
						 },
						500
					);
				}
			});
		} else {
			var maxY = Platform.OS === 'android' ?
			(height - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER - UIConstants.HEADER_HEIGHT
				- UIConstants.SCROLL_TAB_HEIGHT - UIConstants.LIST_HEADER_BAR_HEIGHT - UIConstants.TAB_BAR_HEIGHT)*20/21
				- extendHeight
			: (height- 114 - UIConstants.LIST_HEADER_BAR_HEIGHT)*20/21 - extendHeight

			var currentY = (rowHeight+0.5)*(parseInt(rowID)+1)
			var previousSelectedRow = this.state.selectedRow
			this.setTimeout(
				() => {
					if (currentY > maxY && parseInt(previousSelectedRow) < parseInt(rowID)) {
						this._pullToRefreshListView._scrollView.scrollTo({x:0, y:Math.floor(currentY-maxY), animated:true})
					}
				},
				Platform.OS === 'android' ? 1000 : 0
			);

			//RN 3.3 Android list view has a bug when the spring animation shows up... Disable it for now

			if(Platform.OS === 'ios'){
				//Do not set delete animation, or the some row will be removed if clicked quickly.
				var animation = {
					duration: 700,
					create: {
						type: 'linear',
						property: 'opacity',
					},
					update: {
						type: 'spring',
						springDamping: 0.4,
						property: 'scaleXY',
					},
				}
				LayoutAnimation.configureNext(animation);//LayoutAnimation.Presets.spring);
			}
			newData[rowID].hasSelected = true
			this.setState({
				stockInfo: this.state.stockInfo.cloneWithRows(newData),
				stockInfoRowData: newData,
				selectedRow: rowID,
			})
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
		if(rowID == this.state.selectedRow - 1) {
			return null
		}
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	},

	renderFooter: function(viewState) {
		let {pullState, pullDistancePercent} = viewState
		let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
		pullDistancePercent = Math.round(pullDistancePercent * 100)
		switch(pullState) {
			case load_more_none:
			case load_more_idle:
			case will_load_more:
				return (
					<View style={{height: 35, justifyContent: 'center', alignItems: 'center'}}>
						<Text style={styles.refreshTextStyle}>加载更多</Text>
					</View>
				)
			case loading_more:
				return (
					<View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center'}}>
						{this.renderActivityIndicator()}<Text style={styles.refreshTextStyle}>加载中...</Text>
					</View>
				)
			case loaded_all:
				return (
					<View/>
				)
		}
	},

	renderActivityIndicator: function(){
		var color = "#7a7987";
		var styleAttr = 'small' //or "large"
		return (
			<WaitingRing color={color} styleAttr={styleAttr}/>
		);
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

	renderProfit: function(pl) {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(18*width/375.0)
		pl = pl.toFixed(2)
		if (pl > 0) {
			return (
				<Text style={[styles.stockPercentText, {color: '#f19296', fontSize:textSize}]}>
					 +{pl}
				</Text>
			);
		} else if (pl < 0) {
			return (
				<Text style={[styles.stockPercentText, {color: '#82d2bb', fontSize:textSize}]}>
					 {pl}
				</Text>
			);

		} else {
			return (
				<Text style={[styles.stockPercentText, {color: '#c5c5c5', fontSize:textSize}]}>
					 {pl}
				</Text>
			);
		}
	},

	renderProfitPercentage: function(percentChange) {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(18*width/375.0)
		percentChange = percentChange.toFixed(2)
		if (percentChange > 0) {
			return (
				<Text style={[styles.stockPercentText, {color: '#f19296', fontSize:textSize}]}>
					 +{percentChange} %
				</Text>
			);
		} else if (percentChange < 0) {
			return (
				<Text style={[styles.stockPercentText, {color: '#82d2bb', fontSize:textSize}]}>
					 {percentChange} %
				</Text>
			);

		} else {
			return (
				<Text style={[styles.stockPercentText, {color: '#c5c5c5', fontSize:textSize}]}>
					 {percentChange} %
				</Text>
			);
		}
	},

	renderDetailInfo: function(rowData) {
		var tradeImage = rowData.isLong ? require('../../images/dark_up.png') : require('../../images/dark_down.png')
		var profitColor = rowData.pl > 0 ? ColorConstants.STOCK_RISE_RED : ColorConstants.STOCK_DOWN_GREEN
		if (rowData.pl === 0) {
			profitColor = 'black'
		}
		var openDate = new Date(rowData.openAt)
		var closeDate = new Date(rowData.closeAt)
		var currency = UIConstants.CURRENCY_CODE_LIST[rowData.security.ccy]
		var financing_dividend_sum = 0;
		if(rowData.financingSum){
			financing_dividend_sum += rowData.financingSum;
		}
		if(rowData.dividendSum){
			financing_dividend_sum += rowData.dividendSum;
		}
		return (
			<View style={[{height: extendHeight}, styles.extendWrapper]} >
				<View style={[styles.darkSeparator, {marginLeft: 0}]} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>类型</Text>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>本金({currency})</Text>
						<Text style={styles.extendTextBottom}>{rowData.invest && rowData.invest.toFixed(2)}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>杠杆</Text>
						<Text style={styles.extendTextBottom}>x{rowData.leverage}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.openPrice.toFixed(2)}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>开仓费</Text>
						<Text style={styles.extendTextBottom}>0</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{openDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{openDate.Format('hh:mm')}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>平仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.closePrice.toFixed(2)}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>平仓费</Text>
						<Text style={styles.extendTextBottom}>0</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{closeDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{closeDate.Format('hh:mm')}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>隔夜费</Text>
						<Text style={styles.extendTextBottom}>{financing_dividend_sum.toFixed(2)}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>净收益(美元)</Text>
						<Text style={[styles.extendTextBottom, {color:profitColor}]}>{rowData.pl.toFixed(2)}</Text>
					</View>
					<View style={styles.extendRight}>
					</View>
				</View>

			</View>
		);
	},

	renderAchievementIcon: function(rowData){
		if(rowData.hasCard){
			return(
				<Image style={styles.achievementIcon}
					source={require('../../images/achievement_hint.png')}></Image>
				);
		}
	},

	renderRow: function(rowData, sectionID, rowID, highlightRow) {
		console.log("BUG FIX - renderRow rowID " + rowID + ", rowData " + JSON.stringify(rowData))
		var bgcolor = this.state.selectedRow === rowID ? '#e6e5eb' : 'white'
		var plPercent = (rowData.closePrice - rowData.openPrice) / rowData.openPrice * rowData.leverage * 100
		plPercent = plPercent * (rowData.isLong ? 1 : -1)
		return (
			<View>
				<TouchableHighlight activeOpacity={1} onPress={() => this.stockPressed(rowData, sectionID, rowID, highlightRow)}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowData.key}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
								{rowData.security.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{this.renderCountyFlag(rowData)}
								<Text style={styles.stockSymbolText}>
									{rowData.security.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(rowData.pl)}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfitPercentage(plPercent)}
						</View>

						{this.renderAchievementIcon(rowData)}
					</View>
				</TouchableHighlight>

				{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	},

	renderLoadingText: function() {
		if(this.state.stockInfoRowData.length === 0) {
			return (
				<View style={styles.loadingTextView}>
					<Text style={styles.loadingText}>暂无平仓记录</Text>
				</View>
				)
		}
	},

	renderHeaderBar: function() {
			return (
				<View style={styles.headerBar}>
					<View style={[styles.rowLeftPart, {	paddingTop: 5,}]}>
						<Text style={styles.headerTextLeft}>产品</Text>
					</View>
					<View style={[styles.rowCenterPart]}>
						<Text style={[styles.headerTextLeft]}>亏盈</Text>
					</View>
					<View style={styles.rowRightPart}>
						<Text style={styles.headerTextLeft}>收益率</Text>
					</View>
				</View>
			);
	},

	renderOrClear:function(){
		if(this.state.isClear){
			return(<View style={{height:10000}}></View>)
		}
	},

	renderContent: function(){
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator onRefresh={()=>this.loadClosedPositionInfo()} refreshing={this.state.isRefreshing}/>
			)
		}else{
      var pullUpDistance = 35;
      var pullUpStayDistance = 35;

			return (<View style={{flex:1}}>
				{this.renderOrClear()}
				{this.renderHeaderBar()}
				{this.renderLoadingText()}
				<PullToRefreshListView
					style={styles.list}
					ref={ (component) => this._pullToRefreshListView = component }
					initialListSize={20}
					viewType={PullToRefreshListView.constants.viewType.listView}
					dataSource={this.state.stockInfo}
					enableEmptySections={true}
					renderFooter={this.renderFooter}
					pageSize={20}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					autoLoadMore={false}
					enabledPullDown={false}
					onEndReachedThreshold={30}
					onScroll={this.onScroll}
					//onRefresh={this._onRefresh.bind(this)}
					onLoadMore={this.onLoadMore}
					pullUpDistance={pullUpDistance}
					pullUpStayDistance={pullUpStayDistance}
				/>
			</View>);
		}
	},

	render: function() {
		var viewStyle = Platform.OS === 'android' ?
		{width: width, height: this.state.height
			- UIConstants.HEADER_HEIGHT
			- UIConstants.SCROLL_TAB_HEIGHT
			- UIConstants.TAB_BAR_HEIGHT} :
			{width: width, flex: 1,}
		return (
			<View style={viewStyle}>
				{this.renderContent()}
			</View>
		)
	},
});

var styles = StyleSheet.create({
	list: {
		alignSelf: 'stretch',
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

	rowWrapper: {
		height: rowHeight,
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 10,
		paddingTop: 10,
		backgroundColor: '#ffffff',
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

	rowLeftPart: {
		flex: 3,
		alignItems: 'flex-start',
		paddingLeft: 0,
	},

	rowCenterPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
	},

	rowRightPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 0,
		alignItems: 'flex-end',
	},

	stockNameText: {
		fontSize: stockNameFontSize,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 22,
		color: '#505050',
	},

	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		lineHeight: 14,
	},

	stockPercentText: {
		fontSize: 18,
		color: '#ffffff',
		fontWeight: 'normal',
	},

	darkSeparator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: '#dfdfdf',
	},

	extendWrapper: {
		alignItems: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: ColorConstants.LIST_BACKGROUND_GREY,
	},

	extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		height: 51,
	},

	extendLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendMiddle: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},

	extendTextTop: {
		fontSize:14,
		color: '#7d7d7d',
	},
	extendTextBottom: {
		fontSize:13,
		color: 'black',
		marginTop: 5,
	},
	extendImageBottom: {
		width: 24,
		height: 24,
	},
	loadingTextView: {
		alignItems: 'center',
		paddingTop: 180,
		backgroundColor: 'transparent'
	},
	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},

	headerBar: {
		flexDirection: 'row',
		backgroundColor: '#d9e6f3',
		height: UIConstants.LIST_HEADER_BAR_HEIGHT,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop:2,
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
		textAlign: 'center',
		color:'#576b95',
	},

	achievementIcon: {
		position: 'absolute',
		top: -2,
		right: 3,
		height: 17,
		width: 17,
	},

	refreshTextStyle: {
		color: '#afafaf',
	},
});


module.exports = StockClosedPositionPage;

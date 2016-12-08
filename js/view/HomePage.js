'use strict';

import React from 'react';
import TimerMixin from 'react-timer-mixin';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform,
	ListView,
	Alert,
	ScrollView,
} from 'react-native';

var Swiper = require('react-native-swiper')
var ColorConstants = require('../ColorConstants')
var MainPage = require('./MainPage')
var NetConstants = require('../NetConstants');
var UIConstants = require('../UIConstants');
var NetworkModule = require('../module/NetworkModule');
var StorageModule = require('../module/StorageModule');
var FSModule = require('../module/FSModule');
var LogicData = require('../LogicData');
var WebSocketModule = require('../module/WebSocketModule');
var NavBar = require('./NavBar')
var TalkingdataModule = require('../module/TalkingdataModule')
//var TongDaoModule = require('../module/TongDaoModule')
var DevelopPage = require('./DevelopPage')
var VersionConstants = require('../VersionConstants')
var Reward = require('./Reward')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')

var {EventCenter, EventConst} = require('../EventCenter')

//Change URL may be wrong.
var RECOMMAND_URL = NetConstants.TRADEHERO_API.WEBVIEW_RECOMMAND_PAGE
var PAGES = [
	{name: 'Page0', url: RECOMMAND_URL + "1", header:""},
	{name: 'Page1', url: RECOMMAND_URL + "1", header:""},
];
var BANNERS = [
	require('../../images/bannar01.png'),
	require('../../images/bannar02.png'),
];
const check_in_image = require("../../images/check_in.png")
const movie_image = require("../../images/movie.png")
const hot_image = require("../../images/hot.png")
const bg_hint_image = require("../../images/icon_bg_hint.png")

var {height, width} = Dimensions.get('window');
var barWidth = Math.round(width/3)-12
var imageHeight = 300 / 750 * width

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var bsds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var magicCode = ""
var NO_MAGIC = false
var didTabSelectSubscription = null
var didFocusSubscription = null
var networkConnectionChangedSubscription = null
var lastForceloopTime = 0
const CARDS_LIST = "cardList"

var HomePage = React.createClass({
	mixins: [TimerMixin],
	navBarPressedCount: 0,
	developPageTriggerCount: 10,

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(PAGES),
			rawPopularityInfo: [],
			popularityInfo: bsds.cloneWithRows([]),
			rawCardsInfo: [],
			topNews: [],
			attendedMovieEvent: false,
			winMovieTicket: false,
			isConnected: false,
		};
	},

	propTypes: {
		showIncomeDialogWhenNecessary: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			showIncomeDialogWhenNecessary: ()=>{}
		}
	},

	componentWillMount: function() {
		StorageModule.loadBanners()
			.then((value) => {
				if (value !== null) {
					this.downloadBannerImages(JSON.parse(value))
					.then(()=>{
						//Make sure the downloading synchronized.
						this.reloadBanner();
					})
				}else{
					this.reloadBanner();
				}
			})
			.done();

		this.loadHomeData();
		this.loadCards();
	},

	reloadPage: function(){
		this.reloadBanner();
		this.loadHomeData();
		this.loadCards();
	},

	reloadBanner: function() {
		var userData = LogicData.getUserData();

		this.refs[CARDS_LIST] && this.refs[CARDS_LIST].scrollTo({x:0})
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_HOMEPAGE_BANNER_API,
			{
				method: 'GET',
				cache: 'offline',
			},
			(responseJson) => {
				console.log(JSON.stringify(responseJson))
				this.downloadBannerImages(responseJson)
				StorageModule.setBanners(JSON.stringify(responseJson))
			}
		);

		var userId = userData.userId
		var login = Object.keys(userData).length !== 0
		if(login){
			var url = NetConstants.CFD_API.GET_MOVIE_RANK;
			url = url.replace("<userId>", userId);

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=UTF-8',
					},
				},
				(responseJson) => {
					if(responseJson.rank){
						this.setState({
							attendedMovieEvent: true,
							winMovieTicket: responseJson.rank <= 3,
						})
					}else{
						this.setState({
							attendedMovieEvent: false,
							winMovieTicket: false,
						})
					}
				}
			);
		}
	},

	loadCards: function() {

		var url = NetConstants.CFD_API.GET_HOME_CARDS;
		var userData = LogicData.getUserData()

		var requestSuccess = true;

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				cache: 'none',
			},
			(responseJson) => {
				this.setState({
					rawCardsInfo: responseJson,
				})
			}
		);

	},


	loadHomeData: function() {

		var url = NetConstants.CFD_API.GET_POPULARITY_API
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_POPULARITY_LIVE_API
			console.log('live', url );
		}

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				cache: 'offline',
			},
			(responseJson) => {
				var listdata = responseJson
				if (listdata.length > 3) {
					listdata = listdata.slice(0,3)
				}
				this.setState({
					rawPopularityInfo: responseJson,
					popularityInfo: bsds.cloneWithRows(listdata)
				})
			}
		);

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.GET_TOP_NEWS_TOP10_API,
			{
				method: 'GET',
				cache: 'offline',
			},
			(responseJson) => {
				this.setState({
					topNews: responseJson,
				})
			}
		);
	},

	componentDidMount: function() {
		didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);
		didTabSelectSubscription = EventCenter.getEventEmitter().
		addListener(EventConst.HOME_TAB_RESS_EVENT, this.onTabChanged);
		networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			this.onConnectionStateChanged();
		});

		this.onConnectionStateChanged();
	},

	onConnectionStateChanged: function(){
		var isConnected = WebSocketModule.isConnected();
		this.setState({
			connected: isConnected
		})
		if(isConnected && LogicData.getTabIndex() == 0){
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1] && routes[routes.length-1].name == MainPage.HOME_PAGE_ROUTE){
				this.reloadPage();
			}
		}
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
		didFocusSubscription && didFocusSubscription.remove();
		networkConnectionChangedSubscription && networkConnectionChangedSubscription.remove();
	},

	onTabChanged: function(){
		this.reloadPage();
		LogicData.setTabIndex(0);
		this.forceloopSwipers();
	},

	onDidFocus: function(event) {
		//didfocus emit in componentDidMount
		if (MainPage.HOME_PAGE_ROUTE === event.data.route.name) {
			this.forceloopSwipers()
		}
	},

	forceloopSwipers: function() {
		if (Platform.OS === 'ios') {
    		var nowTime = (new Date()).valueOf();
    		if (nowTime - lastForceloopTime > 1200) {
    			console.log("forceloop:"+nowTime)
				if (this.refs["bannerswiper"] !== undefined) {
					this.refs["bannerswiper"].forceloop()
				}
				if (this.refs["topnewsswiper"] !== undefined) {
					this.refs["topnewsswiper"].forceloop()
				}
				lastForceloopTime = nowTime
			}
		}
	},

	downloadBannerImages: function(images) {
		var promise = new Promise((resolve, reject) => {
		  // do a thing, possibly async, then…
			this.downloadOneBannerImage(images, 0, resolve);
		});
		return promise;
	},

	downloadOneBannerImage: function(images, index, resolve) {
		console.log("downloadOneBannerImage: " + index)
		if (index >= images.length) {
			resolve()
			return
		}
		var imagePath = images[index].imgUrl
		var targetUrl = images[index].url
		if (targetUrl == '') {
			targetUrl = RECOMMAND_URL + images[index].id
		}
		var header = images[index].header
		var digest = images[index].digest
		var id = images[index].id
		FSModule.getBannerImageLocalPath(imagePath)
			.then(filePath => {
				if (filePath !== null) {
					while(PAGES.length <= index) {
						PAGES.push({name: 'PAGE' + PAGES.length})
					}
					PAGES[index].id = id
					PAGES[index].imgUrl = filePath
					PAGES[index].url = targetUrl
					PAGES[index].header = header
					PAGES[index].digest = digest
					this.setState({
						dataSource: ds.cloneWithRows(PAGES)
					})
					this.downloadOneBannerImage(images, index + 1, resolve)
				} else {
					FSModule.downloadBannerImage(imagePath, (filePath) => {
						if (filePath !== null) {
							while(PAGES.length <= index) {
								PAGES.push({name: 'PAGE' + PAGES.length})
							}
							PAGES[index].id = id
							PAGES[index].imgUrl = filePath
							PAGES[index].url = targetUrl
							PAGES[index].header = header
							PAGES[index].digest = digest
							this.setState({
								dataSource: ds.cloneWithRows(PAGES)
							})
						}
						this.downloadOneBannerImage(images, index + 1, resolve)
					})
				}
			})
	},

	goToBannerPage: function(i) {
		var trackingData = {};
		trackingData[TalkingdataModule.KEY_BANNER_PAGE] = PAGES[i].header;
		TalkingdataModule.trackEvent(TalkingdataModule.BANNER_EVENT, "", trackingData)
		this.gotoWebviewPage(PAGES[i].url,
			'推荐',
			PAGES[i].id,
			PAGES[i].header,
			PAGES[i].digest,
			TalkingdataModule.BANNER_SHARE_EVENT)

		//TongDaoModule.trackTopBannerEvent()
	},

	getShareMovieEventInfo: function(){
		var info = {};
		if(!this.state.attendedMovieEvent){
			info.shareUrl = NetConstants.TRADEHERO_API.SHARE_MOVIE_NOT_ATTENDED_TICKET_URL;
			info.message = "模拟投资比收益，排名前三，每天都送电影票！";
		}else{
			if(this.state.winMovieTicket){
				info.shareUrl = NetConstants.TRADEHERO_API.SHARE_MOVIE_WIN_TICKET_URL;
				info.message = "朕的投资收益率排名前3，快快赞我！";
			}else{
				info.shareUrl = NetConstants.TRADEHERO_API.SHARE_MOVIE_NOT_WIN_TICKET_URL;
				info.message = "俺的模拟投资战绩不佳，求大侠支招，助我拿到电影票！";
			}
		}
		info.title = "一大波影券来啦";
		return info;
	},

	gotoWebviewPage: function(targetUrl, title, shareID, shareTitle, shareDescription, sharingTrackingEvent, shareUrl) {
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}

		if(!targetUrl.includes('userId')){
			if (targetUrl.indexOf('?') !== -1) {
				targetUrl = targetUrl + '&userId=' + userId
			} else {
				targetUrl = targetUrl + '?userId=' + userId
			}
		}

		if(!shareUrl && targetUrl.startsWith(NetConstants.TRADEHERO_API.MOVIE_WIN_TICKET_URL)){
			var shareInfo = this.getShareMovieEventInfo();
			shareUrl = shareInfo.shareUrl;
			shareDescription = shareInfo.message;
			shareTitle = shareInfo.title;
		}

		if(!shareID){
			shareID = null
		}
		if(!shareTitle){
			shareTitle = null
		}
		if(!shareDescription){
			shareDescription = null
		}
		if(!shareUrl){
			shareUrl = null
		}
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
			shareID: shareID,
			shareUrl: shareUrl,
			shareTitle: shareTitle,
			shareDescription: shareDescription,
			shareTrackingEvent: sharingTrackingEvent,
			backFunction: this.forceloopSwipers,
		});
	},

	gotoMoviePage: function(){
		TalkingdataModule.trackEvent(TalkingdataModule.MOVIE_ACTIVITY_EVENT);

		var url = NetConstants.TRADEHERO_API.MOVIE_WIN_TICKET_URL;
		var userData = LogicData.getUserData();
		var userId = userData.userId;
		if(userId == undefined){
			userId = 0;
		}
		url = url + '?userId=' + userId;

		var info = this.getShareMovieEventInfo();
		this.gotoWebviewPage(url, '推荐',
			null,
			info.title,
			info.message,
			TalkingdataModule.MOVIE_SHARE_EVENT,
			info.shareUrl);
	},

	gotoCheckinPage: function(){
		TalkingdataModule.trackEvent(TalkingdataModule.CHECK_IN_ACTIVITY_EVENT);
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(notLogin){
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				popToRoute: MainPage.DAY_SIGN_ROUTE,	//Set to destination page
			});
		}else{
			this.showCheckInPage();
		}
	},

	showCheckInPage: function(){
		this.props.navigator.push({
			name:MainPage.DAY_SIGN_ROUTE,
		});
	},

	endsWith: function(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},

	magicButtonPress: function(index) {
		if (NO_MAGIC) {
			return
		}

		// magicCode += ""+index

		// if(this.endsWith(magicCode, "12341234")){
		// 	// open account
		// 	this.props.navigator.push({
		// 		name: MainPage.OPEN_ACCOUNT_ROUTE,
		// 		step: 0,
		// 	});
		// }
		// else if(this.endsWith(magicCode, "41414141")) {
		// 	this.logoutPress()
		// }
		var targetUrl = 'http://cn.tradehero.mobi/TH_CFD_WEB/detail0'+index+'.html'
		if(LogicData.getAccountState()){
			targetUrl = 'http://cn.tradehero.mobi/TH_CFD_SP/detail0'+index+'.html'
		}
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: '',
			backFunction: this.forceloopSwipers,
		});
	},

	logoutPress: function() {
		StorageModule.removeUserData()
		.then(() => {
			LogicData.removeUserData()
			WebSocketModule.registerCallbacks(
				() => {
			})
		})
	},

	gotoStockDetail: function(rowData) {
  		this.props.navigator.push({
			name: MainPage.STOCK_DETAIL_ROUTE,
			stockRowData: rowData,
		});
	},

	gotoStockDetalWithID: function(card){
			var stockRowData = {
				name: card.stockName,
				id: parseInt(card.stockID),
			}

			this.props.navigator.push({
			name: MainPage.STOCK_DETAIL_ROUTE,
			stockRowData: stockRowData,
		});
	},

	renderPopularityRow: function(rowData, sectionID, rowID, highlightRow) {
		var percent = 0
		var stockName = ""
		var stockSymbol = ""
		var peopleNum = 0
		if(rowData.userCount !== undefined) {
			percent = rowData.longCount / (rowData.longCount + rowData.shortCount)
			percent = Math.round(100*percent)/100
			stockName = rowData.name
			stockSymbol = rowData.symbol
			peopleNum = rowData.userCount
		}
		var buyWidth = barWidth * percent
		var sellWidth = barWidth * (1-percent)
		percent = Math.round(percent*100)
		return (
			<TouchableOpacity style={styles.popularityRowContainer} onPress={()=>this.gotoStockDetail(rowData)}>
				<View style={styles.popularityRowLeft}>
					<Text style={styles.buyTitle}>买涨 {percent}%</Text>
					<View style={[styles.grayBar, {width:barWidth}]}>
						<View style={[styles.redBar, {width:buyWidth}]}/>
					</View>
				</View>
				<View style={styles.popularityRowCenter}>
					<Text style={[styles.stockName,{color:LogicData.getAccountState()?ColorConstants.TITLE_DARK_BLUE:'#1862df'}]}>{stockName}</Text>
					<Text style={styles.stockCode}>{stockSymbol}</Text>
					<Text style={styles.stockPeople}>{peopleNum}人参与</Text>
				</View>
				<View style={styles.popularityRowRight}>
					<Text style={styles.sellTitle}>买跌 {100-percent}%</Text>
					<View style={[styles.grayBar, {width:barWidth}]}>
						<View style={[styles.greenBar, {width:sellWidth}]}/>
					</View>
				</View>
			</TouchableOpacity>)
	},

	renderSeparator:function(sectionID, rowID, adjacentRowHighlighted) {
		return(<View key={rowID} style={styles.separator}/>)
	},

	showPopularityDetail: function() {
		this.props.navigator.push({
		 	name: MainPage.STOCK_POPULARITY_ROUTE,
			data: this.state.rawPopularityInfo,
			backFunction: this.forceloopSwipers,
		});
	},

	renderPopularityView: function() {
		if(this.state.rawPopularityInfo.length < 3){
			return(
				<View></View>
			)
		}else{
			return (
			<View style={{height:239, backgroundColor:'white'}}>
				<View style={styles.popularityHeaderContainer}>
					<Text style={styles.popularityTitle}>
						多空博弈
					</Text>
					<TouchableOpacity onPress={this.showPopularityDetail}>
						<Text style={styles.more}>
							更多 >
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.separator}/>
				<ListView
					style={styles.popularitylist}
					ref="popularitylist"
					initialListSize={3}
					scrollEnabled={false}
					dataSource={this.state.popularityInfo}
					enableEmptySections={true}
					renderRow={this.renderPopularityRow}
					renderSeparator={this.renderSeparator}/>
			</View>
			)
		}
	},

	renderIntroduceView: function(index, head, body, image) {
		return (
			<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(index)}>
				<View style={styles.blockContainer}>
					<View style={styles.blockTextContainer}>
						<Text style={[styles.blockTitleText],{color:LogicData.getAccountState()?ColorConstants.TITLE_DARK_BLUE:'#1862df'}}>
							{head}
						</Text>
						<Text style={styles.blockBodyContent}>
							{body}
						</Text>
					</View>
					<Image style={styles.blockImage} source={image}/>
				</View>
			</TouchableOpacity>
		)
	},
	renderBottomViews: function() {
		return (
			<View style={{flex:1}}>
				<View style={styles.rowContainer}>
					{this.renderIntroduceView(1, '涨跌双盈','买对趋势就是盈利',LogicData.getAccountState()?require('../../images/updown_actual.png'):require('../../images/updown.png'))}
					<View style={styles.vertLine}/>
					{this.renderIntroduceView(2, '以小搏大','本金加上杠杆交易',LogicData.getAccountState()?require('../../images/small_big_actual.png'):require('../../images/smallbig.png'))}
				</View>
				<View style={styles.horiLine}/>
				<View style={styles.rowContainer}>
					{this.renderIntroduceView(3, '实时行情','免费实时全球行情',LogicData.getAccountState()?require('../../images/markets_actual.png'):require('../../images/markets.png'))}
					<View style={styles.vertLine}/>
					{this.renderIntroduceView(4, '体验简单','极简交易三步骤',LogicData.getAccountState()?require('../../images/advantage_actual.png'):require('../../images/advantage.png'))}
				</View>
			</View>
		)
	},


	renderCards: function(){

			var cardItems = this.state.rawCardsInfo.map(
			(card, i) =>
				<TouchableOpacity onPress={() => this.pressCard(i)} key={i}>
					<View style={styles.scroolItem}>
						<Reward card={card} type={1} divideInLine={3} id={card}></Reward>
					</View>
				</TouchableOpacity>
			)

			if(cardItems!==undefined && cardItems.length > 0){
				return(
					<View>
						<View style={[styles.popularityHeaderContainer,{backgroundColor:'white'}]}>
							<Text style={styles.popularityTitle}>
								收益分享
							</Text>
						</View>
						<View style={styles.separator}/>
						<ScrollView ref={CARDS_LIST} style={styles.scrollViewStyle}
							horizontal={true}
							showsHorizontalScrollIndicator={false}>
						 	{cardItems}
			   		</ScrollView>
						<View style={styles.bigSeparator}/>
						<StockTransactionInfoModal ref='stockTransactionInfoModal' navigator={this.state.navigator}/>
					</View>
				)
			}else{
				return (<View></View>)
			}
	},

	pressCard:function(index){
		if(this.state.rawCardsInfo[index].likes == undefined){
				//special Card like gold and ag
			// Alert.alert('go to ' + this.state.rawCardsInfo[index].stockName);
			this.gotoStockDetalWithID(this.state.rawCardsInfo[index])
		}else{
			var listData = this.state.rawCardsInfo.filter(function(card){
				return card.likes !== undefined;
			})
			//Alert.alert('cardList length = '+listData.length+' selectIndex = '+index);
			this.refs['stockTransactionInfoModal'].showAchievement(listData, index, ()=>{
				this.loadCards();
			}, {showLike: true,})
			//showAchievement: function(cardList, currentIndex, callback, pageSettings) {
			//Alert.alert('cardList length = '+this.state.rawCardsInfo.length+' selectIndex = '+index);

		}
	},

	renderBannar: function(i) {
		return(
			<TouchableOpacity
				activeOpacity = {1.0}
				onPress={() => this.goToBannerPage(i)} key={i}>
				<Image
					style={[styles.image, {height: imageHeight, width: width}]}
					source={{uri: 'file://' + PAGES[i].imgUrl}}/>
			</TouchableOpacity>
		)
	},

	tapFirstTopNews: function(firstNews) {
		var url = NetConstants.TRADEHERO_API.WEBVIEW_TOP_NEWS_PAGE + firstNews.id;
		if(LogicData.getAccountState()){
			url = NetConstants.TRADEHERO_API.WEBVIEW_TOP_NEWS_PAGE_ACTUAL+news.id
		}
		this.gotoWebviewPage(url,
			'每日头条',
			false,
			null,
			null,
			TalkingdataModule.HEADER_SHARE_EVENT);
	},

	tapTopNews: function(url) {
		this.gotoWebviewPage(url,
			'每日头条',
			false,
			null,
			null,
			TalkingdataModule.HEADER_SHARE_EVENT)
	},

	renderOneNews: function(news) {
		var header = news.header
		var url = NetConstants.TRADEHERO_API.WEBVIEW_TOP_NEWS_PAGE+news.id
		if(LogicData.getAccountState()){
			url = NetConstants.TRADEHERO_API.WEBVIEW_TOP_NEWS_PAGE_ACTUAL+news.id
		}
		return(
			<TouchableOpacity style={styles.newsContainer} onPress={() => this.tapTopNews(url)}>
				<View style={[styles.bluePoint,{backgroundColor:ColorConstants.title_blue()}]}/>
				<Text style={styles.newsText}
					ellipsizeMode="tail"
					numberOfLines={1}>
					{header}
				</Text>
			</TouchableOpacity>
		)
	},

	renderTopNews: function() {
		var rowHeight = 60
		var news = []
		var len = this.state.topNews.length;
		var firstNews;
		if (len > 0) {
			for (var i=0; i<len; i++) {
				var news1 = this.state.topNews[i*2%len]
				var news2 = this.state.topNews[(i*2+1)%len]
				news.push(
					<View style={{flex:1}} key={i+100}>
						{this.renderOneNews(news1)}
						{this.renderOneNews(news2)}
					</View>
				)

				firstNews = this.state.topNews[0];
			}
			return (
				<TouchableOpacity onPress={() => this.tapFirstTopNews(firstNews)}>
					<View style={[styles.topnewsContainer, {height: rowHeight}]}>
						<Image style={styles.topnewsImage} source={LogicData.getAccountState()?require('../../images/topnews_actual.png'):require('../../images/topnews.png')}/>
						<View style={styles.topnewsVerticalLine}/>
						<Swiper
							ref="topnewsswiper"
							horizontal={false}
							height={rowHeight}
							loop={true}
							autoplay={true}
							autoplayTimeout={5}
							showsPagination={false}>
							{news}
						</Swiper>
					</View>
				</TouchableOpacity>
			)
		} else {
			return (
				<View style={[styles.topnewsContainer, {height: rowHeight}]}>
					<Image style={styles.topnewsImage} source={LogicData.getAccountState()?require('../../images/topnews_actual.png'):require('../../images/topnews.png')}/>
					<View style={styles.topnewsVerticalLine}/>
				</View>
				// <View></View>
			)
		}
	},

	renderEventItem: function(i){
		var title;
		var description;
		var onPress;
		var image;
		if(i == 1){
			title = "影票来袭";
			description = "每日模拟交易前三名";
			image = movie_image;
			onPress = () => this.gotoMoviePage();
		}else{
			title = "每日签到";
			description = "签到可赚取实盘资金";
			image = check_in_image;
			onPress = () => this.gotoCheckinPage();
		}
		return(
			<TouchableOpacity style={[styles.eventsItemContainer]}
				onPress={onPress}>
				<View style={{flexDirection: 'row', flex:1}}>
					<View style={[styles.eventsTextContainer]}>
						<Text style={styles.eventsTitleText}>
							{title}
						</Text>
						<Text style={styles.eventsDescriptionText}>
							{description}
						</Text>
					</View>
					<Image
						style={[styles.eventsIcon]}
						source={image}/>
					{/* <Image style={[styles.eventsHotIcon]}
						source={hot_image}/> */}
				</View>
			</TouchableOpacity>
		)
	},

	renderEventSeparator: function(){
		return(<View style={styles.eventSeparator}/>);
	},

	renderEventsRow: function(){
		if(LogicData.getAccountState()){
			return(
				<View></View>
			)
		}else{
			return (
				<View style={[styles.eventsRowContainer]}>
					{this.renderEventItem(1)}
					{this.renderEventSeparator()}
					{this.renderEventItem(2)}
				</View>
			)
		}
	},

	renderEventSeparator2: function(){
		if(LogicData.getAccountState()){
			return(
				<View></View>
			)
		}else{
			return (
			<View style={styles.bigSeparator}/>
			)
		}
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

	renderNavBar: function(){
		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={()=>this.pressedNavBar()}
				>
				<NavBar title={this.state.connected ? "首页" : "首页（未连接）"}/>
			</TouchableOpacity>);
	},

	renderBgHint:function(){
		return(
			<View style={styles.bgHint}>
				<Image style = {{width:20,height:20}} source={bg_hint_image}></Image>
				<Text style={{marginTop:5,fontSize:12,color:'#c4c4c4'}}>具有全套FCA牌照，受FCA授权与监管</Text>
			</View>
	 	)
	},

	render: function() {
		var activeDot = <View style={styles.guideActiveDot} />
		var dot = <View style={styles.guideDot} />
		var slides = []
		for (var i = 0; i < PAGES.length; i++) {
			if (PAGES[i].imgUrl !== undefined && PAGES[i].imgUrl !== null) {
				slides.push (
					this.renderBannar(i)
				);
			} else {
				var index = i;
				slides.push (
					<TouchableOpacity
						onPress={() => this.goToBannerPage(index)} key={index}>
						<Image
							style={[styles.image, {height: imageHeight, width: width}]}
							source={BANNERS[index % 2]}/>
					</TouchableOpacity>
				);
			}
		}
		return (
			<View style={{width: width, height: height - UIConstants.TAB_BAR_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER }}>
				{this.renderNavBar()}

				<View style={{width:width,height:height - UIConstants.TAB_BAR_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER - UIConstants.HEADER_HEIGHT}}>
					{this.renderBgHint()}
					<ScrollView >
						<View style={{width: width, height: imageHeight}}>
							<Swiper
							  style={{backgroundColor:'#eaeaea'}}
								ref="bannerswiper"
								height={imageHeight}
								loop={true}
								bounces={true}
								autoplay={true}
								autoplayTimeout={3}
								paginationStyle={{
									bottom: null, top: 12, left: null, right: 10,
								}}
								activeDot={activeDot}
								dot={dot}>
								{slides}
							</Swiper>
						</View>

						{this.renderTopNews()}
						<View style={styles.bigSeparator}/>

						{this.renderEventsRow()}
						{this.renderEventSeparator2()}


						{this.renderPopularityView()}
						<View style={styles.bigSeparator}/>


						{this.renderCards()}

						{this.renderBottomViews()}

					</ScrollView>
				</View>
			</View>

		);
	},
});

var styles = StyleSheet.create({
	image: {
		height: 239,
		resizeMode: Image.resizeMode.stretch,
		backgroundColor:'transparent',
	},
	rowContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	horiLine: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	vertLine: {
		width: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	blockContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		height: 70,
	},
	blockImage: {
		width: 37,
		height: 37,
		alignSelf: 'center',
		marginRight: 10,
	},
	blockTextContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
		marginLeft: 15,
	},
	blockTitleText: {
		color: '#1862df',
		fontSize: 14,
		marginBottom: 10,
	},
	blockBodyContent: {
		color: '#525252',
		fontSize: 11,
		marginTop: 5,
	},
	backgroundImage: {
		flex: 1,
	},
	popularityHeaderContainer:{
		height:40,
		flexDirection: 'row',
		alignItems: 'center',
	},
	popularityRowContainer:{
		height:66,
		flexDirection: 'row',
		alignItems: 'center',
	},
	popularityTitle: {
		flex: 1,
		fontSize: 17,
		marginLeft: 15,
		color: "#3f3f3f",
	},
	more: {
		fontSize: 14,
		color: ColorConstants.MORE_ICON,
		marginRight: 15,
	},
	popularitylist: {
		height:200,
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	popularityRowLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 15,
	},
	popularityRowCenter: {
		flex: 1,
		alignItems: 'center',
	},
	popularityRowRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
	},
	buyTitle: {
		color: ColorConstants.STOCK_RISE_RED,
		fontSize: 12,
		paddingBottom: 2,
	},
	sellTitle: {
		color: ColorConstants.STOCK_DOWN_GREEN,
		fontSize: 12,
		paddingBottom: 2,
	},
	grayBar: {
		height: 8,
		backgroundColor: '#e5e5e5',
		borderRadius: 4,
	},
	redBar: {
		height: 8,
		backgroundColor: ColorConstants.STOCK_RISE_RED,
		borderRadius: 4,
	},
	greenBar: {
		height: 8,
		backgroundColor: ColorConstants.STOCK_DOWN_GREEN,
		borderRadius: 4,
		alignSelf: 'flex-end',
	},
	stockName: {
		fontSize: 14,
		color: "#1862df",
		paddingBottom: 2,
	},
	stockCode: {
		fontSize: 12,
		color: "#525252",
	},
	stockPeople: {
		fontSize: 11,
		color: "#bebebe",
	},
	guideActiveDot: {
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		width: 6,
		height: 6,
		borderRadius: 3,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 20,
	},
	guideDot: {
		backgroundColor:'rgba(0,0,0,.2)',
		width: 6,
		height: 6,
		borderRadius: 3,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 20,
	},

	topnewsContainer:{
		flexDirection: 'row',
		width: width,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	topnewsImage: {
		width: 38,
		height: 40,
		marginLeft: 16,
		marginRight: 14,
	},
	topnewsVerticalLine:{
		width: 0.5,
		height: 50,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	newsContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	bigSeparator: {
		height: 10,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	bluePoint: {
		width: 4,
		height: 4,
		backgroundColor: '#1962dd',
		marginLeft: 10,
		marginRight: 5,
		borderRadius: 2,
	},
	newsText: {
		width: width-100,
		fontSize: 14,
		color: '#333333',
		marginRight: 10,
	},
	eventsRowContainer:{
		flexDirection: 'row',
		height: 80,
		width: width,
		backgroundColor: 'white',
	},
	eventsItemContainer:{
		flex:1,
		justifyContent: 'center',
	},
	eventSeparator: {
		width: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	eventsTextContainer: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft:15,
		flexDirection: 'column',
		flex:1,
		alignSelf:'center',
	},
	eventsTitleText:{
		fontSize: 16,
		color: '#4c4c4c'
	},
	eventsDescriptionText: {
		fontSize: width > 320 ? 11 : 9,	//iOS 5 fix
		marginTop: 7,
		color: '#626262'
	},
	eventsIcon: {
		width: width > 320 ? 46 : 39,	//iOS 5 fix
		height: width > 320 ? 46 : 39,
		alignSelf: 'center',
		marginRight:6,
	},
	eventsHotIcon: {
		top:0,
		right:0,
		position: 'absolute',
		width:27,
		height:27
	},
	scrollViewStyle:{
		height:(width-20)/3 + 100,
		paddingLeft:5,
		paddingRight:5,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:'white'
	},
	scroolItem:{
		width:(width-20)/3,
		flex:1,
		marginRight:5,
	},
	bgHint:{
		width:width,
		height:80,
		position:'absolute',
		alignItems:'center',
		justifyContent:'center',

	},
});

module.exports = HomePage;

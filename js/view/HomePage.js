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
	WebView,
	StatusBar,
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
	require('../../images/bannar_01.jpg'),
	require('../../images/bannar_02.jpg'),
];
const check_in_image = require("../../images/check_in.png")
//const movie_image = require("../../images/movie.png")
const competition_image = require("../../images/mobile_reward.png");
const hot_image = require("../../images/hot.png")
const bg_hint_image = require("../../images/icon_bg_hint.png")

var {height, width} = Dimensions.get('window');
var barWidth = Math.round(width/3)-12

var BANNER_HEIGHT = 428
var BANNER_WIDTH = 750
var imageHeight = BANNER_HEIGHT / BANNER_WIDTH * width

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var bsds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var magicCode = ""
var NO_MAGIC = false
var didTabSelectSubscription = null
var didFocusSubscription = null
var networkConnectionChangedSubscription = null
var accountStateChangedSubscription = null
var lastForceloopTime = 0
var firstLoad = false
const CARDS_LIST = "cardList"
const SCROLL_VIEW = "scrollView"
var accStatus

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
			//attendedMovieEvent: false,
			//winMovieTicket: false,
			isConnected: false,
			unreadMessageCount: 0,
			navBarBackgroundColor: 'rgba(255,255,255,0)'
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
		// StorageModule.loadBanners()
		// 	.then((value) => {
		// 		if (value !== null) {
		// 			this.downloadBannerImages(JSON.parse(value))
		// 			.then(()=>{
		// 				//Make sure the downloading synchronized.
		// 				this.reloadBanner();
		// 			})
		// 		}else{
		// 			this.reloadBanner();
		// 		}
		// 	})
		// 	.done();

		this.loadUnreadMessage();
		this.reloadBanner();
		this.loadHomeData();
		this.loadCards();
	},

	loadUnreadMessage: function(){
		var userData = LogicData.getUserData();
		var login = Object.keys(userData).length !== 0
		if (!login){
			return
		}
		var url = NetConstants.CFD_API.GET_UNREAD_MESSAGE;
		if(LogicData.getAccountState()){
			url = NetConstants.CFD_API.GET_UNREAD_MESSAGE_LIVE
			console.log('live', url );
		}

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				},
				//cache: 'offline',
			},
			function(response) {
				this.setState(
					{
						unreadMessageCount: response,
					}
				)
			}.bind(this),
			(result) => {
				console.log(result.errorMessage)
			}
		);
	},

	resetPage: function(){
		this.setState(this.getInitialState());
		this.refs[SCROLL_VIEW] && this.refs[SCROLL_VIEW].scrollTo({x:0, y:0})
	},

	reloadPage: function(){
		console.log("reloadPage " + LogicData.getTabIndex());
		console.log("MainPage.HOME_PAGE_TAB_INDEX" +  MainPage.HOME_PAGE_TAB_INDEX)
		if(LogicData.getTabIndex() == MainPage.HOME_PAGE_TAB_INDEX){
			var routes = this.props.navigator.getCurrentRoutes();
			if(routes && routes[routes.length-1] &&
					(routes[routes.length-1].name == MainPage.HOME_PAGE_ROUTE
				|| routes[routes.length-1].name == MainPage.LOGIN_ROUTE)){
				this.loadUnreadMessage();
				this.reloadBanner();
				this.loadHomeData();
				this.loadCards();
			}
		}
	},

	reloadBanner: function() {
		var userData = LogicData.getUserData();

		this.refs[CARDS_LIST] && this.refs[CARDS_LIST].scrollTo({x:0})

		var url = NetConstants.CFD_API.GET_HOMEPAGE_BANNER_ALL_API
		if(LogicData.getAccountState()){
			var url = NetConstants.CFD_API.GET_HOMEPAGE_BANNER_API
		}

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				cache: 'offline',
			},
			(responseJson) => {
				console.log(JSON.stringify(responseJson))
				this.downloadBannerImages(responseJson)
				//StorageModule.setBanners(JSON.stringify(responseJson))
			}
		);

		var userId = userData.userId
		// var login = Object.keys(userData).length !== 0
		// if(login){
		// 	var url = NetConstants.CFD_API.GET_MOVIE_RANK;
		// 	url = url.replace("<userId>", userId);
		//
		// 	NetworkModule.fetchTHUrl(
		// 		url,
		// 		{
		// 			method: 'GET',
		// 			headers: {
		// 				'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
		// 				'Content-Type': 'application/json; charset=UTF-8',
		// 			},
		// 		},
		// 		(responseJson) => {
		// 			if(responseJson.rank){
		// 				this.setState({
		// 					attendedMovieEvent: true,
		// 					winMovieTicket: responseJson.rank <= 3,
		// 				})
		// 			}else{
		// 				this.setState({
		// 					attendedMovieEvent: false,
		// 					winMovieTicket: false,
		// 				})
		// 			}
		// 		}
		// 	);
		// }
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

	goToMailPage: function(){
		this.props.navigator.push({
			name: MainPage.MY_MESSAGES_ROUTE,
			onPopToRoute: this.reloadMeData,
		});
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
		var isConnected = WebSocketModule.isConnected();
		this.setState({
			connected: isConnected
		})
		firstLoad = true;
		didFocusSubscription = this.props.navigator.navigationContext.addListener('didfocus', this.onDidFocus);
		didTabSelectSubscription = EventCenter.getEventEmitter().
		addListener(EventConst.HOME_TAB_RESS_EVENT, this.onTabChanged);
		networkConnectionChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.NETWORK_CONNECTION_CHANGED, () => {
			this.onConnectionStateChanged();
		});
		accountStateChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_STATE_CHANGE, this.resetPage);
		//
		// this.onConnectionStateChanged();
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
		didFocusSubscription && didFocusSubscription.remove();
		networkConnectionChangedSubscription && networkConnectionChangedSubscription.remove();
		accountStateChangedSubscription && accountStateChangedSubscription.remove();
	},

	onConnectionStateChanged: function(){
		var isConnected = WebSocketModule.isConnected();
		this.setState({
			connected: isConnected
		})
		console.log("onConnectionStateChanged reloadPage" + isConnected);
		this.reloadPage();
	},

	onTabChanged: function(){
		LogicData.setTabIndex(MainPage.HOME_PAGE_TAB_INDEX);

		console.log("onTabChanged reloadPage");
		this.reloadPage();
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
		var filePath = images[index].imgUrl
		var type = images[index].bannerType
		// RN will cache the image.
		// FSModule.getBannerImageLocalPath(imagePath)
		// 	.then(filePath => {
		if (filePath !== null) {
			while(PAGES.length <= index) {
				PAGES.push({name: 'PAGE' + PAGES.length})
			}
			PAGES[index].id = id
			PAGES[index].imgUrl = filePath
			PAGES[index].url = targetUrl
			PAGES[index].header = header
			PAGES[index].digest = digest
			PAGES[index].type = type
			this.setState({
				dataSource: ds.cloneWithRows(PAGES)
			})
			this.downloadOneBannerImage(images, index + 1, resolve)
		}
	},

	goToBannerPage: function(i) {
		var trackingData = {};
		trackingData[TalkingdataModule.KEY_BANNER_PAGE] = PAGES[i].header;
		TalkingdataModule.trackEvent(TalkingdataModule.BANNER_EVENT, "", trackingData)


		if(PAGES[i].type == 1){//根据type==1开通实盘
			this.gotoCreateLiveAccount()
		}else if(PAGES[i].type == 2){//根据type==2邀请好友
			this.gotoInviteFriends()
		}else{//默认是跳 ID 对应的网页
			this.gotoWebviewPage(PAGES[i].url,
				'推荐',
				PAGES[i].id,
				PAGES[i].header,
				PAGES[i].digest,
				TalkingdataModule.BANNER_SHARE_EVENT)
		}
	},

	gotoWebviewPage2: function(targetUrl, title, hideNavBar) {
		this.props.navigator.push(this.getWebViewPageScene(targetUrl, title, hideNavBar));
	},

	getWebViewPageScene: function(targetUrl, title, hideNavBar) {
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}

		if (targetUrl.indexOf('?') !== -1) {
			targetUrl = targetUrl + '&userId=' + userId
		} else {
			targetUrl = targetUrl + '?userId=' + userId
		}

		return {
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
			isShowNav: hideNavBar ? false : true,
		}
	},

	gotoInviteFriends:function(){
		console.log("跳转至邀请好友");
		var url = LogicData.getAccountState()?NetConstants.TRADEHERO_API.NEW_USER_INVITATION_ACTUAL:NetConstants.TRADEHERO_API.NEW_USER_INVITATION;
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			this.gotoWebviewPage2(url, '邀请好友', true);
		}else{
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				getNextRoute: ()=> this.getWebViewPageScene(url, '邀请好友', true),
			});
		}
	},

	gotoCreateLiveAccount:function(){
		console.log("跳转至开通实盘");
		var url = LogicData.getAccountState()?NetConstants.TRADEHERO_API.NEW_USER_INVITATION_ACTUAL:NetConstants.TRADEHERO_API.NEW_USER_INVITATION;
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			this.gotoAccountStateExce()
		}else{
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				// getNextRoute: ()=> this.gotoAccountStateExce(),
			});
		}
	},

	////0未注册 1已注册 2审核中 3审核失败
	gotoAccountStateExce:function(){
		var meData = LogicData.getMeData();
		console.log('提示：','liveAccStatus = '+meData.liveAccStatus + ', liveAccRejReason = '+ meData.liveAccRejReason)
	  accStatus = meData.liveAccStatus;

		if(accStatus == 0){
			this.gotoOpenLiveAccount();
		}else if(accStatus == 1){//已注册，去登录
			Alert.alert('温馨提示','您的实盘账户已开通');
		}else if(accStatus == 2){
			Alert.alert('温馨提示','您的实盘开户正在审核中');
		}else if(accStatus == 3){
			this.gotoOpenLiveAccount();
		}else{

		}
	},

	gotoOpenLiveAccount:function(){
		var meData = LogicData.getMeData();
	  console.log("showOARoute medata: " + JSON.stringify(meData));

		var OARoute = {
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 0,
			// onPop: this.reloadMeData,
		};

	  if(!meData.phone){
			this.props.navigator.push({
				name: MainPage.LOGIN_ROUTE,
				nextRoute: OARoute,
				isMobileBinding: true,
			});
		}else{
				this.props.navigator.push(OARoute);
		}
	},

	// getShareMovieEventInfo: function(){
	// 	var info = {};
	// 	if(!this.state.attendedMovieEvent){
	// 		info.shareUrl = NetConstants.TRADEHERO_API.SHARE_MOVIE_NOT_ATTENDED_TICKET_URL;
	// 		info.message = "模拟投资比收益，排名前三，每天都送电影票！";
	// 	}else{
	// 		if(this.state.winMovieTicket){
	// 			info.shareUrl = NetConstants.TRADEHERO_API.SHARE_MOVIE_WIN_TICKET_URL;
	// 			info.message = "朕的投资收益率排名前3，快快赞我！";
	// 		}else{
	// 			info.shareUrl = NetConstants.TRADEHERO_API.SHARE_MOVIE_NOT_WIN_TICKET_URL;
	// 			info.message = "俺的模拟投资战绩不佳，求大侠支招，助我拿到电影票！";
	// 		}
	// 	}
	// 	info.title = "一大波影券来啦";
	// 	return info;
	// },

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

		// if(!shareUrl && targetUrl.startsWith(NetConstants.TRADEHERO_API.MOVIE_WIN_TICKET_URL)){
		// 	var shareInfo = this.getShareMovieEventInfo();
		// 	shareUrl = shareInfo.shareUrl;
		// 	shareDescription = shareInfo.message;
		// 	shareTitle = shareInfo.title;
		// }

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

	gotoCompetitionPage: function(){
		TalkingdataModule.trackEvent(TalkingdataModule.MOVIE_ACTIVITY_EVENT);

		var url = NetConstants.TRADEHERO_API.COMPETITION_PAGE_URL;
		var userData = LogicData.getUserData();
		var userId = userData.userId;
		if(userId == undefined){
			userId = 0;
		}
		url = url + '?userId=' + userId;

		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: url,
			title: "比收益",
			isShowNav: false,
			backFunction: this.forceloopSwipers,
		});
	},

	// gotoMoviePage: function(){
	// 	TalkingdataModule.trackEvent(TalkingdataModule.MOVIE_ACTIVITY_EVENT);
	//
	// 	var url = NetConstants.TRADEHERO_API.MOVIE_WIN_TICKET_URL;
	// 	var userData = LogicData.getUserData();
	// 	var userId = userData.userId;
	// 	if(userId == undefined){
	// 		userId = 0;
	// 	}
	// 	url = url + '?userId=' + userId;
	//
	// 	var info = this.getShareMovieEventInfo();
	// 	this.gotoWebviewPage(url, '推荐',
	// 		null,
	// 		info.title,
	// 		info.message,
	// 		TalkingdataModule.MOVIE_SHARE_EVENT,
	// 		info.shareUrl);
	// },

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

//	payDemoTest:function(index){
//		var userData = LogicData.getUserData()
//		NetworkModule.fetchTHUrl(
//				NetConstants.CFD_API.GET_PAY_DEMO_TEST_ID,
//			{
//				method: 'GET',
//				headers: {
//					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
//					'Content-Type': 'application/json; charset=UTF-8',
//				},
//			},
//			(responseJson) => {
//				 console.log('responseJson = ' + responseJson + 'index = ' + index);
//
//				 if (Platform.OS === 'ios') {
//					 var url =            'http://cn.tradehero.mobi/test_form/test_form_Ayondo-wechat.html';
//					 if(index == 1){url = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-alipay.html';}
//					 if(index == 2){url = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-quick.html';}
//					 if(index == 3){url = 'http://cn.tradehero.mobi/test_form/test_form_Ayondo-wechat.html';}
//					 this.props.navigator.push({
//			 			name: MainPage.PAYMENT_PAGE,
//			 			url: url,
//			 			title: responseJson,
//			 			backFunction: this.forceloopSwipers,
//			 		});
//				 }else{
//					 var payMethod;
//					 if(index == 1){payMethod = 'alipay'}
//					 if(index == 2){payMethod = 'quick'}
//					 if(index == 3){payMethod = 'wechat'}
//					 this.props.navigator.push({
//			 			name: MainPage.PAYMENT_PAGE,
//			 			url: 'http://www.test.paytest/'+payMethod,
//			 			title: responseJson,
//			 			backFunction: this.forceloopSwipers,
//			 		});
//				 }
//			}
//		);
//	},

//	magicButtonPress: function(index) {
//
//		//Pay Demo Test
//
//		this.payDemoTest(index);
//		return;
//
//		if (NO_MAGIC) {
//			return
//		}
//
//		// magicCode += ""+index
//
//		// if(this.endsWith(magicCode, "12341234")){
//		// 	// open account
//		// 	this.props.navigator.push({
//		// 		name: MainPage.OPEN_ACCOUNT_ROUTE,
//		// 		step: 0,
//		// 	});
//		// }
//		// else if(this.endsWith(magicCode, "41414141")) {
//		// 	this.logoutPress()
//		// }
//		var targetUrl = 'http://cn.tradehero.mobi/TH_CFD_WEB/detail0'+index+'.html'
//		if(LogicData.getAccountState()){
//			targetUrl = 'http://cn.tradehero.mobi/TH_CFD_SP/detail0'+index+'.html'
//		}
//		this.props.navigator.push({
//			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
//			url: targetUrl,
//			title: '',
//			backFunction: this.forceloopSwipers,
//		});
//	},

	gotoNewUserGuide:function(){
		var targetUrl = LogicData.getAccountState()?NetConstants.TRADEHERO_API.WEBVIEW_URL_SCHOOL_ACTUAL:NetConstants.TRADEHERO_API.WEBVIEW_URL_SCHOOL;
		console.log('targetUrl : ' + targetUrl);
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: '新手学堂',
			isShowNav: false ,
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
			<View style={{height:249, backgroundColor:'white'}}>
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
					renderSeparator={this.renderSeparator}
					removeClippedSubviews={false}/>

				<View style={styles.bigSeparator}/>
			</View>
			)
		}
	},

//	renderIntroduceView: function(index, head, body, image) {
//		return (
//			<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(index)}>
//				<View style={styles.blockContainer}>
//					<View style={styles.blockTextContainer}>
//						<Text style={[styles.blockTitleText],{color:LogicData.getAccountState()?ColorConstants.TITLE_DARK_BLUE:'#1862df'}}>
//							{head}
//						</Text>
//						<Text style={styles.blockBodyContent}>
//							{body}
//						</Text>
//					</View>
//					<Image style={styles.blockImage} source={image}/>
//				</View>
//			</TouchableOpacity>
//		)
//	},


//	renderBottomViews: function() {
//		return (
//			<View style={{flex:1}}>
//				<View style={styles.rowContainer}>
//					{this.renderIntroduceView(1, '涨跌双盈','买对趋势就是盈利',LogicData.getAccountState()?require('../../images/updown_actual.png'):require('../../images/updown.png'))}
//					<View style={styles.vertLine}/>
//					{this.renderIntroduceView(2, '以小搏大','本金加上杠杆交易',LogicData.getAccountState()?require('../../images/small_big_actual.png'):require('../../images/smallbig.png'))}
//				</View>
//				<View style={styles.horiLine}/>
//				<View style={styles.rowContainer}>
//					{this.renderIntroduceView(3, '实时行情','免费实时全球行情',LogicData.getAccountState()?require('../../images/markets_actual.png'):require('../../images/markets.png'))}
//					<View style={styles.vertLine}/>
//					{this.renderIntroduceView(4, '体验简单','极简交易三步骤',LogicData.getAccountState()?require('../../images/advantage_actual.png'):require('../../images/advantage.png'))}
//				</View>
//			</View>
//		)
//	},


	renderNewUser:function(){
		return(
			<TouchableOpacity style = {[styles.newUser, {width:width}]} activeOpacity={0.5} onPress={()=>this.gotoNewUserGuide()}>
				<View style={{padding:20}}>
					<View style={{flexDirection:'row'}}>
						<Text style={{fontSize:19,color:'#4b4b4b'}}>新手学堂</Text>
						<Text style={{fontSize:19,color:'#ff7500',marginLeft:5}}>场景教学</Text>
     			</View>
					<Text style={{marginTop:12,fontSize:13,color:'#6a6a6a'}}>一站式尽览盈交易赚钱秘诀</Text>
	   		</View>
				<View style={styles.imageContainer}>
					<Image style = {styles.newUserImage} source={require('../../images/user_guide.png')}></Image>
				</View>
   		</TouchableOpacity>
		)
	},
	renderCards: function(){

			var cardItems = this.state.rawCardsInfo.map(
			(card, i) =>
				<TouchableOpacity onPress={() => this.pressCard(i)} key={i}>
					<View style={[styles.scrollItem,{width:Math.round((width-20)/3)}]}>
						<Reward card={card} type={1} divideInLine={3} id={card}></Reward>
					</View>
				</TouchableOpacity>
			)

			if(cardItems!==undefined && cardItems.length > 0 && LogicData.getAccountState()){
				return(
					<View>
						<View style={[styles.popularityHeaderContainer,{backgroundColor:'white'}]}>
							<Text style={styles.popularityTitle}>
								收益分享
							</Text>
						</View>
						<View style={styles.separator}/>
						<ScrollView ref={CARDS_LIST} style={[styles.scrollViewStyle,{height:Math.round((width-20)/3)+100}]}
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
				activeOpacity = {0.8}
				onPress={() => this.goToBannerPage(i)} key={i}>
				<Image
					style={[styles.image, {height: imageHeight, width: width}]}
					source={{uri: PAGES[i].imgUrl}}/>
			</TouchableOpacity>
		)
	},

	tapFirstTopNews: function(firstNews) {
		var url = NetConstants.TRADEHERO_API.WEBVIEW_TOP_NEWS_PAGE + firstNews.id;
		if(LogicData.getAccountState()){
			url = NetConstants.TRADEHERO_API.WEBVIEW_TOP_NEWS_PAGE_ACTUAL+firstNews.id
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
				<Text style={[styles.newsText,{width: width-30}]}
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
					<View style={[styles.topnewsContainer, {height: rowHeight, width: width}]}>
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
				null
				//<View style={[styles.topnewsContainer, {height: rowHeight}]}>
				//</View>
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
			title = "话费来袭";
			description = "每日模拟交易前三名";
			image = competition_image;
			onPress = () => this.gotoCompetitionPage();
		}else{
			title = "每日签到";
			description = "签到可赚取实盘资金";
			image = check_in_image;
			onPress = () => this.gotoCheckinPage();
		}
		var fontSize = width > 320 ? 11 : 9;	//iOS 5 fix
		var imageWidth = width > 320 ? 46 : 39;	//iOS 5 fix
		var imageHeight = imageWidth;
		return(
			<TouchableOpacity style={[styles.eventsItemContainer]}
				onPress={onPress}>
				<View style={{flexDirection: 'row', flex:1}}>
					<View style={[styles.eventsTextContainer]}>
						<Text style={styles.eventsTitleText}>
							{title}
						</Text>
						<Text style={[styles.eventsDescriptionText, {fontSize:fontSize}]}>
							{description}
						</Text>
					</View>
					<Image
						style={[styles.eventsIcon, {width:imageWidth, height:imageHeight}]}
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
				<View style={[styles.eventsRowContainer, {width: width}]}>
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

	renderUnreadCount: function(){
		if(this.state.unreadMessageCount > 0){
			var text = this.state.unreadMessageCount > 9 ? "9+" : "" + this.state.unreadMessageCount;
			return (
				<View style={styles.unreadMessageView}>
					<Text style={styles.unreadMessageText}>
						{text}
					</Text>
				</View>
			)
		}else{
			return null;
		}
	},

	renderMessageIcon: function(){
		var userData = LogicData.getUserData()
		var login = Object.keys(userData).length !== 0
		if(login){
			return (
				<TouchableOpacity onPress={()=>this.goToMailPage()}
					style={styles.navBarRightView}>
					<Image
							style={[styles.navBarIcon, styles.navBarIconRight]}
							source={require('../../images/icon_my_message.png')}/>
					{this.renderUnreadCount()}
				</TouchableOpacity>
			);
		}
		return null;
	},

	renderCheckInView: function(){
		if(LogicData.getAccountState()){
			return (
				<TouchableOpacity onPress={()=>this.gotoCheckinPage()}
					style={styles.navBarLeftView}>
					<Image
							style={[styles.navBarIcon, styles.navBarIconLeft]}
							source={require('../../images/icon_day_sign_live.png')}/>
				</TouchableOpacity>
			);
		}
		return null
	},

	renderNavBar: function(){
		return(
			<TouchableOpacity
				activeOpacity={1}
				onPress={()=>this.pressedNavBar()}
				style={{position:'absolute', top:0, left: 0, right: width, width:width}}
				>
				<NavBar title={this.state.connected ? "首页" : "首页（未连接）"}
					viewOnRight={this.renderMessageIcon()}
					viewOnLeft={this.renderCheckInView()}
					backgroundColor={this.state.navBarBackgroundColor}
					navigator={this.props.navigator}/>
			</TouchableOpacity>
		)
	},

	renderBgHint:function(){
		return(
			<View style={[styles.bgHint, {width: width}]}>
				<Image style = {{width:20,height:20}} source={bg_hint_image}></Image>
				<Text style={{marginTop:5,fontSize:12,color:'#c4c4c4'}}>具有全套FCA牌照，受FCA授权与监管</Text>
			</View>
	 	)
	},

	renderLoginWebView:function(){
		// if(firstLoad){
			console.log("firstLoad true renderLoginWebView");
			firstLoad = false
			var url = 'https://tradehub.net/live/auth?response_type=token&client_id=62d275a211&redirect_uri=https://api.typhoontechnology.hk/api/live/oauth&state=1'
			return(
				<WebView
					style = {{height:0}}
					source={{uri: url}}
				/>
			)
		// }else{
		// 	console.log("firstLoad false not renderLoginWebView");
		// 	return null;
		// }

	},

	hexToRgb: function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},

	onScroll: function(event){
		console.log("event " + event.nativeEvent.contentOffset.y)
		var rgb = this.hexToRgb(ColorConstants.title_blue())
		var alpha = 0;
		var height = imageHeight - 64;
		if(event.nativeEvent.contentOffset.y > height){
			alpha = 1;
		}else{
			alpha = event.nativeEvent.contentOffset.y / height
		}
		this.setState({navBarBackgroundColor: 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+alpha+')'})
	},

	render: function() {
		height = Dimensions.get('window').height;
		width = Dimensions.get('window').width;
		barWidth = Math.round(width/3)-12
		imageHeight = BANNER_HEIGHT / BANNER_WIDTH * width;
		var activeDot = <View style={styles.guideActiveDot} />
		var dot = <View style={styles.guideDot} />
		var slides = []
		for (var i = 0; i < PAGES.length; i++) {
			if (PAGES[i].imgUrl !== undefined && PAGES[i].imgUrl !== null) {//加载到了真实的banner位数据
				slides.push (
					this.renderBannar(i)
				);
			} else {//默认的2个banner位置,在没有加载到真实数据之前.
				var index = i;
				slides.push (
					<TouchableOpacity activeOpacity = {0.8}
						onPress={() => this.goToBannerPage(index)} key={index}>
						<Image
							style={[styles.image, {height: imageHeight, width: width}]}
							source={BANNERS[index % 2]}/>
					</TouchableOpacity>
				);
			}
		}
		return (
			<View style={{width: width, flex: 1, paddingBottom: UIConstants.TAB_BAR_HEIGHT}}>
				<View style={{width:width, flex: 1}}>
					{this.renderBgHint()}
					<ScrollView ref={SCROLL_VIEW}
						onScroll={this.onScroll}
						scrollEventThrottle={8} >
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
									bottom: 0, top: null, left: 12, right: 12,
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


						{this.renderCards()}

						{/* {this.renderBottomViews()} */}

						{this.renderNewUser()}

						{this.renderLoginWebView()}

					</ScrollView>
				</View>
				{this.renderNavBar()}
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
		marginLeft: 15,
		marginRight: 5,
		borderRadius: 2,
	},
	newsText: {
		fontSize: 14,
		color: '#333333',
		marginRight: 10,
	},
	eventsRowContainer:{
		flexDirection: 'row',
		height: 80,
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
		marginTop: 7,
		color: '#626262'
	},
	eventsIcon: {
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
		paddingLeft:5,
		paddingRight:5,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:'white'
	},
	scrollItem:{
		flex:1,
		marginRight:5,
	},
	bgHint:{
		marginTop:36,
		height:80,
		position:'absolute',
		alignItems:'center',
		justifyContent:'center',
	},
	newUser:{
		flexDirection:'row',
		backgroundColor:'white',
		marginBottom:10,
		height:90,

	},

	imageContainer:{
		flex:1,
		justifyContent:'center',
		alignItems:'flex-end',
	},

	newUserImage:{
		height:62,
		width:100,
		marginRight:20,
	},

	unreadMessageView:{
		backgroundColor:'#ff3333',
		position:'absolute',
		top:0,
		right:13,
		width:20,
		height:14,
		alignItems:'center',
		justifyContent:'center',
		borderRadius: 6,
	},

	unreadMessageText:{
		color:'white',
		fontSize:10,
	},

	navBarIcon: {
		width: 21,
		height: 21,
		resizeMode: Image.resizeMode.contain,
	},

	navBarIconRight: {
		marginRight: 20,
	},

	navBarIconLeft: {
		marginLeft: 20,
	},

	navBarRightView:{
		flex:1,
		height: 30,
		alignItems:"flex-end",
		justifyContent:"center",
	},

	navBarLeftView:{
		flex:1,
		height: 30,
		alignItems:"flex-start",
		justifyContent:"center",
	},
});

module.exports = HomePage;

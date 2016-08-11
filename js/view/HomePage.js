'use strict';

import React from 'react';
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
var {EventCenter, EventConst} = require('../EventCenter')


var RECOMMAND_URL = NetConstants.WEBVIEW_RECOMMAND_PAGE
var PAGES = [
	{name: 'Page0', url: RECOMMAND_URL + "1"},
	{name: 'Page1', url: RECOMMAND_URL + "1"},
];
var BANNERS = [
	require('../../images/bannar01.png'),
	require('../../images/bannar02.png'),
];
var {height, width} = Dimensions.get('window');
var barWidth = Math.round(width/3)-12
var imageHeight = 300 / 750 * width

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var bsds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var magicCode = ""
var NO_MAGIC = false
var didTabSelectSubscription = null

var HomePage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(PAGES),
			popularityInfo: bsds.cloneWithRows([]),
			topNews: [], 
		};
	},

	componentWillMount: function() {
		StorageModule.loadBanners()
			.then((value) => {
				if (value !== null) {
					this.downloadBannerImages(JSON.parse(value))
				}
			})
			.done()

		NetworkModule.fetchTHUrl(
			NetConstants.GET_HOMEPAGE_BANNER_API,
			{
				method: 'GET',
			},
			(responseJson) => {
				this.downloadBannerImages(responseJson)
				StorageModule.setBanners(JSON.stringify(responseJson))
			},
			(errorMessage) => {
				// Ignore it.
			}
		);
		this.loadHomeData()
	},

	loadHomeData: function() {
		NetworkModule.fetchTHUrl(
			NetConstants.GET_POPULARITY_API,
			{
				method: 'GET',
			},
			(responseJson) => {
				var listdata = responseJson
				if (listdata.length > 3) {
					listdata = listdata.slice(0,3)
				}
				this.setState({
					popularityInfo: bsds.cloneWithRows(listdata)
				})
			},
			(errorMessage) => {
				Alert.alert('', errorMessage);
			}
		);
		
		NetworkModule.fetchTHUrl(
			NetConstants.GET_TOP_NEWS_TOP10_API,
			{
				method: 'GET',
			},
			(responseJson) => {
				this.setState({
					topNews: responseJson,
				})
			},
			(errorMessage) => {
				Alert.alert('', errorMessage);
			}
		);
	},

	componentDidMount: function() {
		didTabSelectSubscription = EventCenter.getEventEmitter().
			addListener(EventConst.HOME_TAB_RESS_EVENT, this.onTabChanged);
	},

	componentWillUnmount: function() {
		didTabSelectSubscription && didTabSelectSubscription.remove();
	},

	onTabChanged: function(){
		this.loadHomeData()
	},

	downloadBannerImages: function(images) {
		this.downloadOneBannerImage(images, 0)
	},

	downloadOneBannerImage: function(images, index) {
		if (index >= images.length) {
			return
		}
		var imagePath = images[index].imgUrl
		var targetUrl = images[index].url
		if (targetUrl == '') {
			targetUrl = RECOMMAND_URL + images[index].id
		}

		FSModule.getBannerImageLocalPath(imagePath)
			.then(filePath => {
				if (filePath !== null) {
					while(PAGES.length <= index) {
						PAGES.push({name: 'PAGE' + PAGES.length})
					}
					PAGES[index].imgUrl = filePath
					PAGES[index].url = targetUrl
					this.setState({
						dataSource: ds.cloneWithRows(PAGES)
					})
					this.downloadOneBannerImage(images, index + 1)
				} else {
					FSModule.downloadBannerImage(imagePath, (filePath) => {
						if (filePath !== null) {
							while(PAGES.length <= index) {
								PAGES.push({name: 'PAGE' + PAGES.length})
							}
							PAGES[index].imgUrl = filePath
							PAGES[index].url = targetUrl
							this.setState({
								dataSource: ds.cloneWithRows(PAGES)
							})
						}
						this.downloadOneBannerImage(images, index + 1)
					})
				}
			})
	},

	gotoWebviewPage: function(targetUrl, title) {
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
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
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: '',
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
			stockRowData: rowData
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

		return (
			<TouchableOpacity style={styles.popularityRowContainer} onPress={()=>this.gotoStockDetail(rowData)}>
				<View style={styles.popularityRowLeft}>
					<Text style={styles.buyTitle}>买涨 {percent*100}%</Text>
					<View style={[styles.grayBar, {width:barWidth}]}>
						<View style={[styles.redBar, {width:buyWidth}]}/>
					</View>
				</View>
				<View style={styles.popularityRowCenter}>
					<Text style={styles.stockName}>{stockName}</Text>
					<Text style={styles.stockCode}>{stockSymbol}</Text>
					<Text style={styles.stockPeople}>{peopleNum}人参与</Text>
				</View>
				<View style={styles.popularityRowRight}>
					<Text style={styles.sellTitle}>买跌 {100-percent*100}%</Text>
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
		});
	},

	renderPopularityView: function() {
		return (
		<View style={{height:241, backgroundColor:'white'}}>
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
	},

	renderIntroduceView: function(index, head, body, image) {
		return (
			<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(index)}>
				<View style={styles.blockContainer}>
					<View style={styles.blockTextContainer}>
						<Text style={styles.blockTitleText}>
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
					{this.renderIntroduceView(1, '涨跌双盈','买对趋势就是盈利',require('../../images/updown.png'))}
					<View style={styles.vertLine}/>
					{this.renderIntroduceView(2, '以小搏大','本金加上杠杆交易',require('../../images/smallbig.png'))}
				</View>
				<View style={styles.horiLine}/>
				<View style={styles.rowContainer}>
					{this.renderIntroduceView(3, '实时行情','免费实时全球行情',require('../../images/markets.png'))}
					<View style={styles.vertLine}/>
					{this.renderIntroduceView(4, '体验简单','急简交易三步骤',require('../../images/advantage.png'))}
				</View>
			</View>
		)
	},

	renderBannar: function(i) {
		return(
			<TouchableOpacity
				activeOpacity = {1.0}
				onPress={() =>this.gotoWebviewPage(PAGES[i].url, '推荐')} key={i}>
				<Image
					style={[styles.image, {height: imageHeight, width: width}]}
					source={{uri: 'file://' + PAGES[i].imgUrl}}/>
			</TouchableOpacity>
		)
	},

	renderOneNews: function(news) {
		var header = news.header
		var url = NetConstants.WEBVIEW_TOP_NEWS_PAGE+news.id
		return(
			<TouchableOpacity style={styles.newsContainer} onPress={() =>this.gotoWebviewPage(url, '每日头条')}>
				<View style={styles.bluePoint}/>
				<Text>{header}</Text>
			</TouchableOpacity>
		)
	},

	renderTopNews: function() {
		var rowHeight = 60
		var news = []
		var len = this.state.topNews.length
		var tlen = len%2===0 ? len : len*2
		for (var i=0; i<len; i++) {
			var news1 = this.state.topNews[i*2%len]
			var news2 = this.state.topNews[(i*2+1)%len]
			news.push(
				<View style={{flex:1}} key={i+100}>
					{this.renderOneNews(news1)}
					{this.renderOneNews(news2)}
				</View>
			)
		}
		return (
			<View style={[styles.topnewsContainer, {height: rowHeight}]}>
				<Image style={styles.topnewsImage} source={require('../../images/topnews.png')}/>
				<View style={styles.topnewsVerticalLine}/>
				<Swiper
					horizontal={false}
					height={rowHeight}
					loop={true}
					autoplay={true}
					autoplayTimeout={5}
					showsPagination={false}>
					{news}
				</Swiper>
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
				slides.push (
					<TouchableOpacity
						onPress={() => this.gotoWebviewPage(targetUrl, '推荐')} key={i}>
						<Image
							style={[styles.image, {height: imageHeight, width: width}]}
							source={BANNERS[i % 2]}/>
					</TouchableOpacity>
				);
			}
		}
		return (
			<View style={{width: width, height: height - UIConstants.TAB_BAR_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER}}>
				<NavBar title="首页"/>
				<ScrollView>
					<View style={{width: width, height: imageHeight}}>
						<Swiper
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

					{this.renderPopularityView()}
					<View style={styles.bigSeparator}/>

					{this.renderBottomViews()}
				</ScrollView>
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
		height: 1,
		backgroundColor: '#efeff4',
	},
	vertLine: {
		width: 1,
		backgroundColor: '#efeff4',
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
		width: 36,
		height: 36,
		alignSelf: 'center',
		marginRight: 10,
	},
	blockTextContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
		marginLeft: 12,
	},
	blockTitleText: {
		color: '#1862df',
		fontSize: 14,
		marginBottom: 10,
	},
	blockBodyContent: {
		color: '#525252',
		fontSize: 11,
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
		marginLeft: 12,
		color: "#3f3f3f",
		alignItems: 'flex-start',
	},
	more: {
		flex: 1,
		fontSize: 14,
		color: "#9f9f9f",
		alignItems: 'flex-end',
		marginRight: 12,
	},
	popularitylist: {
		height:200,
	},
	separator: {
		height: 1,
		backgroundColor: '#efeff4',
	},
	popularityRowLeft: {
		flex: 1,
		alignItems: 'flex-start',
		marginLeft: 12,
	},
	popularityRowCenter: {
		flex: 1,
		alignItems: 'center',
	},
	popularityRowRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 12,
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
		marginLeft: 22,
		marginRight: 14,
	},
	topnewsVerticalLine:{
		width: 1,
		height: 50,
		backgroundColor: '#efeff4',
	},
	newsContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	bigSeparator: {
		height: 10,
		backgroundColor: '#efeff4',
	},
	bluePoint: {
		width: 4,
		height: 4,
		backgroundColor: '#1962dd',
		marginLeft: 10,
		marginRight: 5,
	},
	newsText: {
		fontSize: 14,
		color: '#333333',
	}
});

module.exports = HomePage;

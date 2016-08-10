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

var RECOMMAND_URL = 'http://cn.tradehero.mobi/TH_CFD_WEB/detailslider.php?id='
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
var imageHeight = 478 / 750 * width

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var bsds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var magicCode = ""
var NO_MAGIC = false

var HomePage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(PAGES),
			popularityInfo: bsds.cloneWithRows([]),
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
		)
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

	gotoRecommandPage: function(targetUrl) {
		this.props.navigator.push({
			name: MainPage.HOMEPAGE_RECOMMAND_ROUTE,
			url: targetUrl,
		});
	},

	endsWith: function(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},

	magicButtonPress: function(index) {
		if (NO_MAGIC) {
			return
		}
		magicCode += ""+index

		if(this.endsWith(magicCode, "12341234")){
			// open account
			this.props.navigator.push({
				name: MainPage.OPEN_ACCOUNT_ROUTE,
				step: 0,
			});
		}
		else if(this.endsWith(magicCode, "41414141")) {
			this.logoutPress()
		}
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
			<View style={styles.popularityRowContainer}>
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
			</View>)
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

	renderBottomViews: function() {
		return (
			<View style={{flex:1}}>
				<View style={styles.rowContainer}>
					<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(1)}>
					<View style={styles.blockContainer}>
						<Text style={styles.blockTitleText}>
							涨跌双盈
						</Text>
						<Image style={styles.blockImage} source={require('../../images/updown.png')}/>
					</View>
					</TouchableOpacity>
					<View style={styles.vertLine}/>
					<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(2)}>
					<View style={styles.blockContainer}>
						<Text style={styles.blockTitleText}>
							以小搏大
						</Text>
						<Image style={styles.blockImage} source={require('../../images/smallbig.png')}/>
					</View>
					</TouchableOpacity>
				</View>
				<View style={styles.horiLine}/>
				<View style={styles.rowContainer}>
					<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(3)}>
					<View style={styles.blockContainer}>
						<Text style={styles.blockTitleText}>
							实时行情
						</Text>
						<Image style={styles.blockImage} source={require('../../images/markets.png')}/>
					</View>
					</TouchableOpacity>
					<View style={styles.vertLine}/>
					<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={()=>this.magicButtonPress(4)}>
					<View style={styles.blockContainer}>
						<Text style={styles.blockTitleText}>
							体验简单
						</Text>
						<Image style={styles.blockImage} source={require('../../images/advantage.png')}/>
					</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	},

	renderBannar: function(i) {
		return(
			<TouchableOpacity
				activeOpacity = {1.0}
				onPress={() =>this.gotoRecommandPage(PAGES[i].url)} key={i}>
				<Image
					style={[styles.image, {height: imageHeight, width: width}]}
					source={{uri: 'file://' + PAGES[i].imgUrl}}/>
			</TouchableOpacity>
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
						onPress={() => this.gotoRecommandPage(targetUrl)} key={i}>
						<Image
							style={[styles.image, {height: imageHeight, width: width}]}
							source={BANNERS[i % 2]}/>
					</TouchableOpacity>
				);
			}
		}
		return (
			<View style={{width: width, height: height - UIConstants.TAB_BAR_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER}}>

				<View style={{width: width, height: imageHeight}}>
					<Swiper
						height={imageHeight}
						loop={true}
						bounces={true}
						autoplay={true}
						autoplayTimeout={3}
						paginationStyle={{
							bottom: null, top: 23, left: null, right: 10,
						}}
						activeDot={activeDot}
						dot={dot}>
						{slides}
					</Swiper>
				</View>

				{this.renderPopularityView()}
				{this.renderBottomViews()}
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
		backgroundColor: '#268dff',
	},
	vertLine: {
		width: 1,
		backgroundColor: '#268dff',
	},
	blockContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0079ff',
	},
	blockImage: {
		width: 39,
		height: 39,
		marginBottom: 15,
	},
	blockTitleText: {
		color: '#ffe400',
		fontSize: 22,
		marginBottom: 10,
	},
	blockTitleContent: {
		color: '#dde8ff',
		fontSize: 12,
		textAlign: 'center',
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
});

module.exports = HomePage;

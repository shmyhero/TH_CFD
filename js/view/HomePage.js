'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Platform,
} = React;

var ViewPager = require('react-native-viewpager');
var ColorConstants = require('../ColorConstants')
var AppNavigator = require('../../AppNavigator')
var NetConstants = require('../NetConstants');
var UIConstants = require('../UIConstants');
var NetworkModule = require('../module/NetworkModule');
var StorageModule = require('../module/StorageModule')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')

var RECOMMAND_URL = 'http://cn.tradehero.mobi/TH_CFD_WEB/detailslider.html?pageid='
var PAGES = [
  'Page 0',
  'Page 1',
];
var BANNERS = [
	require('../../images/bannar01.png'),
	require('../../images/bannar02.png'),
];
var {height, width} = Dimensions.get('window');
var imageHeight = 478 / 750 * width

var ds = new ViewPager.DataSource({
	pageHasChanged: (p1, p2) => p1 !== p2,
});
var HomePage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithPages(PAGES),
		};
	},

	componentWillMount: function() {
		StorageModule.loadBanners()
			.then((value) => {
				if (value !== null) {
					this.setState({
						dataSource: ds.cloneWithPages(JSON.parse(value))
					})
				}
			})
			.done()

		NetworkModule.fetchTHUrl(
			NetConstants.GET_HOMEPAGE_BANNER_API,
			{
				method: 'GET',
			},
			(responseJson) => {
				this.setState({
					dataSource: ds.cloneWithPages(responseJson)
				})
				StorageModule.setBanners(JSON.stringify(responseJson))
			},
			(errorMessage) => {
				// Ignore it.
			}
		)
	},

	_renderPage: function(
		data: Object,
		pageID: number | string,) {
		if (data.imgUrl !== undefined && data.imgUrl !== null) {
			return (
				<TouchableOpacity
					onPress={() => this.gotoRecommandPage(pageID)}>
					<Image
						style={[styles.image, {height: imageHeight, width: width}]}
						source={{uri: data.imgUrl}}/>
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity
					onPress={() => this.gotoRecommandPage(pageID)}>
					<Image
						style={[styles.image, {height: imageHeight, width: width}]}
						source={BANNERS[pageID % 2]}/>
				</TouchableOpacity>
			);
		}
	},

	gotoRecommandPage: function(pageID) {
		pageID += 1
		this.props.navigator.push({
			name: AppNavigator.HOMEPAGE_RECOMMAND_ROUTE,
			url: RECOMMAND_URL + pageID,
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
	render: function() {
		return (
			<View style={{width: width, height: height - UIConstants.TAB_BAR_HEIGHT - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER}}>
				<View style={{width: width, height: imageHeight}}>
					<ViewPager
						dataSource={this.state.dataSource}
						renderPage={this._renderPage}
						renderPageIndicator={false}
						isLoop={true}
						autoPlay={true}/>
				</View>

				<View style={styles.rowContainer}>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/updown.png')}/>
						<Text style={styles.blockTitleText}>
							涨跌双盈
						</Text>
						<Text style={styles.blockTitleContent}>
							{'市场行情的涨跌动态都是\n盈利时机'}
						</Text>
					</View>
					<View style={styles.vertLine}/>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/smallbig.png')}/>
						<Text style={styles.blockTitleText}>
							以小搏大
						</Text>
						<Text style={styles.blockTitleContent}>
							{'盈利无上限 亏损有底线\n杠杆收益'}
						</Text>
					</View>
				</View>
				<View style={styles.horiLine}/>
				<View style={styles.rowContainer}>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/markets.png')}/>
						<Text style={styles.blockTitleText}>
							实时行情
						</Text>
						<Text style={styles.blockTitleContent}>
							{'市场同步的行情助您掌控\n涨跌趋势'}
						</Text>
					</View>
					<View style={styles.vertLine}/>
					<TouchableOpacity style={styles.blockContainer} activeOpacity={0.95} onPress={this.logoutPress}>
					<View style={styles.blockContainer}>
						<Image style={styles.blockImage} source={require('../../images/advantage.png')}/>
						<Text style={styles.blockTitleText}>
							体验简单
						</Text>
						<Text style={styles.blockTitleContent}>
							{'选择涨跌 本金和杠杆三步\n便捷交易'}
						</Text>
					</View>
					</TouchableOpacity>
				</View>
			</View>

		);
	},
});

var styles = StyleSheet.create({
	image: {
		height: 239,
		resizeMode: Image.resizeMode.stretch,
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
});

module.exports = HomePage;

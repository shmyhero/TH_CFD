'use strict'

var React = require('react-native');
var Swiper = require('react-native-swiper')

var {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Alert,
	ViewPagerAndroid,
	ScrollView,
	Dimensions,
	Platform,
} = React;

var LogicData = require('../LogicData')
var StockListPage = require('./StockListPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')

var tabNames = ['自选', '美股', '指数', '外汇', '期货']
var urls = [
	NetConstants.GET_USER_BOOKMARK_LIST_API,
	NetConstants.GET_US_STOCK_TOP_GAIN_API,
	NetConstants.GET_INDEX_LIST_API,
	NetConstants.GET_FX_LIST_API,
	NetConstants.GET_FUTURE_LIST_API
]

var LandingPage = React.createClass({

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
		}
	},

	tabClicked: function(index) {
		this.setState({
			currentSelectedTab: index,
		})
		if (Platform.OS === 'ios') {
			var {height, width} = Dimensions.get('window');
			this.refs.viewPages && this.refs.viewPages.scrollTo(0, index * width)
		} else {
			this.refs.viewPages && this.refs.viewPages.setPage(index)
		}
	},

	viewPageSelected: function(event) {
		this.setState({
			currentSelectedTab: event.nativeEvent.position,
		})
	},

	onScrollEnd: function(event) {
		var {height, width} = Dimensions.get('window');
		this.setState({
			currentSelectedTab: Math.round(event.nativeEvent.contentOffset.x / width),
		})
	},

	renderTabs: function() {
		var {height, width} = Dimensions.get('window');

		var tabs = tabNames.map(
			(tabName, i) =>
			<TouchableHighlight style={[styles.tabItemContainer, {width: width / tabNames.length}]} key={i}
					underlayColor={ColorConstants.TITLE_BLUE}
					onPress={() => this.tabClicked(i)}>

				<Text style={this.state.currentSelectedTab == i ? styles.tabItemTextSelected : styles.tabItemTextUnSelected}>
					{tabName}
				</Text>

			</TouchableHighlight>
		)

		return (
			<ScrollView horizontal={true} style={styles.tabs}
					contentContainerStyle={{height: 25}}>
				{tabs}
			</ScrollView>
		);
	},

	renderViewPagers: function() {
		var {height, width} = Dimensions.get('window');

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				<StockListPage dataURL={urls[i]}/>
			</View>
		)
		if (Platform.OS === 'ios') {
			return (
				<ScrollView style={styles.viewPage} ref='viewPages'
						contentContainerStyle={{width: width * tabNames.length, height: height - 100}}
						pagingEnabled={true}
						horizontal={true}
						onMomentumScrollEnd={this.onScrollEnd}
						directionalLockEnabled={true} >
					{viewPages}
				</ScrollView>
			);
		} else {
			return (
				<ViewPagerAndroid style={[styles.viewPage, {height: height}]} ref='viewPages'
						onPageSelected={this.viewPageSelected}>
					{viewPages}
				</ViewPagerAndroid>
			);
		}
	},

	renderSeperate: function() {
		var {height, width} = Dimensions.get('window');

		var offsetX = -width / tabNames.length * (tabNames.length - this.state.currentSelectedTab)

		return (
			<View style={styles.lineContainer}>

				<View style={[styles.line, {width: width}]}/>
				
				<View style={[styles.tabItemContainer, {width: width / tabNames.length, marginLeft: offsetX}]}>
					<Image 
						style={styles.indicator} 
						source={require('../../images/triangle.png')}/>	
				</View>

			</View>
		);
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				{this.renderTabs()}

				{this.renderSeperate()}

				{this.renderViewPagers()}

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
	
	tabs: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: ColorConstants.TITLE_BLUE,
	},

	tabItemContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	tabItemTextSelected: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 16,
	},

	tabItemTextUnSelected: {
		textAlign: 'center',
		color: '#00b2fe',
		fontSize: 14,
	},

	viewPage: {
		flex: 20,
	},

	slide: {
		alignItems: 'stretch',
	},

	indicator: {
		width: 10,
		height: 5,
		marginTop: -4,
	},

	lineContainer: {
		alignSelf: 'stretch',
		flexDirection: 'row',
	},

	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.5,
		borderColor: '#0f4fba'
	},
})

module.exports = LandingPage;
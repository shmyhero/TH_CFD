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

var tabNames = ['自选', '美股', '指数', '外汇', '期货']

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
			<TouchableHighlight style={[styles.tabItemContainer, {width: width / 5}]}
					underlayColor={ColorConstants.TITLE_BLUE} key={i}
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
				<StockListPage />
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

	render: function() {
		return (
			<View style={styles.wrapper}>
				{this.renderTabs()}

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
		fontSize: 12,
	},

	viewPage: {
		flex: 20,
	},

	slide: {
		alignItems: 'stretch',
	},
})

module.exports = LandingPage;
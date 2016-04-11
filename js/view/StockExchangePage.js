'use strict';

var React = require('react-native');
var { 
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	ViewPagerAndroid,
	TouchableHighlight,
	Dimensions,
	Platform,
} = React;

var StockOpenPositionPage = require('./StockOpenPositionPage')
var StockClosedPositionPage = require('./StockClosedPositionPage')
var StockStatisticsPage = require('./StockStatisticsPage')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')

var {height, width} = Dimensions.get('window');
var tabNames = ['持仓', '平仓', '统计']

var StockExchangePage = React.createClass({

	getInitialState: function() {
		return {
			currentSelectedTab : 0,
			skipOnScrollEvent: false,
		}
	},

	tabClicked: function(index) {
		if (Platform.OS === 'ios') {
			this.refs.viewPages && this.refs.viewPages.scrollTo({x: index * width, y: 0, animated: false})
		} else {
			this.refs.viewPages && this.refs.viewPages.setPageWithoutAnimation(index)
		}
		if (index !== this.state.currentSelectedTab) {
			this.setState({
				currentSelectedTab: index,
				skipOnScrollEvent: true,
			})
		}
	},

	viewPageScrolled: function(event) {
		var targetTabPosition = event.nativeEvent.position
		if (event.nativeEvent.offset > 0.5) {
			targetTabPosition ++
		}    

		if (targetTabPosition !== this.state.currentSelectedTab) {
			this.setState({
				currentSelectedTab: targetTabPosition
			})
		}
	},

	onScroll: function(event) {
		var {height, width} = Dimensions.get('window');
		var offsetX = event.nativeEvent.contentOffset.x
		var targetTabPosition = Math.round(offsetX / width)

		if (this.state.skipOnScrollEvent) {
			if (targetTabPosition == this.state.currentSelectedTab) {
				this.setState({
					skipOnScrollEvent: false,
				})
			}
		} else if (targetTabPosition !== this.state.currentSelectedTab){
			this.setState({
				currentSelectedTab: targetTabPosition,
			})
		}
	},

	renderTabs: function() {
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

	renderSeperate: function() {
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

	renderViewPagers: function() {
		var tabPages = [
			<StockOpenPositionPage navigator={this.props.navigator}/>,
			<StockClosedPositionPage navigator={this.props.navigator}/>,
			<StockStatisticsPage navigator={this.props.navigator}/>
		]

		var viewPages = tabNames.map(
			(tabName, i) =>
			<View style={styles.slide} key={i}>
				{tabPages[i]}
			</View>
		)
		if (Platform.OS === 'ios') {
			return (
				<ScrollView style={styles.viewPage} ref='viewPages'
						contentContainerStyle={{width: width * tabNames.length, height: height - 120}}
						pagingEnabled={true}
						horizontal={true}
						onScroll={this.onScroll}
						scrollEventThrottle={10}
						directionalLockEnabled={true} >
					{viewPages}
				</ScrollView>
			);
		} else {
			return (
				<ViewPagerAndroid style={[styles.viewPage, {height: height}]} ref='viewPages'
						onPageScroll={this.viewPageScrolled}>
					{viewPages}
				</ViewPagerAndroid>
			);
		}
	},

	render: function() {
		return (
			<View style={[styles.wrapper, {width: width}]}>
				{this.renderTabs()}

				{this.renderSeperate()}

				{this.renderViewPagers()}
			</View>
		)
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		alignSelf: 'stretch',
		justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	tabItemContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	tabs: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: ColorConstants.TITLE_BLUE,
	},

	tabItemTextSelected: {
		textAlign: 'center',
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
	},

	tabItemTextUnSelected: {
		textAlign: 'center',
		color: '#abcaff',
		fontSize: 14,
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

	indicator: {
		width: 10,
		height: 5,
		marginTop: -4,
	},

	slide: {
		alignItems: 'stretch',
	},

	viewPage: {
		flex: 20,
	},
});


module.exports = StockExchangePage;

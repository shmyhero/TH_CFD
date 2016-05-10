'use strict';

var React = require('react-native')
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

var ColorConstants = require('../../ColorConstants')

var {height, width} = Dimensions.get('window');

var ScrollTabView = React.createClass({

	propTypes: {
		tabNames: React.PropTypes.array,
		viewPages: React.PropTypes.any,
		onPageSelected: React.PropTypes.func,
	},

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
			this.props.onPageSelected && this.props.onPageSelected(index)
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
			this.props.onPageSelected && this.props.onPageSelected(targetTabPosition)
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
			this.props.onPageSelected && this.props.onPageSelected(targetTabPosition)
		}
	},

	renderTabs: function() {
		var tabs = this.props.tabNames.map(
			(tabName, i) =>
			<TouchableHighlight style={[styles.tabItemContainer, {width: width / this.props.tabNames.length}]} key={i}
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
		var offsetX = width / this.props.tabNames.length * this.state.currentSelectedTab

		return (
			<View style={styles.lineContainer}>

				<View style={[styles.tabItemContainer, {width: width / this.props.tabNames.length, marginLeft: offsetX}]}>
					<Image
						style={styles.indicator}
						source={require('../../../images/triangle.png')}/>
				</View>

			</View>
		);
	},

	renderViewPagers: function() {
		if (Platform.OS === 'ios') {
			return (
				<ScrollView style={styles.viewPage} ref='viewPages'
						contentContainerStyle={{width: width * this.props.tabNames.length, height: height - 142}}
						pagingEnabled={true}
						horizontal={true}
						onScroll={this.onScroll}
						scrollEventThrottle={10}
						directionalLockEnabled={true} >
					{this.props.viewPages}
				</ScrollView>
			);
		} else {
			return (
				<ViewPagerAndroid style={[styles.viewPage, {height: height - 142}]} ref='viewPages'
						onPageScroll={this.viewPageScrolled}>
					{this.props.viewPages}
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
		marginTop: -5,
	},

	slide: {
		alignItems: 'stretch',
	},

	viewPage: {
		flex: 20,
	},
});


module.exports = ScrollTabView;

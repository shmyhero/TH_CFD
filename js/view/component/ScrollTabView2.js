'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	ViewPagerAndroid,
	TouchableHighlight,
	Dimensions,
	Platform,
} from 'react-native';

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
			<TouchableHighlight style={[styles.tabItemContainer,
				{width: width / this.props.tabNames.length,
				 paddingBottom: 10,
}
			]} key={i}
					underlayColor={'#00000000'}
					onPress={() => this.tabClicked(i)}>

				<Text style={this.state.currentSelectedTab == i ? styles.tabItemTextSelected : [styles.tabItemTextUnSelected, {color: '#434343'}]}>
					{tabName}
				</Text>

			</TouchableHighlight>
		)

		return (
			<View>
				<ScrollView horizontal={true} style={[styles.tabs, {paddingTop:10,backgroundColor: 'white'}]}>
					{tabs}
				</ScrollView>
			</View>
		);
	},

	renderSeperate: function() {
		var offsetX = width / this.props.tabNames.length * this.state.currentSelectedTab

		return (
			<View style={styles.lineContainer}>

				<View style={[styles.tabItemContainer, {backgroundColor:ColorConstants.TITLE_BLUE_LIVE,height:2,width: width / this.props.tabNames.length, marginLeft: offsetX}]}>

				</View>

			</View>
		);
	},

	renderViewPagers: function() {
		if (Platform.OS === 'ios') {
			return (
				<ScrollView style={styles.viewPage} ref='viewPages'
						contentContainerStyle={{width: width * this.props.tabNames.length}}
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
				<ViewPagerAndroid style={[styles.viewPage, {flex: 1}]} ref='viewPages'
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
		justifyContent: 'flex-start',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	tabItemContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	tabs: {
		flex: 0,
		alignSelf: 'stretch',
	},

	tabItemTextSelected: {
		textAlign: 'center',
		color: ColorConstants.TITLE_BLUE_LIVE,
		fontSize: 15,
		fontWeight: 'bold',
	},

	tabItemTextUnSelected: {
		textAlign: 'center',
		fontSize: 15,
		color: '#434343',
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
		flex: 1,
	},
});


module.exports = ScrollTabView;

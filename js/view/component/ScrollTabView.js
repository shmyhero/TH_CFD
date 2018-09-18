'use strict';

import PropTypes from 'prop-types';

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

class ScrollTabView extends React.Component {
    static propTypes = {
		tabNames: PropTypes.array,
		viewPages: PropTypes.any,
		onPageSelected: PropTypes.func,
	};

    state = {
        currentSelectedTab : 0,
        skipOnScrollEvent: false,
    };

    tabClicked = (index) => {
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
	};

    viewPageScrolled = (event) => {
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
	};

    onScroll = (event) => {
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
	};

    renderTabs = () => {
		var tabs = this.props.tabNames.map(
			(tabName, i) =>
			<TouchableHighlight style={[styles.tabItemContainer,
				{width: width / this.props.tabNames.length,
				 paddingBottom: 10,
}
			]} key={i}
					underlayColor={ColorConstants.title_blue()}
					onPress={() => this.tabClicked(i)}>

				<Text style={this.state.currentSelectedTab == i ? styles.tabItemTextSelected : [styles.tabItemTextUnSelected, {color: ColorConstants.TAB_UNSELECT_TEXT_COLOR}]}>
					{tabName}
				</Text>

			</TouchableHighlight>
		)

		return (
			<View>
				<ScrollView horizontal={true} style={[styles.tabs, {backgroundColor: ColorConstants.TITLE_BLUE}]}>
					{tabs}
				</ScrollView>
			</View>
		);
	};

    renderSeperate = () => {
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
	};

    renderViewPagers = () => {
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
				<ViewPagerAndroid style={[styles.viewPage, {height: height}]} ref='viewPages'
						onPageScroll={this.viewPageScrolled}>
					{this.props.viewPages}
				</ViewPagerAndroid>
			);
		}
	};

    render() {
		width = Dimensions.get('window').width;
		height = Dimensions.get('window').height;
		return (
			<View style={[styles.wrapper, {width: width}]}>
				{this.renderTabs()}

				{this.renderSeperate()}

				{this.renderViewPagers()}
			</View>
		)
	}
}

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
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
	},

	tabItemTextUnSelected: {
		textAlign: 'center',
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
		flex: 1,
	},
});


module.exports = ScrollTabView;

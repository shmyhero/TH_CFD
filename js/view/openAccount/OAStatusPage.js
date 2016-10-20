'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
} from 'react-native';

// var ViewPager = require('react-native-viewpager-es6');
var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')

var {height, width} = Dimensions.get('window')
var PAGES = [
	{name: 'Page0'},
	{name: 'Page1'},
];
var BANNERS = [
	require('../../../images/live_register_banner01.png'),
	require('../../../images/live_register_banner02.png'),
];
// var ds = new ViewPager.DataSource({
// 	pageHasChanged: (p1, p2) => p1 !== p2,
// });

var imageHeight = 311 / 750 * width

var OAStatusPage = React.createClass({

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithPages(PAGES),
		};
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_START, TalkingdataModule.LABEL_OPEN_ACCOUNT)
		this.props.navigator.push({
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 0,
		});
	},

	helpPressed: function() {

	},

	_renderPage: function(
		data: Object,
		pageID: number | string,) {
		return (
			<Image
				style={[styles.image, {height: imageHeight, width: width}]}
				source={BANNERS[pageID % 2]}/>
		);
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<Image
					style={[styles.backgroundImage, {height: imageHeight, width: width}]}
					source={BANNERS[0]} >
					{
					// <ViewPager
					// 	style={{backgroundColor:'transparent'}}
					// 	dataSource={this.state.dataSource}
					// 	renderPage={this._renderPage}
					// 	isLoop={false}
					// 	autoPlay={false}/>
					}
				</Image>

				<Image style={styles.image} source={require('../../../images/live_register_sub_banner.png')}/>

				<View style={{flex: 2, marginTop: 70}}>
					<Text style={styles.text1}>ayondo欢迎您开启财富之旅</Text>

					<Button style={styles.buttonArea}
						enabled={true}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text='免费开户' />

					<View style={styles.helpContainer}>
						<View style={styles.helpRowWrapper}>
							<View style={styles.helpLine}/>
							<TouchableOpacity style={{padding: 5}} onPress={this.helpPressed}>
								<Text style={styles.helpTitle}>
									 开户交易帮助
								</Text>
							</TouchableOpacity>
							<View style={styles.helpLine}/>
						</View>
					</View>
				</View>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	text1: {
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 10,
		marginBottom: 20,
	},
	image: {
		alignSelf: 'center',
		width: width,
		height: 212 / 750 * width,
	},
	buttonArea: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: '#4567a4',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	helpContainer: {
		paddingBottom: 70,
		alignItems: 'stretch',
	},
	helpRowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'space-around',
	},
	helpLine: {
		flex: 1,
		marginLeft: 5,
		marginRight: 5,
		borderWidth: 0.5,
		borderColor: '#1c5fcf',
	},
	helpTitle: {
		fontSize: 14,
		textAlign: 'center',
		color: '#1c5fcf',
	},
});


module.exports = OAStatusPage;

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
var LogicData = require('../../LogicData')
var UIConstants = require('../../UIConstants')

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

	propTypes: {
		onLoginClicked: React.PropTypes.func,
	},

	getInitialState: function() {
		return {
			// dataSource: ds.cloneWithPages(PAGES),
		};
	},

	gotoNext: function() {
		this.props.onLoginClicked()
	},

	helpPressed: function() {

	},


	render: function() {
		return (

			<View style={styles.wrapper}>
				<Image
					style={[styles.backgroundImage, {height: imageHeight, width: width}]}
					source={BANNERS[0]} >
				</Image>

				<Image style={styles.image} source={require('../../../images/live_register_sub_banner.png')}/>

				<View style={{flex: 2, marginTop: 70}}>
					<Text style={styles.text1}>ayondo欢迎您开启财富之旅</Text>

					<View style={{flex:1}}>
						<Button style={styles.buttonArea}
							enabled={true}
							onPress={this.gotoNext}
							textContainerStyle={styles.buttonView}
							textStyle={styles.buttonText}
							text='实盘登录' />
					</View>

					<View style={styles.helpContainer}>
						<View style={styles.helpRowWrapper}>
							{/* <TouchableOpacity style={{padding: 5}} onPress={this.helpPressed}> */}
								<Text style={styles.helpTitle}>
									 服务热线：66058771
								</Text>
							{/* </TouchableOpacity> */}
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
		flexDirection: 'column',
   	alignItems: 'stretch',
		//backgroundColor: ColorConstants.BACKGROUND_GREY,
		height: height
				- UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
				- UIConstants.HEADER_HEIGHT
				- UIConstants.TAB_BAR_HEIGHT,
		//backgroundColor: 'pink',
	},
	text1: {
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 10,
		marginBottom: 20,
		color:'#A4A4A4',
		backgroundColor: 'transparent',
	},
	image: {
		alignSelf: 'center',
		width: width,
		height: 212 / 750 * width,
	},
	buttonArea: {

		alignItems:'stretch',
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: '#ee595e',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	helpContainer: {
		paddingBottom: 30,
		alignItems: 'stretch',
		//height: 30,
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
		color: '#2b2b2b',
	},
});


module.exports = OAStatusPage;

'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	Alert,
} from 'react-native';

var NativeSceneModule = require('../../module/NativeSceneModule')
// var ViewPager = require('react-native-viewpager-es6');
var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var LogicData = require('../../LogicData')
var UIConstants = require('../../UIConstants')
var SentIntent = require('../component/nativeIntent/SendIntent')
var LS = require('../../LS')
var {height, width} = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient';

var CALL_NUMBER = '66058771'

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
		NativeSceneModule.launchNativeScene('MeiQia')
		// SentIntent.sendPhoneDial(CALL_NUMBER)
	},


	render: function() {
		var strWELCOME = LS.str('WELCOME2YJY')
		var strSERVICES = LS.str('SERVICE24HOURS')
		var strLIVELOGIN = LS.str('SPDL')
		return (
			<LinearGradient colors={['#6689c6','#445c86']} style={styles.wrapper}>
			   
				<Image style={styles.image} source={require('../../../images/bg_login_live.png')}/>

				<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
					 
						<Text style={styles.text1}>{strWELCOME}</Text>  
						<Button style={styles.buttonArea}
							enabled={true}
							onPress={this.gotoNext}
							textContainerStyle={styles.buttonView}
							textStyle={styles.buttonText}
							text={strLIVELOGIN} />
						 
				 
				</View>

			</LinearGradient>
		);
	},

});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		flexDirection: 'column',
   		alignItems: 'stretch',
		backgroundColor: '#445c86',
		paddingTop:50,
		height: height
				// - UIConstants.ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER
				// - UIConstants.HEADER_HEIGHT
				- UIConstants.TAB_BAR_HEIGHT, 
	},
	text1: {
		fontSize: 17,
		textAlign: 'center',
		paddingTop: 10,
		marginBottom: 20,
		color:'#7d9fdb',
		backgroundColor: 'transparent',
	},
	image: {
		alignSelf: 'center',
		width: width,
		height: 770 / 720 * width,
	},
	buttonArea: { 
		// alignItems:'stretch',
		width:width-30,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 16,
		borderRadius: 3,
	},
	buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: '#698ac5',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
	helpContainer: {
		paddingBottom: 30 - UIConstants.STATUS_BAR_ACTUAL_HEIGHT,
		alignItems: 'stretch',
		//height: 30,
	},
	helpRowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		justifyContent: 'center',
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
		color: '#415a87',
	},
	lineLeftRight:{
			 	width:100,
				height:1,
				margin:5,
	},
});


module.exports = OAStatusPage;

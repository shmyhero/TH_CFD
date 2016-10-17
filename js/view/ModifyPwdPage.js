'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TouchableOpacity,
	Alert,
	Modal,
	Animated,
	Easing,
	WebView,
} from 'react-native';


var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var NativeDataModule = require('../module/NativeDataModule')
var NavBar = require('./NavBar')
var TalkingdataModule = require('../module/TalkingdataModule')
var TongDaoModule = require('../module/TongDaoModule')
var WebViewPage = require('./WebViewPage');
var {height, width} = Dimensions.get('window');
var heightRate = height/667.0;

var MainPage = require('./MainPage')

var ModifyPwdPage = React.createClass({

	componentDidMount:function(){
	},

	render: function() {
		return (
				<View>

				</View>
		);
	},
});



var styles = StyleSheet.create({

	webView:{
		flex:1,
		width:width,
		height:height - 50,
		backgroundColor: ColorConstants.TITLE_BLUE
	},

});

module.exports = ModifyPwdPage;

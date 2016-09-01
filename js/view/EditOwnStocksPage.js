'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Alert,
} from 'react-native';

var MainPage = require('./MainPage')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var StockEditFragment = require('./component/StockEditFragment');
var LogicData = require('../LogicData')
var NetworkModule = require('../module/NetworkModule')
var NetConstants = require('../NetConstants')

var {height, width} = Dimensions.get('window')
var didFocusSubscription = null;

var EditOwnStocksPage = React.createClass({

	gotoNext: function() {
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	gotoEditAlertPage: function(alertData) {
		this.props.navigator.push({
			name: MainPage.EDIT_ALERT_ROUTE,
      		stockId: alertData,
		})
	},

	render: function() {

		var userData = LogicData.getUserData()
	 	var notLogin = Object.keys(userData).length === 0

		return (
			<View style={styles.wrapper}>
				<NavBar title='我的自选'
					leftTextOnClick={this.pressBackButton}
					textOnLeft='完成'
					navigator={this.props.navigator}/>
				<StockEditFragment style={{flex: 1}} isLogin = {!notLogin} onTapEditAlert={this.gotoEditAlertPage}/>
			</View>
		);
	},

 	componentDidMount: function() {
		 this.loadAlertList();
	},

	loadAlertList: function(){
		var userData = LogicData.getUserData()
	 	var notLogin = Object.keys(userData).length === 0
	 	if(!notLogin){
		 //If previously logged in, fetch me data from server.
		 NetworkModule.fetchTHUrl(
			 NetConstants.GET_ALL_STOCK_ALERT,
			 {
				 method: 'GET',
				 headers: {
					 'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				 },
			 },
			 (responseJson) => {
			 		console.log('load alert list success');
			 },
			 (errorMessage) => {
				 Alert.alert('', errorMessage);
			 }
		 )
		}
	},

});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
});


module.exports = EditOwnStocksPage;

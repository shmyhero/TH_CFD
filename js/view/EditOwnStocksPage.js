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
var NativeDataModule = require('../module/NativeDataModule')

var {height, width} = Dimensions.get('window')
var didFocusSubscription = null;

// var stockAlertList = [];

var EditOwnStocksPage = React.createClass({

	getInitialState: function() {
		return {
			stockAlertList: [],
		};
	},

	gotoNext: function() {
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	gotoEditAlertPage: function(alertData) {

    var stockInfo = LogicData.getStockFromOwnStockData(alertData);
		var stockAlert = this.state.stockAlertList.find((alert)=>{return alert.SecurityId === alertData})

		this.props.navigator.push({
			name: MainPage.EDIT_ALERT_ROUTE,
      		stockId: alertData,
			stockInfo: stockInfo,
			stockAlert: stockAlert,
			onAlertSetComplete: this.onAlertSetComplete,
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
				<StockEditFragment style={{flex: 1}}
					isLogin = {!notLogin}
					isActual = {LogicData.getAccountState()}
					onTapEditAlert={this.gotoEditAlertPage}
					alertData={JSON.stringify(this.state.stockAlertList)}/>
			</View>
		);
	},

	onAlertSetComplete: function() {
		this.loadAlertList();
	},

 	componentDidMount: function() {
		 this.loadAlertList();
	},

	loadAlertList: function(){
		var userData = LogicData.getUserData()
	 	var notLogin = Object.keys(userData).length === 0
	 	if(!notLogin){
		 //If previously logged in, fetch me data from server.
		 var url = LogicData.getAccountState() ? NetConstants.CFD_API.GET_ALL_STOCK_ALERT_LIVE : NetConstants.CFD_API.GET_ALL_STOCK_ALERT;
		 NetworkModule.fetchTHUrl(
			 url,
			 {
				 method: 'GET',
				 headers: {
					 'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
				 },
			 },
			 (responseJson) => {
					//NativeDataModule.passDataToNative('myAlertList', responseJson);
					this.setState({
						stockAlertList : responseJson,
					});
			 },
			 (result) => {
				 Alert.alert('', result.errorMessage);
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

'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Switch,
} from 'react-native';

var MainPage = require('./MainPage')
var NetworkModule = require('../module/NetworkModule')
var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var NetConstants = require('../NetConstants')
var LogicData = require('../LogicData')
var WebSocketModule = require('../module/WebSocketModule')
var UIConstants = require('../UIConstants')
var {height, width} = Dimensions.get('window')

var EditAlertPage = React.createClass({

	propTypes: {
		stockId:React.PropTypes.number,
		stockInfo: React.PropTypes.object,
		stockAlert: React.PropTypes.object,
		onAlertSetComplete: React.PropTypes.func,
	},

	getDefaultProps() {
		return {

		}
	},

	getInitialState: function() {
		return {
			HighPrice: 0,
			LowPrice: 0,
			HighEnabled: false,
			LowEnabled: false,
			stockInfo: this.props.stockInfo,
			stockPrice: 0,	//TODO: use real price
			upError: null,
			downError: null,
			stockPriceAsk: 0,
			stockPriceBid: 0,
		};
	},

	componentDidMount: function(){
		console.log("test data")
		console.log(this.props.stockInfo)
		console.log(this.props.stockAlert)

		if(this.props.stockAlert){
			this.setState({
				HighPrice: this.props.stockAlert.HighPrice,
				LowPrice: this.props.stockAlert.LowPrice,
				HighEnabled: this.props.stockAlert.HighEnabled,
				LowEnabled: this.props.stockAlert.LowEnabled
			});
		}

		this.loadStockInfo();
	},

	loadStockInfo: function() {
		var url = NetConstants.GET_STOCK_DETAIL_API
		url = url.replace(/<stockCode>/, this.props.stockInfo.id)

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				showLoading: true,
			},
			(responseJson) => {
				/*
				var currencySymbol = responseJson.ccy
				if (currencySymbol != UIConstants.USD_CURRENCY) {
					// Find the USD/ccy fx data first.
					var fxData = LogicData.getFxDataBySymbol(UIConstants.USD_CURRENCY + currencySymbol)
					if (!fxData) {
						fxData = LogicData.getFxDataBySymbol(currencySymbol + UIConstants.USD_CURRENCY)
					}
					if (fxData) {
						var fxId = fxData.id
						responseJson.fxData = fxData
						var previousInterestedStocks = WebSocketModule.getPreviousInterestedStocks()
						previousInterestedStocks += ',' + fxId
						WebSocketModule.registerInterestedStocks(previousInterestedStocks)
					}
				}
				*/

				this.setState({
					stockInfo: responseJson,
					stockPriceBid: responseJson.bid,
					stockPriceAsk: responseJson.ask,
				})

				this.connectWebSocket()
			},
			(errorMessage) => {
				Alert.alert('', errorMessage);
			}
		)
	},

	connectWebSocket: function() {
		WebSocketModule.registerCallbacks(
			(realtimeStockInfo) => {
				console.log("websocket changes! " + JSON.stringify(realtimeStockInfo))
				for (var i = 0; i < realtimeStockInfo.length; i++) {
					if (this.props.stockInfo.id == realtimeStockInfo[i].id ) {
						this.setState({
							stockPrice: realtimeStockInfo[i].last,
							stockPriceAsk: realtimeStockInfo[i].ask,
							stockPriceBid: realtimeStockInfo[i].bid,
						})

						this.validateInputData();
						break;
					}
				};

				/*
				if (this.state.stockInfo.fxData) {
					var fxId = this.state.stockInfo.fxData.id
					for (var i = 0; i < realtimeStockInfo.length; i++) {
						if (fxId == realtimeStockInfo[i].id &&
									this.state.stockCurrencyPrice !== realtimeStockInfo[i].last) {
							this.setState({
								stockCurrencyPrice: realtimeStockInfo[i].last,
							})
							break;
						}
					};
				}
				*/
			})
	},


	componentWillUnmount: function(){
		WebSocketModule.cleanRegisteredCallbacks();
	},

	gotoNext: function() {
	},

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	validateInputData: function(){
		this.updatePrice(1, this.state.HighPrice)
		this.updatePrice(2, this.state.LowPrice)
	},

	updatePrice: function(type, text){
		var value = parseFloat(text);
		if(type === 1){
			//Up
			this.setState({
				HighPrice: text,
				upError: value < this.state.stockPriceAsk ? "低于当前价" : null
			});
		}else{
			//Down
			this.setState({
				LowPrice: text,
				downError: value > this.state.stockPriceBid ? "高于当前价" : null
			});
		}
	},

	renderSeparator: function(marginLeft) {
		return(
			<View style={{backgroundColor:'white'}}>
				<View style={[styles.separator,{marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderAlertCell: function(type){
		//type 1:买涨， 2:买跌
		var title = type === 1 ? '买涨价格高于':'买跌价格低于'
		var textColor = "black";
		var text = null;
		var inputEnable = false;
		if(type === 1){
			textColor = this.state.upError ? "red" : "black";
			text = this.state.HighPrice ? this.state.HighPrice.toString() : null;
			inputEnable = this.state.HighEnabled;
		}else{
			textColor = this.state.downError ? "red" : "black";
			text = this.state.LowPrice ? this.state.LowPrice.toString() : null;
			inputEnable = this.state.LowEnabled;

		}

		return(
			<View style={styles.cellWrapper}>
				<Text style={styles.cellTitle}>
					{title}
				</Text>
				<TextInput style={[styles.cellInput, {color: textColor}]}
				 					 onChangeText={(text) => this.updatePrice(type, text)}
									 value={text}
									 editable={inputEnable}
									 keyboardType='numeric'>
				</TextInput>
				<Switch
				  value={type===1 ? this.state.HighEnabled : this.state.LowEnabled}
					onValueChange={(value) => this.setState(type === 1 ? {HighEnabled:value} : {LowEnabled:value})}
				/>
			</View>
			)
	},

	onComplete: function(){
		var userData = LogicData.getUserData();

		var highPrice = null;
		if(this.state.HighPrice){
			highPrice = parseFloat(this.state.HighPrice);
		}

		var lowPrice = null;
		if(this.state.LowPrice){
			lowPrice = parseFloat(this.state.LowPrice);
		}

		var alertData = {
    	"SecurityId": this.props.stockId,
    	"HighPrice": highPrice,
    	"HighEnabled": this.state.HighEnabled,
    	"LowPrice": lowPrice,
    	"LowEnabled": this.state.LowEnabled
		}

		NetworkModule.fetchTHUrl(
			NetConstants.UPDATE_STOCK_ALERT,
			{
				method: 'PUT',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body:JSON.stringify(alertData),
				showLoading: true,
			},
			(responseJson) => {
				this.props.onAlertSetComplete()
				this.props.navigator.pop()
			},
			(errorMessage) => {
				Alert.alert('提醒设置', errorMessage);
			}
		)
	},

	hasError: function(){
		if(this.state.LowEnabled && !this.state.LowPrice){
			return true;
		}
		if(this.state.HighEnabled && !this.state.HighPrice){
			return true;
		}
		return this.state.upError || this.state.downError ? true : false;
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title='提醒设置'
					showBackButton={true}
					textOnRight='完成'
					rightTextOnClick={this.onComplete}
					enableRightText={!this.hasError()}
					navigator={this.props.navigator}/>
				<View style={styles.headerView}>
					<Text style={styles.nameText}>
						{this.props.stockInfo.name}
					</Text>
					<Text style={styles.priceText}>
						当前买涨价格 {this.state.stockPriceAsk} 当前买跌价格 {this.state.stockPriceBid}
					</Text>
				</View>
				{this.renderSeparator(0)}
				{this.renderAlertCell(1)}
				{this.renderSeparator(15)}
				{this.renderAlertCell(2)}
				{this.renderSeparator(0)}
				<Text style={styles.bottomText}>
					虽然全力以赴传递通知，却也不能保证。
				</Text>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
   		alignItems: 'stretch',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},
	headerView: {
		paddingLeft: 15,
		paddingTop: 12,
		paddingBottom: 12,
		justifyContent: 'space-around',
		height: Math.round(height/8),
	},
	nameText: {
		fontSize: 17,
		color: 'black',
		marginBottom: 10,
	},
	priceText: {
		fontSize: 16,
		color: '#808080',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	cellWrapper: {
		height: Math.round(height/10),
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	cellTitle: {
		fontSize: 17,
	},
	cellInput: {
		fontSize: 17,
		borderWidth: 1.0,
		borderRadius: 2,
		borderColor: '#efeff4',
		height: 28,
		padding: 0,
		width: Math.round(width/3),
		alignSelf: 'center',
		textAlignVertical:'center',
	},
	bottomText: {
		marginTop:15,
		marginLeft: 12,
		fontSize: 12,
		color: '#8d8d8d',
	}
});


module.exports = EditAlertPage;

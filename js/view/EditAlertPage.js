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

var {height, width} = Dimensions.get('window')

var EditAlertPage = React.createClass({

	propTypes: {
		stockName: React.PropTypes.string,
		stockId:React.PropTypes.number,
		stockPrice: React.PropTypes.number,
		stockPriceAsk: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		stockPriceBid: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		currentUp: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		currentDwon: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
		switchHigh: React.PropTypes.bool,
		switchLow: React.PropTypes.bool,
		stockInfo: React.PropTypes.object,
	},

	getDefaultProps() {
		return {
			currentUp: 0,
			currentDwon: 0,
			switchHigh: false,
			switchLow: false,
		}
	},

	getInitialState: function() {
		return {
			currentUp: this.props.currentUp,
			currentDwon: this.props.currentDwon,
			switchHigh: this.props.switchHigh,
			switchLow: this.props.switchLow,
			stockInfo: {},
			stockPrice: 0,	//TODO: use real price
			stockPriceAsk: 0,
			stockPriceBid: 0,
		};
	},

	componentDidMount: function(){
		WebSocketModule.registerCallbacks(
			(realtimeStockInfo) => {
				console.log("update stock info: " + JSON.stringify(realtimeStockInfo))
				for (var i = 0; i < realtimeStockInfo.length; i++) {
					if (this.props.stockCode == realtimeStockInfo[i].id ) {
						if (this.state.chartType === NetConstants.PARAMETER_CHARTTYPE_TEN_MINUTE
							 && this.state.stockInfo != undefined
							 && this.state.stockInfo.priceData != undefined) {
							var stockinfo = this.state.stockInfo
							var price = realtimeStockInfo[i].last
							stockinfo.priceData.push({"p":price,"time":realtimeStockInfo[i].time})
							this.setState({
								stockInfo: stockinfo,
								stockPrice: realtimeStockInfo[i].last,
								stockPriceAsk: realtimeStockInfo[i].ask,
								stockPriceBid: realtimeStockInfo[i].bid,
							})
						}
						else if(this.state.stockPrice !== realtimeStockInfo[i].last) {
							this.setState({
								stockPrice: realtimeStockInfo[i].last,
								stockPriceAsk: realtimeStockInfo[i].ask,
								stockPriceBid: realtimeStockInfo[i].bid,
							})
						}
						break;
					}
				};

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

	updatePrice: function(type, text){
		if(type === 1){
			//Up
			this.state.currentUp = parseInt(text);
		}else{
			//Down
			this.state.currentDown = parseInt(text);
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
		return(
			<View style={styles.cellWrapper}>
				<Text style={styles.cellTitle}>
					{title}
				</Text>
				<TextInput style={styles.cellInput} onChangeText={(text) => this.updatePrice(type, text)}
									 keyboardType='numeric'>
				</TextInput>
				<Switch
				  value={type===1 ? this.state.switchHigh : this.state.switchLow}
					onValueChange={(value) => this.setState(type===1 ? {switchHigh:value} : {switchLow:value})}
				/>
			</View>
			)
	},

	onComplete: function(){
		var userData = LogicData.getUserData();

		var alertData = {
    	"SecurityId": this.props.stockId,
    	"HighPrice": this.state.currentUp,
    	"HighEnabled": this.state.switchHigh,
    	"LowPrice": this.state.currentDwon,
    	"LowEnabled": this.state.switchLow
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
				this.props.navigator.pop()
			},
			(errorMessage) => {
				Alert.alert('提醒设置', errorMessage);
			}
		)
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title='提醒设置'
					showBackButton={true}
					textOnRight='完成'
					rightTextOnClick={this.onComplete}
					navigator={this.props.navigator}/>
				<View style={styles.headerView}>
					<Text style={styles.nameText}>
						{this.props.stockId}
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

'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	TextInput,
	Switch,
	UIManager,
	Image,
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

var UP_INPUT_REF = "upInput"
var DOWN_INPUT_REF = "downInput"

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
			HighError: null,
			LowError: null,
			stockInfo: this.props.stockInfo,
			stockPrice: 0,	//TODO: use real price
			stockPriceAsk: 0,
			stockPriceBid: 0,
			isFinishButtonEnabled: true,
			HighFocused: false,
			LowFocused: false,
		};
	},

	upInputPosition: {},
	downInputPosition: {},

	componentDidMount: function(){
		console.log(this.props.stockInfo)
		console.log(this.props.stockAlert)

		this.calculateInputPosition();

		var currentX = 0;

		if(this.props.stockAlert){
			this.setState({
				HighPrice: this.props.stockAlert.HighPrice,
				LowPrice: this.props.stockAlert.LowPrice,
				HighEnabled: this.props.stockAlert.HighEnabled,
				LowEnabled: this.props.stockAlert.LowEnabled,
			});
		}

		this.loadStockInfo();
	},

	calculateInputPosition(onFinish){
		//Bug fix. The measure function may fail if not wrapped with settimeout...
		setTimeout(()=>{
			this.refs[UP_INPUT_REF].measure((fx, fy, width, height, px, py) => {
				this.upInputPosition = {
					fx: fx,
					fy: fy,
					width: width,
					height: height,
					px: px,
					py: py,
				}
			});

			this.refs[DOWN_INPUT_REF].measure((fx, fy, width, height, px, py) => {
				this.downInputPosition = {
					fx: fx,
					fy: fy,
					width: width,
					height: height,
					px: px,
					py: py,
				}
			});

			console.log(JSON.stringify(this.upInputPosition))
			if(onFinish){
				onFinish();
			}
		}, 0);
	},

	loadStockInfo: function() {
		var url = NetConstants.CFD_API.GET_STOCK_DETAIL_API
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

				this.connectWebSocket();

				this.validatePrice(1, this.state.HighPrice)
				this.validatePrice(2, this.state.LowPrice)
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

	pressBackButton: function() {
		this.props.showTabbar()
		this.props.navigator.pop()
	},

	validateInputData: function(){
		console.log("EditAlertPage validateInputData: " + this.state.HighPrice + ", " + this.state.LowPrice);
		this.validatePrice(1, this.state.HighPrice)
		this.validatePrice(2, this.state.LowPrice)
	},

	validatePrice: function(type, text){
		var value = parseFloat(text);
		var error = null
		if(type === 1){
			//High
			if(text && value < this.state.stockPriceAsk){
				error = "低于当前价";
			}
			console.log("EditAlertPage upvalue: " + text);
			this.setState({
				HighPrice: text,
				HighError: error
			});
		}else{
			//Low
			if(text && value > this.state.stockPriceBid){
				error = "高于当前价";
			}
			console.log("EditAlertPage downvalue: " + text);
			this.setState({
				LowPrice: text,
				LowError: error
			});
		}
	},

	onTextFocus: function(type){
		if(type === 1){
			//High
			this.setState(
			{
				HighFocused: true,
				HighEnabled:true
			})
		}else{
			//Low
			this.setState(
			{
				LowFocused: true,
				LowEnabled:true
			})
		}
	},

	onTextBlur: function(type){
		if(type === 1){
			//High
			if(!this.state.HighPrice){
				this.setState({HighEnabled:false})
			}
			if(this.state.HighError){
				this.setState({
					HighError: null,
					HighPrice: null,
					HighEnabled: false,
				})
			}
			this.setState(
			{
				HighFocused: false
			})
		}else{
			//Low
			if(!this.state.LowPrice){
				this.setState({LowEnabled:false})
			}
			if(this.state.LowError){
				this.setState({
					LowError: null,
					LowPrice: null,
					LowEnabled: false,
				})
			}
			this.setState(
			{
				LowFocused: false
			})
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
		var ref;
		if(type === 1){
			textColor = this.state.HighError ? "red" : "black";
			text = this.state.HighPrice ? this.state.HighPrice.toString() : "";
			inputEnable = this.state.HighEnabled;
			ref = UP_INPUT_REF;
		}else{
			textColor = this.state.LowError ? "red" : "black";
			text = this.state.LowPrice ? this.state.LowPrice.toString() : "";;
			inputEnable = this.state.LowEnabled;
			ref = DOWN_INPUT_REF;
		}

		//editable={inputEnable}
		return(
			<View style={styles.cellWrapper}>
				<Text style={styles.cellTitle}>
					{title}
				</Text>
				<View style={[styles.cellInputWrapper]}>
					<TextInput style={[styles.cellInput, {color: textColor}]}
										 ref={ref}
					 					 onChangeText={(text) => this.validatePrice(type, text)}
										 onFocus={() => this.onTextFocus(type)}
										 onBlur={() => this.onTextBlur(type)}
										 value={text}
										 underlineColorAndroid='transparent'
										 keyboardType='numeric'>
					</TextInput>
				</View>
				<Switch
				  value={type===1 ? this.state.HighEnabled : this.state.LowEnabled}
					onValueChange={(value) => this.setState(type === 1 ? {HighEnabled:value} : {LowEnabled:value})}
					onTintColor={ColorConstants.TITLE_BLUE}

				/>
			</View>
			)
	},

	onComplete: function(){
		this.setState({
			isFinishButtonEnabled: false
		});

		var userData = LogicData.getUserData();

		var highPrice = null;
		if(this.state.HighPrice){
			highPrice = parseFloat(this.state.HighPrice);
		}

		var lowPrice = null;
		if(this.state.LowPrice){
			lowPrice = parseFloat(this.state.LowPrice);
		}

		var highEnabled = highPrice ? this.state.HighEnabled : false;
		var lowEnabled = lowPrice ? this.state.LowEnabled : false;

		var alertData = {
    	"SecurityId": this.props.stockId,
    	"HighPrice": highPrice,
    	"HighEnabled": highEnabled,
    	"LowPrice": lowPrice,
    	"LowEnabled": lowEnabled
		}

		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.UPDATE_STOCK_ALERT,
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
				WebSocketModule.cleanRegisteredCallbacks();
				this.props.onAlertSetComplete()
				this.props.navigator.pop()
			},
			(errorMessage) => {
				Alert.alert('提醒设置', errorMessage);
			}
		)
	},

	hasError: function(){
		return this.state.HighError || this.state.LowError ? true : false;
	},

	renderErrorBubble: function(offsetX, offsetY, errorText){
		return (
			<View style={[styles.tooltip, {top: offsetY - 42, left: offsetX - 5}]}>
				<Image
					style={styles.bubbleImage}
					source={require('../../images/error_bubble.png')}
				/>
				<Text style={styles.errorText}>
					{errorText}
				</Text>
			</View>
		)
	},

	//Silly way! But cannot find a better solution..
	renderHighErrorHint: function(){
		console.log("renderHighErrorHint this.state.HighFocused: " + this.state.HighFocused + ", y: " + this.upInputPosition.py + ", x: " + this.upInputPosition.px)
		if(this.state.HighError && this.state.HighFocused){
			//Sometimes the position calculation will fail...So we may need to update the position...
			if(this.upInputPosition && (this.upInputPosition.py != 0 && this.upInputPosition.px < width)) {
				return this.renderErrorBubble(this.upInputPosition.px, this.upInputPosition.py, this.state.HighError)
			} else{
				this.calculateInputPosition(()=>{
					this.setState({
						HighError: this.state.HighError,
					})
				})
			}
		}
		return (<View/>)
	},

	renderLowErrorHint: function(){
		if(this.state.LowError && this.state.LowFocused){
			if(this.upInputPosition){
				return this.renderErrorBubble(this.downInputPosition.px, this.downInputPosition.py, this.state.LowError)
			}else{
				this.calculateInputPosition(()=>{
					this.setState({
						LowError: this.state.LowError,
					})
				})
			}
		}
		return (<View/>)
	},

	render: function() {
		return (
			<View style={styles.wrapper} ref="root">
				<NavBar title='提醒设置'
					showBackButton={true}
					textOnRight='完成'
					rightTextOnClick={this.onComplete}
					enableRightText={!this.hasError() && this.state.isFinishButtonEnabled}
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
				{this.renderHighErrorHint()}
				{this.renderLowErrorHint()}
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
		padding: 0,
		width: Math.round(width/3),
		alignSelf: 'center',
		textAlignVertical:'center',
		flex:1,
	},
	cellInputWrapper: {
		borderWidth: 1.0,
		borderRadius: 2,
		borderColor: '#efeff4',
		height: 31,
	},
	bottomText: {
		marginTop:15,
		marginLeft: 12,
		fontSize: 12,
		color: '#8d8d8d',
	},
	tooltip:{
    position :'absolute',
	},
	bubbleImage:{
		width: 118,
		height: 42,
	},
	errorText:{
		position: 'absolute',
		top:10,
		right: 12,
		color: 'red',
		backgroundColor: 'transparent'
	}
});


module.exports = EditAlertPage;

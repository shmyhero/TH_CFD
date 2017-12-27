'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ListView,
	Dimensions,
	Image,
	TouchableHighlight,
} from 'react-native';

var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var LogicData = require('../../LogicData')
var NetworkModule = require('../../module/NetworkModule')
var NetConstants = require('../../NetConstants')
var ErrorBar = require('../component/ErrorBar')
var OpenAccountHintBlock = require('./OpenAccountHintBlock')
var LS = require("../../LS")

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(15*width/375)

var OA_WARNING_DIALOG = "oaWarningDialog";
var OAWarningDialog = require('./OAWarningDialog');

var OADocumentInfoPage = React.createClass({
	isProceedAnyway: false,

	listRawData: [
			{"key":"OPEN_ACCOUNT_TERMS", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "1")},
			{"key":"OPEN_ACCOUNT_RISK_DISCLOSURE", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "2")},
			{"key":"OPEN_ACCOUNT_DATA_SHARING_AGREEMENT", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "3")},
			{"key":"OPEN_ACCOUNT_TRADE_ESTABLISH_POLICY", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "4")},
			{"key":"OPEN_ACCOUNT_COMPLAINT_INFORMATION", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "5")},
			{"key":"OPEN_ACCOUNT_PORTRAIT_INFORMATION", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "6")},
			{"key":"OPEN_ACCOUNT_RANKING_TERMS", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "10")},
			{"key":"OPEN_ACCOUNT_IMPORTANT_DOCUMENTS", "url": NetConstants.TRADEHERO_API.LIVE_REGISTER_TERMS.replace("<id>", "11")},
			
			{"key":"OPEN_ACCOUNT_ABOUT_MARGIN_TRADING", "type": "aboutBlock" },
			{"type":"openAccountHintBlock", },
		],

	propTypes: {
		data: React.PropTypes.object,
		onPop: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			data: null,
			onPop: ()=>{},
		}
	},

	getData: function(){
		return {};
	},

	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			dataSource: ds.cloneWithRows(this.listRawData),
			enabled: true,
			hasRead: false,
			validateInProgress: false,
		};
	},

	proceedAnyway: function(){
		this.isProceedAnyway = true;
		this.gotoNext();
	},

	gotoNext: function(){
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP6, TalkingdataModule.LABEL_OPEN_ACCOUNT)

		this.setState({
			enabled: false,
			validateInProgress: true,
			error: null
		});

		var openAccountData = OpenAccountRoutes.getOpenAccountData();
		if(this.isProceedAnyway){
			openAccountData["confirmMifidOverride"] = true;
		}

		OpenAccountRoutes.loadMIFIDTestVerified((value)=>{
			if(!value){
				OpenAccountRoutes.storeMIFIDTestVerified(true);
			}

			//Test errors
			//openAccountData["username"] = "username";
			//openAccountData["password"] = "2";
			//openAccountData["idCode"] = "9"

			var userData = LogicData.getUserData();

			var url = NetConstants.CFD_API.CHECK_LIVE_USERNAME;
			url = url.replace('<userName>', openAccountData["username"]);

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				(responseJson) => {
					//User name duplication check success. Do register.
					NetworkModule.fetchTHUrl(
						NetConstants.CFD_API.REGISTER_LIVE_ACCOUNT,
						{
							method: 'POST',
							body: JSON.stringify(openAccountData),
							headers: {
								'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
								'Content-Type': 'application/json; charset=utf-8',
							},
						},
						(responseJson) => {
							if(!responseJson.success && responseJson.message === "MifidTestFailed"){
								this.refs[OA_WARNING_DIALOG].show();
							}else{
								this.setState({
									enabled: true,
									validateInProgress: false,
								});
								if(!responseJson.success){
									console.log(JSON.stringify(responseJson))
									this.parseError(responseJson.message);
								}else{
									var trackingData = {};
									trackingData[TalkingdataModule.AD_TRACKING_KEY_USER_ID] = userData.userId;
									TalkingdataModule.trackADEvent(TalkingdataModule.AD_TRACKING_EVENT_REGISTER, trackingData);

									OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
								}
							}
						},
						(errorResult) => {
							console.log("api Error: " + errorResult.errorMessage);
							this.setState({
								enabled: true,
								validateInProgress: false,
							});
							this.parseError(errorResult.errorMessage);
						});
				},
				(errorResult) => {
					console.log("api Error: " + errorResult.errorMessage);
					this.setState({
						enabled: true,
						validateInProgress: false,
					});
					if(errorResult.errorMessage.includes("服务器繁忙")){
						this.setState({
							error: errorResult.errorMessage
						});
					} else {
						var errorList = [];
						errorList.push({"key": "username", "error": errorResult.errorMessage});
						OpenAccountRoutes.showError(errorList, this.props.navigator, this.props.onPop);
					}
				}
			);
		})
	},

	parseError: function(errorMessage){
		if(errorMessage === "MifidTestFailed"){
			this.refs[OA_WARNING_DIALOG].show();
			return;
		}
		if(!errorMessage){
			this.setState({
				error: LS.str("ENCOUNTER_ERROR")
			})
			return;
		}
		var regex1 = /Field '\w+'.+\./g; //1. Find "Filed 'xxx'""
		var regex2 = /'(.+?)'/g; //2. Find key name.
		var errorlines = errorMessage.match(regex1);
		if(errorMessage.includes("服务器繁忙")){
			this.setState({
				error: errorMessage
			})
			return;
		}
		if(errorlines){
			var errorList = [];
			for(var i = 0 ; i < errorlines.length; i++){
				var keys = errorlines[i].match(regex2);
				if(keys.length){
					//TODO: parse error?
					var key = keys[0].toLowerCase();
					key = key.replace("'", "").replace("'", "");
					console.log("key: " + key)

					var error = LS.str("OPEN_ACCOUNT_WRONG_FORMAT");
					if(errorlines[i].indexOf("UserNameAvailableRule")){
						error = LS.str("OPEN_ACCOUNT_USERNAME_EXIST")
					}

					errorList.push({"key": key, "error": error});
				}
			}

			if(errorList.length){
				console.log(JSON.stringify(errorList));
				if(!OpenAccountRoutes.showError(errorList, this.props.navigator, this.props.onPop)){
					this.setState({
						error: errorMessage
					})
				}
			}
		}else{
			this.setState({
				error: errorMessage
			})
		}
	},

	documentPressed: function(rowData) {
		this.props.navigator.push({
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: rowData.url,
			title: LS.str(rowData.key),
			themeColor: ColorConstants.TITLE_DARK_BLUE,
		});
	},

	renderAboutCashDeposit:function(){
		return(
			<View style={styles.aboutCash}>
	  		<Text style = {[styles.textTitle,{marginTop:0}]}>{LS.str("OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_HEADER")}</Text>
				<View style = {styles.textLine}>
					<Text style = {styles.textRound}>●</Text>
					<Text style = {styles.textValue}>{LS.str("OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_1")}</Text>
				</View>

				<View style = {styles.textLine}>
					<Text style = {styles.textRound}>●</Text>
					<Text style = {styles.textValue}>{LS.str("OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_2")}</Text>
				</View>

				<View style = {styles.textLine}>
					<Text style = {styles.textRound}>●</Text>
					<Text style = {styles.textValue}>{LS.str("OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_3")}</Text>
				</View>

				<View style = {styles.textLine}>
					<Text style = {styles.textRound}>●</Text>
					<Text style = {styles.textValue}>{LS.str("OPEN_ACCOUNT_ABOUT_MARGIN_TRADING_LINE_4")}</Text>
				</View>
				<Text style = {styles.textTitle}>{LS.str("OPEN_ACCOUNT_NOT_US_CHECK")}</Text>
	  	</View>
		)
	},

	renderRow: function(rowData, sectionID, rowID) {
		if(rowData.type == 'openAccountHintBlock'){
			return (
				<OpenAccountHintBlock />
			);
		}else if(rowData.type && rowData.type === "aboutBlock"){//关于保证金交易
			return this.renderAboutCashDeposit()
		}else{
			return (
				<TouchableHighlight onPress={() => this.documentPressed(rowData)}>
					<View style={styles.rowWrapper}>
						<Text style={styles.rowTitle}>{LS.str(rowData.key)}</Text>
						<Image style={styles.image} source={require("../../../images/icon_arrow_right.png")} />
					</View>
				</TouchableHighlight>
				)
		}
	},
	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	},

	onClickCheckbox: function(value){
		this.setState({
			hasRead: value,
		})
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<ErrorBar error={this.state.error}/>
				<ListView
			    style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
				<View style={styles.checkboxView}>
					<CheckBoxButton
						text={LS.str("OPEN_ACCOUNT_READ_DOCUMENT")}
						defaultSelected={false}
						onPress={(value)=>{this.onClickCheckbox(value)}}/>
				</View>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.enabled && this.state.hasRead}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={this.state.validateInProgress? LS.str("VALIDATE_IN_PROGRESS"): LS.str("OPEN_ACCOUNT_SUBMIT")} />
				</View>
				<OAWarningDialog ref={OA_WARNING_DIALOG}
					proceedCallback={()=>this.proceedAnyway()}/>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width:width,
 		alignItems: 'stretch',
  	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
	},

	aboutCash:{
		paddingTop:15,
		paddingLeft:15,
		paddingRight:15,
		width:width,
	},

	textRound:{
		fontSize:12,
		color:'#cccccc'
	},

	textTitle:{
		fontSize:14,
		color:'black',
		marginTop:15,
		marginBottom:5,
	},

	textValue:{
		fontSize:12,
		color:'#7b7b7b',
		marginLeft:5,
		marginRight:10,
	},

	textLine:{
		flexDirection:'row',
		marginTop:10,
	},

	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: rowPadding,
		paddingTop: rowPadding,
		backgroundColor: '#ffffff',
	},

	line: {
		height: 0.5,
		backgroundColor: 'white',
	},

	separator: {
		marginLeft: 0,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	rowTitle:{
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
	},
	image: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},

	checkboxView: {
		height: 30,
		backgroundColor: 'white',
		paddingLeft: 15,
		paddingTop: 10,
	},
	bottomArea: {
		height: 72,
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
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
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});


module.exports = OADocumentInfoPage;

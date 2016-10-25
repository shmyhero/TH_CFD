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
var ErrorBar = require('./ErrorBar')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var listRawData = [
		{"key":"交易条款说明", "url":"http://baidu.com"},
		{"key":"风险与注意事项告知说明", "url":"http://baidu.com"},
		{"key":"数据信息共享说明", "url":"http://baidu.com"},
		{"key":"Ayondo服务协议说明", "url":"http://baidu.com"},
		{"key":"交易通知说明", "url":"http://baidu.com"}];

var OADocumentInfoPage = React.createClass({
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
			dataSource: ds.cloneWithRows(listRawData),
			enabled: true,
			hasRead: false,
			validateInProgress: false,
		};
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP5, TalkingdataModule.LABEL_OPEN_ACCOUNT)

		this.setState({
			enabled: false,
			validateInProgress: true,
			error: null
		});

		var openAccountData = OpenAccountRoutes.getOpenAccountData();
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
						this.setState({
							enabled: true,
							validateInProgress: false,
						});
						if(!responseJson.success){
							console.log(JSON.stringify(responseJson))
							alert(JSON.stringify(responseJson))
							this.parseError(responseJson.message);
						}else{
							//alert("success")
							OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
						}
					},
					(errorMessage) => {
						console.log("api Error: " + errorMessage);
						this.setState({
							enabled: true,
							validateInProgress: false,
						});
						this.parseError(errorMessage);
					});
			},
			(errorMessage) => {
				console.log("api Error: " + errorMessage);
				this.setState({
					enabled: true,
					validateInProgress: false,
				});
				var errorList = [];
				errorList.push({"key": "username", "error": errorMessage});
				OpenAccountRoutes.showError(errorList, this.props.navigator, this.props.onPop);

			}
		);
	},

	parseError: function(errorMessage){
		var regex1 = /Field '\w+'.+\./g; //1. Find "Filed 'xxx'""
		var regex2 = /'(.+?)'/g; //2. Find key name.
		var errorlines = errorMessage.match(regex1);
		if(errorlines){
			var errorList = [];
			for(var i = 0 ; i < errorlines.length; i++){
				var keys = errorlines[i].match(regex2);
				if(keys.length){
					//TODO: parse error?
					var key = keys[0].toLowerCase();
					key = key.replace("'", "").replace("'", "");
					console.log("key: " + key)

					var error = "格式不正确";
					if(errorlines[i].indexOf("UserNameAvailableRule")){
						error = "用户名已存在"
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
			title: rowData.key,
			themeColor: ColorConstants.TITLE_DARK_BLUE,
		});
	},

	renderRow: function(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight onPress={() => this.documentPressed(rowData)}>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<Image style={styles.image} source={require("../../../images/icon_arrow_right.png")} />
				</View>
			</TouchableHighlight>
			)
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
						text={"我已阅读并同意上述相关内容"}
						defaultSelected={false}
						onPress={(value)=>{this.onClickCheckbox(value)}}/>
				</View>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.enabled && this.state.hasRead}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={this.state.validateInProgress? "信息正在检查中...": '下一步'} />
				</View>
			</View>
		);
	},
});

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
   		alignItems: 'stretch',
    	justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
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
		color: '#333333',
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

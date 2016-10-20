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

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var listRawData = [
		{"key":"交易条款说明", "url":"http://baidu.com"},
		{"key":"风险与注意事项告知说明", "url":"2"},
		{"key":"数据信息共享说明", "url":"3"},
		{"key":"Ayondo服务协议说明", "url":""},
		{"key":"交易通知说明", "url":""}];

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

		/*this.setState({
			enabled: false,
			validateInProgress: true,
		});
*/
		var openAccountData = OpenAccountRoutes.getOpenAccountData();
		/*{


		//TEST:DATA
		//Duplicate username error: api Error: Validation failed. Field 'UserName' failed  UserNameAvailableRule. Value: 'thcn1'.
		"username": "thcn2",
		"password": "abcd1234",
		"email": "anonymous@tradehero.mobi",

		"realName": "",
		"gender": true,//男true 女false
		"birthday": "1990.01.01",
		"ethnic": "汉",
		"idCode": "310104198501251234",
		"addr": "上海市徐汇区徐汇路1号",
		"issueAuth": "徐汇公安局",
		"validPeriod": "2000.01.20-2016.01.19",

		"annualIncome": 1,//参照AMS文档
		"netWorth": 1,//参照AMS文档
		"investPct": 1,//参照AMS文档
		"empStatus":"Employed",//参照AMS文档
		"investFrq": 1,//参照AMS文档
		"hasProExp": false,
		"hasAyondoExp":false,
		"hasOtherQualif":false,
		"expOTCDeriv":false,
		"expDeriv":false,
		"expShareBond":false

		}
		*/
/*
		var userData = LogicData.getUserData();
		NetworkModule.fetchTHUrlWithNoInternetCallback(
			NetConstants.CFD_API.REGISTER_LIVE_ACCOUNT,
			{
				method: 'POST',
				body: JSON.stringify(
					openAccountData
					),
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
					alert(JSON.stringify(responseJson))
				}else{
					OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
				}
			},
			(errorMessage) => {
				console.log("api Error: " + errorMessage);
			},
			(errorMessage) => {
				console.log("networkError: " + errorMessage);
			}
		)
		*/
	},

	documentPressed: function(url) {
		// todo
	},

	renderRow: function(rowData, sectionID, rowID ) {
		return (
			<TouchableHighlight onPress={() => this.documentPressed(rowData.url)}>
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
		backgroundColor: '#4567a4',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});


module.exports = OADocumentInfoPage;

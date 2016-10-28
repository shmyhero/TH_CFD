'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	TextInput,
	ScrollView,
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var OpenAccountUtils = require('./OpenAccountUtils')
var ErrorBar = require('./ErrorBar')
var NetworkModule = require('../../module/NetworkModule')
var NetConstants = require('../../NetConstants')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var listRawData = [
		{"key":"username", "title": "用户名", "value":"", hint: "4位以上登入用户名", "type": "userName", maxLength: 20},
		{"key":"password", "title":"登入密码", "value":"", hint: "8位以上数字字母组合", "type": "pwd", maxLength: 25},
		{"key":"passwordOnceMore", "title":"确认密码", "value":"", hint: "确认登入密码", "type": "pwd", ignoreInRegistery: true, maxLength: 25},
		{"key":"email", "title":"常用邮箱", "value":"", hint: "请输入常用邮箱", "type": "email", maxLength: 60},
		{"title":"账户信息将自动绑定到盈交易实盘账户", "type": "hint"},
	];
var errorRow = [];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });

var OAAccountBasicSettingsPage = React.createClass({
	propTypes: {
		data: React.PropTypes.array,
		onPop: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			data: null,
			onPop: ()=>{},
		}
	},

	getInitialState: function() {
		OpenAccountUtils.getPageListRawDataFromData(listRawData, this.props.data);

		return {
			dataSource: ds.cloneWithRows(listRawData),
			hasError: false,
			enabled: true,
		};
	},

	checkData: function(){
		this.checkPassword();
	},

	gotoNext: function() {
		this.setState({
			enabled: false,
			validateInProgress: true,
		})

		OpenAccountUtils.validateRows(listRawData, this.validateRowValue, ()=>{
			if(OpenAccountUtils.canGoNext(listRawData)){
				TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP3, TalkingdataModule.LABEL_OPEN_ACCOUNT);
				OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
			}else{
				this.setState({
					enabled: true,
					validateInProgress: false,
				})
			}
		});
	},

	getData: function(){
		return OpenAccountUtils.getDataFromPageListRawData(listRawData);
	},

	updateList: function(){
		this.setState({
				dataSource: ds.cloneWithRows(listRawData),
		});
	},

	textInputChange: function(text, rowID) {
		listRawData[rowID].value = text;
		listRawData[rowID].checked = false;
		if(listRawData[rowID].error){
			listRawData[rowID].error = null;
		}

		if(listRawData[rowID].type === "pwd"){
			listRawData[1].error = null;
			listRawData[2].error = null;
		}

		this.updateList();
	},

	textInputEndChange: function(event, rowID){
		this.validateRowValue(rowID);
	},

	validateRowValue: function(rowID){
		if(listRawData[rowID].value && listRawData[rowID].value.length > 0){
			listRawData[rowID].checked = true;
			if(listRawData[rowID].type === "userName"){
				return this.checkUserName(rowID);
			}
			else if(listRawData[rowID].type === "pwd"){
				return this.checkPassword(rowID);
			}
			else if(listRawData[rowID].type === "email"){
				return this.checkEmail(rowID);
			}
			return new Promise(resolve=>{
				resolve();
			})
		}
	},

	checkUserName: function(rowID){
		this.setState({
			validateInProgress: true,
		})
		return new Promise(resolve=>{
			if(listRawData[rowID].value && listRawData[rowID].value.length <= 4){
				listRawData[rowID].error = "用户名必须是5到20位字母和数字的组合";
				this.updateList();
				this.setState({
					validateInProgress: false,
				})
				if(resolve){
					resolve();
				}
				return;
			}

			var url = NetConstants.CFD_API.CHECK_LIVE_USERNAME;
			url = url.replace('<userName>', listRawData[rowID].value);
			var userData = LogicData.getUserData();

			NetworkModule.fetchTHUrlWithNoInternetCallback(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				(responseJson) => {
					if(!responseJson.success){
						listRawData[rowID].error = responseJson.message;
						this.updateList();
					}else{
						if(listRawData[rowID].error){
							listRawData[rowID].error = null;
							this.updateList();
						}
					}
					this.setState({
						validateInProgress: false,
					})
					if(resolve){
						resolve();
					}
				},
				(errorMessage) => {
					console.log("api Error: " + errorMessage);
					listRawData[rowID].error = errorMessage;
					this.updateList();
					this.setState({
						validateInProgress: false,
					})
					if(resolve){
						resolve();
					}
				},
				(errorMessage) => {
					console.log("networkError: " + errorMessage);
					listRawData[rowID].error = errorMessage;
					this.updateList();
					this.setState({
						validateInProgress: false,
					})
					if(resolve){
						resolve();
					}
				}
			)
		});

	},

	checkPassword: function(){
		return new Promise(resolve=>{
			var hasError = false;
			if(listRawData[1].value){
				if(listRawData[1].value.length < 8){
					listRawData[1].error = "密码必须是 8 位或以上字母和数字的组合";
					hasError = true;
				}else{
					var re = /^[0-9a-zA-Z\!\#\*\$\-\/\=\?\@\.\,\:\;]+$/;
					if(!re.test(listRawData[1].value)){
						listRawData[1].error = "密码必须是 8 位或以上字母和数字的组合";
						hasError = true;
					}
				}
				//At least 4 chars. Allowed chars: [0-9a-zA-Z\!\#\*\$\-\/\=\?\@\.\,\:\;]
			}
			if(listRawData[1].value && listRawData[2].value && listRawData[1].value !== listRawData[2].value){
				listRawData[2].error = "两次输入的密码不一致";
				hasError = true;
			}

			if(!hasError){
				if(listRawData[2].error){
					listRawData[2].error = null;
				}
			}

			this.updateList();
			listRawData[1].checked = true;
			listRawData[2].checked = true;
			if(resolve){
				resolve();
			}
		});
	},

	checkEmail: function(rowID){
		return new Promise(resolve=>{
			//var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var re = /^\w+@[0-9a-zA-Z_]+?\.[0-9a-zA-Z]+$/;
	    if(re.test(listRawData[rowID].value)){
				if(listRawData[rowID].error){
					listRawData[rowID].error = null;
					this.updateList();
				}
			}else{
				if(!listRawData[rowID].error){
					listRawData[rowID].error = "邮箱格式不正确";
					this.updateList();
				}
			}
			if(resolve){
				resolve();
			}
		});
	},

	renderRow: function(rowData, sectionID, rowID) {
		if(rowData.type === "hint"){
			return (
				<Text style={styles.hintText}>
					{rowData.title}
				</Text>
			)
		}else{
			var secureTextEntry = rowData.type === "pwd";
			var style = styles.rowTitle;
			if(rowData.error){
				style = styles.errorTitleText;
			}
			return (
				<View>
					<View style={styles.rowWrapper}>
						<Text style={style}>{rowData.title}</Text>
						<TextInput style={styles.valueText}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry={secureTextEntry}
							defaultValue={rowData.value}
							placeholder={rowData.hint}
							selectionColor="#426bf2"
							underlineColorAndroid='transparent'
							onChangeText={(text)=>this.textInputChange(text, rowID)}
							onEndEditing={(event)=>this.textInputEndChange(event, rowID)}
							maxLength={rowData.maxLength}/>
					</View>
					<ErrorBar error={rowData.error}/>
				</View>
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

	renderListView: function(){
		var listDataView = listRawData.map((data, i)=>{
			return(
				<View key={i}>
					{this.renderRow(data, 's1', i)}
					{this.renderSeparator('s1', i, false)}
				</View>
			);
		})
		return (
			<View>
				{listDataView}
			</View>);
	},

	render: function() {
		var nextButtonEnabled = OpenAccountUtils.canGoNext(listRawData);

		return (
			<View style={styles.wrapper}>
				<ScrollView style={styles.list}>
					{this.renderListView()}
				</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.enabled && nextButtonEnabled}
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
	errorTitleText:{
		fontSize: fontSize,
		color: 'red',
		flex: 1,
	},
	valueText: {
		fontSize: fontSize,
		color: '#333333',
		flex: 3,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
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
	hintText: {
		marginTop: 12.5,
		paddingLeft: 15,
		paddingRight: 15,
		fontSize: 12,
		color: '#7b7b7b'
	}
});


module.exports = OAAccountBasicSettingsPage;

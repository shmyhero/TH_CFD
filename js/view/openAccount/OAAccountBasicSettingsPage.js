'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	TextInput,
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var ErrorBar = require('./ErrorBar')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var listRawData = [
		{"key":"用户名", "value":"", "type": "userName"},
		{"key":"登入密码", "value":"", "type": "pwd"},
		{"key":"确认密码", "value":"", "type": "pwd"},
		{"key":"常用邮箱", "value":"", "type": "email"},
	];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });

var OAAccountBasicSettingsPage = React.createClass({
	errorCount: 0,

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

	getInitialState: function() {
		if (this.props.data && this.props.data.listData) {
			var certificateIdCardInfo = this.props.data.listData;
			listRawData = certificateIdCardInfo;
		}
		return {
			dataSource: ds.cloneWithRows(listRawData),
			hasError: false,
		};
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP3, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	},

	getData: function(){
		return {listData: listRawData};
	},

	updateList: function(){
		this.setState(
			{
				dataSource: ds.cloneWithRows(listRawData),
			}
		)
	},

	textInputChange: function(text, rowID) {
		listRawData[rowID].value = text;

		//alert(JSON.stringify(listRawData));
	},

	textInputEndChange: function(event, rowID){
		if(listRawData[rowID].type === "userName"){
			this.checkUserName(rowID);
		}	else if(listRawData[rowID].type === "pwd"){
			this.checkPassword(rowID);
		}

	},

	checkUserName: function(rowID){
		if(listRawData[rowID].value === "aaa"){
			listRawData[rowID].error = "用户名已存在";
			this.errorCount++;
			this.updateList();
		}else{
			if(listRawData[rowID].error){
				listRawData[rowID].error = null;
				this.errorCount--;
				this.updateList();
			}
		}
	},


	checkPassword: function(rowID){
		if(listRawData[1].value !== listRawData[2].value){
			listRawData[2].error = "2次输入密码不一致";
			this.errorCount++;
			this.updateList();
		}else{
			if(listRawData[rowID].error){
				listRawData[rowID].error = null;
				this.errorCount--;
				this.updateList();
			}
		}
	},

	renderRow: function(rowData, sectionID, rowID) {
		var secureTextEntry = rowData.type === "pwd";

		return (
			<View>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<TextInput style={styles.valueText}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={secureTextEntry}
						defaultValue={rowData.value}
						onChangeText={(text)=>this.textInputChange(text, rowID)}
						onEndEditing={(event)=>this.textInputEndChange(event, rowID)} />
				</View>
				<ErrorBar error={rowData.error}/>
			</View>
			)
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	},

	render: function() {
		var enabled = this.errorCount === 0;

		return (
			<View style={styles.wrapper}>
			    <ListView
			    	style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={enabled}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text='下一步' />
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
		backgroundColor: '#4567a4',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});


module.exports = OAAccountBasicSettingsPage;

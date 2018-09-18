'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import createReactClass from 'create-react-class';
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
var ErrorBar = require('../component/ErrorBar')
var NetworkModule = require('../../module/NetworkModule')
var NetConstants = require('../../NetConstants')
var OpenAccountHintBlock = require('./OpenAccountHintBlock')
var LS = require("../../LS")

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(15*width/375)

var defaultRawData = [
	{"key":"username", "title": "OPEN_ACCOUNT_USERNAME", "value":"", hint: "OPEN_ACCOUNT_USERNAME_HINT", "type": "userName", maxLength: 20},
	{"key":"password", "title": "OPEN_ACCOUNT_PASSWORD", "value":"", hint: "OPEN_ACCOUNT_PASSWORD_HINT", "type": "pwd", maxLength: 25},
	{"key":"passwordOnceMore", "title": "OPEN_ACCOUNT_PASSWORD_AGAIN", "value":"", hint: "OPEN_ACCOUNT_PASSWORD_AGAIN_HINT", "type": "pwd", ignoreInRegistery: true, maxLength: 25},
	{"key":"email", "title": "OPEN_ACCOUNT_EMAIL", "value":"", hint: "OPEN_ACCOUNT_EMAIL_HINT", "type": "email", maxLength: 60},
	{"title": "OPEN_ACCOUNT_REGISTER_HINT", "type": "hint"},
	{"type":"openAccountHintBlock"},
];

var OAAccountBasicSettingsPage = createReactClass({
    displayName: 'OAAccountBasicSettingsPage',
    listRawData: [],
    ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 }),

    propTypes: {
		data: PropTypes.array,
		onPop: PropTypes.func,
	},

    getDefaultProps() {
		return {
			data: null,
			onPop: ()=>{},
		}
	},

    getInitialState: function() {
		this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

		OpenAccountUtils.getPageListRawDataFromData(this.listRawData, this.props.data);

		return {
			dataSource: this.ds.cloneWithRows(this.listRawData),
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

		OpenAccountUtils.validateRows(this.listRawData, this.validateRowValue, ()=>{
			if(OpenAccountUtils.canGoNext(this.listRawData)){
				TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP1, TalkingdataModule.LABEL_OPEN_ACCOUNT);
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
		return OpenAccountUtils.getDataFromPageListRawData(this.listRawData);
	},

    updateList: function(){
		this.setState({
				dataSource: this.ds.cloneWithRows(this.listRawData),
		});
	},

    textInputChange: function(text, rowID) {
		this.listRawData[rowID].value = text;
		this.listRawData[rowID].checked = false;
		if(this.listRawData[rowID].error){
			this.listRawData[rowID].error = null;
		}

		if(this.listRawData[rowID].type === "pwd"){
			this.listRawData[1].error = null;
			this.listRawData[2].error = null;
		}

		this.updateList();
	},

    textInputEndChange: function(event, rowID){
		this.validateRowValue(rowID);
	},

    validateRowValue: function(rowID){
		if(this.listRawData[rowID].value && this.listRawData[rowID].value.length > 0){
			this.listRawData[rowID].checked = true;
			if(this.listRawData[rowID].type === "userName"){
				return this.checkUserName(rowID);
			}
			else if(this.listRawData[rowID].type === "pwd"){
				return this.checkPassword(rowID);
			}
			else if(this.listRawData[rowID].type === "email"){
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

			if(this.listRawData[rowID].value){
				var re = /^\w*[a-zA-Z]\w*$/;
				if(this.listRawData[rowID].value.length <= 4 || !re.test(this.listRawData[rowID].value)){
					this.listRawData[rowID].error = LS.str("OPEN_ACCOUNT_USERNAME_ERROR");
					this.updateList();
					this.setState({
						validateInProgress: false,
					})
					if(resolve){
						resolve();
					}
					return;
				}
			}

			var url = NetConstants.CFD_API.CHECK_LIVE_USERNAME;
			url = url.replace('<userName>', this.listRawData[rowID].value);
			var userData = LogicData.getUserData();

			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				(responseJson) => {
					if(!responseJson.success){
						this.listRawData[rowID].error = responseJson.message;
						this.updateList();
					}else{
						if(this.listRawData[rowID].error){
							this.listRawData[rowID].error = null;
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
				(result) => {
					console.log("api Error: " + result.errorMessage);
					this.listRawData[rowID].error = result.errorMessage;
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
			if(this.listRawData[1].value){
				if(this.listRawData[1].value.length < 8){
					this.listRawData[1].error = LS.str("OPEN_ACCOUNT_PASSWORD_ERROR");
					hasError = true;
				}else{
					var re = /^[0-9a-zA-Z\!\#\*\$\-\/\=\?\@\.\,\:\;]+$/;
					if(!re.test(this.listRawData[1].value)){
						this.listRawData[1].error = LS.str("OPEN_ACCOUNT_PASSWORD_ERROR");
						hasError = true;
					}
				}
				//At least 4 chars. Allowed chars: [0-9a-zA-Z\!\#\*\$\-\/\=\?\@\.\,\:\;]
			}
			if(this.listRawData[1].value && this.listRawData[2].value && this.listRawData[1].value !== this.listRawData[2].value){
				this.listRawData[2].error = LS.str("OPEN_ACCOUNT_PASSWORD_NOT_SAME_ERROR");
				hasError = true;
			}

			if(!hasError){
				if(this.listRawData[2].error){
					this.listRawData[2].error = null;
				}
			}

			this.updateList();
			this.listRawData[1].checked = true;
			this.listRawData[2].checked = true;
			if(resolve){
				resolve();
			}
		});
	},

    checkEmail: function(rowID){
		return new Promise(resolve=>{
			//var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var re = /^[\w\._\-]+@([0-9a-zA-Z_]+?\.)+[0-9a-zA-Z]+$/;
	    if(re.test(this.listRawData[rowID].value)){
				if(this.listRawData[rowID].error){
					this.listRawData[rowID].error = null;
					this.updateList();
				}
			}else{
				if(!this.listRawData[rowID].error){
					this.listRawData[rowID].error = LS.str("OPEN_ACCOUNT_EMAIL_ERROR");
					this.updateList();
				}
			}
			if(resolve){
				resolve();
			}
		});
	},

    renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === "openAccountHintBlock"){
			return (
				<OpenAccountHintBlock />
			)
		} else if(rowData.type === "hint"){
			return (
				<Text style={styles.hintText}>
					{LS.str(rowData.title)}
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
						<Text style={style}>{LS.str(rowData.title)}</Text>
						<TextInput style={styles.valueText}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry={secureTextEntry}
							defaultValue={rowData.value}
							placeholder={LS.str(rowData.hint)}
							placeholderColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
							selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
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
		var listDataView = this.listRawData.map((data, i)=>{
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
		var nextButtonEnabled = OpenAccountUtils.canGoNext(this.listRawData);

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
						text={this.state.validateInProgress? LS.str("VALIDATE_IN_PROGRESS"): LS.str("NEXT")} />
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
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
	},
	errorTitleText:{
		fontSize: fontSize,
		color: 'red',
		flex: 1,
	},
	valueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
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

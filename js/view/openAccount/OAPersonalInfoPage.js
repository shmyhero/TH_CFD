'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView
} from 'react-native';

var TimerMixin = require('react-timer-mixin');
import Picker from 'react-native-picker';

import DatePicker from 'react-native-datepicker'

var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var LogicData = require('../../LogicData')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var OpenAccountUtils = require('./OpenAccountUtils')
var ErrorBar = require('./ErrorBar')
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');
var LogicData = require('../../LogicData');

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

const GenderTranslater = [
  {"value":true, "displayText": "男"},
  {"value":false, "displayText": "女"},
]

var defaultRawData = [
		{"title":"姓", "key": "lastName", "value":"", hint:"请输入姓", maxLength: 50, "ignoreInRegistery": true},	//TODO: add ignoreInRegistery when API is avaliable.
		{"title":"名", "key": "firstName", "value":"", hint:"请输入名", maxLength: 50, "ignoreInRegistery": true},
		{"title":"性别", "key": "gender", "value":"", hint: "点击选择", "type": "choice", "choices": GenderTranslater},
		{"title":"出生日期", "key": "birthday", "value":"", hint: "点击选择", "type": "date"},
		{"title":"民族", "key": "ethnic", "value":"", hint:"请输入民族", maxLength: 10,},
		{"title":"身份证号", "key": "idCode", "value":"", hint:"请输入身份证号", maxLength: 18, minLength: 18, "ignoreInRegistery": true},
		{"title":"证件地址", "key": "addr", "value":"", hint:"请输入证件地址", maxLength:75, maxLine: 2},
		{"title":"签发机关", "key": "issueAuth", hint:"请输入签发机关", "value":""},
		{"title":"有效期限", "key": "validPeriod", "value":"", "type": "datePeriod"}];

const DEFAULT_ERROR = "身份一致性验证失败";

var OAPersonalInfoPage = React.createClass({
	mixins: [TimerMixin],
	pickerDisplayed: false,

	propTypes: {
		data: React.PropTypes.array,
		onPop: React.PropTypes.func,
	},

	listRawData: [],

	ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 }),

	getDefaultProps() {
		return {
			data: null,
			onPop: ()=>{},
		}
	},

	getInitialState: function() {
		this.listRawData = JSON.parse(JSON.stringify(defaultRawData));

		if (this.props.data && this.props.data) {
			OpenAccountUtils.getPageListRawDataFromData(this.listRawData, this.props.data);

			var routes = this.props.navigator.getCurrentRoutes();
			var lastRoute = routes[routes.length-1];
			if(lastRoute){
				console.log("lastRoute: " + JSON.stringify(lastRoute));
				if(lastRoute.isNext){
					console.log("getInitialState!");
					OpenAccountRoutes.setCurrentRouteStateAsLatest(this.props.navigator, this.listRawData);
				}
			}
		}
		return {
			dataSource: this.ds.cloneWithRows(this.listRawData),
			validateInProgress: false,
			selectedPicker: -1,
			error: null
		};
	},

	gotoNext: function() {
		//GZT validation.
		if(this.checkValues()){
			this.setState({
				validateInProgress: true,
				error: null,
			})

			var verifyBody = {};
			for(var i = 0; i< this.listRawData.length; i++){
				if(this.listRawData[i].ignoreInRegistery){
					var key = this.listRawData[i].key
					if(this.listRawData[i].key == "idCode"){
						key = "userId";
					}
					verifyBody[key] = this.listRawData[i].value;
				}
			}

			var userData = LogicData.getUserData()
		 	var notLogin = Object.keys(userData).length === 0
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.ID_CHECK,
				{
					method: 'POST',
					body: JSON.stringify(verifyBody),
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					showLoading: true,
				},
				(responseJson) => {
					if(responseJson.result == 0){
						TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP3, TalkingdataModule.LABEL_OPEN_ACCOUNT);
						OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
					}else{
						if(responseJson.message){
							var errorMessage = decodeURIComponent(responseJson.message);
							console.log("ID validation failed. Error: " + errorMessage);
						}
						this.setState({
							error: decodeURIComponent(DEFAULT_ERROR),
							validateInProgress: false,
						})
					}
				},
				(error) => {
					this.setState({
						error: DEFAULT_ERROR,
						validateInProgress: false,
					})
				}
			);

		}
	},

	getData: function(){
		return OpenAccountUtils.getDataFromPageListRawData(this.listRawData);
	},

	onDismiss: function(){
		this.hidePicker();
	},

	textInputChange: function(text, rowID) {
		this.listRawData[rowID].value = text;
		this.listRawData[rowID].error = null;
		this.setState({
			error: null,
		})
		this.updateList();
	},

	textInputEndChange: function(event, rowID){
		if(this.listRawData[rowID].value && this.listRawData[rowID].value.length > 0){
			this.listRawData[rowID].checked = true;
			if(this.listRawData[rowID].key === "idCode"){
				this.checkIDCode(rowID);
			}
		}
	},

	checkValues: function(){
		var valid = true;
		for(var rowID = 0; rowID < this.listRawData.length; rowID++){
			if(this.listRawData[rowID].key === "idCode"){
				valid = this.checkIDCode(rowID);
			}
		}
		return valid;
	},

	checkIDCode: function(rowID){
		if(this.listRawData[rowID].value.length < 18){
			this.listRawData[rowID].error = "请输入" + this.listRawData[rowID].minLength + "位身份证号";
			this.updateList();
			return false;
		}else{
			this.listRawData[rowID].error = null;
			this.updateList();
			return true;
		}
	},

	onPressPicker: function(rowData,rowID) {
		this.setState({
			selectedPicker: rowID,
		})

		var selectedText = "";
		var choices = [];
		for(var i = 0; i < rowData.choices.length; i++){
			if(rowData.value === rowData.choices[i].value){
				selectedText = rowData.choices[i].displayText;
			}
			choices.push(rowData.choices[i].displayText);
		}

    Picker.init({
        pickerData: choices,
        selectedValue: [selectedText],
				pickerTitleText: "",
				pickerConfirmBtnColor: [25,98,221,1],
				pickerCancelBtnColor: [25,98,221,1],
        onPickerConfirm: data => {
					if(data[0] === ""){
						rowData.value = rowData.choices[0].value;
					}else{
						for(var i = 0; i < rowData.choices.length; i++){
							if(data[0] === rowData.choices[i].displayText){
								rowData.value = rowData.choices[i].value;
							}
						}
					}
					this.setState({
						dataSource: this.ds.cloneWithRows(this.listRawData),
						selectedPicker: -1,
					})
        },
    });
    Picker.show();
	},

	hidePicker: function(){
		Picker.isPickerShow(show => {
			if(show){
				Picker.hide();
				this.setState({
					selectedPicker: -1,
				})
			}
		});
	},

	onDateTimeSelect: function(rowID, value) {
		if (rowID>= 0) {
			console.log("onDatePikcerSelect: " + value);
			this.listRawData[rowID].value = value;

			this.updateList();
		}
	},

	onStartDateSelect: function(rowID, value) {
		if (rowID >= 0) {
			var dateInfo = this.parseStartEndDate(this.listRawData[rowID].value);
			this.listRawData[rowID].value = value + "-" + dateInfo.endDate;
			this.updateList();
		}
	},

	onEndDateSelect: function(rowID, value) {
		if (rowID >= 0) {
			var dateInfo = this.parseStartEndDate(this.listRawData[rowID].value);
			this.listRawData[rowID].value = dateInfo.startDate + "-" + value;
			this.updateList();
		}
	},

	parseStartEndDate: function(period){
		var dateArray = period.split("-");
		var startDate = "";
		var endDate = "";
		if(dateArray && dateArray.length == 2){
			startDate = dateArray[0];
			endDate = dateArray[1];
		}
		console.log("startDate: " + startDate + ", endDate: " + endDate);
		return {
			"startDate": startDate,
			"endDate": endDate,
		}
	},

	updateList: function(){
		this.setState({
				dataSource: this.ds.cloneWithRows(this.listRawData),
		});
	},

	chooseBirthday: function(){
		this.refs["birthdayPicker"].onPressDate();
	},

	chooseStartDatePicker: function(){
		this.refs['startDatePicker'].onPressDate();
	},

	chooseEndDatePicker: function(){
		this.refs['endDatePicker'].onPressDate();
	},

	renderDatePeriod: function(rowID, rowData){
		var dateInfo = this.parseStartEndDate(rowData.value);

		return (
			<View style={[styles.rowWrapper, {paddingTop: 0, paddingBottom: 0}]}>
				<Text style={[styles.rowTitle, {paddingTop: rowPadding, paddingBottom: rowPadding,}]}>{rowData.title}</Text>
				<View style={styles.valueContent}>
					<TouchableOpacity style={styles.datePeriodButton} onPress={()=>this.chooseStartDatePicker()}>
						<DatePicker
							style={styles.datePeriodPicker}
							ref={'startDatePicker'}
							date={dateInfo.startDate}
							mode="date"
							format="YYYY.MM.DD"
							confirmBtnText="确定"
							cancelBtnText="取消"
							showIcon={false}
							minDate={"1990-01-01"}
							maxDate={dateInfo.endDate!==""?dateInfo.endDate:"2099-01-01"}
							onDateChange={(datetime) => this.onStartDateSelect(rowID, datetime)}
							customStyles={datePeriodPickerStyle}
							placeholder="开始日期"
						/>
					</TouchableOpacity>
					<View style={{alignItems:'center', alignSelf:'center', width: 80,}}>
						<Text>-</Text>
					</View>
					<TouchableOpacity style={styles.datePeriodButton} onPress={()=>this.chooseEndDatePicker()}>
						<DatePicker
							style={styles.datePeriodPicker}
							ref={'endDatePicker'}
							date={dateInfo.endDate}
							mode="date"
							format="YYYY.MM.DD"
							confirmBtnText="确定"
							cancelBtnText="取消"
							showIcon={false}
							minDate={dateInfo.startDate!==""?dateInfo.startDate:"1990-01-01"}
							maxDate={"2099-01-01"}
							onDateChange={(datetime) => this.onEndDateSelect(rowID, datetime)}
							customStyles={datePeriodPickerStyle}
							placeholder="结束日期"
						/>

					</TouchableOpacity>
				</View>
			</View>)
	},

	renderRow: function(rowData, sectionID, rowID) {
		var rowTitleStyle = styles.rowTitle;
		if(rowData.error){
			rowTitleStyle = styles.errorRowTitle;
		}

		if (rowData.type === "choice") {
			var displayText = "";
			var textColor = ColorConstants.INPUT_TEXT_COLOR;
			for(var i = 0; i < rowData.choices.length; i++){
				if(rowData.value === rowData.choices[i].value){
					displayText = rowData.choices[i].displayText;
				}
			}
			if(displayText === ""){
				displayText = rowData.hint;
				textColor = ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR;
			}

			return (
				<TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
					<View style={styles.rowWrapper}>
						<Text style={rowTitleStyle}>{rowData.title}</Text>
						<View style={styles.valueContent}>
							<View style={{flex: 1, flexDirection: 'column', justifyContent: "center", margin: 0,}}>
								<Text style={[styles.centerText, {color: textColor}]}
									autoCapitalize="none"
									autoCorrect={false}
									editable={false}>
									{displayText}
								</Text>
							</View>
							<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />
						</View>
					</View>
				</TouchableOpacity>
				)
		} else if(rowData.type === "date"){
			console.log("birthday: " + rowData.value)
			return (
				<TouchableOpacity onPress={()=>this.chooseBirthday()}>
					<View style={styles.rowWrapper}>
						<Text style={styles.rowTitle}>{rowData.title}</Text>
						<DatePicker
							ref={"birthdayPicker"}
		          style={styles.datePicker}
		          date={rowData.value}
		          mode="date"
		          format="YYYY.MM.DD"
		          confirmBtnText="确定"
		          cancelBtnText="取消"
							placeholder="点击选择"
		          showIcon={false}
		          onDateChange={(datetime) => this.onDateTimeSelect(rowID, datetime)}
							customStyles={datePickerStyle}
		        />
					</View>
				</TouchableOpacity>);
		} else if(rowData.type === "datePeriod"){
			return this.renderDatePeriod(rowID, rowData);
		} else{
			var numberOfLines = 1;
			var multiline = false;
			var titleStyle = styles.rowWrapper;
			var inputStyle = styles.valueText;
			if(rowData.maxLine && rowData.maxLine > 1){
				multiline = true;
				numberOfLines = rowData.maxLine;
				titleStyle = styles.multilineRowWrapper;
				inputStyle = styles.multilineValueText;
			}
			return (
				<View style={titleStyle}>
					<Text style={rowTitleStyle}>{rowData.title}</Text>
					<TextInput style={inputStyle}
						autoCapitalize="none"
						autoCorrect={false}
						defaultValue={rowData.value}
						placeholder={rowData.hint}
						placeholderTextColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
						multiline={multiline}
						numberOfLines={numberOfLines}
						maxLength={rowData.maxLength}
						selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
						underlineColorAndroid='transparent'
						onChangeText={(text)=>this.textInputChange(text, rowID)}
						onEndEditing={(event)=>this.textInputEndChange(event, rowID)}
						/>
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

	render: function() {
		var pickerModal = null
		var error = this.state.error;

		var nextEnabled = OpenAccountUtils.canGoNext(this.listRawData);
		//console.log("listRawData: " + JSON.stringify(listRawData));
		for (var i = 0; i < this.listRawData.length; i++) {
			if(this.listRawData[i].error){
				if(error){
					error = DEFAULT_ERROR;
				}else{
					error = "您输入的" + this.listRawData[i].title + "有误，请核对后重试";
				}
			}
			if (this.listRawData[i].type === "datePeriod") {
				var date = this.parseStartEndDate(this.listRawData[i].value);
				if(date.startDate === "" || date.endDate === ""){
					nextEnabled = false
				}
			}
		};

		if(error){
			nextEnabled = false;
		}

		if (this.state.selectedPicker>=0) {
			pickerModal = (
				<TouchableOpacity
					style={{backgroundColor:'transparent', flex:1, position:'absolute', top:0, left:0, right: 0, bottom:0}}
					onPress={()=>this.hidePicker()}>
				</TouchableOpacity>
			)
		}


		return (
			<View style={styles.wrapper}>
				<ErrorBar error={error}/>
				<ScrollView style={styles.list}>
					{this.renderListView()}
				</ScrollView>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.validateInProgress ? false : nextEnabled}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={this.state.validateInProgress? "信息正在检查中...": '下一步'} />
				</View>
				{pickerModal}
			</View>
		);
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
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
	},
	multilineRowWrapper: {
		flexDirection: 'row',
		alignSelf: 'center',
		//alignItems: 'center',
		//height: 120,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
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
		width:rowTitleWidth,
	},
	errorRowTitle:{
		fontSize: fontSize,
		color: 'red',
		width:rowTitleWidth,
	},
	valueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
	centerText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		alignItems:'center',
		justifyContent:'center',
		margin: 0,
	},
	multilineValueText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
		alignItems:'center',
		justifyContent:'center',
		padding:0,
		margin: 0,
		textAlignVertical: 'top',
		height: Platform.OS === "ios" ? 48 : 65,
		marginTop: Platform.OS === "ios" ? -5 : 0,
		alignSelf: "flex-start",
	},
	valueContent:{
		flex: 1,
		flexDirection: 'row',
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
	datePicker: {
		flex:1,
		width: 0,
		padding:0,
		margin: 0,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
		alignItems:'center',
		justifyContent:'center',
		marginLeft:0,
		paddingLeft:0
	},
	datePeriodButton: {
		paddingTop: rowPadding,
		paddingBottom: rowPadding,
		flexDirection: 'row',
		justifyContent:'center',
		alignItems: 'center',
	},
	datePeriodPicker:{
		width: 100,
	}
});

var datePickerStyle = StyleSheet.create({
		dateTouchBody:{
			height: Platform.OS === 'ios' ? 0: 40,
		},
		dateText: {
			fontSize: fontSize,
			color: ColorConstants.INPUT_TEXT_COLOR,
		},
		dateInput: {
			height: Platform.OS === 'ios' ? 20: 40,
			borderWidth: 0,
			alignItems: 'flex-start',
			justifyContent: 'center',
		},
		placeholderText: {
			fontSize: fontSize,
			color: ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR,
			height: 20,
		},
});

var datePeriodPickerStyle = StyleSheet.create({
	dateTouchBody:{
		height: Platform.OS === 'ios' ? 0: 40,
	  width: 100,
	},
  dateInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 20: 40,
    borderWidth: 0,
		alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dateText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		height: 20,
  },
	placeholderText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR,
		height: 20,
	},
});

module.exports = OAPersonalInfoPage;

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
	Image
} from 'react-native';

import Picker from 'react-native-wheel-picker';
var PickerItem = Picker.Item;

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

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

const GenderTranslater = [
  {"value":true, "displayText": "男"},
  {"value":false, "displayText": "女"},
]

var listRawData = [
		{"title":"姓", "key": "firstName", "value":"", maxLength: 50,},	//TODO: add ignoreInRegistery when API is avaliable.
		{"title":"名", "key": "lastName", "value":"", maxLength: 50,},
		{"title":"性别", "key": "gender", "value":"", "type": "choice", "choices": GenderTranslater},
		{"title":"出生日期", "key": "birthday", "value":"", "type": "date"},
		{"title":"民族", "key": "ethnic", "value":"", maxLength: 10,},
		{"title":"身份证号", "key": "idCode", "value":"", maxLength: 18, minLength: 18},
		{"title":"证件地址", "key": "addr", "value":"", maxLength:75, maxLine: 2},
		{"title":"签发机关", "key": "issueAuth", "value":""},
		{"title":"有效期限", "key": "validPeriod", "value":"", "type": "datePeriod"}];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });


var OAPersonalInfoPage = React.createClass({
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
		if (this.props.data && this.props.data) {
			OpenAccountUtils.getPageListRawDataFromData(listRawData, this.props.data);
		}
		return {
			dataSource: ds.cloneWithRows(listRawData),
			validateInProgress: false,
			pickerArray: [],
			selectedPicker: -1,
			error: null
		};
	},

	gotoNext: function() {
		//TODO: GZT validation.
		this.setState({
			validateInProgress: true,
		})
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP3, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	},

	getData: function(){
		return OpenAccountUtils.getDataFromPageListRawData(listRawData);
	},

	textInputChange: function(text, rowID) {
		listRawData[rowID].value = text;
		listRawData[rowID].error = null;
		this.updateList();
	},

	textInputEndChange: function(event, rowID){
		if(listRawData[rowID].value && listRawData[rowID].value.length > 0){
			listRawData[rowID].checked = true;
			if(listRawData[rowID].key === "idCode"){
				this.checkIDCode(rowID);
			}
		}
	},

	checkIDCode: function(rowID){
		if(listRawData[rowID].value.length < 18){
			listRawData[rowID].error = "请输入" + listRawData[rowID].minLength + "位身份证号";
			this.updateList();
		}else{
			listRawData[rowID].error = null;
			this.updateList();
		}
	},

	updateList: function(){
		this.setState({
				dataSource: ds.cloneWithRows(listRawData),
		});
	},

	onPressPicker: function(rowData,rowID) {
		if (-1 !== this.state.selectedPicker) {
			this.setState({
				selectedPicker: -1,
				pickerArray: [],
			})
		}
		else {
			this.setState({
				selectedPicker: rowID,
				pickerArray: rowData.choices,
			})
		}
	},

	onPikcerSelect: function(value) {
		if (this.state.selectedPicker >= 0) {
			console.log("onPikcerSelect: " + value);
			listRawData[this.state.selectedPicker].value = value;
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				selectedPicker: -1,
			})
		}
	},

	onDateTimeSelect: function(rowID, value) {
		if (rowID>= 0) {
			console.log("onPikcerSelect: " + value);
			listRawData[rowID].value = value;

			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
			})
		}
	},

	onStartDateSelect: function(rowID, value) {
		if (rowID >= 0) {
			var dateInfo = this.parseStartEndDate(listRawData[rowID].value);
			listRawData[rowID].value = value + "-" + dateInfo.endDate;
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
			})
		}
	},

	onEndDateSelect: function(rowID, value) {
		if (rowID >= 0) {
			var dateInfo = this.parseStartEndDate(listRawData[rowID].value);
			listRawData[rowID].value = dateInfo.startDate + "-" + value;
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
			})
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

		return {
			"startDate": startDate,
			"endDate": endDate,
		}
	},

	updateList: function(){
		this.setState({
				dataSource: ds.cloneWithRows(listRawData),
		});
	},

	renderDatePeriod: function(rowID, rowData){
		var dateInfo = this.parseStartEndDate(rowData.value);

		return (
			<View style={styles.rowWrapper}>
				<Text style={styles.rowTitle}>{rowData.title}</Text>
				<View style={{flex: 3, flexDirection: 'row'}}>
					<DatePicker
						style={{flex:1, width: 0}}
						date={dateInfo.startDate}
						mode="date"
						format="YYYY.MM.DD"
						confirmBtnText="确定"
						cancelBtnText="取消"
						showIcon={false}
						maxDate={dateInfo.endDate}
						onDateChange={(datetime) => this.onStartDateSelect(rowID, datetime)}
						customStyles={datePeriodPickerStyle}
						placeholder="开始日期"
					/>
					<View style={{flex:1, alignItems:'center'}}>
						<Text>-</Text>
					</View>
					<DatePicker
						style={{flex:1, width: 0}}
						date={dateInfo.endDate}
						mode="date"
						format="YYYY.MM.DD"
						confirmBtnText="确定"
						cancelBtnText="取消"
						showIcon={false}
						minDate={dateInfo.startDate}
						onDateChange={(datetime) => this.onEndDateSelect(rowID, datetime)}
						customStyles={datePeriodPickerStyle}
						placeholder="结束日期"
					/>
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
			for(var i = 0; i < rowData.choices.length; i++){
				if(rowData.value == rowData.choices[i].value){
					displayText = rowData.choices[i].displayText;
				}
			}

			return (
				<TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
					<View style={styles.rowWrapper}>
						<Text style={rowTitleStyle}>{rowData.title}</Text>
						<View style={{flex: 3, flexDirection: 'row'}}>
							<TextInput style={styles.valueText}
								autoCapitalize="none"
								autoCorrect={false}
								editable={false}
								placeholder={rowData.defaultValue}
								placeholderTextColor={"#3f6dbd"}
								value={displayText}
								maxLength={rowData.maxLength}/>
							<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />
						</View>
					</View>
				</TouchableOpacity>
				)
		} else if(rowData.type === "date"){
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<DatePicker
	          style={{flex:3, width: 0, padding:0, margin: 0,}}
	          date={rowData.value}
	          mode="date"
	          format="YYYY.MM.DD"
	          confirmBtnText="确定"
	          cancelBtnText="取消"
	          showIcon={false}
	          onDateChange={(datetime) => this.onDateTimeSelect(rowID, datetime)}
						customStyles={datePickerStyle}
	        />
				</View>);
		} else if(rowData.type === "datePeriod"){
			return this.renderDatePeriod(rowID, rowData);
		} else{
			var numberOfLines = 1;
			var multiline = false;
			var style = styles.rowWrapper;
			if(rowData.maxLine && rowData.maxLine > 1){
				multiline = true;
				numberOfLines = rowData.maxLine;
				style = styles.multilineRowWrapper;
			}
			return (
				<View style={style}>
					<Text style={rowTitleStyle}>{rowData.title}</Text>
					<TextInput style={styles.valueText}
						autoCapitalize="none"
						autoCorrect={false}
						defaultValue={rowData.value}
						multiline={multiline}
						numberOfLines={numberOfLines}
						maxLength={rowData.maxLength}
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
		var enabled = true
		var error = null;
		for (var i = 0; i < listRawData.length; i++) {
			if(listRawData[i].error){
				if(error){
					error = "您输入的" + listRawData[i].title + "有误，请核对后重试";
				}else{
					error = listRawData[i].error;
				}
			}
			if (listRawData[i].type === "choice" && listRawData[i].value === "") {
				enabled = false
				break
			}
			if (listRawData[i].type === "datePeriod") {
				var date = this.parseStartEndDate(listRawData[i].value);
				if(date && date.length == 2){
					if(date[0] == "" || date[1] == ""){
						enabled = false
						break
					}
				}else{
					enabled = false
					break
				}
			}
		};
		if (this.state.selectedPicker>=0) {
			var rowData = listRawData[this.state.selectedPicker];
			var pickerValue = listRawData[this.state.selectedPicker].value;
			//for(var i = 0; i < listRawData[this.state.selectedPicker].length; i++){
				//if()
			//}
			console.log("this.state.selectedPicker: " + this.state.selectedPicker + ", " + pickerValue);

			pickerModal = (<View style={styles.pickerContainer}>
				<Picker ref={"picker"} style={{width: width, height: 150}}
					itemStyle={{color:"black", fontSize:26}}
					selectedValue={pickerValue}
					onValueChange={(value) => this.onPikcerSelect(value)}>
					{this.state.pickerArray.map((data) => {

							//alert(data.value.toString());
							return (
						<PickerItem label={data.displayText} value={data.value} key={"lever"+data.value.toString()}/>
					)})}
				</Picker>
			</View>)
		}

		var nextEnabled = OpenAccountUtils.canGoNext(listRawData);

		return (
			<View style={styles.wrapper}>
				<ErrorBar error={error}/>
		    <ListView
		    	style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={nextEnabled}
						onPress={this.gotoNext}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text={this.state.validateInProgress? "信息正在检查中...": '下一步'} />
				</View>
				{pickerModal}
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
	multilineRowWrapper: {
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
	errorRowTitle:{
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
	valueContent:{
		flex: 3,
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

var datePickerStyle = StyleSheet.create({
		dateTouchBody:{
		 	height: 0,
		},
		dateText: {
			fontSize: fontSize,
			color: '#333333',
		},
		dateInput: {
			height: 0,//40,
			borderWidth: 0,
			alignItems: 'flex-start',
			justifyContent: 'center',
		},
});

var datePeriodPickerStyle = StyleSheet.create({
		dateTouchBody:{
		 	height: 0,
		},
		dateText: {
			fontSize: fontSize,
			color: '#333333',
		},
		dateInput: {
			height: 0,//40,
			borderWidth: 0,
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
		},
});

module.exports = OAPersonalInfoPage;

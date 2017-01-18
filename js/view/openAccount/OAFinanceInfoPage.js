
'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	TextInput,
	Switch,
	Image,
	TouchableOpacity,
} from 'react-native';

var TimerMixin = require('react-timer-mixin');
import Picker from 'react-native-picker';

var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')
var TalkingdataModule = require('../../module/TalkingdataModule')
var OpenAccountRoutes = require('./OpenAccountRoutes')
var OpenAccountUtils = require('./OpenAccountUtils')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var fontSize2 = Math.round(15*width/375)

var IncomeMapping = [
	{"value": 0, "displayText": "12万以下（人民币）"},
	{"value": 15, "displayText": "12-33万（人民币）"},
	{"value": 40, "displayText": "33-58万（人民币）"},
	{"value": 70, "displayText": "58-83万（人民币）"},
	{"value": 100, "displayText": "83万以上（人民币）"},
];

var NetWorthMapping = [
	{"value": 0, "displayText": "12万以下（人民币）"},
	{"value": 15, "displayText": "12-33万（人民币）"},
	{"value": 40, "displayText": "33-58万（人民币）"},
	{"value": 70, "displayText": "58-83万（人民币）"},
	{"value": 100, "displayText": "83-413万以上（人民币）"},
	{"value": 101, "displayText": "413万以上（人民币）"},
]

var InvestmentPortfolioMapping = [
	{"value": 0, "displayText": "占净资产0-25%"},
	{"value": 25, "displayText": "占净资产25-50%"},
	{"value": 50, "displayText": "占净资产50-75%"},
	{"value": 75, "displayText": "占净资产75-100%"},
]

var EmploymengStatusMapping = [
	{"value": "Employed", "displayText": "就业"},
	{"value": "Self-Employed", "displayText": "自由职业"},
	{"value": "UnEmployed", "displayText": "失业"},
	{"value": "Retired", "displayText": "退休"},
	{"value": "Student", "displayText": "学生"},
	{"value": "Other", "displayText": "其他"},
]

var investFrqMappings = [
	{"value": 0, "displayText": "基本没有"},
	{"value": 1, "displayText": "每季度1-5次"},
	{"value": 2, "displayText": "每季度6-10次"},
	{"value": 3, "displayText": "每季度超过10次"},
]

var expierenceMappings = [
	{"key": "expOTCDeriv", "displayText": "场外衍生品", "value": false},
	{"key": "expDeriv", "displayText": "衍生产品", "value": false},
	{"key": "expShareBond", "displayText": "股票和债券", "value": false},
]

var defaultRawData = [
	{"key":"annualIncome", "title":"年收入", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":IncomeMapping},
	{"key":"netWorth", "title":"净资产", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":NetWorthMapping},
	{"key":"investPct", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":InvestmentPortfolioMapping},
	{"key":"empStatus", "title":"就业", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":EmploymengStatusMapping},
	{"key":"investFrq", "title":"投资频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
	{"key":"hasProExp", "title":"你是否有一年以上与金融杠杆交易相关的职业经历", "value":false, "type":"switch"},
	{"key":"hasAyondoExp", "title":"你是否了解过ayondo的金融产品或使用ayondo模拟账户交易", "value":true, "type":"switch"},
	{"key":"hasOtherQualif", "title":"你是否有其它相关资质帮助理解ayondo的服务", "value":false, "type":"switch"},
	{"optionsKey":"tradingExp" ,"title":"你有哪些产品的交易经验", "value":expierenceMappings, "type":"options"},
];

var OAFinanceInfoPage = React.createClass({
	listRawData: [],

	ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),

	mixins: [TimerMixin],
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
		this.listRawData = JSON.parse(JSON.stringify(defaultRawData));
		var dataSource;
		if (this.props.data && this.props.data) {
			OpenAccountUtils.getPageListRawDataFromData(this.listRawData, this.props.data);
		}
		dataSource = this.ds.cloneWithRows(this.listRawData);

		return {
			dataSource: dataSource,
			selectedPicker: -1,
		};
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP4, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	},

	getData: function(){
		return OpenAccountUtils.getDataFromPageListRawData(this.listRawData);
	},

	onDismiss: function(){
		this.hidePicker();
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
				onPickerCancel: ()=>{
					this.setState({
						selectedPicker: -1,
					})
				}
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

	onPressSwitch: function(value, rowID) {
		if(rowID >= 0) {
			this.listRawData[rowID].value = value
			this.setState({
				dataSource: this.ds.cloneWithRows(this.listRawData),
			})
		}
	},

	onCheckBoxPressed: function(data, selected){
		data.value = selected;
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === "choice") {

			var displayText = "";
			var textColor = ColorConstants.INPUT_TEXT_COLOR;
			for(var i = 0; i < rowData.choices.length; i++){
				if(rowData.value === rowData.choices[i].value){
					displayText = rowData.choices[i].displayText;
				}
			}
			if(displayText === ""){
				displayText = rowData.defaultValue;
				textColor = '#3f6dbd';
			}

			return (
				<TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<View style={{flex: 3, flexDirection: 'column', justifyContent: "center"}}>
						<Text style={[styles.centerText, {color: textColor}]}
							autoCapitalize="none"
							autoCorrect={false}
							editable={false}
							placeholder={rowData.defaultValue}
							placeholderTextColor={"#3f6dbd"}>
							{displayText}
						</Text>
					</View>
					<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />
				</View>
				</TouchableOpacity>
				)
		}
		else if(rowData.type === "switch") {
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<Switch
						onValueChange={(value) => this.onPressSwitch(value, rowID)}
						style={{height: 22}}
						value={rowData.value}
						onTintColor={ColorConstants.TITLE_DARK_BLUE}/>
				</View>)
		}
		else if(rowData.type === 'options'){
			var boxes = rowData.value.map(
				(title, i) =>{
					var data = rowData.value[i];
					return (<CheckBoxButton key={i} text={data.displayText}
						defaultSelected={data.value}
						onPress={(selected)=>this.onCheckBoxPressed(data, selected)}>
						</CheckBoxButton>
					);
				}
			)
			return(
				<View style={styles.rowWrapperOption}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<View style={styles.checkboxView}>
						{boxes}
					</View>
				</View>)
		}
		else {
			return(
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
				</View>)
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
		for (var i = 0; i < this.listRawData.length; i++) {
			if (this.listRawData[i].type === "choice" && this.listRawData[i].value === "") {
				enabled = false
				break
			}
		};
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
	rowWrapperOption: {
		flexDirection: 'column',
		alignItems:'stretch',
		backgroundColor: '#ffffff',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: rowPadding,
		paddingTop: rowPadding,
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		marginLeft: 0,
		height: 0.5,
		backgroundColor: '#ececec',
	},
	rowTitle:{
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		flex: 1,
	},
	valueText: {
		fontSize: fontSize2,
		color: 'black',
		flex: 3,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
	},
	centerText: {
		fontSize: fontSize,
		color: ColorConstants.INPUT_TEXT_COLOR,
		alignItems:'center',
		justifyContent:'center',
	},
	checkboxView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 10,
	},

	pickerContainer: {
		flex: 1,
	    borderRadius: 5,
	    justifyContent: 'center',
	    alignItems: 'center',
	    marginBottom: 0,
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


module.exports = OAFinanceInfoPage;

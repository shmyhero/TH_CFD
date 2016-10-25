
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

import Picker from 'react-native-wheel-picker';
var PickerItem = Picker.Item;

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
	{"value": 0, "displayText": "15万以下"},
	{"value": 15, "displayText": "15-40万"},
	{"value": 40, "displayText": "40-70万"},
	{"value": 70, "displayText": "70-100万"},
	{"value": 100, "displayText": "100万以上"},
];

var NetWorthMapping = [
	{"value": 0, "displayText": "15万以下"},
	{"value": 15, "displayText": "15-40万"},
	{"value": 40, "displayText": "40-70万"},
	{"value": 70, "displayText": "70-100万"},
	{"value": 100, "displayText": "100万-500万"},
	{"value": 101, "displayText": "500万以上"},
]

var InvestmentPortfolioMapping = [
	{"value": 0, "displayText": "占净资产25%"},
	{"value": 25, "displayText": "占净资产50%"},
	{"value": 50, "displayText": "占净资产75%"},
	{"value": 75, "displayText": "占净资产100%"},
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

var listRawData = [
		{"key":"annualIncome", "title":"年收入", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":IncomeMapping},
		{"key":"netWorth", "title":"净资产", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":NetWorthMapping},
		{"key":"investPct", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":InvestmentPortfolioMapping},
		{"key":"empStatus", "title":"就业", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":EmploymengStatusMapping},
		{"key":"investFrq", "title":"投资频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
		{"key":"hasProExp", "title":"你是否有一年以上与金融杠杆交易相关的职业经历", "value":false, "type":"switch"},
		{"key":"hasAyondoExp", "title":"你是否了解过ayondo的金融产品或使用ayondo模拟账户交易", "value":true, "type":"switch"},
		{"key":"hasOtherQualif", "title":"你是否有其它相关资质帮助理解ayondo的服务", "value":false, "type":"switch"},
		{"optionsKey":"tradingExp" ,"title":"你有哪些产品的交易经验", "value":expierenceMappings, "type":"options"},
		]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var OAFinanceInfoPage = React.createClass({
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
		var dataSource;
		if (this.props.data && this.props.data) {
			OpenAccountUtils.getPageListRawDataFromData(listRawData, this.props.data);
		}
		dataSource = ds.cloneWithRows(listRawData);

		return {
			dataSource: dataSource,
			pickerArray: [],
			selectedPicker: -1,
		};
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP4, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	},

	getData: function(){
		return OpenAccountUtils.getDataFromPageListRawData(listRawData);
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

	onPressSwitch: function(value, rowID) {
		if(rowID >= 0) {
			listRawData[rowID].value = value
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
			})
		}
	},

	onCheckBoxPressed: function(data, selected){
		data.value = selected;
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === "choice") {

			var displayText = "";
			for(var i = 0; i < rowData.choices.length; i++){
				if(rowData.value === rowData.choices[i].value){
					displayText = rowData.choices[i].displayText;
				}
			}

			return (
				<TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<TextInput style={styles.valueText}
						autoCapitalize="none"
						autoCorrect={false}
						editable={false}
						placeholder={rowData.defaultValue}
						placeholderTextColor={"#3f6dbd"}
						selectionColor="#426bf2"
						value={displayText} />
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
						style={{height: 16}}
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
		for (var i = 0; i < listRawData.length; i++) {
			if (listRawData[i].type === "choice" && listRawData[i].value === "") {
				enabled = false
				break
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
		color: '#333333',
		flex: 1,
	},
	valueText: {
		fontSize: fontSize2,
		color: 'black',
		flex: 3,
		marginTop: -rowPadding,
		marginBottom: -rowPadding,
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

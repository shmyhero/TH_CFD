
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
	{"value": 0, "displayText": "低于 8000 元"},
	{"value": 1, "displayText": "8001-20000 元"},
	{"value": 2, "displayText": "20001-32000 元"},
	{"value": 3, "displayText": "32001-48000 元"},
	{"value": 4, "displayText": "高于 48000 元"},
];

var NetWorthMapping = [
	{"value": 0, "displayText": "9万以下（人民币）"},
	{"value": 1, "displayText": "9-24万（人民币）"},
	{"value": 2, "displayText": "24-42万（人民币）"},
	{"value": 3, "displayText": "42-60万（人民币）"},
	{"value": 4, "displayText": "60-300万以上（人民币）"},
	{"value": 5, "displayText": "300万以上（人民币）"},
]

var InvestmentPortfolioMapping = [
	{"value": 0, "displayText": "占净资产0-25%"},
	{"value": 25, "displayText": "占净资产25-50%"},
	{"value": 50, "displayText": "占净资产50-75%"},
	{"value": 75, "displayText": "占净资产75-100%"},
]

var EmploymengStatusMapping = [
	{"value": "Employed", "displayText": "就业"},
	{"value": "Self-Employed", "displayText": "自雇"},
	{"value": "Unemployed", "displayText": "失业"},
	{"value": "Retired", "displayText": "退休"},
	{"value": "Student", "displayText": "学生"},
	// {"value": "Other", "displayText": "其他"},	//API Doesn't have this value!
]

var EmploymengTypeMapping = [
	{"value": "automotive", "displayText": "汽车和零部件"},
	{"value": "capital-goods", "displayText": "资本产品"},
	{"value": "commercial", "displayText": "商业及专业服务"},
	{"value": "consumer", "displayText": "消费产品及服务"},
	{"value": "financials", "displayText": "银行与金融服务"},
	{"value": "energy", "displayText": "能源"},
	{"value": "food", "displayText": "食品，饮料和烟草"},
	{"value": "health", "displayText": "医疗保健设备和服务"},
	{"value": "household", "displayText": "家用和个人产品"},
	{"value": "insurance", "displayText": "保险"},
	{"value": "media", "displayText": "传媒"},
	{"value": "pharma", "displayText": "医疗"},
	// {"value": "type12", "displayText": "生物技术与生命科学"},	//API Doesn't have this value!
	{"value": "real-estate", "displayText": "房地产"},
	{"value": "retailing", "displayText": "零售"},
	{"value": "software", "displayText": "软件与服务"},
	{"value": "technology", "displayText": "科技"},
	{"value": "telecomms", "displayText": "电信"},
	{"value": "transportation", "displayText": "运输"},
	{"value": "utilities", "displayText": "公共事业"},
	{"value": "other", "displayText": "其他"},
]

var PositionMapping = [
	{"value": "associate", "displayText": "副经理"},
	{"value": "supervisor", "displayText": "主管"},
	{"value": "manager", "displayText": "经理"},
	{"value": "owner", "displayText": "创始人"},
	{"value": "partner", "displayText": "合伙人"},
	{"value": "other", "displayText": "其他"},
]

var investFrqMappings = [
	{"value": 0, "displayText": "完全没有"},
	{"value": 1, "displayText": "1-5次"},
	{"value": 2, "displayText": "6-10次"},
	{"value": 3, "displayText": "超过10次"},
]

var amontOfMoneyMappings = [
	{"value": 0, "displayText": "低于 8000 元"},
	{"value": 1, "displayText": "8001 - 40000 元"},
	{"value": 2, "displayText": "40001 - 200000 元"},
	{"value": 3, "displayText": "200001- 400000 元"},
	{"value": 4, "displayText": "400001- 800000 元"},
	{"value": 5, "displayText": "高于 800000 元"},
	//BUGBUG: There's a "6" here per API doc!!!
]

var investProportionMapping = [
	{"value": 0, "displayText": "低于 10%"},
	{"value": 1, "displayText": "10% - 25%"},
	{"value": 2, "displayText": "25% - 50%"},
	{"value": 3, "displayText": "50% - 75%"},
	{"value": 4, "displayText": "75% - 100%"},
]

var expierenceMappings = [
	{"key": "expOTCDeriv", "displayText": "场外衍生品", "value": false},
	{"key": "expDeriv", "displayText": "衍生产品", "value": false},
	{"key": "expShareBond", "displayText": "股票和债券", "value": false},
]

var InComeSourceMappings = [
	{"value":"savings" , "displayText":"存款与投资"},
	{"value":"employment" , "displayText":"工作收入"},
	{"value":"gift" , "displayText":"赠予",},
	{"value":"inheritance" , "displayText":"遗产"},
	{"value":"pension" , "displayText":"养老金"},
	{"value":"other" , "displayText":"其他"},
]
//
// //Options values
// var InComeSourceMappings = [
// 	{"key":"savings" , "displayText":"存款与投资",value:false},
// 	{"key":"employment" , "displayText":"工作收入",value:false},
// 	{"key":"gift" , "displayText":"赠予",value:false},
// 	{"key":"inheritance" , "displayText":"遗产",value:false},
// 	{"key":"pension" , "displayText":"养老金",value:false},
// 	{"key":"other" , "displayText":"其他",value:false},
// ]

var qualificationsMappings = [
	{"key":"professional" , "displayText":"专业资格", value:false},
	{"key":"university" , "displayText":"大学学位", value:false},
	{"key":"vocational" , "displayText":"职业资格", value:false},
	{"key":"other" , "displayText":"其他资历", value:false},
]

//hard code for control hide line
var EMPSWITCH = 3
var EMPSWITCH_0 = 4
var EMPSWITCH_1 = 5
var EMPSWITCH_2 = 6
var QUALIFICATION = 10
var QUALIFICATION_V = 11
var EXPCHANNEL0 = 13
var EXPCHANNEL0_0 = 14
var EXPCHANNEL0_1 = 15
var EXPCHANNEL0_2 = 16
var EXPCHANNEL1 = 17
var EXPCHANNEL1_0 = 18
var EXPCHANNEL1_1 = 19
var EXPCHANNEL1_2 = 20
var EXPCHANNEL2 = 21
var EXPCHANNEL2_0 = 22
var EXPCHANNEL2_1 = 23
var EXPCHANNEL2_2 = 24

var defaultRawData = [
	{"key":"monthlyIncome", "title":"月净收入", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":IncomeMapping},
	{"key":"investments", "title":"净资产", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":NetWorthMapping},
	{"key":"sourceOfFunds", "title":"资金主要来源", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":InComeSourceMappings},
	// {"multiOptionsKey":"sourceOfFunds" ,"title":"交易资金主要来源", "value":InComeSourceMappings, "type":"options",},
	// {"key":"investPct", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":InvestmentPortfolioMapping},
	{"key":"empStatus", "title":"职业信息", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":EmploymengStatusMapping, "trueChoice":["Employed", "Self-Employed"]},
	{"key":"employerName", "title": "雇主名称", "value":"", hint: "请输入雇主名称", "type": "text", maxLength: 20,"hide":true, "parent":"empStatus"},
	{"key":"employerSector", "title":"业务类型", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":EmploymengTypeMapping,"hide":true, "parent":"empStatus"},
	{"key":"empPosition", "title":"担任职位", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":PositionMapping,"hide":true, "parent":"empStatus"},
	// {"key":"investFrq", "title":"投资频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
	{"key":"hasProExp", "title":"您是否曾经在金融领域担任专业杠杆交易相关职位至少一年？", "value":false, "type":"switch"},
	{"key":"hasTraining", "title":"您以前参加过培训研讨会或通过其他教育形式了解过我们的产品吗？", "value":false, "type":"switch"},
	{"key":"hasDemoAcc", "title":"您是否用过点差交易或差价合约(CFD)的模拟账户？", "value":false, "type":"switch"},
	{"key":"hasOtherQualif", "title":"您是否有其他相关的资历证书，让您可以更好理解我们的金融服务？", "value":false, "type":"switch",},
	{"multiOptionsKey":"otherQualif" ,"title":"", "value":qualificationsMappings, "type":"options","hide":true, "parent": "hasOtherQualification"},
	// {"optionsKey":"tradingExp" ,"title":"您有以下哪种产品的实盘交易经验？", "value":expierenceMappings, "type":"options"},
	{"title":"您有以下哪种产品的实盘交易经验？"},
	{"key":"hasTradedHighLev", "title":"差价合约、点差交易或外汇", "value":false, "type":"switch"},
		{"key":"highLevFrq", "title":"季度交易频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings,"hide":true, "parent":"hasTradedHighLev"},
		{"key":"highLevBalance", "title":"投入金额", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":amontOfMoneyMappings,"hide":true, "parent":"hasTradedHighLev"},
		{"key":"highLevRisk", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investProportionMapping,"hide":true, "parent":"hasTradedHighLev"},
	{"key":"hasTradedMidLev", "title":"股票或债券", "value":false, "type":"switch"},
		{"key":"midLevFrq", "title":"季度交易频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings,"hide":true, "parent":"hasTradedMidLev"},
		{"key":"midLevBalance", "title":"投入金额", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":amontOfMoneyMappings,"hide":true, "parent":"hasTradedMidLev"},
		{"key":"midLevRisk", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investProportionMapping,"hide":true, "parent":"hasTradedMidLev"},
	{"key":"hasTradedNoLev", "title":"期权，期货或认购权证", "value":false, "type":"switch"},
		{"key":"noLevFrq", "title":"季度交易频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings,"hide":true, "parent":"hasTradedNoLev"},
		{"key":"noLevBalance", "title":"投入金额", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":amontOfMoneyMappings,"hide":true, "parent":"hasTradedNoLev"},
		{"key":"noLevRisk", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investProportionMapping,"hide":true, "parent":"hasTradedNoLev"},
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

	textInputChange: function(text, rowID) {
		this.listRawData[rowID].value = text;
		this.listRawData[rowID].error = null;
		this.setState({
			error: null,
			dataSource: this.ds.cloneWithRows(this.listRawData),
		})
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

		if(selectedText == "" && rowData.choices.length > 0){
			selectedText = rowData.choices[0].displayText;
		}

    Picker.init({
        pickerData: choices,
        selectedValue: [selectedText],
				pickerTitleText: "",
        onPickerConfirm: data => {
					if(data[0] === ""){
						rowData.value = rowData.choices[0].value;
					}else{
						console.log("selected: "+data[0])

						for(var i = 0; i < this.listRawData[rowID].choices.length; i++){
							console.log("this.listRawData[rowID].choices[i]: " + JSON.stringify(this.listRawData[rowID].choices[i]))
							if(data[0] === this.listRawData[rowID].choices[i].displayText){
								this.listRawData[rowID].value = this.listRawData[rowID].choices[i].value;
								break;
							}
						}

						console.log("this.listRawData[rowID].value: " + this.listRawData[rowID].value)
						if(rowID == EMPSWITCH){
							var showEMPSwitches = (data[0] == "就业" || data[0] == "自雇")
							this.listRawData[EMPSWITCH_0].hide = !showEMPSwitches
							this.listRawData[EMPSWITCH_1].hide = !showEMPSwitches
							this.listRawData[EMPSWITCH_2].hide = !showEMPSwitches
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

	setForHideValues(value,rowID){
		if(rowID == EMPSWITCH){
			this.listRawData[EMPSWITCH_0].hide = !value
			this.listRawData[EMPSWITCH_1].hide = !value
			this.listRawData[EMPSWITCH_2].hide = !value
		}

		if(rowID == QUALIFICATION){
			this.listRawData[QUALIFICATION_V].hide = !value
		}

		if(rowID == EXPCHANNEL0){
			this.listRawData[EXPCHANNEL0_0].hide = !value
			this.listRawData[EXPCHANNEL0_1].hide = !value
			this.listRawData[EXPCHANNEL0_2].hide = !value
		}
		if(rowID == EXPCHANNEL1){
			this.listRawData[EXPCHANNEL1_0].hide = !value
			this.listRawData[EXPCHANNEL1_1].hide = !value
			this.listRawData[EXPCHANNEL1_2].hide = !value
		}
		if(rowID == EXPCHANNEL2){
			this.listRawData[EXPCHANNEL2_0].hide = !value
			this.listRawData[EXPCHANNEL2_1].hide = !value
			this.listRawData[EXPCHANNEL2_2].hide = !value
		}
	},

	onPressSwitch: function(value, rowID) {
		if(rowID >= 0) {
			this.listRawData[rowID].value = value

			this.setForHideValues(value, rowID)

			this.setState({
				dataSource: this.ds.cloneWithRows(this.listRawData),
			})
		}
	},

	onCheckBoxPressed: function(rowID, checkboxIndex, selected){
		if(this.listRawData[rowID]){
			if(this.listRawData[rowID].value[checkboxIndex]){
				this.listRawData[rowID].value[checkboxIndex].value = selected;
				this.setState({
					dataSource: this.ds.cloneWithRows(this.listRawData),
				})
			}
		}
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
				<TouchableOpacity style = {rowData.hide?{height:0}:null} activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.title}</Text>
					<View style={{flex: 2, flexDirection: 'column', justifyContent: "center"}}>
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
			var valuesCount = rowData.value.length;
			var rowCount = Math.ceil(valuesCount / 3);
			var array = [];
			for(var i = 0; i < rowCount; i++){
				var data;
				if(rowData.value.length >= i* + 2){
					data = rowData.value.slice(i*3, i*3 + 3);
				}else{
					data = rowData.value.slice(i*3);
				}
				if(data){
					while(data.length < 3)
					{
						data.push(null);
					}

					array.push(data);
				}
			}

			var rows = array.map(
				(boxRowData, i) =>{
					var boxes = array[i].map(
						(data, j) =>{
							if(data){
								var index = i*3+j;
								console.log("data.displayText: " + data.displayText + ", data.value: " + data.value)
								return (<CheckBoxButton key={index} text={data.displayText}
									defaultSelected={data.value}
									onPress={(selected)=>this.onCheckBoxPressed(rowID, index, selected)}>
									</CheckBoxButton>
								);
							}else{
								return(
									<View key={i*3+j} style={{flex:1}}/>
								);
							}
						}
					)
					var data = rowData.value[i];
					return (
						<View style={[styles.checkboxView]} key={i}>
							{boxes}
						</View>
					);
				}
			)

			return(rowData.hide?null:
				<View style={[styles.rowWrapperOption]}>
				  <Text style={[styles.rowTitle,rowData.title ? null : {height:0}]}>{rowData.title}</Text>
					<View style={{flexDirection: 'column'}}>
						{rows}
					</View>
				</View>)

		}
		else if(rowData.type === 'text'){
			return (
				<View  style={rowData.hide?{height:0}:null}>
					<View style={styles.rowWrapper}>
						<Text style={styles.rowTitle}>{rowData.title}</Text>
						<TextInput style={styles.valueText}
							autoCapitalize="none"
							autoCorrect={false}
							// secureTextEntry={secureTextEntry}
							defaultValue={rowData.value}
							placeholder={rowData.hint}
							placeholderColor={ColorConstants.INPUT_TEXT_PLACE_HOLDER_COLOR}
							selectionColor={ColorConstants.INOUT_TEXT_SELECTION_COLOR}
							underlineColorAndroid='transparent'
							onChangeText={(text)=>this.textInputChange(text, rowID)}
							maxLength={rowData.maxLength}/>
					</View>
				</View>
			)
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
		var switchEmpStatus = false;
		var lastParentSwitchIsOn = false;
		for (var i = 0; i < this.listRawData.length; i++) {
			if(this.listRawData[i].key === "empStatus"){
				if(this.listRawData[i].value === "Employed" || this.listRawData[i].value === "Self-Employed"){
					lastParentSwitchIsOn = true;
				}
			}
			/*
			if(this.listRawData[i].key === "otherQualifSelector"){
				lastParentSwitchIsOn = this.listRawData[i].value;
			}*/
			if(this.listRawData[i].type === "switch"){
				lastParentSwitchIsOn = this.listRawData[i].value;
			}

			if (this.listRawData[i].parent && !lastParentSwitchIsOn){
				continue;
			}

			if (this.listRawData[i].type === "options") {
				var hasSelected = false;
				for(var j = 0; j < this.listRawData[i].value.length; j++){
					if(this.listRawData[i].value[j].value == true){
						hasSelected = true;
						break;
					}
				}
				if(!hasSelected){
					enabled = false;
					break;
				}
			}
			if (this.listRawData[i].type === "text" && this.listRawData[i].value === "") {
				enabled = false
				break;
			}
			if (this.listRawData[i].type === "choice" && this.listRawData[i].value === "") {
				enabled = false
				break;
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
		fontSize: fontSize,
		color: 'black',
		flex: 2,
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

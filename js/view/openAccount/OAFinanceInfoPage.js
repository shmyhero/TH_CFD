
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
var OpenAccountHintBlock = require('./OpenAccountHintBlock')
var ErrorBar = require('../component/ErrorBar')
var LS = require("../../LS")

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var fontSize2 = Math.round(15*width/375)

var IncomeMapping = [
	{"value": 0, "displayText": "OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_1"},
	{"value": 1, "displayText": "OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_2"},
	{"value": 2, "displayText": "OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_3"},
	{"value": 3, "displayText": "OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_4"},
	{"value": 4, "displayText": "OPEN_ACCOUNT_FINANCE_INCOMING_LEVEL_5"},
];

var NetWorthMapping = [
	{"value": 0, "displayText": "OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_1"},
	{"value": 1, "displayText": "OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_2"},
	{"value": 2, "displayText": "OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_3"},
	{"value": 3, "displayText": "OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_4"},
	{"value": 4, "displayText": "OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_5"},
	{"value": 5, "displayText": "OPEN_ACCOUNT_FINANCE_NETWORTH_LEVEL_6"},
]

var InvestmentPortfolioMapping = [
	{"value": 0, "displayText": "OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_1"},
	{"value": 25, "displayText": "OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_2"},
	{"value": 50, "displayText": "OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_3"},
	{"value": 75, "displayText": "OPEN_ACCOUNT_FINANCE_PORTFOLIO_LEVEL_4"},
]

var EmploymentStatusMapping = [
	{"value": "Employed", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_1"},
	{"value": "Self-Employed", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_2"},
	{"value": "Unemployed", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_3"},
	{"value": "Retired", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_4"},
	{"value": "Student", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_5"},
	// {"value": "Other", "displayText": "其他"},	//API Doesn't have this value!
]

var EmploymentTypeMapping = [
	{"value": "automotive", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_1"},
	{"value": "capital-goods", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_2"},
	{"value": "commercial", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_3"},
	{"value": "consumer", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_4"},
	{"value": "financials", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_5"},
	{"value": "energy", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_6"},
	{"value": "food", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_7"},
	{"value": "health", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_8"},
	{"value": "household", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_9"},
	{"value": "insurance", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_10"},
	{"value": "media", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_11"},
	{"value": "pharma", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_12"},
	// {"value": "type12", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_13"},	//API Doesn't have this value!
	{"value": "real-estate", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_14"},
	{"value": "retailing", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_15"},
	{"value": "software", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_16"},
	{"value": "technology", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_17"},
	{"value": "telecomms", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_18"},
	{"value": "transportation", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_19"},
	{"value": "utilities", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_20"},
	{"value": "other", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_TYPE_21"},
]

var PositionMapping = [
	{"value": "associate", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_1"},
	{"value": "supervisor", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_2"},
	{"value": "manager", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_3"},
	{"value": "owner", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_4"},
	{"value": "partner", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_5"},
	{"value": "other", "displayText": "OPEN_ACCOUNT_FINANCE_EMPLOYMENT_POSITION_6"},
]

var investFrqMappings = [
	{"value": 0, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_FRQ_1"},
	{"value": 1, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_FRQ_2"},
	{"value": 2, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_FRQ_3"},
	{"value": 3, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_FRQ_4"},
]

var amontOfMoneyMappings = [
	{"value": 0, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_1"},
	{"value": 1, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_2"},
	{"value": 2, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_3"},
	{"value": 3, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_4"},
	{"value": 4, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_5"},
	{"value": 5, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_6"},
	{"value": 6, "displayText": "OPEN_ACCOUNT_FINANCE_AMOUNT_OF_MONEY_7"},
	//BUGBUG: There's a "6" here per API doc!!!
]

var investProportionMapping = [
	{"value": 0, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_1"},
	{"value": 1, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_2"},
	{"value": 2, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_3"},
	{"value": 3, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_4"},
	{"value": 4, "displayText": "OPEN_ACCOUNT_FINANCE_INVEST_PROPOTION_5"},
]

var expierenceMappings = [
	{"key": "expOTCDeriv", "displayText": "OPEN_ACCOUNT_FINANCE_EXPIERENCE_1", "value": false},
	{"key": "expDeriv", "displayText": "OPEN_ACCOUNT_FINANCE_EXPIERENCE_2", "value": false},
	{"key": "expShareBond", "displayText": "OPEN_ACCOUNT_FINANCE_EXPIERENCE_3", "value": false},
]

var InComeSourceMappings = [
	{"value":"savings" , "displayText":"OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_1"},
	{"value":"employment" , "displayText":"OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_2"},
	{"value":"gift" , "displayText":"OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_3",},
	{"value":"inheritance" , "displayText":"OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_4"},
	{"value":"pension" , "displayText":"OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_5"},
	{"value":"other" , "displayText":"OPEN_ACCOUNT_FINANCE_INCOME_SOURCE_6"},
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
	{"key":"professional" , "displayText":"OPEN_ACCOUNT_FINANCE_QUALIFICATION_1", value:false},
	{"key":"university" , "displayText":"OPEN_ACCOUNT_FINANCE_QUALIFICATION_2", value:false},
	{"key":"vocational" , "displayText":"OPEN_ACCOUNT_FINANCE_QUALIFICATION_3", value:false},
	{"key":"other" , "displayText":"OPEN_ACCOUNT_FINANCE_QUALIFICATION_4", value:false},
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
	{"key":"monthlyIncome", "title":"OPEN_ACCOUNT_FINANCE_MONTHLY_INCOME", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":IncomeMapping},
	{"key":"investments", "title":"OPEN_ACCOUNT_FINANCE_NETWORTH", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":NetWorthMapping},
	{"key":"sourceOfFunds", "title":"OPEN_ACCOUNT_FINANCE_SOURCE", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":InComeSourceMappings},
	// {"multiOptionsKey":"sourceOfFunds" ,"title":"交易资金主要来源", "value":InComeSourceMappings, "type":"options",},
	// {"key":"investPct", "title":"投资比重", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":InvestmentPortfolioMapping},
	{"key":"empStatus", "title":"OPEN_ACCOUNT_FINANCE_EMP_STATUS", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":EmploymentStatusMapping, "trueChoice":["Employed", "Self-Employed"]},
	{"key":"employerName", "title": "OPEN_ACCOUNT_FINANCE_EMPLOYER_NAME", "value":"", hint: "OPEN_ACCOUNT_FINANCE_EMPLOYER_NAME_HINT", "type": "text", maxLength: 20,"hide":true, "parent":"empStatus"},
	{"key":"employerSector", "title":"OPEN_ACCOUNT_FINANCE_EMPLOYER_SECTOR", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":EmploymentTypeMapping,"hide":true, "parent":"empStatus"},
	{"key":"empPosition", "title":"OPEN_ACCOUNT_FINANCE_EMP_POSITION", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":PositionMapping,"hide":true, "parent":"empStatus"},
	// {"key":"investFrq", "title":"投资频率", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investFrqMappings},
	{"key":"hasProExp", "title":"OPEN_ACCOUNT_FINANCE_HAS_PRO_EXP", "value":false, "type":"switch"},
	{"key":"hasTraining", "title":"OPEN_ACCOUNT_FINANCE_HAS_TRAINING", "value":false, "type":"switch"},
	{"key":"hasDemoAcc", "title":"OPEN_ACCOUNT_FINANCE_HAS_DEMO_ACC", "value":false, "type":"switch"},
	{"key":"hasOtherQualif", "title":"OPEN_ACCOUNT_FINANCE_HAS_OTHER_QUALIF", "value":false, "type":"switch",},
	{"multiOptionsKey":"otherQualif" ,"title":"", "value":qualificationsMappings, "type":"options","hide":true, "parent": "hasOtherQualification"},
	// {"optionsKey":"tradingExp" ,"title":"您有以下哪种产品的实盘交易经验？", "value":expierenceMappings, "type":"options"},
	{"title":"OPEN_ACCOUNT_FINANCE_HAS_FOLLOWING_EXP"},
	{"key":"hasTradedHighLev", "title":"OPEN_ACCOUNT_FINANCE_HAS_TRADE_HIGH_LEV", "value":false, "type":"switch"},
		{"key":"highLevFrq", "title":"OPEN_ACCOUNT_FINANCE_FRQ", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investFrqMappings,"hide":true, "parent":"hasTradedHighLev"},
		{"key":"highLevBalance", "title":"OPEN_ACCOUNT_FINANCE_BALANCE", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":amontOfMoneyMappings,"hide":true, "parent":"hasTradedHighLev"},
		{"key":"highLevRisk", "title":"OPEN_ACCOUNT_FINANCE_RISK", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investProportionMapping,"hide":true, "parent":"hasTradedHighLev"},
	{"key":"hasTradedNoLev", "title":"OPEN_ACCOUNT_FINANCE_HAS_TRADE_NO_LEV", "value":false, "type":"switch"},
		{"key":"noLevFrq", "title":"OPEN_ACCOUNT_FINANCE_FRQ", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investFrqMappings,"hide":true, "parent":"hasTradedMidLev"},
		{"key":"noLevBalance", "title":"OPEN_ACCOUNT_FINANCE_BALANCE", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":amontOfMoneyMappings,"hide":true, "parent":"hasTradedMidLev"},
		{"key":"noLevRisk", "title":"OPEN_ACCOUNT_FINANCE_RISK", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investProportionMapping,"hide":true, "parent":"hasTradedMidLev"},
	{"key":"hasTradedMidLev", "title":"OPEN_ACCOUNT_FINANCE_HAS_TRADE_MID_LEV", "value":false, "type":"switch"},
		{"key":"midLevFrq", "title":"OPEN_ACCOUNT_FINANCE_FRQ", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investFrqMappings,"hide":true, "parent":"hasTradedNoLev"},
		{"key":"midLevBalance", "title":"OPEN_ACCOUNT_FINANCE_BALANCE", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":amontOfMoneyMappings,"hide":true, "parent":"hasTradedNoLev"},
		{"key":"midLevRisk", "title":"OPEN_ACCOUNT_FINANCE_RISK", "defaultValue":"PRESS_TO_CHOOSE", "value":"", "type":"choice", "choices":investProportionMapping,"hide":true, "parent":"hasTradedNoLev"},
		{"type": "openAccountHintBlock", "ignoreInRegistery": true}
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
			disableChanges: false,
		};
	},

	componentWillMount: function(){
		OpenAccountRoutes.loadMIFIDTestVerified((value)=>{
			if(value){
				this.setState({
					disableChanges: true,
				})
			}
		});

		this.setForHideValues(this.listRawData[EMPSWITCH].value, EMPSWITCH)
		this.setForHideValues(this.listRawData[QUALIFICATION].value, QUALIFICATION)
		this.setForHideValues(this.listRawData[EXPCHANNEL0].value, EXPCHANNEL0)
		this.setForHideValues(this.listRawData[EXPCHANNEL1].value, EXPCHANNEL1)
		this.setForHideValues(this.listRawData[EXPCHANNEL2].value, EXPCHANNEL2)
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP5, TalkingdataModule.LABEL_OPEN_ACCOUNT);
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
				selectedText = LS.str(rowData.choices[i].displayText);
			}
			choices.push(LS.str(rowData.choices[i].displayText));
		}

		if(selectedText == "" && rowData.choices.length > 0){
			selectedText = LS.str(rowData.choices[0].displayText);
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
							if(data[0] === LS.str(this.listRawData[rowID].choices[i].displayText)){
								this.listRawData[rowID].value = this.listRawData[rowID].choices[i].value;
								break;
							}
						}

						console.log("this.listRawData[rowID].value: " + this.listRawData[rowID].value)
						if(rowID == EMPSWITCH){
							var showEMPSwitches = (data[0] == LS.str("OPEN_ACCOUNT_FINANCE_EMPLOYMENT_1") 
												|| data[0] == LS.str("OPEN_ACCOUNT_FINANCE_EMPLOYMENT_2"))
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
			var hide = !(this.listRawData[EMPSWITCH].value === "Employed" || this.listRawData[EMPSWITCH].value === "Self-Employed");
			this.listRawData[EMPSWITCH_0].hide = hide;
			this.listRawData[EMPSWITCH_1].hide = hide;
			this.listRawData[EMPSWITCH_2].hide = hide;
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

		if (rowData.type === "openAccountHintBlock"){
			return (
				<OpenAccountHintBlock />
			)
		}else if (rowData.type === "choice") {

			var displayText = "";
			var textColor = ColorConstants.INPUT_TEXT_COLOR;
			for(var i = 0; i < rowData.choices.length; i++){
				if(rowData.value === rowData.choices[i].value){
					displayText = LS.str(rowData.choices[i].displayText);
				}
			}
			if(displayText === ""){
				displayText = LS.str(rowData.defaultValue);
				textColor = '#3f6dbd';
			}

			return (
				<TouchableOpacity style = {rowData.hide?{height:0}:null} activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}
													disabled={this.state.disableChanges}>
				<View style={styles.rowWrapper}>
					<Text style={[styles.rowTitle, {flex:3}]}>{LS.str(rowData.title)}</Text>
					<View style={{flex:4, flexDirection: 'row'}}>
						<View style={{flex: 1, flexDirection: 'column', justifyContent: "center",}}>
							<Text style={[styles.centerText, {color: textColor}]}
								autoCapitalize="none"
								autoCorrect={false}
								editable={false}
								placeholder={LS.str(rowData.defaultValue)}
								placeholderTextColor={"#3f6dbd"}>
								{displayText}
							</Text>
						</View>
						<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />
					</View>
				</View>
				</TouchableOpacity>
				)
		}
		else if(rowData.type === "switch") {
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{LS.str(rowData.title)}</Text>
					<Switch
						onValueChange={(value) => this.onPressSwitch(value, rowID)}
						style={{height: 22}}
						value={rowData.value}
						disabled={this.state.disableChanges}
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
								console.log("data.displayText: " + LS.str(data.displayText) + ", data.value: " + data.value)
								return (<CheckBoxButton key={index} text={LS.str(data.displayText)}
									defaultSelected={data.value}
									onPress={(selected)=>this.onCheckBoxPressed(rowID, index, selected)}
									enabled={!this.state.disableChanges}>
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
				  <Text style={[styles.rowTitle, rowData.title == "" ? null : {height:0}]}>{rowData.title == "" ? "" : LS.str(rowData.title)}</Text>
					<View style={{flexDirection: 'column'}}>
						{rows}
					</View>
				</View>)

		}
		else if(rowData.type === 'text'){
			if(this.state.disableChanges){
				return (
					<View  style={rowData.hide?{height:0}:null}>
						<View style={styles.rowWrapper}>
							<Text style={[styles.rowTitle, {flex: 3}]}>{LS.str(rowData.title)}</Text>
							<Text style={styles.valueText}>
								{rowData.value}
							</Text>
						</View>
					</View>
				);
			}
			return (
				<View  style={rowData.hide?{height:0}:null}>
					<View style={styles.rowWrapper}>
						<Text style={[styles.rowTitle, {flex: 3}]}>{LS.str(rowData.title)}</Text>
						<TextInput style={styles.valueText}
							autoCapitalize="none"
							autoCorrect={false}
							// secureTextEntry={secureTextEntry}
							defaultValue={rowData.value}
							placeholder={LS.str(rowData.hint)}
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
					<Text style={styles.rowTitle}>{LS.str(rowData.title)}</Text>
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
				<ErrorBar error={this.state.disableChanges ? 
					LS.str("OPEN_ACCOUNT_FINANCE_INFORMATION_READONLY_HINT"): 
					LS.str("OPEN_ACCOUNT_FINANCE_INFORMATION_NOT_CHANGED_HINT")}/>
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
						text={LS.str("NEXT")} />
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
		flex: 4,
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


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
	{"value": 0, "displayText": "低于 1000 元"},
	{"value": 15, "displayText": "1001-2500 元"},
	{"value": 40, "displayText": "2501-4000 元"},
	{"value": 70, "displayText": "4001-6000 元"},
	{"value": 100, "displayText": "高于 6000 元"},
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

var EmploymengTypeMapping = [
	{"value": "type0", "displayText": "汽车和零部件"},
	{"value": "type1", "displayText": "资本产品"},
	{"value": "type2", "displayText": "商业及专业服务"},
	{"value": "type3", "displayText": "消费产品及服务"},
	{"value": "type4", "displayText": "银行与金融服务"},
	{"value": "type5", "displayText": "能源"},
	{"value": "type6", "displayText": "食品，饮料和烟草"},
	{"value": "type7", "displayText": "医疗保健设备和服务"},
	{"value": "type8", "displayText": "家用和个人产品"},
	{"value": "type9", "displayText": "保险"},
	{"value": "type10", "displayText": "传媒"},
	{"value": "type11", "displayText": "医疗"},
	{"value": "type12", "displayText": "生物技术与生命科学"},
	{"value": "type13", "displayText": "房地产"},
	{"value": "type14", "displayText": "零售"},
	{"value": "type15", "displayText": "软件与服务"},
	{"value": "type16", "displayText": "科技"},
	{"value": "type17", "displayText": "电信"},
	{"value": "type18", "displayText": "运输"},
	{"value": "type19", "displayText": "公共事业"},
	{"value": "type20", "displayText": "其他"},
]

var PositionMapping = [
	{"value": "type0", "displayText": "副经理"},
	{"value": "type1", "displayText": "主管"},
	{"value": "type2", "displayText": "经理"},
	{"value": "type3", "displayText": "创始人"},
	{"value": "type4", "displayText": "合伙人"},
	{"value": "type5", "displayText": "职员"},
	{"value": "type6", "displayText": "其他"},
] 

var investFrqMappings = [
	{"value": 0, "displayText": "完全没有"},
	{"value": 1, "displayText": "1-5次"},
	{"value": 2, "displayText": "6-10次"},
	{"value": 3, "displayText": "超过10次"},
]

var amontOfMondyMappings = [
	{"value": 0, "displayText": "低于 1000 元"},
	{"value": 1, "displayText": "1001 - 5000 元"},
	{"value": 2, "displayText": "5001 - 25000 元"},
	{"value": 3, "displayText": "25001- 50000 元"},
	{"value": 4, "displayText": "50001- 100000 元"},
	{"value": 5, "displayText": "高于 100000 元"},
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
	{"key":"incomeSource0" , "displayText":"存款与投资",value:false},
	{"key":"incomeSource1" , "displayText":"工作收入",value:false},
	{"key":"incomeSource2" , "displayText":"赠予",value:false},
	{"key":"incomeSource3" , "displayText":"遗产",value:false},
	{"key":"incomeSource4" , "displayText":"养老金",value:false},
	{"key":"incomeSource5" , "displayText":"其他",value:false},
]

var qualificationsMappings = [
	{"key":"qualifications0" , "displayText":"专业资格", value:false},
	{"key":"qualifications1" , "displayText":"大学学位", value:false},
	{"key":"qualifications2" , "displayText":"职业资格", value:false},
	{"key":"qualifications3" , "displayText":"其他资历", value:false},
]

var defaultRawData = [
	{"key":"annualIncome", "title":"月净收入", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":IncomeMapping},
	{"key":"netWorth", "title":"净资产", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":NetWorthMapping},
	{"optionsKey":"incomeSource" ,"title":"交易资金主要来源", "value":InComeSourceMappings, "type":"options"},
	// {"key":"investPct", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":InvestmentPortfolioMapping},
	{"key":"empStatus", "title":"职业信息", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":EmploymengStatusMapping},
	// {"key":"investFrq", "title":"投资频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
	{"key":"hasProExp", "title":"您是否曾经在金融领域担任专业杠杆交易相关职位至少一年？", "value":false, "type":"switch"},
	{"key":"hasAyondoExp", "title":"您以前参加过培训研讨会或通过其他教育形式了解过我们的产品吗？", "value":true, "type":"switch"},
	{"key":"hasOtherQualif", "title":"您是否用过点差交易或差价合约(CFD)的模拟账户？", "value":false, "type":"switch"},
	{"key":"hasOther2", "title":"您是否有其他相关的资历证书，让您可以更好理解我们的金融服务？", "value":false, "type":"switch"},
	{"optionsKey":"qualificationsKey" ,"title":"", "value":qualificationsMappings, "type":"options"},
	// {"optionsKey":"tradingExp" ,"title":"您有以下哪种产品的实盘交易经验？", "value":expierenceMappings, "type":"options"},
	{"title":"您有以下哪种产品的实盘交易经验？"},
	{"key":"hasExpChannel0", "title":"差价合约、点差交易或外汇", "value":false, "type":"switch"},
		{"key":"investFrq0", "title":"季度交易频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
		{"key":"amontOfMondy0", "title":"投入金额", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":amontOfMondyMappings},
		{"key":"investProportion0", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investProportionMapping},
	{"key":"hasExpChannel1", "title":"股票或债券", "value":false, "type":"switch"},
		{"key":"investFrq1", "title":"季度交易频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
		{"key":"amontOfMondy1", "title":"投入金额", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":amontOfMondyMappings},
		{"key":"investProportion1", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investProportionMapping},
	{"key":"hasExpChannel2", "title":"期权，期货或认购权证", "value":false, "type":"switch"},
		{"key":"investFrq2", "title":"季度交易频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investFrqMappings},
		{"key":"amontOfMondy2", "title":"投入金额", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":amontOfMondyMappings},
		{"key":"investProportion2", "title":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":investProportionMapping},
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
				  <Text style={[styles.rowTitle,rowData.title ? null : {height:0}]}>{rowData.title}</Text>
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


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

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var fontSize2 = Math.round(15*width/375)
var listRawData = [
		{"key":"年收入", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":["15万以下","15-30万","30-60万","60-120万","120万以上"]},
		{"key":"净资产", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":["15万以下","15-30万","30-60万","60-120万","120万以上"]},
		{"key":"投资比重", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":["占净资产10%","占净资产30%","占净资产50%","占净资产70%"]},
		{"key":"就业", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":["受雇/创业","退休","学生","失业中"]},
		{"key":"投资频率", "defaultValue":"点击选择", "value":"", "type":"choice", "choices":["短期（小于3年）","中期（4到7年）","长期（8年以上）"]},
		{"key":"你是否有一年以上与金融杠杆交易相关的职业经历", "value":false, "type":"switch"},
		{"key":"你是否了解过ayondo的金融产品或使用ayondo模拟账户交易", "value":true, "type":"switch"},
		{"key":"你是否有其它相关资质帮助理解ayondo的服务", "value":false, "type":"switch"},
		{"key":"你有哪些产品的交易经验", "value":["场外衍生品","衍生产品","股票和债券"], "type":"options"},
		]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var OAFinanceInfoPage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			pickerArray: [],
			selectedPicker: -1,
		};
	},

	gotoNext: function() {
		//TODO, check
		this.props.navigator.push({
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 4,
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
			listRawData[this.state.selectedPicker].value = value
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
			})
		}
	},

	onPressSwitch: function(value, rowID) {
		console.log(value, rowID)
		if(rowID >= 0) {
			listRawData[rowID].value = value
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
			})
		}
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === "choice") {
			return (
				<TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressPicker(rowData, rowID)}>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<TextInput style={styles.valueText}
						autoCapitalize="none"
						autoCorrect={false}
						editable={false}
						placeholder={rowData.defaultValue}
						placeholderTextColor={"#3f6dbd"}
						value={rowData.value} />
					<Image style={{width:17.5, height:13.5}} source={require("../../../images/icon_down_arrow.png")} />
				</View>
				</TouchableOpacity>
				)
		}
		else if(rowData.type === "switch") {
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<Switch
						onValueChange={(value) => this.onPressSwitch(value, rowID)}
						style={{height: 16}}
						value={rowData.value} />
				</View>)
		}
		else if(rowData.type === 'options'){
			var boxes = rowData.value.map(
				(title, i) =>
				<CheckBoxButton key={i} text={title}>
				</CheckBoxButton>
			)
			return(
				<View style={styles.rowWrapperOption}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<View style={styles.checkboxView}>
						{boxes}
					</View>
				</View>)
		}
		else {
			return(
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
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
		if (this.state.selectedPicker>=0) {
			var pickerValue = listRawData[this.state.selectedPicker].value
			pickerModal = (<View style={styles.pickerContainer}>
				<Picker ref={"picker"} style={{width: width, height: 150}}
					itemStyle={{color:"black", fontSize:26}}
					selectedValue={pickerValue}
					onValueChange={(value) => this.onPikcerSelect(value)}>
					{this.state.pickerArray.map((value) => (
					  <PickerItem label={value} value={value} key={"lever"+value}/>
					))}
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
						enabled={true}
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
		backgroundColor: '#4567a4',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});


module.exports = OAFinanceInfoPage;
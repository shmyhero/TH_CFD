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

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var listRawData = [
		{"key":"姓名", "value":""},
		{"key":"性别", "value":""},
		{"key":"出生日期", "value":""},
		{"key":"民族", "value":""},
		{"key":"身份证号", "value":""},
		{"key":"证件地址", "value":""},
		{"key":"签发机关", "value":""},
		{"key":"有效期限", "value":""}];

var OAPersonalInfoPage = React.createClass({
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
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		if (this.props.data && this.props.data.listData) {
			var certificateIdCardInfo = this.props.data.listData;
			listRawData = certificateIdCardInfo;
			/*[
					{"key":"姓名", "value": certificateIdCardInfo.real_name},
					{"key":"性别", "value":certificateIdCardInfo.gender},
					{"key":"出生日期", "value":certificateIdCardInfo.birthday},
					{"key":"民族", "value":certificateIdCardInfo.ethnic},
					{"key":"身份证号", "value":certificateIdCardInfo.id_code},
					{"key":"证件地址", "value":certificateIdCardInfo.addr},
					{"key":"签发机关", "value":certificateIdCardInfo.issue_authority},
					{"key":"有效期限", "value":certificateIdCardInfo.valid_period}];*/
		}
		return {
			dataSource: ds.cloneWithRows(listRawData),
		};
	},

	gotoNext: function() {
		TalkingdataModule.trackEvent(TalkingdataModule.LIVE_OPEN_ACCOUNT_STEP3, TalkingdataModule.LABEL_OPEN_ACCOUNT);
		OpenAccountRoutes.goToNextRoute(this.props.navigator, this.getData(), this.props.onPop);
	},

	getData: function(){
		return {listData: listRawData};
	},

	textInputChange: function(text, rowID) {
		listRawData[rowID].value = text;
		//alert(JSON.stringify(listRawData));
	},

	renderRow: function(rowData, sectionID, rowID) {
		return (
			<View style={styles.rowWrapper}>
				<Text style={styles.rowTitle}>{rowData.key}</Text>
				<TextInput style={styles.valueText}
					autoCapitalize="none"
					autoCorrect={false}
					defaultValue={rowData.value}
					onChangeText={(text)=>this.textInputChange(text, rowID)} />
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


module.exports = OAPersonalInfoPage;

'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ListView,
	Dimensions,
	Image,
	TouchableHighlight,
} from 'react-native';

var Button = require('../component/Button')
var CheckBoxButton = require('../component/CheckBoxButton')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var listRawData = [
		{"key":"交易条款说明", "url":"http://baidu.com"},
		{"key":"风险与注意事项告知说明", "url":"2"},
		{"key":"数据信息共享说明", "url":"3"},
		{"key":"Ayondo服务协议说明", "url":""},
		{"key":"交易通知说明", "url":""}];

var OADocumentInfoPage = React.createClass({
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			dataSource: ds.cloneWithRows(listRawData),
			enabled: true,
		};
	},

	gotoNext: function() {
		if (this.state.enabled) {
			this.props.navigator.push({
				name: MainPage.OPEN_ACCOUNT_ROUTE,
				step: 1,
			});
		}
	},

	documentPressed: function(url) {
		// todo
	},
	renderRow: function(rowData, sectionID, rowID ) {
		return (
			<TouchableHighlight onPress={() => this.documentPressed(rowData.url)}>
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<Image style={styles.image} source={require("../../../images/icon_arrow_right.png")} />
				</View>
			</TouchableHighlight>
			)
	},
	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	},

	onClickCheckbox: function(value){
		this.setState({
			enabled: value,
		})
	},
	render: function() {
		return (
			<View style={styles.wrapper}>
				<ListView
			    	style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
				<View style={styles.checkboxView}>
					<CheckBoxButton
						text={"我已阅读并同意上述相关内容"}
						defaultSelected={true}
						onPress={(value)=>{this.onClickCheckbox(value)}}/>
				</View>
				<View style={styles.bottomArea}>
					<Button style={styles.buttonArea}
						enabled={this.state.enabled}
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
		backgroundColor: '#ececec',
	},
	rowTitle:{
		fontSize: fontSize,
		color: '#333333',
		flex: 1,
	},
	image: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},

	checkboxView: {
		height: 30,
		backgroundColor: 'white',
		paddingLeft: 15,
		paddingTop: 10,
	},
	bottomArea: {
		height: 72, 
		backgroundColor: 'white',
		alignItems: 'flex-end',
		flexDirection:'row'
	},
	buttonArea: {
		flex: 1,
		backgroundColor: 'green',
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


module.exports = OADocumentInfoPage;
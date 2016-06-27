
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
} from 'react-native';

var Button = require('../component/Button')
var MainPage = require('../MainPage')
var ColorConstants = require('../../ColorConstants')

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)
var fontSize2 = Math.round(15*width/375)
var listRawData = [
		{"key":"年收入", "value":"点击选择", "type":"choice"},
		{"key":"净资产", "value":"点击选择", "type":"choice"},
		{"key":"投资比重", "value":"点击选择", "type":"choice"},
		{"key":"就业", "value":"点击选择", "type":"choice"},
		{"key":"投资频率", "value":"点击选择", "type":"choice"},
		{"key":"你是否了解过Ayondo的金融产品", "value":true, "type":"switch"},
		{"key":"你是否有一年以上与金融交易相关的经验", "value":false, "type":"switch"},
		{"key":"你有哪些产品的交易经验", "value":false, "type":""},
		{"key":"开账户选择", "value":false, "type":""},
		]

var OAFinanceInfoPage = React.createClass({
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			dataSource: ds.cloneWithRows(listRawData),
		};
	},

	gotoNext: function() {
		//TODO, check
		this.props.navigator.push({
			name: MainPage.OPEN_ACCOUNT_ROUTE,
			step: 2,
		});
	},
	
	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === "choice") {
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<TextInput style={styles.valueText}
						autoCapitalize="none"
						autoCorrect={false}
						editable={false}
						defaultValue={"点击选择"} />
				</View>
				)
		}
		else if(rowData.type === "switch") {
			return (
				<View style={styles.rowWrapper}>
					<Text style={styles.rowTitle}>{rowData.key}</Text>
					<Switch
						onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
						style={{height: 16}}
						value={rowData.value} />
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
		backgroundColor: '#ececec',
	},
	rowTitle:{
		fontSize: fontSize,
		color: '#333333',
		flex: 1,
	},
	valueText: {
		fontSize: fontSize2,
		color: '#3f6dbd',
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


module.exports = OAFinanceInfoPage;
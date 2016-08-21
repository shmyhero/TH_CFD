'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TouchableOpacity,
	ListView,
} from 'react-native';

var {height, width} = Dimensions.get('window');
var MainPage = require('./MainPage');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var {height, width} = Dimensions.get('window');
var heightRate = height/667.0;
var listRawData = [
{'type':'head','title':'头像', 'subtype': 'head'},
{'type':'nickName','title':'昵称', 'subtype': 'nickName'},
];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});



var AccountInfoPage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
			headUrl:'',
			nickName:'刘大鹏',
		};
	},

	onSelectNormalRow: function(rowData) {
		if(rowData.subtype === 'head') {
			 alert('选择头像');
		}else if(rowData.subtype === 'nickName') {
			this.gotoAccountNameModifyPage();
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0;
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {

			if(rowData.type === 'head'){
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Text style={styles.title}>{rowData.title}</Text>
							<Image source={require('../../images/head_portrait.png')} style={[styles.headImage,{marginRight:5}]} />
							<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
					</TouchableOpacity>
				);
			}else if(rowData.type === 'nickName'){
				return(
					<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
						<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Text style={styles.title}>{rowData.title}</Text>
							<Text style={styles.contentValue}>{this.state.nickName}</Text>
							<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
						</View>
					</TouchableOpacity>
				);
			}


	},

	render: function() {
		return (
			<ListView
				style={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator} />
		);
	},

	gotoAccountNameModifyPage(){
		this.props.navigator.push({
			name: MainPage.ACCOUNT_NAME_MODIFY_ROUTE,
		});
	},
});

var styles = StyleSheet.create({

	wrapper: {
		flex: 1,
		width: width,
			alignItems: 'stretch',
			justifyContent: 'space-around',
		backgroundColor: ColorConstants.BACKGROUND_GREY,
	},

	list: {
		flex: 1,
		// borderWidth: 1,
	},
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	image: {
		marginLeft: -10,
		width: 40,
		height: 40,
	},
	title: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#303030',
	},

	contentValue: {
		fontSize: 17,
		marginRight: 5,
		color: '#303030',
	},

	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},

	buttonArea: {
		flex: 1,
		borderRadius: 3,
	},
	buttonView: {
		height: Math.round(44*heightRate),
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},

	defaultText: {
		flex: 1,
		fontSize: 17,
		marginLeft: 10,
		color: '#6d6d6d',
	},
	headImage: {
		width: Math.round(48*heightRate),
		height: Math.round(48*heightRate),
	},

});

module.exports = AccountInfoPage;

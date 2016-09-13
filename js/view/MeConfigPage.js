'use strict';

import React from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	Image,
	TouchableOpacity,
	Alert,
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')
var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var listRawData = [
{'type':'normal','title':'推送设置', 'subtype': 'pushconfig'},
{'type':'normal','title':'账号绑定', 'subtype': 'accountbinding'},
{'type':'normal','title':'退出当前账号', 'subtype': 'logout'},
]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MeConfigPage = React.createClass({

	propTypes: {
		onPopBack: React.PropTypes.func,
	},

	getDefaultProps: function(){
		return {
				onPopBack: ()=>{}
		};
	},

	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
		};
	},

	onSelectNormalRow: function(rowData) {
		//todo
		if(rowData.subtype === 'pushconfig') {
			this.props.navigator.push({
				name: MainPage.ME_PUSH_CONFIG_ROUTE,
			});
		}else if(rowData.subtype === 'accountbinding') {
			this.props.navigator.push({
				name: MainPage.ME_ACCOUNT_BINDING_ROUTE,
			});
		}else if(rowData.subtype === 'logout'){
			this.logout();
		}
	},

	logout: function(){
		//TODO
		Alert.alert(
			"提示",
			"是否确认退出？",
				[
					{text: '取消'},
					{text: '确定', onPress: () => this.logoutCurrentAccount()},
				]
			)
	},

	logoutCurrentAccount: function(){
		LocalDataUpdateModule.removeUserData();
		this.props.navigator.pop();
		if(this.props.onPopBack){
			this.props.onPopBack();
		}
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = 0
		//if (rowID > 1 && rowID < 3){
		//	marginLeft = 15
		//}
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {
		return(
			<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectNormalRow(rowData)}>
				<View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
					<Text style={styles.title}>{rowData.title}</Text>
					<Image style={styles.moreImage} source={require("../../images/icon_arrow_right.png")} />
				</View>
			</TouchableOpacity>
		);
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
		width: Math.round(62*heightRate),
		height: Math.round(62*heightRate),
	},
});


module.exports = MeConfigPage;

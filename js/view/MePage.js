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
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var NavBar = require('./NavBar')
var Button = require('./component/Button')
var MainPage = require('./MainPage')

var {height, width} = Dimensions.get('window')
var listRawData = [{'type':'account'},
{'type':'button','title':'开设实盘账户'},
{'type':'normal','title':'帮助中心', 'image':require('../../images/markets.png'), 'subtype':''},
{'type':'normal','title':'线上咨询', 'image':require('../../images/markets.png'), 'subtype':''},
{'type':'normal','title':'产品反馈', 'image':require('../../images/markets.png'), 'subtype':''},
{'type':'normal','title':'关于我们', 'image':require('../../images/markets.png'), 'subtype':''},
{'type':'normal','title':'设置', 'image':require('../../images/markets.png'), 'subtype':''}]

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MePage = React.createClass({
	getInitialState: function() {
		return {
			dataSource: ds.cloneWithRows(listRawData),
		};
	},

	gotoOpenAccount: function() {
		this.props.navigator.push({
			name: MainPage.LOGIN_ROUTE,
		});

	},

	onSelectRow: function(rowData) {
		//todo
	},

	renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
			)
	},

	renderRow: function(rowData, sectionID, rowID) {
		if (rowData.type === 'normal') {
			return(
				<TouchableOpacity activeOpacity={0.5} onPress={()=>this.onSelectRow(rowData)}>
					<View style={styles.rowWrapper}>
						<Image source={rowData.image} style={styles.image} />
						<Text style={styles.title}>{rowData.title}</Text>
						<Text style={styles.more}> > </Text>
					</View>
				</TouchableOpacity>
			)
		}
		else if (rowData.type === 'button'){
			return(
				<View style={styles.rowWrapper}>
					<Button style={styles.buttonArea}
						enabled={true}
						onPress={this.gotoOpenAccount}
						textContainerStyle={styles.buttonView}
						textStyle={styles.buttonText}
						text= {rowData.title}/>
				</View>
			)
		}
		else {
			// account
			return(
				<View style={styles.rowWrapper}>
					<Image source={require('../../images/markets.png')} style={styles.image} />
					<Text style={styles.defaultText}>手机号/微信号登录</Text>
					<Text style={styles.more}> > </Text>
				</View>
			)
		}
	},

	render: function() {
		return (
			<View style={styles.wrapper}>
				<NavBar title="我的" />
			    <ListView
			    	style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator} />
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
		backgroundColor: 'transparent',
	},
	line: {
		height: 0.5,
		backgroundColor: 'transparent',
	},
	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: '#d0d0d0',
	},

	image: {
		width: 15,
		height: 15,
	},
	title: {
		flex: 1,
		fontSize: 14,
		marginLeft: 10,
	},
	more: {
		fontSize: 14,
		color: "#9f9f9f",
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

	defaultText: {
		flex: 1,
		marginLeft: 10,
		color: '#6d6d6d',
	}
});


module.exports = MePage;
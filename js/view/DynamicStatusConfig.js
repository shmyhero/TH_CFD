'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	ScrollView,
	Linking,
	Platform, 
	Switch,
} from 'react-native' 

var NavBar = require('./NavBar')
var ColorConstants = require('../ColorConstants')
const FOCUS_ME = 0
const FOCUS_FOLLOW = 1
const FOCUS_SYSTEM = 2

var listRawData = [
	{type:FOCUS_ME,"title":'我的',"desciption":'自己的交易动态'},
	{type:FOCUS_FOLLOW,"title":'关注',"desciption":'关注用户的交易动态'},
	{type:FOCUS_SYSTEM,"title":'资讯',"desciption":'系统推送的每日资讯'},
] 
var {height, width} = Dimensions.get('window')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class DynamicStatusConfig extends Component {
 

	constructor(props){
		super(props);
		this.state = {
			isFocusMe:false,
			isFocusFollow:false,
			ifFocusSystem:false,
			dataSource: ds.cloneWithRows(listRawData),
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
		  <View style={styles.line} key={rowID}>
			<View style = {styles.separator}></View>
		  </View>
		);
	}

	onSwitchPressed(value,rowData){
		if(rowData.type == FOCUS_ME){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				isFocusMe: value
			})
		}else if(rowData.type == FOCUS_FOLLOW){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				isFocusFollow: value
			})
		}else if(rowData.type == FOCUS_SYSTEM){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				ifFocusSystem: value
			})
		}
	}

	renderRow(rowData, sectionID, rowID){
		var switchIsOn = false;

		if(rowData.type == FOCUS_ME){
			switchIsOn = this.state.isFocusMe
		}else if(rowData.type == FOCUS_FOLLOW){
			switchIsOn = this.state.isFocusFollow
		}else if(rowData.type == FOCUS_SYSTEM){
			switchIsOn = this.state.ifFocusSystem
		}
		

		return(
			<View style={styles.viewWapper}>
				<View style={styles.leftWapper}>
					<Text style={styles.titleText}>{rowData.title}</Text>
					<Text style={styles.desciptionText}>{rowData.desciption}</Text>
				</View> 
				<Switch
					onValueChange={(value) => this.onSwitchPressed(value, rowData)}
					value={switchIsOn}
					onTintColor={ColorConstants.title_blue()} />
			</View>
			
		) 
	}
	 

	onCompleted(){
		this.props.navigator.pop();
		if(this.props.onPopOut){
			this.props.onPopOut()
		}
	}

	render(){
		return(
			<View style={{backgroundColor:'#FFFFFF',flex:1,width:width}}>
				<NavBar title='栏目管理' showBackButton={true} navigator={this.props.navigator}
							textOnRight='完成'
							rightTextOnClick={()=>this.onCompleted()}
							/>  
			 	<ListView 
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					renderSeparator={this.renderSeparator} />
			</View>
		 ) 
	}


}

var styles = StyleSheet.create({
	list:{

	},
	viewWapper:{
		height:60,
		width:width, 
		paddingLeft:15,
		paddingRight:15,
		flexDirection:'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	leftWapper:{
		justifyContent:'center'
	},
	titleText:{
		fontSize:15, 
		marginBottom:2.5,
		color:'black'
	},
	desciptionText:{
		fontSize:13,
		color:'grey'
	},
	separator: {
		height: 0.5,
		backgroundColor: '#eeeeee',
    	marginLeft:15,
	  },
	line: {
		height: 0.5,
		backgroundColor: 'white',
   		marginLeft:0,
	},
});


module.exports = DynamicStatusConfig;

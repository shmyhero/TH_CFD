'use strict';

import React,{Component} from 'react'
import {StyleSheet,Text,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')

var listRawData = [
	{id:0},
	{id:1},
	{id:2},
	{id:3},
	{id:4},
	{id:5},
	{id:6},
	{id:7},
	{id:8},
	{id:9}
	]
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class MyCard extends Component{

	constructor(props){
		super(props);
		this.state = {
			dataSource: ds.cloneWithRows(listRawData),
		}
	}

	_renderRow(rowData,sectionID,rowID){
		return(
			<TouchableOpacity style={styles.scroolItem} onPress={()=>{this._onPressItem(rowData)}}>
						<Reward type={2} divideInLine={2} ></Reward>
		  </TouchableOpacity>
	 	);
	}

	_onPressItem(rowData){
		Alert.alert(''+rowData.id);
	}

	render(){
		return(
			<View style={{flex:1}}>
				<NavBar title='我的卡片' showBackButton={true} navigator={this.props.navigator}/>
				<ListView
					contentContainerStyle={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this._renderRow.bind(this)} />
			</View>
		);
	}
}


const styles = StyleSheet.create({
	scroolItem:{
		width:(width-20)/2,
		height:((width-20)/2) + 70,
		marginRight:5,
		backgroundColor:'white',
		marginBottom:10,
	},

	list:{
		marginLeft:5,
		marginTop:5,
		marginRight:5,
		flexDirection:'row',
		justifyContent: 'space-around',
		flexWrap:'wrap',
	},
});


module.exports = MyCard;

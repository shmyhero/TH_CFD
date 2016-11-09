'use strict';

import React,{Component} from 'react'
import {StyleSheet,Text,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')

var listRawData = []
var listResponse = []
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class MyCard extends Component{

	constructor(props){
		super(props);
		this.state = {
			listRawData: ds.cloneWithRows(listRawData),
			listResponse: undefined,
		}
	}

	_renderRow(rowData,sectionID,rowID){
		return(
			<TouchableOpacity style={styles.scroolItem} onPress={()=>{this._onPressItem(rowID)}}>
						<Reward card={rowData} type={2} divideInLine={2} ></Reward>
		  </TouchableOpacity>
	 	);
	}

	componentDidMount(){
		this.loadMyCards();
	}

	_onPressItem(index){
		//
		Alert.alert('cardList length = '+this.state.listResponse.length+' selectIndex = '+index);
	}

	//获取我的卡片列表
	loadMyCards() {
		var userData = LogicData.getUserData()

			NetworkModule.fetchTHUrlWithNoInternetCallback(
				NetConstants.CFD_API.GET_USER_LIVE_CARDS,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
				},
				(responseJson) =>{
					this.setState({
						listRawData: ds.cloneWithRows(responseJson.cards),
						listResponse : responseJson.cards,
						})
				},
				(error) => {
					Alert.alert(error)
				}
			)
	}

	render(){
		return(
			<View style={{flex:1}}>
				<NavBar title='我的卡片' showBackButton={true} navigator={this.props.navigator}/>
				<ListView
					contentContainerStyle={styles.list}
					dataSource={this.state.listRawData}
					enableEmptySections={true}
					renderRow={this._renderRow.bind(this)} />
			</View>
		);
	}
}


const styles = StyleSheet.create({
	scroolItem:{
		width:(width-20)/2,
		height:((width-20)/2) + 80,
		marginRight:5,
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

'use strict';

import React,{Component} from 'react'
import {StyleSheet,Text,Image,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var Reward = require('./Reward')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var StockTransactionInfoModal = require('./StockTransactionInfoModal')
var UIConstants = require('../UIConstants')

var listRawData = []
var listResponse = []
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class MyCard extends Component{

	constructor(props){
		super(props);
		this.state = {
			listRawData: ds.cloneWithRows(listRawData),
			listResponse: undefined,
			noMessage: false,
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
		this.refs['stockTransactionInfoModal'].showAchievement(this.state.listResponse, parseInt(index), ()=>{
			//alert("我回来了！");
		});
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
					var noMessage = responseJson.cards.length == 0;
					this.setState({
					  listRawData: ds.cloneWithRows(responseJson.cards),
						listResponse : responseJson.cards,
						noMessage: noMessage,
						})
				},
				(error) => {
					Alert.alert(error)
				}
			)
	}

	renderEmptyView(){
		if(this.state.noMessage){
			return (
				<View style={styles.emptyContent}>
						<Text style={styles.emptyText}>暂无卡片</Text>
				</View>
			);
		}
	}

	render(){
		return(
			<View style={{flex:1}}>
				<NavBar title='我的卡片' showBackButton={true} navigator={this.props.navigator}/>
				{this.renderEmptyView()}
				<ListView
					contentContainerStyle={styles.list}
					dataSource={this.state.listRawData}
					enableEmptySections={true}
					removeClippedSubviews={false}
					renderRow={this._renderRow.bind(this)} />
        <StockTransactionInfoModal ref='stockTransactionInfoModal'/>
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
		justifyContent: 'flex-start',
		flexWrap:'wrap',
	},

	emptyContent: {
		height:height-UIConstants.HEADER_HEIGHT,
    alignItems:'center',
    justifyContent: 'center'
  },
  emptyText: {
    marginTop: 14,
    color: '#afafaf'
  },


});


module.exports = MyCard;

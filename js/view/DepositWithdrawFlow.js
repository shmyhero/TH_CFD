'use strict';

/*
出入金流水明细
*/

import React,{Component} from 'react'
import {StyleSheet,Text,Image,View,Dimensions,ListView,Alert,TouchableOpacity} from 'react-native'


var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NavBar = require('./NavBar')
var LogicData = require('../LogicData');
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants')
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var ColorConstants = require('../ColorConstants')

var listRawData = []
var listResponse = []
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class DepositWithdrawFlow extends Component{

	constructor(props){
		super(props);
		this.state = {
			listRawData: ds.cloneWithRows(listRawData),
			listResponse: undefined,
			noMessage: false,
			contentLoaded: false,
			isRefreshing: false,
		}
	}

	_renderRow(rowData,sectionID,rowID){
		return(
			<TouchableOpacity style={styles.scroolItem}>
					 <View style = {styles.leftView}>
						 <Text style = {styles.itemTitle}>入金</Text>
						 <Text style = {styles.itemTime}>2016-12-05 12:21:33</Text>
					 </View>
					 <View style = {styles.rightView}	>
					 	<Text style = {styles.itemMoney}>350.12</Text>
					 </View>
		  </TouchableOpacity>
	 	);
	}

	componentDidMount(){
		this.loadMyCards();
	}

	//获取我的卡片列表
	loadMyCards() {
		if(!this.state.contentLoaded){
			console.log("loadMyCards content not Loaded")
			this.setState({
				isRefreshing: true,
			})
		}
		var userData = LogicData.getUserData()

			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_USER_LIVE_CARDS,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},
					cache: "offline",
					//timeout: 1000,
				},
				(responseJson) =>{
					var noMessage = responseJson.cards.length == 0;
					this.setState({
					  listRawData: ds.cloneWithRows(responseJson.cards),
						listResponse : responseJson.cards,
						noMessage: noMessage,
						contentLoaded: true,
						isRefreshing: false,
						})
				},
				(result) => {
					console.log("fetch url error: " + JSON.stringify(result))
					if(!result.loadedOfflineCache){
						this.setState({
							contentLoaded: false,
							isRefreshing: false,
						})
					}
				}
			)
	}

	renderEmptyView(){
		if(this.state.noMessage){
			return (
				<View style={styles.emptyContent}>
						<Text style={styles.emptyText}>暂无明细</Text>
				</View>
			);
		}
	}

	renderContent(){
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator onRefresh={()=>this.loadMyCards()} refreshing={this.state.isRefreshing}/>
			)
		}else{
			return(
				<View style={{flex:1}}>
					{this.renderEmptyView()}
					<ListView
						contentContainerStyle={styles.list}
						dataSource={this.state.listRawData}
						enableEmptySections={true}
						removeClippedSubviews={false}
						renderSeparator={this.renderSeparator}
						renderRow={this._renderRow.bind(this)} />
				</View>
			)
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
		var marginLeft = width;
		return (
			<View style={styles.line} key={rowID}>
				<View style={[styles.separator, {marginLeft: marginLeft}]}/>
			</View>
			)
	}

	render(){
		return(
			<View style={{flex:1,backgroundColor:'white'}}>
				<NavBar title='明细' showBackButton={true} navigator={this.props.navigator}/>
				{this.renderContent()}
			</View>
		);
	}
}


const styles = StyleSheet.create({
	scroolItem:{
		width:width,
		height:60,
		flexDirection:'row'
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
	leftView:{
		padding:10,
	},
	itemTitle:{
		fontSize:16,
	},
	itemTime:{
		marginTop:6,
		fontSize:12,
		color:'#2e2e2e'
	},
	rightView:{
		flex:1,
		paddingRight:20,
		alignItems:'flex-end',
		justifyContent:'center',
	},
	itemMoney:{
		fontSize:18,
		color:'green',
	},
	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	line: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
});


module.exports = DepositWithdrawFlow;

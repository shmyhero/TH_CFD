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
var NetworkErrorIndicator = require('./NetworkErrorIndicator');
var LS = require('../LS')
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
			contentLoaded: false,
			isRefreshing: false,
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
						<Text style={styles.emptyText}>暂无卡片</Text>
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
						renderRow={this._renderRow.bind(this)} />
					<StockTransactionInfoModal ref='stockTransactionInfoModal'/>
				</View>
			)
		}
	}

	render(){
		var strWDKP = LS.str('WDKP')
		return(
			<View style={{flex:1}}>
				<NavBar title={strWDKP} showBackButton={true} navigator={this.props.navigator}/>
				{this.renderContent()}
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
